// Kolejka zdjęć protokołu: zmniejszanie w przeglądarce + wysyłka w tle.
//
// Dlaczego: zdjęcia z telefonu mają 3–8 MB, a wcześniej szły do Storage
// w oryginale dopiero po kliknięciu "Potwierdź" — przy kilku zdjęciach
// i mobilnym internecie zapis trwał minutę i dłużej. Teraz:
//  1. każde zdjęcie zaraz po dodaniu jest zmniejszane w przeglądarce do
//     PHOTO_MAX_DIMENSION px na dłuższym boku (JPEG) — niezależnie od
//     ustawień aparatu; obrót z EXIF jest uwzględniany, metadane EXIF
//     (data, GPS) nie są przenoszone,
//  2. gdy znane jest miejsce w Storage (getTarget() zwraca rentalId —
//     np. protokół z linku najemcy), wysyłka startuje od razu, w tle,
//     podczas wypełniania reszty formularza; przy zapisie czekamy już tylko
//     na resztę (waitForUploads),
//  3. miniatury pokazują stan (zmniejszanie / % wysyłania / ✓ / błąd),
//     a waitForUploads raportuje postęp do przycisku zapisu.
// Nazwy plików: rentals/{rentalId}/{folder}/{PREFIKS}-{nr}.jpg — końcówka
// "-{nr}.jpg" (rosnąca liczba) jest wymagana przez fetchRecoveredAssets
// w js/app.js (protokół awaryjny), który sortuje zdjęcia po tym numerze.
//
// Pamięć telefonu (ważne przy kilkunastu zdjęciach): plik jest wczytywany do
// pamięci strony od razu po wybraniu (na Androidzie zdjęcia z galerii/chmury
// potrafią po chwili stać się nieczytelne), oryginał jest zwalniany po
// zmniejszeniu, miniatury są małe (a nie pełne 12 Mpx), a płótna canvas są
// zerowane po użyciu — iOS ma twardy limit łącznej pamięci canvas i po jego
// przekroczeniu kolejne zdjęcia przestają się dać przetworzyć.
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { storageFilePrefix } from "./protocol-actions.js";

export const PHOTO_MAX_DIMENSION = 2560;
const PHOTO_JPEG_QUALITY = 0.85;
const THUMB_MAX_DIMENSION = 200;
const MAX_PARALLEL_UPLOADS = 2;
const MAX_UPLOAD_ATTEMPTS = 3;

// Rosnący numer pliku — unikalny także między sesjami (ponowne otwarcie
// linku), więc nowe zdjęcia nie nadpiszą wcześniej wysłanych.
let fileSeq = Date.now();

// Czytelny opis dowolnego błędu — także zdarzeń (FileReader/obraz), które
// nie mają .message (wcześniej kończyło się komunikatem "Błąd zapisu: undefined").
export function describeError(err) {
  if (!err) return "nieznany błąd";
  if (typeof err === "string") return err;
  if (err.message) return err.code ? `${err.message} (${err.code})` : err.message;
  if (err.target && err.target.error && err.target.error.message) return err.target.error.message;
  if (err.code) return String(err.code);
  if (err.type) return `zdarzenie „${err.type}”`;
  return String(err);
}

// Zwalnia pamięć płótna od razu (iOS liczy ją do limitu do czasu GC).
export function releaseCanvas(canvas) {
  if (!canvas) return;
  canvas.width = 0;
  canvas.height = 0;
}

// Wykonuje fn(item) po kolei, nie wszystkie naraz — np. dekodowanie zdjęć
// do PDF-u (12 jednoczesnych dekodowań potrafi wyczerpać pamięć telefonu).
export async function mapInSequence(list, fn) {
  const out = [];
  for (const item of list) out.push(await fn(item));
  return out;
}

function canvasToJpeg(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

function drawScaled(source, width, height, maxDim) {
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    releaseCanvas(canvas);
    throw new Error("Brak pamięci na przetworzenie zdjęcia");
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function decodeImage(blob) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch (e) {
      // spróbujemy przez <img>
    }
  }
  // Starsze przeglądarki: dekodowanie przez <img> (nowoczesne przeglądarki
  // same stosują przy tym obrót z EXIF).
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  try {
    await img.decode();
  } catch (e) {
    URL.revokeObjectURL(url);
    throw new Error("Nie można odczytać obrazu");
  }
  return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
}

// Zwraca { blob, thumbUrl }: zmniejszony JPEG (lub oryginał, gdy przeglądarka
// nie potrafi zdekodować pliku — np. HEIC w części przeglądarek) i małą
// miniaturę (data URL) do podglądu. Rzuca Error, gdy pliku nie da się w ogóle
// odczytać (wtedy nie da się go też wysłać).
export async function compressPhoto(file) {
  let data;
  try {
    // Kopia w pamięci strony — niezależna od dalszej dostępności pliku w telefonie.
    data = new Blob([await file.arrayBuffer()], { type: file.type || "image/jpeg" });
  } catch (e) {
    throw new Error(`Nie można odczytać pliku „${file.name || "zdjęcie"}” — dodaj je ponownie`);
  }
  let decoded;
  try {
    decoded = await decodeImage(data);
  } catch (e) {
    return { blob: data, thumbUrl: null };
  }
  let canvas = null;
  let thumbCanvas = null;
  try {
    canvas = drawScaled(decoded.source, decoded.width, decoded.height, PHOTO_MAX_DIMENSION);
    thumbCanvas = drawScaled(canvas, canvas.width, canvas.height, THUMB_MAX_DIMENSION);
    const thumbUrl = thumbCanvas.toDataURL("image/jpeg", 0.7);
    const blob = await canvasToJpeg(canvas, PHOTO_JPEG_QUALITY);
    if (!blob) return { blob: data, thumbUrl };
    // Zdjęcie już wcześniej małe — nie powiększamy go ponownym zapisem.
    return { blob: blob.size < data.size || !/jpe?g/i.test(data.type) ? blob : data, thumbUrl };
  } catch (e) {
    return { blob: data, thumbUrl: null };
  } finally {
    decoded.close();
    releaseCanvas(canvas);
    releaseCanvas(thumbCanvas);
  }
}

// Standardowe podpięcie w formularzu protokołu: pasek #photoStrip +
// #photoInput, pod paskiem linijka "Wysłano 2 z 5 zdjęć…".
export function wireProtocolPhotoQueue(storage, getTarget) {
  const stripEl = document.getElementById("photoStrip");
  const inputEl = document.getElementById("photoInput");
  const statusEl = document.createElement("p");
  statusEl.className = "muted upload-progress";
  statusEl.hidden = true;
  stripEl.insertAdjacentElement("afterend", statusEl);
  return createPhotoQueue({
    storage,
    stripEl,
    inputEl,
    getTarget,
    onChange: ({ total, uploaded, failed, unreadable, preparing }) => {
      statusEl.hidden = total === 0;
      if (!total) return;
      const willUploadLater = !(getTarget && getTarget());
      const problems = [
        unreadable ? `${unreadable} nie da się odczytać — usuń (✕) i dodaj ponownie` : "",
        failed ? `${failed} z błędem wysyłki, ponowimy przy zapisie` : ""
      ].filter(Boolean).join("; ");
      const main = willUploadLater
        ? `Zdjęcia: ${total}${preparing ? ` (przygotowywanie ${preparing}…)` : ""} — zostaną wysłane przy zapisie`
        : uploaded === total
          ? `Wysłano wszystkie zdjęcia (${total}).`
          : `Wysłano ${uploaded} z ${total} zdjęć…`;
      statusEl.textContent = problems ? `${main} (${problems})` : main;
    }
  });
}

// Tekst przycisku zapisu podczas wysyłki zdjęć.
export function uploadProgressLabel({ uploaded, total, fraction }) {
  return `Wysyłanie zdjęć ${uploaded}/${total} (${Math.round(fraction * 100)}%)…`;
}

// Ostrzeżenie przeglądarki przy próbie zamknięcia/odświeżenia strony w
// trakcie zapisu protokołu. Zwraca funkcję zdejmującą ostrzeżenie.
export function guardUnloadWhileSaving() {
  const handler = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  window.addEventListener("beforeunload", handler);
  return () => window.removeEventListener("beforeunload", handler);
}

// storage — instancja Firebase Storage; stripEl — kontener miniatur;
// inputEl — <input type="file">; getTarget() → { rentalId, folder, plate }
// albo null, gdy miejsce w Storage nie jest jeszcze znane (wtedy zdjęcia są
// tylko zmniejszane, a wysyłka rusza w waitForUploads z podanym targetem).
// Stany zdjęcia: compressing → queued → uploading → done; błędy: "error"
// (wysyłka, ponawiana) albo "unreadable" (pliku nie da się odczytać).
export function createPhotoQueue({ storage, stripEl, inputEl, getTarget, onChange }) {
  const items = [];
  let compressChain = Promise.resolve();
  let activeUploads = 0;
  let fixedTarget = null;
  let progressListener = null;

  const target = () => fixedTarget || (getTarget ? getTarget() : null);

  function summary() {
    const count = (s) => items.filter((i) => i.status === s).length;
    return {
      total: items.length,
      uploaded: count("done"),
      failed: count("error"),
      unreadable: count("unreadable"),
      preparing: count("compressing")
    };
  }

  function notify() {
    const s = summary();
    if (onChange) onChange(s);
    if (progressListener) progressListener(s);
  }

  function renderBadge(item) {
    const b = item.badge;
    b.className = "photo-status";
    b.title = "";
    if (item.status === "compressing") b.textContent = "…";
    else if (item.status === "queued") b.textContent = "⏳";
    else if (item.status === "uploading") b.textContent = `${Math.round(item.progress * 100)}%`;
    else if (item.status === "done") { b.textContent = "✓"; b.classList.add("ok"); }
    else if (item.status === "error") { b.textContent = "!"; b.classList.add("err"); b.title = item.error || "Nie wysłano — ponowimy przy zapisie"; }
    else if (item.status === "unreadable") { b.textContent = "✕"; b.classList.add("err"); b.title = item.error || "Nie można odczytać zdjęcia"; }
    else b.textContent = "";
  }

  function setStatus(item, status, progress = item.progress) {
    item.status = status;
    item.progress = progress;
    renderBadge(item);
    notify();
  }

  function pump() {
    const t = target();
    if (!t || !t.rentalId) return;
    for (const item of items) {
      if (activeUploads >= MAX_PARALLEL_UPLOADS) break;
      if (item.status !== "queued") continue;
      try {
        startUpload(item, t);
      } catch (e) {
        // Błąd przy samym starcie wysyłki nie może zatrzymać pozostałych zdjęć.
        activeUploads = Math.max(0, activeUploads - 1);
        item.error = describeError(e);
        setStatus(item, "error");
      }
    }
  }

  function startUpload(item, t) {
    activeUploads++;
    item.attempts = (item.attempts || 0) + 1;
    item.path = item.path || `rentals/${t.rentalId}/${t.folder}/${storageFilePrefix(t.plate, Date.now())}-${++fileSeq}.jpg`;
    setStatus(item, "uploading", 0);
    const task = uploadBytesResumable(ref(storage, item.path), item.blob, { contentType: item.blob.type || "image/jpeg" });
    item.task = task;
    item.done = new Promise((resolve) => {
      task.on(
        "state_changed",
        (snap) => {
          if (snap.totalBytes) {
            item.progress = snap.bytesTransferred / snap.totalBytes;
            renderBadge(item);
            notify();
          }
        },
        (err) => {
          activeUploads--;
          item.task = null;
          if (item.removed) return resolve();
          item.error = describeError(err);
          setStatus(item, item.attempts < MAX_UPLOAD_ATTEMPTS ? "queued" : "error");
          // Ponowna próba z krótką przerwą (chwilowy brak zasięgu).
          setTimeout(pump, 1500 * item.attempts);
          resolve();
        },
        async () => {
          activeUploads--;
          item.task = null;
          try {
            item.url = await getDownloadURL(task.snapshot.ref);
            setStatus(item, "done", 1);
          } catch (e) {
            item.error = describeError(e);
            setStatus(item, "error");
          }
          resolve();
          pump();
        }
      );
    });
  }

  function remove(item) {
    item.removed = true;
    const idx = items.indexOf(item);
    if (idx >= 0) items.splice(idx, 1);
    item.wrap.remove();
    if (item.task) item.task.cancel();
    if (item.url && item.path) {
      // Już wysłane — usuń też ze Storage, żeby nie trafiło do protokołu
      // awaryjnego (fetchRecoveredAssets bierze wszystkie pliki z folderu).
      deleteObject(ref(storage, item.path)).catch(() => {});
    }
    notify();
    pump();
  }

  function add(file) {
    const item = { file, name: file.name, blob: null, status: "compressing", progress: 0, url: null, path: null };
    const wrap = document.createElement("div");
    wrap.className = "photo-thumb-wrap";
    // Podgląd dopiero z małej miniatury (po zmniejszeniu) — pełne zdjęcie
    // 12 Mpx jako <img> zajmuje kilkadziesiąt MB pamięci na każde zdjęcie.
    const img = document.createElement("img");
    img.className = "photo-thumb";
    img.alt = "";
    img.title = file.name || "";
    const badge = document.createElement("span");
    const del = document.createElement("button");
    del.type = "button";
    del.className = "photo-remove";
    del.textContent = "✕";
    del.title = "Usuń zdjęcie";
    del.addEventListener("click", () => remove(item));
    wrap.append(img, badge, del);
    stripEl.appendChild(wrap);
    item.wrap = wrap;
    item.badge = badge;
    items.push(item);
    renderBadge(item);
    notify();

    // Zmniejszanie po kolei (jedno zdjęcie naraz — oszczędza pamięć
    // telefonu). Każde ogniwo łańcucha łapie własne błędy, żeby problem
    // z jednym zdjęciem nie zatrzymał pozostałych.
    item.ready = compressChain = compressChain.then(async () => {
      if (item.removed) return;
      try {
        const { blob, thumbUrl } = await compressPhoto(file);
        item.blob = blob;
        item.file = null; // oryginał niepotrzebny — zwalniamy pamięć
        if (thumbUrl) img.src = thumbUrl;
        else img.classList.add("photo-thumb-placeholder");
        if (item.removed) return;
        setStatus(item, "queued");
        pump();
      } catch (e) {
        item.error = describeError(e);
        setStatus(item, "unreadable");
      }
    });
  }

  inputEl.addEventListener("change", () => {
    for (const file of inputEl.files) add(file);
    inputEl.value = "";
  });

  return {
    get count() {
      return items.length;
    },
    summary,
    // Zmniejszone pliki (dla PDF-u — szybsze niż ponowne dekodowanie oryginałów).
    async getBlobs() {
      await compressChain;
      return items.filter((i) => i.blob).map((i) => i.blob);
    },
    // Czeka na wysłanie wszystkich zdjęć (startuje te jeszcze nie wysłane,
    // ponawia błędy). onProgress({ uploaded, total, fraction }).
    // Zwraca adresy URL w kolejności dodania.
    async waitForUploads(uploadTarget, onProgress) {
      if (uploadTarget) fixedTarget = uploadTarget;
      const report = () => {
        if (!onProgress) return;
        const total = items.length;
        const fraction = total ? items.reduce((s, i) => s + (i.status === "done" ? 1 : i.status === "uploading" ? i.progress : 0), 0) / total : 1;
        onProgress({ uploaded: items.filter((i) => i.status === "done").length, total, fraction });
      };
      progressListener = report;
      try {
        await compressChain;
        const unreadable = items.filter((i) => i.status === "unreadable");
        if (unreadable.length) {
          throw new Error(
            `Nie można odczytać ${unreadable.length} zdj. (${unreadable.map((i) => i.name || "?").join(", ")}) — usuń je (✕) i dodaj ponownie.`
          );
        }
        if (items.length && !(target() && target().rentalId)) {
          throw new Error("Brak miejsca docelowego dla zdjęć (rentalId).");
        }
        // Przy zapisie dajemy błędnym zdjęciom kolejną serię prób.
        items.forEach((i) => {
          if (i.status === "error") {
            i.attempts = 0;
            i.status = "queued";
            renderBadge(i);
          }
        });
        report();
        pump();
        for (;;) {
          const pending = items.filter((i) => i.status !== "done");
          if (!pending.length) break;
          const failed = pending.filter((i) => i.status === "error");
          if (failed.length === pending.length) {
            throw new Error(
              `Nie udało się wysłać ${failed.length} zdj. — sprawdź połączenie z internetem i spróbuj ponownie (${failed[0].error || "błąd wysyłki"}).`
            );
          }
          pump();
          await new Promise((r) => setTimeout(r, 200));
        }
        return items.map((i) => i.url);
      } finally {
        progressListener = null;
      }
    }
  };
}

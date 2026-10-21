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
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { storageFilePrefix } from "./protocol-actions.js";

export const PHOTO_MAX_DIMENSION = 2560;
const PHOTO_JPEG_QUALITY = 0.85;
const MAX_PARALLEL_UPLOADS = 2;
const MAX_UPLOAD_ATTEMPTS = 3;

// Rosnący numer pliku — unikalny także między sesjami (ponowne otwarcie
// linku), więc nowe zdjęcia nie nadpiszą wcześniej wysłanych.
let fileSeq = Date.now();

function canvasToJpeg(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", PHOTO_JPEG_QUALITY));
}

function drawScaled(source, width, height) {
  const scale = Math.min(1, PHOTO_MAX_DIMENSION / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// Zwraca zmniejszony JPEG; gdy przeglądarka nie potrafi zdekodować pliku
// (np. HEIC w części przeglądarek) — oryginał, żeby nie blokować protokołu.
export async function compressPhoto(file) {
  let canvas = null;
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      canvas = drawScaled(bitmap, bitmap.width, bitmap.height);
      bitmap.close();
    } catch (e) {
      canvas = null;
    }
  }
  if (!canvas) {
    // Starsze przeglądarki / słabsze telefony: dekodowanie przez <img>
    // (nowoczesne przeglądarki same stosują przy tym obrót z EXIF).
    try {
      const url = URL.createObjectURL(file);
      try {
        const img = new Image();
        img.decoding = "async";
        img.src = url;
        await img.decode();
        canvas = drawScaled(img, img.naturalWidth, img.naturalHeight);
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      return file;
    }
  }
  const blob = await canvasToJpeg(canvas);
  if (!blob) return file;
  // Zdjęcie już wcześniej małe — nie powiększamy go ponownym zapisem.
  return blob.size < file.size || !/jpe?g/i.test(file.type) ? blob : file;
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
    onChange: ({ total, uploaded, failed }) => {
      statusEl.hidden = total === 0;
      if (!total) return;
      const willUploadLater = !(getTarget && getTarget());
      statusEl.textContent = willUploadLater
        ? `Zdjęcia: ${total} (zostaną wysłane przy zapisie)`
        : uploaded === total
          ? `Wysłano wszystkie zdjęcia (${total}).`
          : `Wysłano ${uploaded} z ${total} zdjęć${failed ? ` — ${failed} z błędem, ponowimy przy zapisie` : "…"}`;
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
export function createPhotoQueue({ storage, stripEl, inputEl, getTarget, onChange }) {
  const items = [];
  let compressChain = Promise.resolve();
  let activeUploads = 0;
  let fixedTarget = null;

  const target = () => fixedTarget || (getTarget ? getTarget() : null);
  const notify = () => onChange && onChange(summary());

  function summary() {
    const total = items.length;
    const uploaded = items.filter((i) => i.status === "done").length;
    const failed = items.filter((i) => i.status === "error").length;
    return { total, uploaded, failed };
  }

  function renderBadge(item) {
    const b = item.badge;
    b.className = "photo-status";
    if (item.status === "compressing") b.textContent = "…";
    else if (item.status === "queued") b.textContent = "⏳";
    else if (item.status === "uploading") b.textContent = `${Math.round(item.progress * 100)}%`;
    else if (item.status === "done") { b.textContent = "✓"; b.classList.add("ok"); }
    else if (item.status === "error") { b.textContent = "!"; b.classList.add("err"); b.title = "Nie wysłano — spróbujemy ponownie przy zapisie"; }
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
      if (item.status === "queued") startUpload(item, t);
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
        () => {
          activeUploads--;
          item.task = null;
          if (item.removed) return resolve();
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
            setStatus(item, "error");
          }
          resolve();
          pump();
        }
      );
    });
  }

  async function remove(item) {
    item.removed = true;
    const idx = items.indexOf(item);
    if (idx >= 0) items.splice(idx, 1);
    item.wrap.remove();
    URL.revokeObjectURL(item.previewUrl);
    if (item.task) item.task.cancel();
    if (item.url && item.path) {
      // Już wysłane — usuń też ze Storage, żeby nie trafiło do protokołu
      // awaryjnego (fetchRecoveredAssets bierze wszystkie pliki z folderu).
      deleteObject(ref(storage, item.path)).catch(() => {});
    }
    notify();
  }

  function add(file) {
    const item = { file, blob: null, status: "compressing", progress: 0, url: null, path: null };
    item.previewUrl = URL.createObjectURL(file);
    const wrap = document.createElement("div");
    wrap.className = "photo-thumb-wrap";
    const img = document.createElement("img");
    img.className = "photo-thumb";
    img.src = item.previewUrl;
    img.alt = "Zdjęcie";
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

    // Zmniejszanie po kolei (jedno zdjęcie naraz — oszczędza pamięć telefonu).
    item.ready = compressChain = compressChain.then(async () => {
      if (item.removed) return;
      item.blob = await compressPhoto(file).catch(() => file);
      if (item.removed) return;
      setStatus(item, "queued");
      pump();
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
      return items.map((i) => i.blob || i.file);
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
      const prevOnChange = onChange;
      onChange = (s) => {
        if (prevOnChange) prevOnChange(s);
        report();
      };
      try {
        await compressChain;
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
            throw new Error(`Nie udało się wysłać ${failed.length} zdj. — sprawdź połączenie z internetem i spróbuj ponownie.`);
          }
          await Promise.race(pending.map((i) => i.done || i.ready || new Promise((r) => setTimeout(r, 500))));
          await new Promise((r) => setTimeout(r, 50));
        }
        return items.map((i) => i.url);
      } finally {
        onChange = prevOnChange;
      }
    }
  };
}

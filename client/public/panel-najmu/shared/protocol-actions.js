// Logika zapisu protokołu (Storage/Firestore/e-mail) współdzielona między
// panelem operatora (js/app.js, za Basic Authem) a samoobsługową stroną
// najemcy (protokol/protokol.js, publiczną, autoryzowaną wyłącznie hasłem
// do konkretnego protokołu). Ten moduł nie zakłada NIC o tym, kto woła —
// przyjmuje gotowe instancje Storage/Functions i dane jako argumenty, żeby
// obie strony zachowywały się identycznie i nie rozjeżdżały się z czasem.
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  httpsCallable
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";

export function normalizePlateId(plate) {
  return (plate || "").trim().toUpperCase().replace(/\s+/g, "");
}

export function formatDateRRMMDD(timestampMs) {
  const d = new Date(timestampMs || Date.now());
  const rr = String(d.getFullYear() % 100).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${rr}${mm}${dd}`;
}

// Prefiks nazw plików w Storage — [nr_rejestracyjny][RRMMDD], żeby dało się
// odnaleźć pliki wynajmu po numerze rejestracyjnym w konsoli Firebase.
export function storageFilePrefix(plate, timestampMs) {
  return `${normalizePlateId(plate)}-${formatDateRRMMDD(timestampMs)}`;
}

// ID wynajmu (= nazwa dokumentu w Firestore = nazwa folderu w Storage) w
// postaci [nr_rejestracyjny]-[RRMMDD]-[indeks] zamiast losowego ID.
export async function generateReadableRentalId(db, plate, timestampMs) {
  const prefix = storageFilePrefix(plate, timestampMs);
  for (let index = 1; ; index++) {
    const candidate = `${prefix}-${index}`;
    const snap = await getDoc(doc(db, "rentals", candidate));
    if (!snap.exists()) return candidate;
  }
}

export async function uploadPhotoFiles(storage, rentalId, phase, plate, timestampMs, files) {
  const prefix = storageFilePrefix(plate, timestampMs);
  return Promise.all(
    files.map(async (file, index) => {
      const path = `rentals/${rentalId}/${phase}/${prefix}-${index + 1}.jpg`;
      const r = ref(storage, path);
      await uploadBytes(r, file);
      return getDownloadURL(r);
    })
  );
}

export async function uploadSignatureBlob(storage, rentalId, phase, plate, timestampMs, blob) {
  const prefix = storageFilePrefix(plate, timestampMs);
  const r = ref(storage, `rentals/${rentalId}/${phase}/${prefix}-podpis.jpg`);
  await uploadBytes(r, blob);
  return getDownloadURL(r);
}

export async function uploadDamageMapBlob(storage, rentalId, phase, plate, timestampMs, blob) {
  const prefix = storageFilePrefix(plate, timestampMs);
  const r = ref(storage, `rentals/${rentalId}/${phase}/${prefix}-uszkodzenia.jpg`);
  await uploadBytes(r, blob);
  return getDownloadURL(r);
}

// Zdjęcia dodane przez pracownika do SZKICU protokołu (przed wydaniem) —
// osobny folder "szkic" i znacznik czasu w nazwie, bo szkic można
// uzupełniać zdjęciami kilka razy tego samego dnia (nazwy z
// uploadPhotoFiles — prefiks + indeks — nadpisałyby wcześniejsze pliki).
export async function uploadDraftPhotoFiles(storage, rentalId, plate, files) {
  const prefix = `${normalizePlateId(plate)}-${Date.now()}`;
  return Promise.all(
    files.map(async (file, index) => {
      const r = ref(storage, `rentals/${rentalId}/szkic/${prefix}-${index + 1}.jpg`);
      await uploadBytes(r, file);
      return getDownloadURL(r);
    })
  );
}

// Łączy zaznaczenia uszkodzeń z kilku źródeł (baza pojazdu + szkic
// protokołu), pomijając praktycznie te same punkty (≤ 6 px na schemacie
// 600×400) — ten sam ślad zaznaczony w obu miejscach nie zdubluje się.
export function mergeDamageMarks(...lists) {
  const out = [];
  for (const list of lists) {
    for (const m of list || []) {
      if (!m || typeof m.x !== "number" || typeof m.y !== "number") continue;
      if (out.some((o) => Math.hypot(o.x - m.x, o.y - m.y) <= 6)) continue;
      out.push({ x: m.x, y: m.y });
    }
  }
  return out;
}

export async function urlsToDataUrls(urls) {
  if (!urls || !urls.length) return [];
  const results = await Promise.all(urls.map((u) => urlToDataUrl(u)));
  return results.filter(Boolean);
}

// Podgląd zdjęć już zapisanych (URL-e ze Storage) w pasku miniatur. Gdy
// podane onRemove, przy każdej miniaturze jest "✕" do usunięcia z listy.
export function renderPhotoUrlStrip(stripEl, urls, onRemove) {
  stripEl.replaceChildren();
  urls.forEach((url, index) => {
    const wrap = document.createElement("div");
    wrap.className = "photo-thumb-wrap";
    wrap.style.position = "relative";
    wrap.style.display = "inline-block";
    wrap.style.flexShrink = "0";
    const img = document.createElement("img");
    img.className = "photo-thumb";
    img.src = url;
    img.alt = `Zdjęcie ${index + 1}`;
    wrap.appendChild(img);
    if (onRemove) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "✕";
      btn.title = "Usuń zdjęcie ze szkicu";
      btn.style.cssText = "position:absolute;top:2px;right:2px;border:0;border-radius:50%;width:24px;height:24px;background:rgba(0,0,0,.65);color:#fff;cursor:pointer;line-height:24px;padding:0;";
      btn.addEventListener("click", () => onRemove(index));
      wrap.appendChild(btn);
    }
    stripEl.appendChild(wrap);
  });
}

export async function uploadPdfBlob(storage, rentalId, phase, plate, timestampMs, blob) {
  const prefix = storageFilePrefix(plate, timestampMs);
  const r = ref(storage, `rentals/${rentalId}/${phase}/${prefix}-protokol.pdf`);
  await uploadBytes(r, blob, { contentType: "application/pdf" });
  return getDownloadURL(r);
}

// Aparaty zapisują zdjęcie zrobione w poziomie w oryginalnej orientacji
// czujnika (często pionowej) plus znacznik EXIF "obróć przy wyświetlaniu".
// Zwykłe <img> ten znacznik respektuje, ale PDF go ignoruje — dlatego
// dekodujemy zdjęcie z uwzględnieniem EXIF i zapisujemy piksele już
// poprawnie obrócone, zanim trafią do protokołu. Przeskalowane do
// PDF_PHOTO_MAX_DIMENSION, bo w PDF-ie zdjęcie i tak zajmuje ułamek
// rozdzielczości aparatu — oryginał trafia bez zmian do Storage.
const PDF_PHOTO_MAX_DIMENSION = 1600;

async function blobToResizedDataUrl(blob) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
      const scale = Math.min(1, PDF_PHOTO_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      return canvas.toDataURL("image/jpeg", 0.85);
    } catch (e) {
      // Spadamy do zwykłego odczytu pliku, jeśli dekodowanie się nie uda.
    }
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function fileToDataUrl(file) {
  return blobToResizedDataUrl(file);
}

// Pobiera zdjęcie spod adresu Storage (np. już udokumentowane uszkodzenie
// zapisane na stałe przy pojeździe, patrz vehicleDamagePhotosToDataUrls
// niżej) i zamienia na data URL do osadzenia w PDF-ie. `null` przy błędzie —
// brak jednego zdjęcia nie powinien wywalać całego protokołu.
export async function urlToDataUrl(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await blobToResizedDataUrl(await res.blob());
  } catch (e) {
    return null;
  }
}

// Zdjęcia udokumentowanych uszkodzeń zapisane na stałe przy pojeździe
// (kolekcja vehicles, pole damagePhotoUrls — ustawiane przez pracownika w
// panelu, patrz js/app.js) — dołączane do PDF-u przy wydaniu/zwrocie, żeby
// najemca (i wypożyczalnia) widzieli pełną historię, nie tylko to, co
// zaznaczono w bieżącym protokole.
export async function vehicleDamagePhotosToDataUrls(photos) {
  if (!photos || !photos.length) return [];
  const results = await Promise.all(photos.map((p) => urlToDataUrl(p.url)));
  return results.filter(Boolean);
}

export async function sendProtocolEmail(functionsInstance, rentalId, phase, pdfUrl, tenantEmail, lessorEmail, vehiclePlate, timestamp) {
  const callable = httpsCallable(functionsInstance, "sendProtocolEmail");
  await callable({ rentalId, phase, pdfUrl, tenantEmail, lessorEmail, vehiclePlate, timestamp });
}

// Wypełnia pola formularza wartościami z zapisanego wcześniej rekordu
// wynajmu (np. tym, co pracownik wpisał przy wstępnym zakładaniu protokołu,
// albo tym, co najemca zdążył już wypełnić) — dopasowanie po `name` pola.
export function prefillForm(form, record) {
  for (const el of form.elements) {
    if (!el.name || !(el.name in record)) continue;
    const value = record[el.name];
    if (value === undefined || value === null || value === "") continue;
    if (el.type === "checkbox") el.checked = Boolean(value);
    else el.value = value;
  }
}

export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

export function formatDate(timestampMs) {
  return new Date(timestampMs).toLocaleDateString("pl-PL");
}

// Przełącza widoczność pola PESEL/NIP (i etykietę "Imię i nazwisko" /
// "Nazwa firmy") zależnie od typu najemcy — współdzielone między formularzem
// wydania w panelu (js/app.js) a samoobsługowym formularzem najemcy
// (protokol/protokol.js).
export function wireTenantTypeToggle(typeSelect, peselWrap, nipWrap, nameLabel, extraWraps) {
  const { idNumberWrap, krsWrap, representativeWrap } = extraWraps || {};
  function apply() {
    const isCompany = typeSelect.value === "firma";
    peselWrap.hidden = isCompany;
    nipWrap.hidden = !isCompany;
    nameLabel.firstChild.textContent = isCompany ? "Nazwa firmy" : "Imię i nazwisko";
    if (idNumberWrap) idNumberWrap.hidden = isCompany;
    if (krsWrap) krsWrap.hidden = !isCompany;
    if (representativeWrap) representativeWrap.hidden = !isCompany;
  }
  typeSelect.addEventListener("change", apply);
  apply();
}

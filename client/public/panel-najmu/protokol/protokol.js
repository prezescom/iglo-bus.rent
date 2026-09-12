// Samoobsługowa strona protokołu dla najemcy — BEZ Basic Auth (patrz
// middleware.ts) i BEZ signInAnonymously operatorskiego (patrz js/app.js).
// Jedyne co daje dostęp do jednego konkretnego wynajmu to hasło do TEGO
// protokołu, zweryfikowane przez Cloud Function verifyProtocolPassword,
// która w zamian wydaje Firebase custom token z claimem "protocolAccess"
// ograniczającym uprawnienia wyłącznie do rentals/{rentalId} (patrz
// firestore.rules / storage.rules). To samo hasło obsługuje wydanie i zwrot
// tego samego wynajmu — nie trzeba go podawać osobno przy zwrocie, dopóki
// sesja w tej przeglądarce jest wciąż aktywna; jeśli nie jest (inne
// urządzenie, wyczyszczone dane), strona po prostu prosi o to samo hasło
// jeszcze raz.
import { firebaseConfig, FUNCTIONS_REGION } from "../shared/firebase-config.js";
import { initSignatureField } from "../shared/signature.js";
import { initDamageMap } from "../shared/damage-map.js";
import { generateProtocolPdf, preloadPdfAssets } from "../shared/pdf.js";
import {
  escapeHtml, fileToDataUrl, wireTenantTypeToggle, prefillForm,
  uploadPhotoFiles, uploadSignatureBlob, uploadDamageMapBlob, uploadPdfBlob,
  sendProtocolEmail as sharedSendProtocolEmail
} from "../shared/protocol-actions.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithCustomToken, onAuthStateChanged, signOut,
  setPersistence, browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  getFunctions, httpsCallable
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";

const DAMAGE_MAP_DIAGRAM_URL = "/panel-najmu/img/van-diagram.png";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Sesja gościa (custom token zawężony do jednego rentalId) ma żyć TYLKO w
// tej jednej karcie (sessionStorage), nigdy w domyślnym IndexedDB dzielonym
// przez całe origin — inaczej karta panelu operatora (js/app.js), otwarta w
// tej samej przeglądarce, mogłaby "zobaczyć" i przejąć tę zawężoną sesję
// (Firebase synchronizuje IndexedDB między kartami), tracąc dostęp do
// reszty bazy mimo poprawnego logowania operatorskiego.
const authPersistenceReady = setPersistence(auth, browserSessionPersistence);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, FUNCTIONS_REGION);

const appEl = document.getElementById("app");

let currentPhotos = []; // array of File
let sigPad = null;
let damageMap = null;

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

function currentRentalId() {
  return decodeURIComponent(location.hash.replace("#", "").trim());
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 3500);
}

function showInfoScreen(message) {
  const tpl = document.getElementById("tpl-info-screen");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  document.getElementById("infoMessage").textContent = message;
}

// Wywoływane zaraz po zapisaniu KAŻDEJ fazy protokołu (wydania lub zwrotu):
// dezaktywuje hasło do tego protokołu (patrz expireProtocolAccess w
// functions/index.js) i wylogowuje bieżącą sesję — kolejna faza wymaga
// nowego hasła ustawionego ręcznie przez pracownika w panelu. Najlepszy
// wysiłek: dane protokołu są już bezpiecznie zapisane w tym momencie, więc
// błąd samej dezaktywacji (np. chwilowy brak sieci) nie powinien pokazywać
// się najemcy jako błąd zapisu.
async function expireAccessAndSignOut(rentalId) {
  try {
    await httpsCallable(functions, "expireProtocolAccess")({ rentalId });
  } catch (e) {
    // Ignorowane celowo — patrz komentarz wyżej.
  }
  await signOut(auth).catch(() => {});
}

async function render() {
  const rentalId = currentRentalId();
  currentPhotos = [];

  if (!rentalId) {
    showInfoScreen("Brak identyfikatora protokołu w adresie — użyj linku otrzymanego od wypożyczalni.");
    return;
  }

  // Musi być ustawione zanim cokolwiek sprawdzi/zmieni stan logowania — w
  // przeciwnym razie sygnOut poniżej (dla sesji operatorskiej z panelu,
  // wykrytej jako "zła" dla tego rentalId) wylogowałby ją też z panelu w
  // innej karcie tej samej przeglądarki, bo domyślnie obie karty dzielą to
  // samo IndexedDB.
  await authPersistenceReady;

  const user = await waitForInitialAuth();
  const claims = user ? (await user.getIdTokenResult()).claims : null;

  if (!claims || claims.protocolAccess !== rentalId) {
    // Albo w ogóle niezalogowany, albo zalogowany do INNEGO protokołu
    // (np. ten sam telefon miał otwarty wcześniej inny link) — w obu
    // przypadkach trzeba podać hasło do TEGO protokołu. Jeśli to, co
    // zobaczyliśmy, to cudza sesja (np. operatorska z panelu w innej
    // karcie) — dzięki setPersistence powyżej nie dotyka już współdzielonego
    // IndexedDB, więc signOut tutaj nie rusza panelu w innej karcie.
    if (user) await signOut(auth).catch(() => {});
    renderPasswordGate(rentalId);
    return;
  }

  await renderProtocolForPhase(rentalId);
}

function waitForInitialAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// ---------- EKRAN HASŁA ----------
function renderPasswordGate(rentalId) {
  const tpl = document.getElementById("tpl-password-gate");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  const form = document.getElementById("passwordForm");
  const errorEl = document.getElementById("gateError");
  const submitBtn = document.getElementById("gateSubmitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    const password = form.elements["password"].value;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sprawdzanie…";
    try {
      const verify = httpsCallable(functions, "verifyProtocolPassword");
      const result = await verify({ rentalId, password });
      await authPersistenceReady;
      await signInWithCustomToken(auth, result.data.token);
      await renderProtocolForPhase(rentalId);
    } catch (err) {
      errorEl.textContent = err.message || "Nieprawidłowe hasło.";
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Wejdź do protokołu";
    }
  });
}

// ---------- WYBÓR FAZY (wydanie / zwrot / zakończony) ----------
async function renderProtocolForPhase(rentalId) {
  let record = null;
  try {
    const snap = await getDoc(doc(db, "rentals", rentalId));
    if (snap.exists()) record = snap.data();
  } catch (e) {
    showInfoScreen("Błąd wczytywania protokołu: " + e.message);
    return;
  }

  if (!record) {
    showInfoScreen("Nie znaleziono protokołu o tym identyfikatorze.");
    return;
  }

  if (record.status === "zwrocony") {
    showInfoScreen("Ten protokół wynajmu jest już zakończony (pojazd zwrócony). Dziękujemy!");
    return;
  }

  if (record.status === "wydany" && record.handoverProtocolPdfUrl) {
    renderGuestReturn(rentalId, record);
    return;
  }

  // status "szkic", albo "wydany" bez gotowego PDF-a (przerwany wcześniejszy
  // zapis) — w obu przypadkach najemca wypełnia/dokańcza wydanie.
  renderGuestHandover(rentalId, record);
}

// ---------- WYDANIE (wypełniane przez najemcę) ----------
// Pola pojazdu/najemcy/adresu/wyposażenia, które pracownik może zablokować
// przy zakładaniu protokołu (checkbox "Dostęp najemcy" w panelu, patrz
// renderNewProtocol/renderDrafts w js/app.js) — najemca je widzi, ale nie
// edytuje. Przebieg i paliwo (mileage/fuel) NIGDY nie są blokowane — to
// jedyne dane, które najemca zawsze podaje sam przy odbiorze.
const LOCKABLE_FIELDS = [
  "vehiclePlate", "vehicleModel", "vehicleVin",
  "tenantType", "tenantPesel", "tenantNip", "tenantName", "tenantPhone", "tenantEmail",
  "tenantStreet", "tenantHouseNumber", "tenantApartmentNumber", "tenantPostalCode", "tenantCity",
  "equipmentShelf", "equipmentCargoBar", "equipmentStraps", "equipmentPowerCable"
];

function applyFieldLock(form, existingRecord) {
  if (!existingRecord.lockFieldsForTenant) return;
  LOCKABLE_FIELDS.forEach((name) => {
    const el = form.elements[name];
    if (el) el.disabled = true;
  });
  // Dane najemcy i jego adres nie są najemcy w ogóle potrzebne do wglądu
  // (wypożyczalnia już je zebrała przy zakładaniu protokołu) — w
  // przeciwieństwie do pojazdu/wyposażenia, które zostają widoczne, tylko
  // zablokowane do edycji (żeby najemca mógł je zweryfikować).
  const tenantFieldset = document.getElementById("tenantFieldset");
  const addressFieldset = document.getElementById("addressFieldset");
  if (tenantFieldset) tenantFieldset.hidden = true;
  if (addressFieldset) addressFieldset.hidden = true;
  const note = document.createElement("p");
  note.className = "muted";
  note.textContent = "Dane pojazdu, najemcy, adresu i wyposażenia zostały uzupełnione przez wypożyczalnię i nie można ich tu zmienić.";
  form.prepend(note);
}

function renderGuestHandover(rentalId, existingRecord) {
  preloadPdfAssets();
  const tpl = document.getElementById("tpl-guest-handover");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  wirePhotoStrip();
  sigPad = initSignatureField({
    placeholder: document.getElementById("sigPlaceholder"),
    preview: document.getElementById("sigPreview"),
    editBtn: document.getElementById("sigEditBtn")
  });
  damageMap = initDamageMap({
    canvas: document.getElementById("damageMap"),
    overlay: document.getElementById("damageMapOverlay"),
    confirmBtn: document.getElementById("damageMapConfirmBtn"),
    discardBtn: document.getElementById("damageMapDiscardBtn"),
    pendingActions: document.getElementById("damageMapPendingActions"),
    diagramUrl: DAMAGE_MAP_DIAGRAM_URL
  });
  appEl.querySelector('[data-action="clear-damage-map"]').addEventListener("click", () => damageMap.clear());

  const form = document.getElementById("handoverForm");
  wireTenantTypeToggle(
    document.getElementById("tenantTypeSelect"),
    document.getElementById("tenantPeselWrap"),
    document.getElementById("tenantNipWrap"),
    document.getElementById("tenantNameLabel")
  );

  // Dane, które pracownik mógł już wpisać przy wstępnym zakładaniu protokołu
  // (np. nr rejestracyjny pojazdu, PESEL, adres, wyposażenie) — podpowiadamy
  // je najemcy, żeby nie musiał ich przepisywać.
  prefillForm(form, existingRecord);
  // Odśwież widoczność pól PESEL/NIP zgodnie z wczytanym typem najemcy
  // (ustawienie .value nie wywołuje samo z siebie listenera "change").
  form.elements["tenantType"].dispatchEvent(new Event("change"));
  applyFieldLock(form, existingRecord);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("formError");
    const submitBtn = document.getElementById("submitBtn");
    errorEl.hidden = true;

    if (sigPad.isEmpty()) {
      errorEl.textContent = "Musisz się podpisać przed zapisaniem protokołu.";
      errorEl.hidden = false;
      return;
    }

    const fd = new FormData(form);
    // Pola zablokowane przez pracownika (patrz applyFieldLock) są "disabled"
    // — FormData je pomija, więc dla nich bierzemy wartość wprost z rekordu
    // szkicu zamiast z formularza (który i tak jej nie da zmienić).
    const locked = Boolean(existingRecord.lockFieldsForTenant);
    const val = (name) => (locked && LOCKABLE_FIELDS.includes(name) ? existingRecord[name] || "" : fd.get(name) || "");
    const checkedVal = (name) => (locked && LOCKABLE_FIELDS.includes(name) ? Boolean(existingRecord[name]) : form.elements[name].checked);
    const record = {
      vehiclePlate: val("vehiclePlate"),
      vehicleModel: val("vehicleModel"),
      vehicleVin: val("vehicleVin"),
      vehicleMileageAtHandover: fd.get("mileage"),
      vehicleFuelAtHandover: fd.get("fuel"),
      vehicleMileageAtReturn: "",
      vehicleFuelAtReturn: "",
      distanceTraveled: "",
      tenantType: val("tenantType"),
      tenantName: val("tenantName"),
      tenantNip: val("tenantNip"),
      tenantPesel: val("tenantPesel"),
      tenantPhone: val("tenantPhone"),
      tenantEmail: val("tenantEmail"),
      tenantStreet: val("tenantStreet"),
      tenantHouseNumber: val("tenantHouseNumber"),
      tenantApartmentNumber: val("tenantApartmentNumber"),
      tenantPostalCode: val("tenantPostalCode"),
      tenantCity: val("tenantCity"),
      driverName: fd.get("driverName"),
      driverLicenseNumber: fd.get("driverLicense"),
      lessorEmail: existingRecord.lessorEmail,
      handoverTimestamp: Date.now(),
      returnTimestamp: 0,
      closedTimestamp: 0,
      handoverNotes: fd.get("notes") || "",
      returnNotes: "",
      handoverBodyCondition: fd.get("bodyCondition"),
      handoverPassengerAreaCondition: fd.get("passengerAreaCondition"),
      handoverCargoAreaCondition: fd.get("cargoAreaCondition"),
      returnBodyCondition: "",
      returnPassengerAreaCondition: "",
      returnCargoAreaCondition: "",
      equipmentShelf: checkedVal("equipmentShelf"),
      equipmentCargoBar: checkedVal("equipmentCargoBar"),
      equipmentStraps: checkedVal("equipmentStraps"),
      equipmentPowerCable: checkedVal("equipmentPowerCable"),
      lockFieldsForTenant: locked,
      handoverPhotoUrls: [],
      returnPhotoUrls: [],
      handoverSignatureUrl: "",
      returnSignatureUrl: "",
      handoverDamageMapUrl: "",
      returnDamageMapUrl: "",
      handoverProtocolPdfUrl: "",
      returnProtocolPdfUrl: "",
      id: rentalId,
      status: "wydany"
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      const docRef = doc(db, "rentals", rentalId);
      const [, photoUrls, sigUrl, damageMapUrl, photoDataUrls] = await Promise.all([
        setDoc(docRef, record),
        uploadPhotoFiles(storage, rentalId, "wydanie", record.vehiclePlate, record.handoverTimestamp, currentPhotos),
        (async () => uploadSignatureBlob(storage, rentalId, "wydanie", record.vehiclePlate, record.handoverTimestamp, await sigPad.toBlob()))(),
        (async () => uploadDamageMapBlob(storage, rentalId, "wydanie", record.vehiclePlate, record.handoverTimestamp, await damageMap.toBlob()))(),
        Promise.all(currentPhotos.map(fileToDataUrl))
      ]);
      const sigDataUrl = sigPad.toDataUrl();
      const damageMapDataUrl = damageMap.toDataUrl();
      const pdfBlob = await generateProtocolPdf(record, "wydanie", sigDataUrl, damageMapDataUrl, photoDataUrls);
      const pdfUrl = await uploadPdfBlob(storage, rentalId, "wydanie", record.vehiclePlate, record.handoverTimestamp, pdfBlob);

      const finalRecord = {
        ...record,
        handoverPhotoUrls: photoUrls,
        handoverSignatureUrl: sigUrl,
        handoverDamageMapUrl: damageMapUrl,
        handoverProtocolPdfUrl: pdfUrl
      };
      await setDoc(docRef, finalRecord);
      await sharedSendProtocolEmail(functions, rentalId, "wydanie", pdfUrl, record.tenantEmail, record.lessorEmail, record.vehiclePlate, record.handoverTimestamp);

      showToast("Zapisano protokół wydania. Kopię wysłaliśmy na Twój e-mail.");
      await expireAccessAndSignOut(rentalId);
      showInfoScreen("Protokół wydania zapisany. Kopię wysłaliśmy na Twój e-mail. Ten link jest teraz nieaktywny — do zwrotu pojazdu poproś wypożyczalnię o nowe hasło.");
    } catch (err) {
      errorEl.textContent = "Błąd zapisu: " + err.message;
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Zapisz protokół wydania";
    }
  });
}

// ---------- ZWROT (wypełniane przez najemcę, tym samym hasłem) ----------
function renderGuestReturn(rentalId, record) {
  preloadPdfAssets();
  const tpl = document.getElementById("tpl-guest-return");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  const headerEl = document.getElementById("returnHeader");
  const formEl = document.getElementById("returnForm");

  headerEl.innerHTML = `<strong>${escapeHtml(record.vehicleModel)} • ${escapeHtml(record.vehiclePlate)}</strong>`;
  formEl.hidden = false;

  wirePhotoStrip();
  sigPad = initSignatureField({
    placeholder: document.getElementById("sigPlaceholder"),
    preview: document.getElementById("sigPreview"),
    editBtn: document.getElementById("sigEditBtn")
  });
  damageMap = initDamageMap({
    canvas: document.getElementById("damageMap"),
    overlay: document.getElementById("damageMapOverlay"),
    confirmBtn: document.getElementById("damageMapConfirmBtn"),
    discardBtn: document.getElementById("damageMapDiscardBtn"),
    pendingActions: document.getElementById("damageMapPendingActions"),
    diagramUrl: DAMAGE_MAP_DIAGRAM_URL,
    distinguishOrigin: true
  });
  appEl.querySelector('[data-action="clear-damage-map"]').addEventListener("click", () => damageMap.clear());

  const equipmentOptions = [
    { field: "equipmentShelf", label: "Półka double-deck" },
    { field: "equipmentCargoBar", label: "Poprzeczka do blokowania ładunku" },
    { field: "equipmentStraps", label: "Zapinki (6 szt.)" },
    { field: "equipmentPowerCable", label: "Kabel do zasilania chłodni na postoju" }
  ].filter((opt) => record[opt.field]);

  if (equipmentOptions.length) {
    document.getElementById("returnEquipmentFieldset").hidden = false;
    const container = document.getElementById("returnEquipmentContainer");
    equipmentOptions.forEach((opt) => {
      const label = document.createElement("label");
      label.className = "checkbox-label";
      label.innerHTML = `<input type="checkbox" name="return_${opt.field}" checked /> ${escapeHtml(opt.label)}`;
      container.appendChild(label);
    });
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("formError");
    const submitBtn = document.getElementById("submitBtn");
    errorEl.hidden = true;

    if (sigPad.isEmpty()) {
      errorEl.textContent = "Musisz się podpisać przed zapisaniem protokołu.";
      errorEl.hidden = false;
      return;
    }

    const fd = new FormData(formEl);
    const now = Date.now();
    const mileageAtReturn = fd.get("mileage");
    const distanceTraveled = Number(mileageAtReturn) - Number(record.vehicleMileageAtHandover);

    const returnedEquipment = {};
    equipmentOptions.forEach((opt) => {
      returnedEquipment[opt.field] = formEl.elements[`return_${opt.field}`].checked;
    });

    const updated = {
      ...record,
      vehicleMileageAtReturn: mileageAtReturn,
      vehicleFuelAtReturn: fd.get("fuel"),
      distanceTraveled: Number.isFinite(distanceTraveled) ? distanceTraveled : "",
      returnNotes: fd.get("notes") || "",
      returnBodyCondition: fd.get("bodyCondition"),
      returnPassengerAreaCondition: fd.get("passengerAreaCondition"),
      returnCargoAreaCondition: fd.get("cargoAreaCondition"),
      returnedEquipment,
      returnTimestamp: now,
      closedTimestamp: now,
      status: "zwrocony"
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      const [photoUrls, sigUrl, damageMapUrl, photoDataUrls] = await Promise.all([
        uploadPhotoFiles(storage, rentalId, "zwrot", updated.vehiclePlate, updated.returnTimestamp, currentPhotos),
        (async () => uploadSignatureBlob(storage, rentalId, "zwrot", updated.vehiclePlate, updated.returnTimestamp, await sigPad.toBlob()))(),
        (async () => uploadDamageMapBlob(storage, rentalId, "zwrot", updated.vehiclePlate, updated.returnTimestamp, await damageMap.toBlob()))(),
        Promise.all(currentPhotos.map(fileToDataUrl))
      ]);
      const sigDataUrl = sigPad.toDataUrl();
      const damageMapDataUrl = damageMap.toDataUrl();
      const pdfBlob = await generateProtocolPdf(updated, "zwrot", sigDataUrl, damageMapDataUrl, photoDataUrls);
      const pdfUrl = await uploadPdfBlob(storage, rentalId, "zwrot", updated.vehiclePlate, updated.returnTimestamp, pdfBlob);

      updated.returnPhotoUrls = photoUrls;
      updated.returnSignatureUrl = sigUrl;
      updated.returnDamageMapUrl = damageMapUrl;
      updated.returnProtocolPdfUrl = pdfUrl;

      await setDoc(doc(db, "rentals", rentalId), updated);
      await sharedSendProtocolEmail(functions, rentalId, "zwrot", pdfUrl, updated.tenantEmail, updated.lessorEmail, updated.vehiclePlate, updated.returnTimestamp);

      showToast("Zapisano protokół zwrotu. Dziękujemy!");
      await expireAccessAndSignOut(rentalId);
      showInfoScreen("Protokół zwrotu zapisany. Kopię wysłaliśmy na Twój e-mail. Ten link jest teraz nieaktywny. Dziękujemy!");
    } catch (err) {
      errorEl.textContent = "Błąd zapisu: " + err.message;
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Zapisz protokół zwrotu";
    }
  });
}

// ---------- Pomocnicze (zdjęcia) ----------
function wirePhotoStrip() {
  const strip = document.getElementById("photoStrip");
  const input = document.getElementById("photoInput");
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    currentPhotos.push(file);
    const img = document.createElement("img");
    img.className = "photo-thumb";
    img.src = URL.createObjectURL(file);
    strip.appendChild(img);
    input.value = "";
  });
}

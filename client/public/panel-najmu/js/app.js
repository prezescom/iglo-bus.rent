import { firebaseConfig, LESSOR_EMAIL, FUNCTIONS_REGION } from "../shared/firebase-config.js";
import { initSignatureField } from "../shared/signature.js";
import { initDamageMap } from "../shared/damage-map.js";
import { generateProtocolPdf, preloadPdfAssets } from "../shared/pdf.js";
import { generateContractDocx, resolveTemplateKey } from "./contracts.js";

const DAMAGE_MAP_DIAGRAM_URL = "/panel-najmu/img/van-diagram.png";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll, getBlob
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  getFunctions, httpsCallable
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, FUNCTIONS_REGION);

const appEl = document.getElementById("app");
const pageTitle = document.getElementById("pageTitle");
const backBtn = document.getElementById("backBtn");

let currentPhotos = []; // array of { blob, previewUrl }
let sigPad = null;
let damageMap = null;

// ---------- Auth (anonymous — single operator, no login screen needed) ----------
// Panel i samoobsługowa strona protokołu (protokol/protokol.js) dzielą to
// samo pochodzenie (origin), więc dzielą też sesję logowania Firebase w tej
// przeglądarce. Jeśli ktoś na tym samym urządzeniu miał wcześniej otwarty i
// zalogowany link do jednego protokołu (custom token z claimem
// "protocolAccess" — patrz firestore.rules), ta zawężona sesja zostałaby
// błędnie użyta też przez panel operatora, dając "Missing or insufficient
// permissions" wszędzie. Dlatego zanim uznamy sesję za gotową, sprawdzamy
// claimy i w razie potrzeby wylogowujemy/logujemy się od nowa anonimowo.
// Celowo NIE zapamiętujemy wyniku na stałe (żadnego zapamiętanego Promise) —
// karta panelu i karta protokol/ w tej samej przeglądarce dzielą to samo
// IndexedDB logowania Firebase, więc sesja w już otwartej karcie panelu
// potrafi zostać podmieniona na zawężoną (protocolAccess) w dowolnym
// momencie, nawet długo po pierwszym załadowaniu — np. gdy operator w
// międzyczasie otworzy i zaloguje link do protokołu w innej karcie tej
// samej przeglądarki. render() woła tę funkcję przy każdej nawigacji, więc
// świeże sprawdzenie tutaj samo naprawia sytuację przy kolejnym kliknięciu.
async function waitForAuthReady() {
  let user = auth.currentUser;
  if (!user) {
    user = await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        if (u) {
          unsubscribe();
          resolve(u);
        } else {
          signInAnonymously(auth).catch((e) => showToast("Błąd logowania: " + e.message));
        }
      });
    });
  }
  try {
    const { claims } = await user.getIdTokenResult();
    if (claims.protocolAccess) {
      await signOut(auth);
      await signInAnonymously(auth);
      return waitForAuthReady();
    }
  } catch (e) {
    // Brak możliwości odczytania claimów nie powinien blokować dalej —
    // spróbujemy z tym, co jest.
  }
  return user;
}

// Siatka bezpieczeństwa dla widoku, na którym operator siedzi bez nawigacji
// (więc render() by się nie odpalił samo z siebie), gdy w międzyczasie inna
// karta tej samej przeglądarki podmieni sesję na zawężoną (protocolAccess)
// — odśwież bieżący widok, żeby waitForAuthReady() to wykryło i naprawiło.
let lastKnownUid = null;
onAuthStateChanged(auth, (user) => {
  if (user && user.uid !== lastKnownUid) {
    lastKnownUid = user.uid;
    render();
  }
});

// ---------- Routing (simple hash-based) ----------
window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

function currentRoute() {
  const hash = location.hash.replace("#", "") || "list";
  const [view, param] = hash.split("/");
  return { view, param };
}

function navigate(hash) {
  location.hash = hash;
}

async function render() {
  await waitForAuthReady();
  const { view, param } = currentRoute();
  currentPhotos = [];
  backBtn.hidden = view === "list";

  if (view === "list") {
    pageTitle.textContent = "Wynajmy";
    renderList();
  } else if (view === "handover") {
    pageTitle.textContent = param ? "Dokończ protokół" : "Wydanie pojazdu";
    renderHandover(param || null);
  } else if (view === "new-protocol") {
    pageTitle.textContent = "Nowy protokół (link dla najemcy)";
    renderNewProtocol();
  } else if (view === "drafts") {
    pageTitle.textContent = "Szkice protokołów";
    renderDrafts();
  } else if (view === "return") {
    pageTitle.textContent = "Zwrot pojazdu";
    renderReturn(param);
  } else if (view === "regenerate") {
    pageTitle.textContent = "Protokół awaryjny";
    const [phase, rentalId] = (param || "").split("__");
    renderRegenerate(phase, rentalId);
  } else if (view === "history") {
    pageTitle.textContent = "Zakończone wynajmy";
    renderHistory();
  } else if (view === "vehicles") {
    pageTitle.textContent = "Baza pojazdów";
    renderVehicles();
  } else if (view === "vehicle") {
    pageTitle.textContent = param ? "Edytuj pojazd" : "Nowy pojazd";
    renderVehicleForm(param);
  } else if (view === "tenants") {
    pageTitle.textContent = "Baza najemców";
    renderTenants();
  } else if (view === "tenant") {
    pageTitle.textContent = param ? "Edytuj najemcę" : "Nowy najemca";
    renderTenantForm(param);
  } else if (view === "contract") {
    pageTitle.textContent = "Wygeneruj umowę";
    renderContractForm();
  } else if (view === "posts") {
    pageTitle.textContent = "Blog";
    renderPosts();
  } else if (view === "post") {
    pageTitle.textContent = param ? "Edytuj wpis" : "Nowy wpis";
    renderPostForm(param);
  }
}

backBtn.addEventListener("click", () => navigate("list"));

// ---------- Toast ----------
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 3500);
}

// ---------- LIST VIEW ----------
async function renderList() {
  const tpl = document.getElementById("tpl-list");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  appEl.querySelector('[data-action="new-handover"]').addEventListener("click", () => navigate("handover"));
  appEl.querySelector('[data-action="new-protocol-link"]').addEventListener("click", () => navigate("new-protocol"));
  appEl.querySelector('[data-action="view-drafts"]').addEventListener("click", () => navigate("drafts"));
  appEl.querySelector('[data-action="view-history"]').addEventListener("click", () => navigate("history"));
  appEl.querySelector('[data-action="view-vehicles"]').addEventListener("click", () => navigate("vehicles"));
  appEl.querySelector('[data-action="view-tenants"]').addEventListener("click", () => navigate("tenants"));
  appEl.querySelector('[data-action="new-contract"]').addEventListener("click", () => navigate("contract"));
  appEl.querySelector('[data-action="view-posts"]').addEventListener("click", () => navigate("posts"));

  const listEl = document.getElementById("rentalList");
  try {
    const q = query(collection(db, "rentals"), where("status", "==", "wydany"));
    const snap = await getDocs(q);
    if (snap.empty) {
      listEl.innerHTML = '<p class="muted">Brak aktywnych wynajmów.</p>';
      return;
    }
    listEl.innerHTML = "";
    snap.forEach((d) => {
      const r = d.data();
      const missingProtocol = !r.handoverProtocolPdfUrl;
      const card = document.createElement("div");
      card.className = "rental-card";
      const link = `${location.origin}/panel-najmu/protokol/#${d.id}`;
      card.innerHTML = `
        <div class="plate">${escapeHtml(r.vehicleModel)} • ${escapeHtml(r.vehiclePlate)}</div>
        <div class="tenant">Najemca: ${escapeHtml(r.tenantName)}</div>
        ${missingProtocol ? '<div class="error">Brak wygenerowanego protokołu wydania (PDF)!</div>' : ""}
        <button class="btn btn-secondary" data-action="return">Zarejestruj zwrot</button>
        <button class="btn-text" data-action="return-password">Ustaw hasło do samoobsługowego zwrotu</button>
        ${missingProtocol ? '<button class="btn-text" data-action="regen">Wygeneruj protokół awaryjnie</button>' : ""}
      `;
      card.querySelector('[data-action="return"]').addEventListener("click", () => navigate(`return/${d.id}`));
      card.querySelector('[data-action="return-password"]').addEventListener("click", async () => {
        const newPassword = prompt("Hasło, którym najemca sam zrobi zwrot pod linkiem (min. 6 znaków):");
        if (!newPassword) return;
        try {
          await httpsCallable(functions, "setProtocolPassword")({ rentalId: d.id, password: newPassword });
          showToast(`Ustawiono hasło do zwrotu. Link: ${link}`);
        } catch (e) {
          showToast("Błąd: " + e.message);
        }
      });
      const regenBtn = card.querySelector('[data-action="regen"]');
      if (regenBtn) {
        regenBtn.addEventListener("click", () => navigate(`regenerate/wydanie__${d.id}`));
      }
      listEl.appendChild(card);
    });
  } catch (e) {
    listEl.innerHTML = `<p class="error">Błąd wczytywania: ${escapeHtml(e.message)}</p>`;
  }
}

// ---------- NOWY PROTOKÓŁ (wstępne wprowadzenie + link dla najemcy) ----------
// Tworzy rekord wynajmu w statusie "szkic" i ustawia hasło do jego
// samoobsługowego linku (client/public/panel-najmu/protokol/, poza Basic
// Authem) — patrz firebase-panel-najmu/functions/index.js:
// setProtocolPassword/verifyProtocolPassword. Najemca pod tym linkiem sam
// wypełni resztę (albo pracownik dokończy to z panelu przez "Szkice
// protokołów", patrz renderDrafts poniżej).
async function renderNewProtocol() {
  const tpl = document.getElementById("tpl-new-protocol");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  const form = document.getElementById("newProtocolForm");
  const errorEl = document.getElementById("newProtocolError");
  const submitBtn = document.getElementById("newProtocolSubmitBtn");
  const resultEl = document.getElementById("newProtocolResult");

  // ---- Pojazd: podpowiedź nr rejestracyjnego z bazy pojazdów ----
  const plateInput = document.getElementById("newProtocolPlateInput");
  const modelInput = form.elements["vehicleModel"];
  const vinInput = form.elements["vehicleVin"];
  let knownVehicles = [];
  try {
    knownVehicles = await fetchVehicles();
  } catch (e) {
    // Brak dostępu do bazy pojazdów nie powinien blokować zakładania protokołu.
  }
  wireAutocomplete(plateInput, () =>
    knownVehicles.map((v) => ({
      value: v.plate,
      label: v.plate,
      sub: [v.make, v.model].filter(Boolean).join(" ")
    }))
  );
  plateInput.addEventListener("change", () => {
    const match = knownVehicles.find((v) => normalizePlateId(v.plate) === normalizePlateId(plateInput.value));
    if (match) {
      modelInput.value = `${match.make || ""} ${match.model || ""}`.trim();
      vinInput.value = match.vin || "";
    }
  });

  // ---- Najemca: typ + podpowiedź PESEL/NIP z bazy najemców (adres itd.) ----
  wireTenantTypeToggle(
    document.getElementById("newProtocolTenantTypeSelect"),
    document.getElementById("newProtocolTenantPeselWrap"),
    document.getElementById("newProtocolTenantNipWrap"),
    document.getElementById("newProtocolTenantNameLabel")
  );

  let knownTenants = [];
  try {
    knownTenants = await fetchTenants();
  } catch (e) {
    // Brak dostępu do bazy najemców nie powinien blokować zakładania protokołu.
  }
  wireAutocomplete(document.getElementById("newProtocolTenantPeselInput"), () =>
    knownTenants
      .filter((t) => t.tenantType !== "firma")
      .map((t) => ({ value: t.pesel, label: t.name, sub: t.pesel }))
  );
  wireAutocomplete(document.getElementById("newProtocolTenantNipInput"), () =>
    knownTenants
      .filter((t) => t.tenantType === "firma")
      .map((t) => ({ value: t.nip, label: t.name, sub: t.nip }))
  );

  function autofillTenant(inputEl) {
    const match = knownTenants.find((t) => normalizeTenantId(t.tenantType === "firma" ? t.nip : t.pesel) === normalizeTenantId(inputEl.value));
    if (!match) return;
    form.elements["tenantName"].value = match.name || "";
    form.elements["tenantPhone"].value = match.phone || "";
    form.elements["tenantEmail"].value = match.email || "";
    form.elements["tenantStreet"].value = match.street || "";
    form.elements["tenantHouseNumber"].value = match.houseNumber || "";
    form.elements["tenantApartmentNumber"].value = match.apartmentNumber || "";
    form.elements["tenantPostalCode"].value = match.postalCode || "";
    form.elements["tenantCity"].value = match.city || "";
  }
  form.elements["tenantPesel"].addEventListener("change", (e) => autofillTenant(e.target));
  form.elements["tenantNip"].addEventListener("change", (e) => autofillTenant(e.target));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    const fd = new FormData(form);
    const plate = fd.get("vehiclePlate");
    const password = fd.get("password");

    submitBtn.disabled = true;
    submitBtn.textContent = "Tworzenie…";
    try {
      const rentalId = await generateReadableRentalId(plate, Date.now());
      const record = {
        vehiclePlate: plate,
        vehicleModel: fd.get("vehicleModel") || "",
        vehicleVin: fd.get("vehicleVin") || "",
        vehicleMileageAtHandover: "",
        vehicleFuelAtHandover: "",
        vehicleMileageAtReturn: "",
        vehicleFuelAtReturn: "",
        distanceTraveled: "",
        tenantType: fd.get("tenantType"),
        tenantName: fd.get("tenantName") || "",
        tenantNip: fd.get("tenantNip") || "",
        tenantPesel: fd.get("tenantPesel") || "",
        tenantPhone: fd.get("tenantPhone") || "",
        tenantEmail: fd.get("tenantEmail") || "",
        tenantStreet: fd.get("tenantStreet") || "",
        tenantHouseNumber: fd.get("tenantHouseNumber") || "",
        tenantApartmentNumber: fd.get("tenantApartmentNumber") || "",
        tenantPostalCode: fd.get("tenantPostalCode") || "",
        tenantCity: fd.get("tenantCity") || "",
        driverName: "",
        driverLicenseNumber: "",
        lessorEmail: LESSOR_EMAIL,
        handoverTimestamp: 0,
        returnTimestamp: 0,
        closedTimestamp: 0,
        handoverNotes: "",
        returnNotes: "",
        handoverBodyCondition: "",
        handoverPassengerAreaCondition: "",
        handoverCargoAreaCondition: "",
        returnBodyCondition: "",
        returnPassengerAreaCondition: "",
        returnCargoAreaCondition: "",
        equipmentShelf: form.elements["equipmentShelf"].checked,
        equipmentCargoBar: form.elements["equipmentCargoBar"].checked,
        equipmentStraps: form.elements["equipmentStraps"].checked,
        equipmentPowerCable: form.elements["equipmentPowerCable"].checked,
        // Gdy zaznaczone, najemca pod linkiem widzi dane pojazdu/najemcy/
        // adresu/wyposażenia, ale nie może ich zmienić (patrz protokol.js:
        // LOCKABLE_FIELDS) — poza przebiegiem i paliwem, które zawsze wpisuje sam.
        lockFieldsForTenant: form.elements["lockFieldsForTenant"].checked,
        handoverPhotoUrls: [],
        returnPhotoUrls: [],
        handoverSignatureUrl: "",
        returnSignatureUrl: "",
        handoverDamageMapUrl: "",
        returnDamageMapUrl: "",
        handoverProtocolPdfUrl: "",
        returnProtocolPdfUrl: "",
        id: rentalId,
        status: "szkic"
      };
      await setDoc(doc(db, "rentals", rentalId), record);
      await httpsCallable(functions, "setProtocolPassword")({ rentalId, password });

      const link = `${location.origin}/panel-najmu/protokol/#${rentalId}`;
      document.getElementById("newProtocolLink").textContent = link;
      form.hidden = true;
      resultEl.hidden = false;

      document.getElementById("copyLinkBtn").addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(link);
          showToast("Skopiowano link.");
        } catch (e) {
          showToast("Nie udało się skopiować — zaznacz link ręcznie.");
        }
      });
      document.getElementById("newProtocolBackBtn").addEventListener("click", () => navigate("list"));
    } catch (err) {
      errorEl.textContent = "Błąd tworzenia protokołu: " + err.message;
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Utwórz protokół i link";
    }
  });
}

// ---------- SZKICE PROTOKOŁÓW (oczekujące na najemcę lub dokończenie) ----------
async function renderDrafts() {
  const tpl = document.getElementById("tpl-drafts");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  const listEl = document.getElementById("draftsList");
  try {
    const q = query(collection(db, "rentals"), where("status", "==", "szkic"));
    const snap = await getDocs(q);
    if (snap.empty) {
      listEl.innerHTML = '<p class="muted">Brak oczekujących szkiców.</p>';
      return;
    }
    listEl.innerHTML = "";
    snap.forEach((d) => {
      const r = d.data();
      const link = `${location.origin}/panel-najmu/protokol/#${d.id}`;
      const card = document.createElement("div");
      card.className = "rental-card";
      card.innerHTML = `
        <div class="plate">${escapeHtml(r.vehicleModel || "?")} • ${escapeHtml(r.vehiclePlate)}</div>
        <div class="tenant">Najemca: ${escapeHtml(r.tenantName || "— (jeszcze nie wypełnione)")}</div>
        <label class="checkbox-label">
          <input type="checkbox" data-action="lock" ${r.lockFieldsForTenant ? "checked" : ""} />
          Zablokuj dane pojazdu/najemcy przed edycją przez najemcę
        </label>
        <button class="btn-text" data-action="show-link">Pokaż link</button>
        <button class="btn btn-secondary" data-action="finish">Dokończ z panelu</button>
        <button class="btn-text" data-action="password">Ustaw nowe hasło</button>
        <button class="btn-text" data-action="delete">Usuń szkic</button>
      `;
      card.querySelector('[data-action="finish"]').addEventListener("click", () => navigate(`handover/${d.id}`));
      card.querySelector('[data-action="show-link"]').addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(link);
          showToast(`Skopiowano link: ${link}`);
        } catch (e) {
          // Kopiowanie może być zablokowane (np. brak uprawnień przeglądarki)
          // — pokaż link do ręcznego skopiowania zamiast cichej porażki.
          window.prompt("Link do protokołu (skopiuj ręcznie):", link);
        }
      });
      card.querySelector('[data-action="lock"]').addEventListener("change", async (e) => {
        const checked = e.target.checked;
        try {
          await setDoc(doc(db, "rentals", d.id), { lockFieldsForTenant: checked }, { merge: true });
        } catch (err) {
          e.target.checked = !checked;
          showToast("Błąd: " + err.message);
        }
      });
      card.querySelector('[data-action="password"]').addEventListener("click", async () => {
        const newPassword = prompt("Nowe hasło do tego protokołu (min. 6 znaków):");
        if (!newPassword) return;
        try {
          await httpsCallable(functions, "setProtocolPassword")({ rentalId: d.id, password: newPassword });
          showToast(`Ustawiono nowe hasło. Link: ${link}`);
        } catch (e) {
          showToast("Błąd: " + e.message);
        }
      });
      card.querySelector('[data-action="delete"]').addEventListener("click", async () => {
        if (!confirm("Usunąć ten szkic protokołu?")) return;
        try {
          await deleteDoc(doc(db, "rentals", d.id));
          renderDrafts();
        } catch (e) {
          showToast("Błąd usuwania: " + e.message);
        }
      });
      listEl.appendChild(card);
    });
  } catch (e) {
    listEl.innerHTML = `<p class="error">Błąd wczytywania: ${escapeHtml(e.message)}</p>`;
  }
}

// ---------- HISTORY VIEW (zakończone wynajmy) ----------
async function renderHistory() {
  const tpl = document.getElementById("tpl-history");
  appEl.replaceChildren(tpl.content.cloneNode(true));

  const listEl = document.getElementById("historyList");
  const filterInput = document.getElementById("historyFilter");

  let closedRentals = [];
  try {
    const q = query(collection(db, "rentals"), where("status", "==", "zwrocony"));
    const snap = await getDocs(q);
    closedRentals = snap.docs.map((d) => d.data());
    // Najnowsze zwroty na górze — sortowanie po stronie klienta, bo
    // wynajmów zamkniętych jest mało (kasowane po 10 dniach).
    closedRentals.sort((a, b) => (b.closedTimestamp || 0) - (a.closedTimestamp || 0));
  } catch (e) {
    listEl.innerHTML = `<p class="error">Błąd wczytywania: ${escapeHtml(e.message)}</p>`;
    return;
  }

  function renderFiltered() {
    const filterValue = filterInput.value.trim().toLowerCase();
    const filtered = filterValue
      ? closedRentals.filter((r) => (r.vehiclePlate || "").toLowerCase().includes(filterValue))
      : closedRentals;

    if (filtered.length === 0) {
      listEl.innerHTML = '<p class="muted">Brak zakończonych wynajmów.</p>';
      return;
    }

    listEl.innerHTML = "";
    filtered.forEach((r) => {
      const card = document.createElement("div");
      card.className = "rental-card";
      const returnDate = r.closedTimestamp ? formatDate(r.closedTimestamp) : "—";
      const pdfLink = r.returnProtocolPdfUrl
        ? `<a class="btn-text" href="${r.returnProtocolPdfUrl}" target="_blank" rel="noopener">Protokół zwrotu (PDF)</a>`
        : '<div class="error">Brak wygenerowanego protokołu zwrotu (PDF)!</div><button class="btn-text" data-action="regen">Wygeneruj protokół awaryjnie</button>';
      card.innerHTML = `
        <div class="plate">${escapeHtml(r.vehicleModel)} • ${escapeHtml(r.vehiclePlate)}</div>
        <div class="tenant">Najemca: ${escapeHtml(r.tenantName)}</div>
        <div class="tenant">Data zakończenia: ${returnDate}</div>
        ${pdfLink}
      `;
      const regenBtn = card.querySelector('[data-action="regen"]');
      if (regenBtn) {
        regenBtn.addEventListener("click", () => navigate(`regenerate/zwrot__${r.id}`));
      }
      listEl.appendChild(card);
    });
  }

  filterInput.addEventListener("input", renderFiltered);
  renderFiltered();
}

function formatDate(timestampMs) {
  return new Date(timestampMs).toLocaleDateString("pl-PL");
}

function formatDateRRMMDD(timestampMs) {
  const d = new Date(timestampMs || Date.now());
  const rr = String(d.getFullYear() % 100).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${rr}${mm}${dd}`;
}

// Prefiks nazw plików w Storage — [nr_rejestracyjny][RRMMDD], żeby dało się
// odnaleźć pliki konkretnego protokołu wyszukiwarką w konsoli Firebase, bez
// przeklikiwania się przez foldery nazwane losowym ID wynajmu.
function storageFilePrefix(plate, timestampMs) {
  return `${normalizePlateId(plate)}-${formatDateRRMMDD(timestampMs)}`;
}

// ID wynajmu (= nazwa dokumentu w Firestore = nazwa folderu w Storage) w
// postaci [nr_rejestracyjny]-[RRMMDD]-[indeks] zamiast losowego ID — z tego
// samego powodu co nazwy plików wyżej: żeby folder w konsoli Firebase też
// dało się odnaleźć po numerze rejestracyjnym. Indeks odróżnia ewentualne
// kolejne wynajmy tego samego pojazdu tego samego dnia.
async function generateReadableRentalId(plate, timestampMs) {
  const prefix = storageFilePrefix(plate, timestampMs);
  for (let index = 1; ; index++) {
    const candidate = `${prefix}-${index}`;
    const snap = await getDoc(doc(db, "rentals", candidate));
    if (!snap.exists()) return candidate;
  }
}

// ---------- VEHICLES (baza pojazdów) ----------
function normalizePlateId(plate) {
  return (plate || "").trim().toUpperCase().replace(/\s+/g, "");
}

// Wyświetla datę czynności serwisowej razem z przebiegiem, przy którym
// została wykonana (oba pola opcjonalne, niezależne od siebie).
function formatServiceEntry(date, mileage) {
  if (!date && !mileage) return "—";
  const mileagePart = mileage ? `${mileage} km` : "brak przebiegu";
  return date ? `${date} (${mileagePart})` : mileagePart;
}

async function fetchVehicleDamageMarks(plate) {
  const snap = await getDoc(doc(db, "vehicles", normalizePlateId(plate)));
  return snap.exists() ? snap.data().lastDamageMapMarks || [] : [];
}

async function updateVehicleDamageMarks(plate, marks) {
  await setDoc(doc(db, "vehicles", normalizePlateId(plate)), { lastDamageMapMarks: marks }, { merge: true });
}

// Zwraca aktywny (jeszcze niezwrócony) wynajem dla danego pojazdu, jeśli
// istnieje — używane do zablokowania otwarcia drugiego wydania na ten sam
// pojazd, zanim poprzedni wynajem zostanie zamknięty zwrotem.
async function findActiveRentalForPlate(plate) {
  const targetId = normalizePlateId(plate);
  if (!targetId) return null;
  const q = query(collection(db, "rentals"), where("status", "==", "wydany"));
  const snap = await getDocs(q);
  const match = snap.docs.find((d) => normalizePlateId(d.data().vehiclePlate) === targetId);
  return match ? match.data() : null;
}

async function fetchVehicles() {
  const snap = await getDocs(collection(db, "vehicles"));
  return snap.docs.map((d) => d.data()).sort((a, b) => (a.plate || "").localeCompare(b.plate || ""));
}

async function renderVehicles() {
  const tpl = document.getElementById("tpl-vehicles");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  appEl.querySelector('[data-action="new-vehicle"]').addEventListener("click", () => navigate("vehicle"));

  const listEl = document.getElementById("vehicleList");
  try {
    const vehicles = await fetchVehicles();
    if (vehicles.length === 0) {
      listEl.innerHTML = '<p class="muted">Brak pojazdów w bazie.</p>';
      return;
    }
    listEl.innerHTML = "";
    vehicles.forEach((v) => {
      const card = document.createElement("div");
      card.className = "rental-card";
      card.innerHTML = `
        <div class="plate">${escapeHtml(v.make || "")} ${escapeHtml(v.model || "")} • ${escapeHtml(v.plate)}</div>
        <div class="tenant">VIN: ${escapeHtml(v.vin || "—")}</div>
        <div class="tenant">Ostatni przebieg: ${v.lastMileage ? v.lastMileage + " km" : "—"}</div>
        <div class="tenant">Serwis olejowy: ${formatServiceEntry(v.lastOilServiceDate, v.lastOilServiceMileage)} • Serwis chłodni: ${formatServiceEntry(v.lastCoolingServiceDate, v.lastCoolingServiceMileage)}</div>
        <div class="tenant">AdBlue: ${formatServiceEntry(v.lastAdBlueDate, v.lastAdBlueMileage)} • Zdjęcia uszkodzeń: ${(v.damagePhotoUrls || []).length}</div>
        <button class="btn btn-secondary" data-id="${v.plateId}">Edytuj</button>
      `;
      card.querySelector("button").addEventListener("click", () => navigate(`vehicle/${v.plateId}`));
      listEl.appendChild(card);
    });
  } catch (e) {
    listEl.innerHTML = `<p class="error">Błąd wczytywania: ${escapeHtml(e.message)}</p>`;
  }
}

// ---------- VEHICLE damage photos (dokumentacja stała, niezależna od
// protokołów — dołączana automatycznie do PDF-u każdego kolejnego
// wydania/zwrotu, patrz drawPhotoPages w pdf.js) ----------
function wireVehiclePhotos(plateId, initialPhotos) {
  let photos = Array.isArray(initialPhotos) ? [...initialPhotos] : []; // [{ url, path }]
  const strip = document.getElementById("vehiclePhotoStrip");
  const input = document.getElementById("vehiclePhotoInput");

  function renderStrip() {
    strip.innerHTML = "";
    photos.forEach((photo, index) => {
      const wrap = document.createElement("div");
      wrap.style.position = "relative";
      wrap.style.flexShrink = "0";
      wrap.innerHTML = `
        <img class="photo-thumb" src="${escapeHtml(photo.url)}" alt="Zdjęcie uszkodzenia ${index + 1}" />
        <button type="button" class="icon-btn" data-index="${index}"
          style="position:absolute;top:-6px;right:-6px;background:#C0392B;color:#fff;border-radius:50%;width:22px;height:22px;line-height:1;padding:0;font-size:14px;text-align:center;">×</button>
      `;
      wrap.querySelector("button").addEventListener("click", async () => {
        const [removed] = photos.splice(index, 1);
        renderStrip();
        try {
          await setDoc(doc(db, "vehicles", plateId), { damagePhotoUrls: photos }, { merge: true });
        } catch (e) {
          showToast("Błąd usuwania zdjęcia: " + e.message);
        }
        if (removed?.path) {
          deleteObject(ref(storage, removed.path)).catch(() => {
            // Osierocony plik w Storage nie jest krytyczny — dokument już
            // nie wskazuje na to zdjęcie.
          });
        }
      });
      strip.appendChild(wrap);
    });
  }
  renderStrip();

  input.addEventListener("change", async () => {
    const file = input.files[0];
    input.value = "";
    if (!file) return;
    const path = `vehicles/${plateId}/damage-photos/${Date.now()}.jpg`;
    try {
      const r = ref(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      photos.push({ url, path });
      await setDoc(doc(db, "vehicles", plateId), { damagePhotoUrls: photos }, { merge: true });
      renderStrip();
    } catch (e) {
      showToast("Błąd wgrywania zdjęcia: " + e.message);
    }
  });
}

async function renderVehicleForm(plateId) {
  const tpl = document.getElementById("tpl-vehicle-form");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  const form = document.getElementById("vehicleForm");
  const errorEl = document.getElementById("vehicleFormError");
  const submitBtn = document.getElementById("vehicleSubmitBtn");
  const extrasWrap = document.getElementById("vehicleExtrasWrap");

  let existingDamageMarks = [];
  let existingDamagePhotos = [];

  if (plateId) {
    try {
      const snap = await getDoc(doc(db, "vehicles", plateId));
      if (snap.exists()) {
        const v = snap.data();
        form.elements["plate"].value = v.plate || "";
        form.elements["make"].value = v.make || "";
        form.elements["model"].value = v.model || "";
        form.elements["vin"].value = v.vin || "";
        form.elements["lastOilServiceDate"].value = v.lastOilServiceDate || "";
        form.elements["lastOilServiceMileage"].value = v.lastOilServiceMileage || "";
        form.elements["lastCoolingServiceDate"].value = v.lastCoolingServiceDate || "";
        form.elements["lastCoolingServiceMileage"].value = v.lastCoolingServiceMileage || "";
        form.elements["lastAdBlueDate"].value = v.lastAdBlueDate || "";
        form.elements["lastAdBlueMileage"].value = v.lastAdBlueMileage || "";
        form.elements["lastMileage"].value = v.lastMileage || "";
        existingDamageMarks = v.lastDamageMapMarks || [];
        existingDamagePhotos = v.damagePhotoUrls || [];
      }
    } catch (e) {
      errorEl.textContent = "Błąd wczytywania: " + e.message;
      errorEl.hidden = false;
    }

    // Zdjęcia uszkodzeń i schemat mają sens tylko dla pojazdu, który już
    // istnieje w bazie (potrzebują plateId jako klucza dokumentu/ścieżki
    // w Storage) — dla nowego pojazdu ta sekcja jest ukryta do pierwszego
    // zapisu (patrz submit handler niżej).
    extrasWrap.hidden = false;
    wireVehiclePhotos(plateId, existingDamagePhotos);

    const vehicleDamageMap = initDamageMap({
      canvas: document.getElementById("vehicleDamageMap"),
      overlay: document.getElementById("vehicleDamageMapOverlay"),
      confirmBtn: document.getElementById("vehicleDamageMapConfirmBtn"),
      discardBtn: document.getElementById("vehicleDamageMapDiscardBtn"),
      pendingActions: document.getElementById("vehicleDamageMapPendingActions"),
      diagramUrl: DAMAGE_MAP_DIAGRAM_URL
    });
    vehicleDamageMap.setMarks(existingDamageMarks);
    document.getElementById("vehicleDamageMapClearBtn").addEventListener("click", () => vehicleDamageMap.clear());
    document.getElementById("vehicleDamageMapSaveBtn").addEventListener("click", async () => {
      try {
        await updateVehicleDamageMarks(plateId, vehicleDamageMap.getMarks());
        showToast("Zapisano schemat uszkodzeń.");
      } catch (e) {
        showToast("Błąd zapisu schematu: " + e.message);
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    const fd = new FormData(form);
    const plate = fd.get("plate").trim();
    const newPlateId = normalizePlateId(plate);
    const isNewVehicle = !plateId;

    const vehicle = {
      plateId: newPlateId,
      plate,
      make: fd.get("make") || "",
      model: fd.get("model") || "",
      vin: fd.get("vin") || "",
      lastOilServiceDate: fd.get("lastOilServiceDate") || "",
      lastOilServiceMileage: fd.get("lastOilServiceMileage") || "",
      lastCoolingServiceDate: fd.get("lastCoolingServiceDate") || "",
      lastCoolingServiceMileage: fd.get("lastCoolingServiceMileage") || "",
      lastAdBlueDate: fd.get("lastAdBlueDate") || "",
      lastAdBlueMileage: fd.get("lastAdBlueMileage") || "",
      lastMileage: fd.get("lastMileage") || ""
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      await setDoc(doc(db, "vehicles", newPlateId), vehicle, { merge: true });
      showToast("Zapisano pojazd.");
      // Nowo utworzony pojazd: wróć na ten sam formularz (teraz w trybie
      // edycji), żeby od razu można było dodać zdjęcia uszkodzeń/schemat —
      // bez tego trzeba by go odszukać ponownie na liście.
      navigate(isNewVehicle ? `vehicle/${newPlateId}` : "vehicles");
    } catch (err) {
      errorEl.textContent = "Błąd zapisu: " + err.message;
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Zapisz pojazd";
    }
  });
}

// ---------- TENANTS (baza najemców) ----------
function normalizeTenantId(value) {
  return (value || "").trim().toUpperCase().replace(/[\s-]/g, "");
}

async function fetchTenants() {
  const snap = await getDocs(collection(db, "tenants"));
  return snap.docs.map((d) => d.data()).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

async function renderTenants() {
  const tpl = document.getElementById("tpl-tenants");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  appEl.querySelector('[data-action="new-tenant"]').addEventListener("click", () => navigate("tenant"));

  const listEl = document.getElementById("tenantList");
  try {
    const tenants = await fetchTenants();
    if (tenants.length === 0) {
      listEl.innerHTML = '<p class="muted">Brak najemców w bazie.</p>';
      return;
    }
    listEl.innerHTML = "";
    tenants.forEach((t) => {
      const isCompany = t.tenantType === "firma";
      const card = document.createElement("div");
      card.className = "rental-card";
      card.innerHTML = `
        <div class="plate">${escapeHtml(t.name)}</div>
        <div class="tenant">${isCompany ? "NIP" : "PESEL"}: ${escapeHtml(isCompany ? t.nip : t.pesel)}</div>
        <div class="tenant">Telefon: ${escapeHtml(t.phone || "—")} • E-mail: ${escapeHtml(t.email || "—")}</div>
        <button class="btn btn-secondary" data-id="${t.tenantId}">Edytuj</button>
      `;
      card.querySelector("button").addEventListener("click", () => navigate(`tenant/${t.tenantId}`));
      listEl.appendChild(card);
    });
  } catch (e) {
    listEl.innerHTML = `<p class="error">Błąd wczytywania: ${escapeHtml(e.message)}</p>`;
  }
}

// Własna podpowiedź (zamiast natywnego <datalist>, które na sporej części
// przeglądarek mobilnych w ogóle nie pokazuje listy sugestii). getItems()
// jest wywoływane na bieżąco, więc może zwracać dane wczytane asynchronicznie
// już po podłączeniu pola. Wybór podpowiedzi ustawia wartość i wywołuje
// prawdziwe zdarzenie "change", więc reszta kodu (autouzupełnianie itd.)
// działa bez zmian.
function wireAutocomplete(input, getItems) {
  const list = document.createElement("div");
  list.className = "autocomplete-list";
  list.hidden = true;
  input.insertAdjacentElement("afterend", list);

  function renderItems(items) {
    list.innerHTML = "";
    if (!items.length) {
      list.hidden = true;
      return;
    }
    // Limit tylko techniczny (żeby nie renderować tysięcy wierszy) — lista
    // i tak przewija się (patrz .autocomplete-list w CSS), więc przy bazie
    // rzędu dziesiątek/setek klientów/pojazdów to nie obcina wyników w
    // praktyce, jak wcześniejszy sztywny limit 8 pozycji.
    items.slice(0, 50).forEach((item) => {
      const row = document.createElement("div");
      row.className = "autocomplete-item";
      row.innerHTML = item.sub
        ? `${escapeHtml(item.label)}<span class="ac-sub">${escapeHtml(item.sub)}</span>`
        : escapeHtml(item.label);
      // mousedown (nie click) + preventDefault, żeby "blur" pola nie schował
      // listy zanim zdąży się zarejestrować wybór.
      row.addEventListener("mousedown", (e) => e.preventDefault());
      row.addEventListener("click", () => {
        input.value = item.value;
        list.hidden = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      list.appendChild(row);
    });
    list.hidden = false;
  }

  function filterAndRender() {
    const q = input.value.trim().toLowerCase();
    const items = getItems();
    const filtered = q
      ? items.filter((it) => it.label.toLowerCase().includes(q) || it.value.toLowerCase().includes(q))
      : items;
    renderItems(filtered);
  }

  input.addEventListener("input", filterAndRender);
  input.addEventListener("focus", filterAndRender);
  input.addEventListener("blur", () => {
    setTimeout(() => {
      list.hidden = true;
    }, 150);
  });
}

function wireTenantTypeToggle(typeSelect, peselWrap, nipWrap, nameLabel, extraWraps) {
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

async function renderTenantForm(tenantId) {
  const tpl = document.getElementById("tpl-tenant-form");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  const form = document.getElementById("tenantForm");
  const errorEl = document.getElementById("tenantFormError");
  const submitBtn = document.getElementById("tenantSubmitBtn");

  wireTenantTypeToggle(
    document.getElementById("tenantFormTypeSelect"),
    document.getElementById("tenantFormPeselWrap"),
    document.getElementById("tenantFormNipWrap"),
    document.getElementById("tenantFormNameLabel"),
    {
      idNumberWrap: document.getElementById("tenantFormIdNumberWrap"),
      krsWrap: document.getElementById("tenantFormKrsWrap"),
      representativeWrap: document.getElementById("tenantFormRepresentativeWrap")
    }
  );

  if (tenantId) {
    try {
      const snap = await getDoc(doc(db, "tenants", tenantId));
      if (snap.exists()) {
        const t = snap.data();
        form.elements["tenantType"].value = t.tenantType || "osoba";
        form.elements["tenantType"].dispatchEvent(new Event("change"));
        form.elements["pesel"].value = t.pesel || "";
        form.elements["idNumber"].value = t.idNumber || "";
        form.elements["nip"].value = t.nip || "";
        form.elements["krs"].value = t.krs || "";
        form.elements["representative"].value = t.representative || "";
        form.elements["name"].value = t.name || "";
        form.elements["phone"].value = t.phone || "";
        form.elements["email"].value = t.email || "";
        form.elements["street"].value = t.street || "";
        form.elements["houseNumber"].value = t.houseNumber || "";
        form.elements["apartmentNumber"].value = t.apartmentNumber || "";
        form.elements["postalCode"].value = t.postalCode || "";
        form.elements["city"].value = t.city || "";
      }
    } catch (e) {
      errorEl.textContent = "Błąd wczytywania: " + e.message;
      errorEl.hidden = false;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    const fd = new FormData(form);
    const tenantType = fd.get("tenantType");
    const isCompany = tenantType === "firma";
    const identifier = isCompany ? fd.get("nip") : fd.get("pesel");
    const newTenantId = normalizeTenantId(identifier);

    if (!newTenantId) {
      errorEl.textContent = isCompany ? "Podaj NIP." : "Podaj PESEL.";
      errorEl.hidden = false;
      return;
    }

    const tenant = {
      tenantId: newTenantId,
      tenantType,
      pesel: isCompany ? "" : fd.get("pesel") || "",
      idNumber: isCompany ? "" : fd.get("idNumber") || "",
      nip: isCompany ? fd.get("nip") || "" : "",
      krs: isCompany ? fd.get("krs") || "" : "",
      representative: isCompany ? fd.get("representative") || "" : "",
      name: fd.get("name") || "",
      phone: fd.get("phone") || "",
      email: fd.get("email") || "",
      street: fd.get("street") || "",
      houseNumber: fd.get("houseNumber") || "",
      apartmentNumber: fd.get("apartmentNumber") || "",
      postalCode: fd.get("postalCode") || "",
      city: fd.get("city") || ""
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      await setDoc(doc(db, "tenants", newTenantId), tenant);
      showToast("Zapisano najemcę.");
      navigate("tenants");
    } catch (err) {
      errorEl.textContent = "Błąd zapisu: " + err.message;
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Zapisz najemcę";
    }
  });
}

// ---------- CONTRACT VIEW ----------
async function renderContractForm() {
  const tpl = document.getElementById("tpl-contract");
  appEl.replaceChildren(tpl.content.cloneNode(true));

  const form = document.getElementById("contractForm");
  const errorEl = document.getElementById("contractFormError");
  const submitBtn = document.getElementById("contractSubmitBtn");

  const tenantSearchInput = document.getElementById("contractTenantSearch");
  const tenantSummaryEl = document.getElementById("contractTenantSummary");
  const partyTypeSelect = document.getElementById("contractPartyType");

  const vehiclePlateInput = document.getElementById("contractVehiclePlateInput");
  const vehicleSummaryEl = document.getElementById("contractVehicleSummary");

  const contractTypeSelect = document.getElementById("contractTypeSelect");
  const jednostkowaFieldset = document.getElementById("contractJednostkowaFieldset");
  const signatureFormWrap = document.getElementById("contractSignatureFormWrap");

  let selectedTenant = null;
  let selectedVehicle = null;

  let knownTenants = [];
  try {
    knownTenants = await fetchTenants();
  } catch (e) {
    // Brak dostępu do bazy najemców nie powinien blokować reszty formularza.
  }
  let knownVehicles = [];
  try {
    knownVehicles = await fetchVehicles();
  } catch (e) {
    // Brak dostępu do bazy pojazdów nie powinien blokować reszty formularza.
  }

  wireAutocomplete(tenantSearchInput, () =>
    knownTenants.map((t) => ({
      value: t.tenantId,
      label: t.name,
      sub: t.tenantType === "firma" ? `NIP: ${t.nip}` : `PESEL: ${t.pesel}`
    }))
  );
  tenantSearchInput.addEventListener("change", () => {
    selectedTenant = knownTenants.find((t) => t.tenantId === tenantSearchInput.value) || null;
    if (!selectedTenant) {
      tenantSummaryEl.hidden = true;
      return;
    }
    const isCompany = selectedTenant.tenantType === "firma";
    partyTypeSelect.value = isCompany ? "firma" : "konsument";
    const addressParts = [selectedTenant.street, selectedTenant.houseNumber].filter(Boolean).join(" ");
    const address = [
      selectedTenant.apartmentNumber ? `${addressParts}/${selectedTenant.apartmentNumber}` : addressParts,
      [selectedTenant.postalCode, selectedTenant.city].filter(Boolean).join(" ")
    ].filter(Boolean).join(", ");
    tenantSummaryEl.textContent = isCompany
      ? `${selectedTenant.name} · NIP ${selectedTenant.nip || "-"} · KRS ${selectedTenant.krs || "-"} · ${address || "brak adresu"}`
      : `${selectedTenant.name} · PESEL ${selectedTenant.pesel || "-"} · dowód: ${selectedTenant.idNumber || "-"} · ${address || "brak adresu"}`;
    tenantSummaryEl.hidden = false;
  });

  wireAutocomplete(vehiclePlateInput, () =>
    knownVehicles.map((v) => ({
      value: v.plate,
      label: v.plate,
      sub: [v.make, v.model].filter(Boolean).join(" ")
    }))
  );
  vehiclePlateInput.addEventListener("change", () => {
    selectedVehicle = knownVehicles.find((v) => normalizePlateId(v.plate) === normalizePlateId(vehiclePlateInput.value)) || null;
    if (!selectedVehicle) {
      vehicleSummaryEl.hidden = true;
      return;
    }
    vehicleSummaryEl.textContent = `${[selectedVehicle.make, selectedVehicle.model].filter(Boolean).join(" ")} · VIN ${selectedVehicle.vin || "-"}`;
    vehicleSummaryEl.hidden = false;
  });

  function updateConditionalFieldsVisibility() {
    jednostkowaFieldset.hidden = !(partyTypeSelect.value === "konsument" && contractTypeSelect.value === "jednostkowa");
    // Dla Firmy zarówno "Umowa" jak i "Umowa najmu jednostkowego" korzystają
    // z tego samego dokumentu (osobna umowa ramowa ma własny szablon), więc
    // forma podpisu dotyczy obu tych wyborów, nie tylko "Umowa".
    signatureFormWrap.hidden = !(partyTypeSelect.value === "firma" && contractTypeSelect.value !== "ramowa");
  }
  partyTypeSelect.addEventListener("change", updateConditionalFieldsVisibility);
  contractTypeSelect.addEventListener("change", updateConditionalFieldsVisibility);
  updateConditionalFieldsVisibility();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    if (!selectedTenant) {
      errorEl.textContent = "Wybierz najemcę z bazy.";
      errorEl.hidden = false;
      return;
    }
    if (!selectedVehicle) {
      errorEl.textContent = "Wybierz pojazd z bazy.";
      errorEl.hidden = false;
      return;
    }

    const fd = new FormData(form);
    const partyType = fd.get("contractPartyType");
    const contractType = fd.get("contractType");
    const signatureForm = fd.get("contractSignatureForm");
    const templateKey = resolveTemplateKey(partyType, contractType, signatureForm);

    const formData = {
      contractDate: formatDatePl(fd.get("contractDate")),
      periodFrom: formatDatePl(fd.get("periodFrom")),
      periodTo: formatDatePl(fd.get("periodTo")),
      rentAmount: fd.get("rentAmount") || "",
      depositAmount: fd.get("depositAmount") || "",
      ramowaDate: formatDatePl(fd.get("ramowaDate")),
      applicationDate: formatDatePl(fd.get("applicationDate")),
      confirmationDate: formatDatePl(fd.get("confirmationDate")),
      handoverPlace: fd.get("handoverPlace") || "",
      returnPlace: fd.get("returnPlace") || "",
      vatAmount: fd.get("vatAmount") || "",
      grossRentAmount: fd.get("grossRentAmount") || ""
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Generowanie…";
    try {
      const blob = await generateContractDocx(templateKey, {
        tenant: selectedTenant,
        vehicle: selectedVehicle,
        form: formData
      });
      const fileName = `Umowa_${selectedVehicle.plate}_${fd.get("contractDate") || ""}.docx`;
      downloadBlob(blob, fileName);
      showToast("Wygenerowano umowę.");
    } catch (err) {
      errorEl.textContent = "Błąd generowania umowy: " + err.message;
      errorEl.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Generuj umowę (.docx)";
    }
  });
}

function formatDatePl(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- BLOG (posty na iglo-bus.rent/blog) ----------

// Rozbija wklejony/wczytany plik Markdown na tytuł (pierwszy nagłówek "# "),
// opis (blockquote "> " zaraz po tytule) i resztę treści — dokładnie w
// formacie, w jakim SORO generuje pliki z wpisami bloga. Jeśli nagłówka lub
// blockquote nie ma (np. treść już wcześniej oczyszczona), zwraca to, co się
// da rozpoznać, a resztę traktuje jako treść.
function parseMarkdownPost(raw) {
  const lines = (raw || "").replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  const skipBlank = () => { while (i < lines.length && lines[i].trim() === "") i++; };

  skipBlank();
  let title = "";
  if (i < lines.length && /^#\s+/.test(lines[i])) {
    title = lines[i].replace(/^#\s+/, "").trim();
    i++;
  }

  skipBlank();
  let description = "";
  if (i < lines.length && /^>\s?/.test(lines[i])) {
    const descLines = [];
    while (i < lines.length && /^>\s?/.test(lines[i])) {
      descLines.push(lines[i].replace(/^>\s?/, ""));
      i++;
    }
    description = descLines.join(" ").trim();
  }

  skipBlank();
  const body = lines.slice(i).join("\n").trim();
  return { title, description, body };
}

const SLUG_DIACRITICS = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z"
};
function slugify(text) {
  return (text || "")
    .trim()
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (ch) => SLUG_DIACRITICS[ch] || ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Konwersje na potrzeby <input type="datetime-local"> (reprezentuje "naiwną"
// datę/godzinę w lokalnej strefie czasowej przeglądarki, bez offsetu) —
// zapisujemy i tak wszystko jako epoch ms, więc trzeba świadomie użyć
// lokalnych gettery/konstruktora, a nie UTC.
function toDatetimeLocalValue(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromDatetimeLocalValue(value) {
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : null;
}

async function fetchAllPosts() {
  const snap = await getDocs(collection(db, "posts"));
  return snap.docs.map((d) => d.data());
}

async function renderPosts() {
  const tpl = document.getElementById("tpl-posts");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  appEl.querySelector('[data-action="new-post"]').addEventListener("click", () => navigate("post"));

  const listEl = document.getElementById("postList");
  try {
    const posts = await fetchAllPosts();
    posts.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    if (posts.length === 0) {
      listEl.innerHTML = '<p class="muted">Brak wpisów. Dodaj pierwszy wpis bloga.</p>';
      return;
    }
    listEl.innerHTML = "";
    posts.forEach((p) => {
      const isScheduled = p.status === "published" && p.publishedAt > Date.now();
      const isLive = p.status === "published" && !isScheduled;
      const statusLabel = isLive
        ? "🟢 Opublikowany"
        : isScheduled
        ? `🕒 Zaplanowany na ${formatDate(p.publishedAt)}`
        : "⚪ Szkic";
      const card = document.createElement("div");
      card.className = "rental-card";
      card.innerHTML = `
        <div class="plate">${escapeHtml(p.title)}</div>
        <div class="tenant">${statusLabel} • Aktualizacja: ${formatDate(p.updatedAt)}</div>
        <div class="tenant">/blog/${escapeHtml(p.slug)}</div>
        <button class="btn btn-secondary" data-id="${p.slug}">Edytuj</button>
      `;
      card.querySelector("button").addEventListener("click", () => navigate(`post/${p.slug}`));
      listEl.appendChild(card);
    });
  } catch (e) {
    listEl.innerHTML = `<p class="error">Błąd wczytywania: ${escapeHtml(e.message)}</p>`;
  }
}

async function uploadPostImage(slug, file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const r = ref(storage, `blog/${slug}/cover-${Date.now()}.${ext}`);
  await uploadBytes(r, file, { contentType: file.type || "image/jpeg" });
  return getDownloadURL(r);
}

async function renderPostForm(slug) {
  const tpl = document.getElementById("tpl-post-form");
  appEl.replaceChildren(tpl.content.cloneNode(true));

  const form = document.getElementById("postForm");
  const rawTextarea = document.getElementById("postRawTextarea");
  const fileInput = document.getElementById("postFileInput");
  const parseBtn = document.getElementById("postParseBtn");
  const titleInput = document.getElementById("postTitleInput");
  const slugInput = document.getElementById("postSlugInput");
  const descriptionInput = document.getElementById("postDescriptionInput");
  const statusSelect = document.getElementById("postStatusSelect");
  const publishAtWrap = document.getElementById("postPublishAtWrap");
  const publishAtInput = document.getElementById("postPublishAtInput");
  const publishAtHint = document.getElementById("postPublishAtHint");
  const imageInput = document.getElementById("postImageInput");
  const imagePreviewWrap = document.getElementById("postImagePreviewWrap");
  const imagePreview = document.getElementById("postImagePreview");
  const imageRemoveBtn = document.getElementById("postImageRemoveBtn");
  const errorEl = document.getElementById("postFormError");
  const submitBtn = document.getElementById("postSubmitBtn");
  const deleteBtn = document.getElementById("postDeleteBtn");

  let existing = null;
  // Dopóki operator nie zacznie ręcznie edytować pola "slug", podąża ono
  // za tytułem — jak w bazie najemców/pojazdów, gdzie ID też liczy się z
  // wpisanych danych.
  let slugAutoFilled = true;
  let existingImageUrl = "";  // obrazek już zapisany w Firestore (z poprzedniego zapisu)
  let selectedImageFile = null; // nowy plik wybrany w tej sesji, jeszcze nie wgrany
  let imageRemoved = false; // operator kliknął "Usuń obrazek"

  function updatePublishAtVisibility() {
    const isPublished = statusSelect.value === "published";
    publishAtWrap.hidden = !isPublished;
    publishAtHint.hidden = !isPublished;
    if (isPublished && !publishAtInput.value) {
      publishAtInput.value = toDatetimeLocalValue(Date.now());
    }
  }

  function showImagePreview(url) {
    imagePreview.src = url;
    imagePreviewWrap.hidden = false;
  }

  if (slug) {
    slugInput.value = slug;
    slugInput.disabled = true; // slug = adres URL opublikowanego wpisu — nie zmieniamy przy edycji
    slugAutoFilled = false;
    try {
      const snap = await getDoc(doc(db, "posts", slug));
      if (snap.exists()) {
        existing = snap.data();
        titleInput.value = existing.title || "";
        descriptionInput.value = existing.description || "";
        statusSelect.value = existing.status || "draft";
        rawTextarea.value = existing.contentMarkdown || "";
        if (existing.publishedAt) publishAtInput.value = toDatetimeLocalValue(existing.publishedAt);
        if (existing.imageUrl) {
          existingImageUrl = existing.imageUrl;
          showImagePreview(existingImageUrl);
        }
        deleteBtn.hidden = false;
      }
    } catch (e) {
      errorEl.textContent = "Błąd wczytywania: " + e.message;
      errorEl.hidden = false;
    }
  }
  updatePublishAtVisibility();

  titleInput.addEventListener("input", () => {
    if (slugAutoFilled) slugInput.value = slugify(titleInput.value);
  });
  slugInput.addEventListener("input", () => {
    slugAutoFilled = false;
  });
  statusSelect.addEventListener("change", updatePublishAtVisibility);

  // Wypełnia tytuł/opis/treść na podstawie tego, co aktualnie jest w polu
  // treści — wywoływane po wczytaniu pliku i pod przyciskiem "Wczytaj tytuł
  // i opis z treści" (na wypadek ręcznej wklejki bez wybierania pliku).
  function applyParsed() {
    const parsed = parseMarkdownPost(rawTextarea.value);
    if (parsed.title) {
      titleInput.value = parsed.title;
      if (slugAutoFilled) slugInput.value = slugify(parsed.title);
    }
    if (parsed.description) descriptionInput.value = parsed.description;
    if (parsed.body) rawTextarea.value = parsed.body;
  }
  parseBtn.addEventListener("click", applyParsed);

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      rawTextarea.value = String(reader.result || "");
      applyParsed();
    };
    reader.readAsText(file);
    fileInput.value = "";
  });

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    selectedImageFile = file;
    imageRemoved = false;
    showImagePreview(URL.createObjectURL(file));
    imageInput.value = "";
  });

  imageRemoveBtn.addEventListener("click", () => {
    selectedImageFile = null;
    imageRemoved = true;
    imagePreviewWrap.hidden = true;
    imagePreview.src = "";
  });

  deleteBtn.addEventListener("click", async () => {
    if (!slug) return;
    if (!confirm(`Usunąć wpis "${existing?.title || slug}"? Tej operacji nie można cofnąć.`)) return;
    deleteBtn.disabled = true;
    try {
      await deleteDoc(doc(db, "posts", slug));
      showToast("Usunięto wpis.");
      navigate("posts");
    } catch (e) {
      errorEl.textContent = "Błąd usuwania: " + e.message;
      errorEl.hidden = false;
      deleteBtn.disabled = false;
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    // Parsujemy treść jeszcze raz przy zapisie, żeby zapisany
    // contentMarkdown zawsze był "czystym" ciałem wpisu — bez nagłówka i
    // blockquote — nawet jeśli operator zapisuje bez klikania przycisku
    // parsowania (np. wkleił cały plik i od razu zapisał).
    const parsed = parseMarkdownPost(rawTextarea.value);
    const title = titleInput.value.trim() || parsed.title;
    const description = descriptionInput.value.trim() || parsed.description;
    const contentMarkdown = parsed.body || rawTextarea.value.trim();
    const newSlug = slugInput.value.trim() || slugify(title);
    const status = statusSelect.value;

    if (!title) {
      errorEl.textContent = "Podaj tytuł wpisu.";
      errorEl.hidden = false;
      return;
    }
    if (!newSlug) {
      errorEl.textContent = "Podaj adres URL (slug) wpisu.";
      errorEl.hidden = false;
      return;
    }
    if (!description) {
      errorEl.textContent = "Podaj opis (meta description).";
      errorEl.hidden = false;
      return;
    }
    if (!contentMarkdown) {
      errorEl.textContent = "Treść wpisu jest pusta.";
      errorEl.hidden = false;
      return;
    }

    // Data publikacji: dla "Opublikowany" bierzemy to, co operator ustawił w
    // polu daty (może być w przyszłości — to jest właśnie zaplanowanie
    // publikacji: wpis stanie się publicznie widoczny automatycznie o tej
    // porze, patrz reguły Firestore i client/src/lib/blog.ts). Dla szkicu
    // czyścimy datę, żeby przy ponownej zmianie na "Opublikowany" nie
    // został przypadkiem stary termin.
    let publishedAt = null;
    if (status === "published") {
      publishedAt = fromDatetimeLocalValue(publishAtInput.value) || existing?.publishedAt || Date.now();
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      let imageUrl = imageRemoved ? "" : existingImageUrl;
      if (selectedImageFile) {
        submitBtn.textContent = "Wysyłanie obrazka…";
        imageUrl = await uploadPostImage(newSlug, selectedImageFile);
      }

      const now = Date.now();
      const record = {
        slug: newSlug,
        title,
        description,
        contentMarkdown,
        imageUrl,
        status,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        publishedAt
      };

      submitBtn.textContent = "Zapisywanie…";
      await setDoc(doc(db, "posts", newSlug), record);
      const isScheduled = status === "published" && publishedAt > now;
      showToast(
        status !== "published" ? "Zapisano szkic." : isScheduled ? "Zaplanowano publikację." : "Opublikowano wpis."
      );
      navigate("posts");
    } catch (err) {
      errorEl.textContent = "Błąd zapisu: " + err.message;
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Zapisz wpis";
    }
  });
}

// ---------- HANDOVER VIEW ----------
// draftRentalId: jeśli podane, edytujemy/dokańczamy istniejący protokół w
// statusie "szkic" (założony przez "+ Nowy protokół" albo wciąż niedokończony
// przez najemcę pod linkiem) zamiast zakładać zupełnie nowy wynajem — patrz
// renderDrafts().
async function renderHandover(draftRentalId) {
  // Czcionki i logo PDF-a i tak są potrzebne dopiero przy zapisie — pobierz
  // je już teraz, w tle, na czas wypełniania formularza (patrz komentarz
  // przy preloadPdfAssets w pdf.js).
  preloadPdfAssets();

  let draftRecord = null;
  if (draftRentalId) {
    try {
      const snap = await getDoc(doc(db, "rentals", draftRentalId));
      if (snap.exists()) draftRecord = snap.data();
    } catch (e) {
      showToast("Błąd wczytywania szkicu: " + e.message);
    }
  }

  const tpl = document.getElementById("tpl-handover");
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

  const plateInput = document.getElementById("vehiclePlateInput");
  const modelInput = document.getElementById("handoverForm").elements["vehicleModel"];
  const vinInput = document.getElementById("handoverForm").elements["vehicleVin"];
  // Zdjęcia uszkodzeń zapisane na stałe przy pojeździe (baza pojazdów) —
  // dołączane automatycznie do protokołu, patrz submit handler niżej.
  let selectedVehicleDamagePhotos = [];
  let knownVehicles = [];
  try {
    knownVehicles = await fetchVehicles();
  } catch (e) {
    // Brak dostępu do bazy pojazdów nie powinien blokować wydania — po
    // prostu nie będzie podpowiedzi/autouzupełniania modelu.
  }
  wireAutocomplete(plateInput, () =>
    knownVehicles.map((v) => ({
      value: v.plate,
      label: v.plate,
      sub: [v.make, v.model].filter(Boolean).join(" ")
    }))
  );
  plateInput.addEventListener("change", async () => {
    const match = knownVehicles.find((v) => normalizePlateId(v.plate) === normalizePlateId(plateInput.value));
    selectedVehicleDamagePhotos = match?.damagePhotoUrls || [];
    if (match) {
      modelInput.value = `${match.make || ""} ${match.model || ""}`.trim();
      vinInput.value = match.vin || "";
    }
    try {
      damageMap.setMarks(await fetchVehicleDamageMarks(plateInput.value));
    } catch (e) {
      // Brak dostępu do zapisanego schematu nie powinien blokować wydania.
    }
    try {
      const activeRental = await findActiveRentalForPlate(plateInput.value);
      if (activeRental) {
        showToast(`Uwaga: ten pojazd jest już wynajęty (najemca: ${activeRental.tenantName || "?"}).`);
      }
    } catch (e) {
      // Brak możliwości sprawdzenia nie powinien blokować wydania.
    }
  });

  const handoverForm = document.getElementById("handoverForm");
  wireTenantTypeToggle(
    document.getElementById("tenantTypeSelect"),
    document.getElementById("tenantPeselWrap"),
    document.getElementById("tenantNipWrap"),
    document.getElementById("tenantNameLabel")
  );

  let knownTenants = [];
  try {
    knownTenants = await fetchTenants();
  } catch (e) {
    // Brak dostępu do bazy najemców nie powinien blokować wydania — po
    // prostu nie będzie podpowiedzi/autouzupełniania danych najemcy.
  }
  wireAutocomplete(document.getElementById("tenantPeselInput"), () =>
    knownTenants
      .filter((t) => t.tenantType !== "firma")
      .map((t) => ({ value: t.pesel, label: t.name, sub: t.pesel }))
  );
  wireAutocomplete(document.getElementById("tenantNipInput"), () =>
    knownTenants
      .filter((t) => t.tenantType === "firma")
      .map((t) => ({ value: t.nip, label: t.name, sub: t.nip }))
  );

  function autofillTenant(inputEl) {
    const match = knownTenants.find((t) => normalizeTenantId(t.tenantType === "firma" ? t.nip : t.pesel) === normalizeTenantId(inputEl.value));
    if (!match) return;
    handoverForm.elements["tenantName"].value = match.name || "";
    handoverForm.elements["tenantPhone"].value = match.phone || "";
    handoverForm.elements["tenantEmail"].value = match.email || "";
    handoverForm.elements["tenantStreet"].value = match.street || "";
    handoverForm.elements["tenantHouseNumber"].value = match.houseNumber || "";
    handoverForm.elements["tenantApartmentNumber"].value = match.apartmentNumber || "";
    handoverForm.elements["tenantPostalCode"].value = match.postalCode || "";
    handoverForm.elements["tenantCity"].value = match.city || "";
  }
  handoverForm.elements["tenantPesel"].addEventListener("change", (e) => autofillTenant(e.target));
  handoverForm.elements["tenantNip"].addEventListener("change", (e) => autofillTenant(e.target));

  // Podpowiedz dane, które pracownik (albo najemca pod linkiem) zdążył już
  // wpisać wcześniej — dopasowanie po `name` pola, wartości puste pomijane.
  if (draftRecord) {
    for (const el of handoverForm.elements) {
      if (!el.name || !(el.name in draftRecord)) continue;
      const value = draftRecord[el.name];
      if (value === undefined || value === null || value === "") continue;
      if (el.type === "checkbox") el.checked = Boolean(value);
      else el.value = value;
    }
    // Odśwież widoczność pól PESEL/NIP zgodnie z wczytanym typem najemcy
    // (ustawienie .value nie wywołuje samo z siebie listenera "change").
    handoverForm.elements["tenantType"].dispatchEvent(new Event("change"));
  }

  document.getElementById("handoverForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const errorEl = document.getElementById("formError");
    const submitBtn = document.getElementById("submitBtn");
    errorEl.hidden = true;

    if (sigPad.isEmpty()) {
      errorEl.textContent = "Najemca musi się podpisać przed zapisaniem protokołu.";
      errorEl.hidden = false;
      return;
    }

    const fd = new FormData(form);

    const activeRental = await findActiveRentalForPlate(fd.get("vehiclePlate")).catch(() => null);
    if (activeRental) {
      errorEl.textContent = `Ten pojazd jest już wynajęty (najemca: ${activeRental.tenantName || "?"}) — najpierw zarejestruj zwrot.`;
      errorEl.hidden = false;
      return;
    }

    const record = {
      vehiclePlate: fd.get("vehiclePlate"),
      vehicleModel: fd.get("vehicleModel"),
      vehicleVin: fd.get("vehicleVin") || "",
      vehicleMileageAtHandover: fd.get("mileage"),
      vehicleFuelAtHandover: fd.get("fuel"),
      vehicleMileageAtReturn: "",
      vehicleFuelAtReturn: "",
      distanceTraveled: "",
      tenantType: fd.get("tenantType"),
      tenantName: fd.get("tenantName"),
      tenantNip: fd.get("tenantNip") || "",
      tenantPesel: fd.get("tenantPesel") || "",
      tenantPhone: fd.get("tenantPhone"),
      tenantEmail: fd.get("tenantEmail"),
      tenantStreet: fd.get("tenantStreet") || "",
      tenantHouseNumber: fd.get("tenantHouseNumber") || "",
      tenantApartmentNumber: fd.get("tenantApartmentNumber") || "",
      tenantPostalCode: fd.get("tenantPostalCode") || "",
      tenantCity: fd.get("tenantCity") || "",
      driverName: fd.get("driverName"),
      driverLicenseNumber: fd.get("driverLicense"),
      lessorEmail: LESSOR_EMAIL,
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
      equipmentShelf: form.elements["equipmentShelf"].checked,
      equipmentCargoBar: form.elements["equipmentCargoBar"].checked,
      equipmentStraps: form.elements["equipmentStraps"].checked,
      equipmentPowerCable: form.elements["equipmentPowerCable"].checked,
      handoverPhotoUrls: [],
      returnPhotoUrls: [],
      handoverSignatureUrl: "",
      returnSignatureUrl: "",
      handoverDamageMapUrl: "",
      returnDamageMapUrl: "",
      handoverProtocolPdfUrl: "",
      returnProtocolPdfUrl: "",
      status: "wydany"
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      const rentalId = draftRentalId || await generateReadableRentalId(record.vehiclePlate, record.handoverTimestamp);
      const docRef = doc(db, "rentals", rentalId);
      record.id = docRef.id;

      const sigDataUrl = sigPad.toDataUrl();
      const damageMapDataUrl = damageMap.toDataUrl();

      // Dwie niezależne grupy operacji równolegle: zapis dokumentu +
      // wgrywanie zdjęć/podpisu/mapy do Storage z jednej strony, a z
      // drugiej przygotowanie i wygenerowanie PDF-u. PDF nie potrzebuje
      // adresów URL ze Storage (używa lokalnych danych — zdjęć z aparatu i
      // zdjęć uszkodzeń pojazdu pobranych z bazy) — wcześniej czekał na
      // zakończenie wgrywania, mimo że wcale tego nie wymagał, co sumowało
      // czasy zamiast liczyć je równolegle.
      const [[, photoUrls, sigUrl, damageMapUrl], pdfBlob] = await Promise.all([
        Promise.all([
          setDoc(docRef, record),
          uploadPhotos(docRef.id, "wydanie", record.vehiclePlate, record.handoverTimestamp),
          uploadSignature(docRef.id, "wydanie", record.vehiclePlate, record.handoverTimestamp),
          uploadDamageMap(docRef.id, "wydanie", record.vehiclePlate, record.handoverTimestamp)
        ]),
        (async () => {
          const [photoDataUrls, vehicleDamagePhotoDataUrls] = await Promise.all([
            Promise.all(currentPhotos.map(fileToDataUrl)),
            vehicleDamagePhotosToDataUrls(selectedVehicleDamagePhotos)
          ]);
          return generateProtocolPdf(record, "wydanie", sigDataUrl, damageMapDataUrl, photoDataUrls, vehicleDamagePhotoDataUrls);
        })()
      ]);
      const pdfUrl = await uploadPdf(docRef.id, "wydanie", pdfBlob, record.vehiclePlate, record.handoverTimestamp);

      await setDoc(docRef, {
        ...record,
        handoverPhotoUrls: photoUrls,
        handoverSignatureUrl: sigUrl,
        handoverDamageMapUrl: damageMapUrl,
        handoverProtocolPdfUrl: pdfUrl
      });

      showToast("Zapisano protokół wydania — wysyłam e-mail…");
      navigate("list");

      // Mail i aktualizacja schematu w bazie pojazdu nie decydują o tym,
      // czy zapis się udał — dane są już bezpiecznie w Firestore/Storage —
      // więc nie blokują nimi przejścia do listy. Uruchamiane w tle, z
      // osobną obsługą błędu, żeby awaria maila nie wyglądała jak
      // niepowodzenie całego zapisu protokołu.
      sendProtocolEmail(docRef.id, "wydanie", pdfUrl, record.tenantEmail, LESSOR_EMAIL, record.vehiclePlate, record.handoverTimestamp)
        .catch((e) => showToast("Protokół zapisany, ale mail się nie wysłał: " + e.message));
      updateVehicleDamageMarks(record.vehiclePlate, damageMap.getMarks()).catch(() => {
        // Brak wpisu pojazdu w bazie nie powinien niepokoić operatora.
      });
    } catch (err) {
      errorEl.textContent = "Błąd zapisu: " + err.message;
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Zapisz protokół wydania i wyślij e-mail";
    }
  });
}

// ---------- RETURN VIEW ----------
async function renderReturn(rentalId) {
  preloadPdfAssets();

  const tpl = document.getElementById("tpl-return");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  const headerEl = document.getElementById("returnHeader");
  const formEl = document.getElementById("returnForm");

  let record;
  try {
    const snap = await getDoc(doc(db, "rentals", rentalId));
    if (!snap.exists()) {
      headerEl.textContent = "Nie znaleziono wynajmu.";
      return;
    }
    record = snap.data();
  } catch (e) {
    headerEl.textContent = "Błąd wczytywania: " + e.message;
    return;
  }

  headerEl.innerHTML = `<strong>${escapeHtml(record.vehicleModel)} • ${escapeHtml(record.vehiclePlate)}</strong><br>Najemca: ${escapeHtml(record.tenantName)}`;
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

  // Zdjęcia uszkodzeń zapisane na stałe przy pojeździe (baza pojazdów) —
  // dołączane automatycznie do protokołu zwrotu, tak jak przy wydaniu.
  let selectedVehicleDamagePhotos = [];
  try {
    const vehicleSnap = await getDoc(doc(db, "vehicles", normalizePlateId(record.vehiclePlate)));
    if (vehicleSnap.exists()) selectedVehicleDamagePhotos = vehicleSnap.data().damagePhotoUrls || [];
  } catch (e) {
    // Brak wpisu pojazdu w bazie nie powinien blokować zwrotu.
  }

  try {
    damageMap.setMarks(await fetchVehicleDamageMarks(record.vehiclePlate));
  } catch (e) {
    // Brak zapisanego schematu nie powinien blokować zwrotu.
  }

  // Pokaż do potwierdzenia tylko to wyposażenie, które faktycznie zostało
  // przekazane przy wydaniu — domyślnie zaznaczone (zakładamy, że wraca),
  // operator odznacza to, czego brakuje.
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
      errorEl.textContent = "Najemca musi się podpisać przed zapisaniem protokołu.";
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
      closedTimestamp: now, // uruchamia 10-dniowy zegar czyszczenia
      status: "zwrocony"
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      const sigDataUrl = sigPad.toDataUrl();
      const damageMapDataUrl = damageMap.toDataUrl();

      // Równolegle zamiast po kolei (patrz też komentarz przy wydaniu
      // pojazdu): wgrywanie do Storage z jednej strony, przygotowanie i
      // wygenerowanie PDF-u (dane wyłącznie lokalne) z drugiej — zamiast
      // czekać z generowaniem PDF-u, aż wgrywanie się skończy.
      const [[photoUrls, sigUrl, damageMapUrl], pdfBlob] = await Promise.all([
        Promise.all([
          uploadPhotos(rentalId, "zwrot", updated.vehiclePlate, updated.returnTimestamp),
          uploadSignature(rentalId, "zwrot", updated.vehiclePlate, updated.returnTimestamp),
          uploadDamageMap(rentalId, "zwrot", updated.vehiclePlate, updated.returnTimestamp)
        ]),
        (async () => {
          const [photoDataUrls, vehicleDamagePhotoDataUrls] = await Promise.all([
            Promise.all(currentPhotos.map(fileToDataUrl)),
            vehicleDamagePhotosToDataUrls(selectedVehicleDamagePhotos)
          ]);
          return generateProtocolPdf(updated, "zwrot", sigDataUrl, damageMapDataUrl, photoDataUrls, vehicleDamagePhotoDataUrls);
        })()
      ]);
      const pdfUrl = await uploadPdf(rentalId, "zwrot", pdfBlob, updated.vehiclePlate, updated.returnTimestamp);

      updated.returnPhotoUrls = photoUrls;
      updated.returnSignatureUrl = sigUrl;
      updated.returnDamageMapUrl = damageMapUrl;
      updated.returnProtocolPdfUrl = pdfUrl;

      await setDoc(doc(db, "rentals", rentalId), updated);

      const distanceMsg = Number.isFinite(distanceTraveled) ? ` (przejechano ${distanceTraveled} km)` : "";
      showToast(`Zapisano protokół zwrotu${distanceMsg} — wysyłam e-mail…`);
      navigate("list");

      // Mail i aktualizacja bazy pojazdów nie decydują o powodzeniu zapisu
      // (dane wynajmu są już bezpiecznie zapisane) — w tle, bez blokowania
      // przejścia do listy, patrz komentarz przy wydaniu pojazdu.
      sendProtocolEmail(rentalId, "zwrot", pdfUrl, updated.tenantEmail, updated.lessorEmail, updated.vehiclePlate, updated.returnTimestamp)
        .catch((e) => showToast("Protokół zapisany, ale mail się nie wysłał: " + e.message));
      setDoc(
        doc(db, "vehicles", normalizePlateId(updated.vehiclePlate)),
        { lastMileage: mileageAtReturn, lastDamageMapMarks: damageMap.getMarks() },
        { merge: true }
      ).catch(() => {
        // Brak wpisu pojazdu w bazie nie powinien niepokoić operatora.
      });
    } catch (err) {
      errorEl.textContent = "Błąd zapisu: " + err.message;
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Zapisz protokół zwrotu i wyślij e-mail";
    }
  });
}

// ---------- Shared helpers ----------
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


// Aparaty zapisują zdjęcie zrobione w poziomie w oryginalnej orientacji
// czujnika (często pionowej) plus znacznik EXIF "obróć przy wyświetlaniu".
// Zwykłe <img> ten znacznik respektuje, ale PDF go ignoruje — dlatego
// dekodujemy zdjęcie z uwzględnieniem EXIF i zapisujemy piksele już
// poprawnie obrócone, zanim trafią do protokołu.
//
// Zdjęcie w protokole jest wyświetlane co najwyżej na ~500pt szerokości, a
// telefony robią zdjęcia w rozdzielczości rzędu 12 Mpx (4000+ px) — bez
// przeskalowania każde zdjęcie w PDF-ie waży kilka MB, mimo że na stronie
// zajmuje ułamek tej rozdzielczości. 1600px na dłuższym boku to wielokrotność
// tego, co faktycznie widać w protokole. Oryginał (pełna rozdzielczość) i tak
// trafia bez zmian do Firebase Storage przez uploadPhotos — ta funkcja
// dotyczy wyłącznie kopii osadzanej w PDF-ie.
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

async function fileToDataUrl(file) {
  return blobToResizedDataUrl(file);
}

// Odpowiednik fileToDataUrl, ale dla zdjęć już leżących w Storage (stała
// dokumentacja uszkodzeń pojazdu) — pobiera obraz spod adresu URL i skaluje
// go tak samo, jak świeżo zrobione zdjęcie protokołu. Błąd pojedynczego
// zdjęcia (np. brak sieci, CORS) nie ma zatrzymywać generowania PDF-u — ta
// funkcja celowo zwraca null zamiast rzucać, a wywołujący filtruje null-e.
async function urlToDataUrl(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await blobToResizedDataUrl(await res.blob());
  } catch (e) {
    return null;
  }
}

async function vehicleDamagePhotosToDataUrls(photos) {
  if (!photos || !photos.length) return [];
  const results = await Promise.all(photos.map((p) => urlToDataUrl(p.url)));
  return results.filter(Boolean);
}

async function uploadPhotos(rentalId, phase, plate, timestampMs) {
  const prefix = storageFilePrefix(plate, timestampMs);
  return Promise.all(
    currentPhotos.map(async (file, index) => {
      const path = `rentals/${rentalId}/${phase}/${prefix}-${index + 1}.jpg`;
      const r = ref(storage, path);
      await uploadBytes(r, file);
      return getDownloadURL(r);
    })
  );
}

async function uploadSignature(rentalId, phase, plate, timestampMs) {
  const blob = await sigPad.toBlob();
  const prefix = storageFilePrefix(plate, timestampMs);
  const r = ref(storage, `rentals/${rentalId}/${phase}/${prefix}-podpis.jpg`);
  await uploadBytes(r, blob);
  return getDownloadURL(r);
}

async function uploadDamageMap(rentalId, phase, plate, timestampMs) {
  const blob = await damageMap.toBlob();
  const prefix = storageFilePrefix(plate, timestampMs);
  const r = ref(storage, `rentals/${rentalId}/${phase}/${prefix}-uszkodzenia.jpg`);
  await uploadBytes(r, blob);
  return getDownloadURL(r);
}

async function uploadPdf(rentalId, phase, blob, plate, timestampMs) {
  const prefix = storageFilePrefix(plate, timestampMs);
  const r = ref(storage, `rentals/${rentalId}/${phase}/${prefix}-protokol.pdf`);
  await uploadBytes(r, blob, { contentType: "application/pdf" });
  return getDownloadURL(r);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ---------- AWARYJNE ODTWARZANIE PROTOKOŁU ----------
// Zapis wydania/zwrotu generuje PDF z lokalnych danych równolegle z
// wgrywaniem zdjęć/podpisu/mapy do Storage (patrz Promise.all wyżej) —
// jeśli ta druga grupa operacji zawiedzie (np. urwane połączenie w
// trakcie wgrywania dużego zdjęcia), cały zapis odrzuca, mimo że PDF już
// się poprawnie wygenerował — po prostu nigdy nie trafia do Storage, bo
// kod nigdy nie dochodzi do uploadPdf. Część plików (te, które zdążyły
// się wgrać przed zerwaniem) zostaje jednak bezpiecznie w Storage. Ta
// funkcja tylko odzyskuje to, co już tam leży dla danego wynajmu/fazy —
// złożenie protokołu (renderRegenerate) daje operatorowi szansę poprawić
// dane przed wygenerowaniem, bo zapisany rekord bywa niekompletny (np.
// brak numeru prawa jazdy wpisanego w pośpiechu).
async function fetchRecoveredAssets(rentalId, phase) {
  const listing = await listAll(ref(storage, `rentals/${rentalId}/${phase}`));
  let signatureItem = null;
  let damageMapItem = null;
  const photoItems = [];
  for (const item of listing.items) {
    if (/-podpis\.jpg$/.test(item.name)) signatureItem = item;
    else if (/-uszkodzenia\.jpg$/.test(item.name)) damageMapItem = item;
    else if (/-\d+\.jpg$/.test(item.name)) photoItems.push(item);
  }

  // Zdjęcia w kolejności, w jakiej zostały zrobione (numer w nazwie pliku).
  photoItems.sort((a, b) => {
    const numA = Number((/-(\d+)\.jpg$/.exec(a.name) || [])[1] || 0);
    const numB = Number((/-(\d+)\.jpg$/.exec(b.name) || [])[1] || 0);
    return numA - numB;
  });

  const [sigDataUrl, damageMapDataUrl, photoDataUrls] = await Promise.all([
    signatureItem ? getBlob(signatureItem).then(blobToDataUrl) : Promise.resolve(null),
    damageMapItem ? getBlob(damageMapItem).then(blobToDataUrl) : Promise.resolve(null),
    Promise.all(photoItems.map((item) => getBlob(item).then(fileToDataUrl)))
  ]);

  return { signatureItem, damageMapItem, photoItems, sigDataUrl, damageMapDataUrl, photoDataUrls };
}

// Widok przeglądu/poprawy danych przed złożeniem protokołu awaryjnie —
// wywoływany z listy aktywnych wynajmów (wydanie) i z historii (zwrot),
// gdy brakuje wygenerowanego PDF-a.
async function renderRegenerate(phase, rentalId) {
  const tpl = document.getElementById("tpl-regenerate");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  const headerEl = document.getElementById("regenerateHeader");
  const form = document.getElementById("regenerateForm");
  const errorEl = document.getElementById("regenerateFormError");
  const submitBtn = document.getElementById("regenerateSubmitBtn");
  const isHandover = phase === "wydanie";
  // Zadeklarowane tu (nie wewnątrz try/catch niżej), bo są potrzebne też w
  // handlerze submit, który wieszamy po zakończeniu tego try/catch.
  let recovered;
  let vehicleDamagePhotoDataUrls;

  let record;
  try {
    const snap = await getDoc(doc(db, "rentals", rentalId));
    if (!snap.exists()) {
      headerEl.textContent = "Nie znaleziono wynajmu.";
      return;
    }
    record = snap.data();
  } catch (e) {
    headerEl.textContent = "Błąd wczytywania: " + e.message;
    return;
  }

  headerEl.innerHTML = `<strong>${escapeHtml(record.vehicleModel)} • ${escapeHtml(record.vehiclePlate)}</strong><br>Najemca: ${escapeHtml(record.tenantName)}`;

  // Całość przygotowania formularza (poniżej) w jednym try/catch — inaczej
  // nieoczekiwany wyjątek w dowolnym miejscu (np. brakujący element w DOM,
  // błąd odczytu ze Storage) po prostu zawiesza widok na samym nagłówku,
  // bez żadnego komunikatu dla operatora.
  try {

  // Pojazd/najemca/kierowca/adres ma sens do poprawiania tylko przy wydaniu
  // — przy zwrocie te dane są już ustalone i nie są ponownie zbierane.
  document.getElementById("regenerateVehicleFieldset").hidden = !isHandover;
  document.getElementById("regenerateTenantFieldset").hidden = !isHandover;
  document.getElementById("regenerateDriverFieldset").hidden = !isHandover;
  document.getElementById("regenerateAddressFieldset").hidden = !isHandover;

  const equipmentContainer = document.getElementById("regenerateEquipmentContainer");
  const equipmentLabels = {
    equipmentShelf: "Półka double-deck",
    equipmentCargoBar: "Poprzeczka do blokowania ładunku",
    equipmentStraps: "Zapinki (6 szt.)",
    equipmentPowerCable: "Kabel do zasilania chłodni na postoju"
  };

  if (isHandover) {
    form.elements["vehiclePlate"].value = record.vehiclePlate || "";
    form.elements["vehicleModel"].value = record.vehicleModel || "";
    form.elements["vehicleVin"].value = record.vehicleVin || "";
    form.elements["mileage"].value = record.vehicleMileageAtHandover || "";
    form.elements["fuel"].value = record.vehicleFuelAtHandover || "";
    form.elements["tenantType"].value = record.tenantType || "osoba";
    form.elements["tenantPesel"].value = record.tenantPesel || "";
    form.elements["tenantNip"].value = record.tenantNip || "";
    form.elements["tenantName"].value = record.tenantName || "";
    form.elements["tenantPhone"].value = record.tenantPhone || "";
    form.elements["tenantEmail"].value = record.tenantEmail || "";
    form.elements["driverName"].value = record.driverName || "";
    form.elements["driverLicense"].value = record.driverLicenseNumber || "";
    form.elements["tenantStreet"].value = record.tenantStreet || "";
    form.elements["tenantHouseNumber"].value = record.tenantHouseNumber || "";
    form.elements["tenantApartmentNumber"].value = record.tenantApartmentNumber || "";
    form.elements["tenantPostalCode"].value = record.tenantPostalCode || "";
    form.elements["tenantCity"].value = record.tenantCity || "";
    form.elements["bodyCondition"].value = record.handoverBodyCondition || "czysta";
    form.elements["passengerAreaCondition"].value = record.handoverPassengerAreaCondition || "czysta";
    form.elements["cargoAreaCondition"].value = record.handoverCargoAreaCondition || "czysta";
    form.elements["notes"].value = record.handoverNotes || "";

    const peselWrap = document.getElementById("regenerateTenantPeselWrap");
    const nipWrap = document.getElementById("regenerateTenantNipWrap");
    const syncTenantType = () => {
      const isCompany = form.elements["tenantType"].value === "firma";
      peselWrap.hidden = isCompany;
      nipWrap.hidden = !isCompany;
    };
    form.elements["tenantType"].addEventListener("change", syncTenantType);
    syncTenantType();

    Object.entries(equipmentLabels).forEach(([field, label]) => {
      const wrap = document.createElement("label");
      wrap.className = "checkbox-label";
      wrap.innerHTML = `<input type="checkbox" name="${field}" ${record[field] ? "checked" : ""} /> ${escapeHtml(label)}`;
      equipmentContainer.appendChild(wrap);
    });
  } else {
    form.elements["mileage"].value = record.vehicleMileageAtReturn || "";
    form.elements["fuel"].value = record.vehicleFuelAtReturn || "";
    form.elements["bodyCondition"].value = record.returnBodyCondition || "czysta";
    form.elements["passengerAreaCondition"].value = record.returnPassengerAreaCondition || "czysta";
    form.elements["cargoAreaCondition"].value = record.returnCargoAreaCondition || "czysta";
    form.elements["notes"].value = record.returnNotes || "";

    // Tylko wyposażenie faktycznie przekazane przy wydaniu — analogicznie
    // do zwykłego formularza zwrotu.
    Object.keys(equipmentLabels).filter((field) => record[field]).forEach((field) => {
      const returned = record.returnedEquipment ? record.returnedEquipment[field] : true;
      const wrap = document.createElement("label");
      wrap.className = "checkbox-label";
      wrap.innerHTML = `<input type="checkbox" name="return_${field}" ${returned !== false ? "checked" : ""} /> ${escapeHtml(equipmentLabels[field])}`;
      equipmentContainer.appendChild(wrap);
    });
  }

  // ---- Odzyskiwanie zdjęć/podpisu/mapy uszkodzeń z Storage ----
  recovered = await fetchRecoveredAssets(rentalId, phase);

  if (!recovered.signatureItem) {
    errorEl.textContent = "Brak zapisanego podpisu w Firebase Storage — nie da się złożyć protokołu awaryjnie. Trzeba powtórzyć podpis w normalnym trybie.";
    errorEl.hidden = false;
    return;
  }

  document.getElementById("regenerateSigPreview").src = recovered.sigDataUrl;

  const damagePreview = document.getElementById("regenerateDamageMapPreview");
  if (recovered.damageMapDataUrl) {
    damagePreview.src = recovered.damageMapDataUrl;
  } else {
    damagePreview.hidden = true;
    document.getElementById("regenerateDamageMapEmpty").hidden = false;
  }

  const photoStrip = document.getElementById("regeneratePhotoStrip");
  if (recovered.photoDataUrls.length) {
    recovered.photoDataUrls.forEach((src) => {
      const img = document.createElement("img");
      img.className = "photo-thumb";
      img.src = src;
      photoStrip.appendChild(img);
    });
  } else {
    document.getElementById("regeneratePhotoEmpty").hidden = false;
  }

  // Zdjęcia uszkodzeń zapisane na stałe przy pojeździe (baza pojazdów) —
  // tak jak przy zwykłym wydaniu/zwrocie, dołączane automatycznie do PDF-u.
  // To stan AKTUALNY bazy pojazdu, nie migawka z chwili tego wynajmu —
  // dokładnie tak samo, jak działa to w normalnym trybie (dokumentacja
  // uszkodzeń pojazdu nie jest wersjonowana per-wynajem).
  let vehicleDamagePhotos = [];
  try {
    const vehicleSnap = await getDoc(doc(db, "vehicles", normalizePlateId(record.vehiclePlate)));
    vehicleDamagePhotos = vehicleSnap.exists() ? vehicleSnap.data().damagePhotoUrls || [] : [];
  } catch (e) {
    // Brak dostępu do bazy pojazdów nie powinien blokować protokołu awaryjnego.
  }
  vehicleDamagePhotoDataUrls = await vehicleDamagePhotosToDataUrls(vehicleDamagePhotos);
  const vehicleDamageStrip = document.getElementById("regenerateVehicleDamagePhotoStrip");
  if (vehicleDamageStrip) {
    if (vehicleDamagePhotoDataUrls.length) {
      vehicleDamagePhotoDataUrls.forEach((src) => {
        const img = document.createElement("img");
        img.className = "photo-thumb";
        img.src = src;
        vehicleDamageStrip.appendChild(img);
      });
    } else {
      document.getElementById("regenerateVehicleDamagePhotoEmpty").hidden = false;
    }
  }

  form.hidden = false;
  } catch (e) {
    errorEl.textContent = "Błąd przygotowania protokołu awaryjnego: " + e.message;
    errorEl.hidden = false;
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    const fd = new FormData(form);

    const update = isHandover
      ? {
          vehiclePlate: fd.get("vehiclePlate"),
          vehicleModel: fd.get("vehicleModel"),
          vehicleVin: fd.get("vehicleVin") || "",
          vehicleMileageAtHandover: fd.get("mileage"),
          vehicleFuelAtHandover: fd.get("fuel"),
          tenantType: fd.get("tenantType"),
          tenantNip: fd.get("tenantNip") || "",
          tenantPesel: fd.get("tenantPesel") || "",
          tenantName: fd.get("tenantName"),
          tenantPhone: fd.get("tenantPhone"),
          tenantEmail: fd.get("tenantEmail"),
          tenantStreet: fd.get("tenantStreet") || "",
          tenantHouseNumber: fd.get("tenantHouseNumber") || "",
          tenantApartmentNumber: fd.get("tenantApartmentNumber") || "",
          tenantPostalCode: fd.get("tenantPostalCode") || "",
          tenantCity: fd.get("tenantCity") || "",
          driverName: fd.get("driverName"),
          driverLicenseNumber: fd.get("driverLicense"),
          handoverNotes: fd.get("notes") || "",
          handoverBodyCondition: fd.get("bodyCondition"),
          handoverPassengerAreaCondition: fd.get("passengerAreaCondition"),
          handoverCargoAreaCondition: fd.get("cargoAreaCondition"),
          equipmentShelf: form.elements["equipmentShelf"].checked,
          equipmentCargoBar: form.elements["equipmentCargoBar"].checked,
          equipmentStraps: form.elements["equipmentStraps"].checked,
          equipmentPowerCable: form.elements["equipmentPowerCable"].checked
        }
      : {
          vehicleMileageAtReturn: fd.get("mileage"),
          vehicleFuelAtReturn: fd.get("fuel"),
          returnNotes: fd.get("notes") || "",
          returnBodyCondition: fd.get("bodyCondition"),
          returnPassengerAreaCondition: fd.get("passengerAreaCondition"),
          returnCargoAreaCondition: fd.get("cargoAreaCondition")
        };

    if (!isHandover) {
      const returnedEquipment = { ...(record.returnedEquipment || {}) };
      form.querySelectorAll('input[type="checkbox"][name^="return_"]').forEach((cb) => {
        returnedEquipment[cb.name.replace("return_", "")] = cb.checked;
      });
      update.returnedEquipment = returnedEquipment;
    }

    const mergedRecord = { ...record, ...update };

    submitBtn.disabled = true;
    submitBtn.textContent = "Generowanie…";
    try {
      const pdfBlob = await generateProtocolPdf(
        mergedRecord, phase, recovered.sigDataUrl, recovered.damageMapDataUrl, recovered.photoDataUrls, vehicleDamagePhotoDataUrls
      );
      const timestamp = isHandover ? record.handoverTimestamp : record.returnTimestamp;
      const pdfUrl = await uploadPdf(rentalId, phase, pdfBlob, mergedRecord.vehiclePlate, timestamp);

      const urlField = isHandover ? "handoverProtocolPdfUrl" : "returnProtocolPdfUrl";
      const sigField = isHandover ? "handoverSignatureUrl" : "returnSignatureUrl";
      const damageField = isHandover ? "handoverDamageMapUrl" : "returnDamageMapUrl";
      const photoField = isHandover ? "handoverPhotoUrls" : "returnPhotoUrls";

      const finalUpdate = { ...update, [urlField]: pdfUrl };
      // Dogrywamy też adresy podpisu/mapy uszkodzeń/zdjęć w Firestore, jeśli
      // ten sam przerwany zapis, który ubił upload PDF-a, ubił i te pola.
      if (!record[sigField]) finalUpdate[sigField] = await getDownloadURL(recovered.signatureItem);
      if (recovered.damageMapItem && !record[damageField]) finalUpdate[damageField] = await getDownloadURL(recovered.damageMapItem);
      if ((!record[photoField] || !record[photoField].length) && recovered.photoItems.length) {
        finalUpdate[photoField] = await Promise.all(recovered.photoItems.map((item) => getDownloadURL(item)));
      }

      await setDoc(doc(db, "rentals", rentalId), finalUpdate, { merge: true });

      const successEl = document.getElementById("regenerateSuccess");
      successEl.innerHTML = `Protokół wygenerowany. <a class="btn-text" href="${pdfUrl}" target="_blank" rel="noopener">Otwórz PDF</a> — wyślij go do klienta ręcznie.`;
      successEl.hidden = false;
      submitBtn.hidden = true;
      showToast("Wygenerowano protokół z odzyskanych danych.");
    } catch (err) {
      errorEl.textContent = "Błąd generowania: " + err.message;
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Zatwierdź dane i wygeneruj protokół";
    }
  });
}

async function sendProtocolEmail(rentalId, phase, pdfUrl, tenantEmail, lessorEmail, vehiclePlate, timestamp) {
  const callable = httpsCallable(functions, "sendProtocolEmail");
  await callable({ rentalId, phase, pdfUrl, tenantEmail, lessorEmail, vehiclePlate, timestamp });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// ---------- PWA service worker ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/panel-najmu/service-worker.js").catch(() => {});
  });
}

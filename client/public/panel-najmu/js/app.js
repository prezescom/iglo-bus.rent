import { firebaseConfig, LESSOR_EMAIL, FUNCTIONS_REGION } from "./firebase-config.js";
import { initSignatureField } from "./signature.js";
import { initDamageMap } from "./damage-map.js";
import { generateProtocolPdf } from "./pdf.js";
import { generateContractDocx, resolveTemplateKey } from "./contracts.js";

const DAMAGE_MAP_DIAGRAM_URL = "/panel-najmu/img/van-diagram.png";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
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
let authReadyPromise;
function waitForAuthReady() {
  if (!authReadyPromise) {
    authReadyPromise = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        }
      });
    });
  }
  return authReadyPromise;
}

onAuthStateChanged(auth, (user) => {
  if (!user) signInAnonymously(auth).catch((e) => showToast("Błąd logowania: " + e.message));
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
    pageTitle.textContent = "Wydanie pojazdu";
    renderHandover();
  } else if (view === "return") {
    pageTitle.textContent = "Zwrot pojazdu";
    renderReturn(param);
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
  appEl.querySelector('[data-action="view-history"]').addEventListener("click", () => navigate("history"));
  appEl.querySelector('[data-action="view-vehicles"]').addEventListener("click", () => navigate("vehicles"));
  appEl.querySelector('[data-action="view-tenants"]').addEventListener("click", () => navigate("tenants"));
  appEl.querySelector('[data-action="new-contract"]').addEventListener("click", () => navigate("contract"));

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
      const card = document.createElement("div");
      card.className = "rental-card";
      card.innerHTML = `
        <div class="plate">${escapeHtml(r.vehicleModel)} • ${escapeHtml(r.vehiclePlate)}</div>
        <div class="tenant">Najemca: ${escapeHtml(r.tenantName)}</div>
        <button class="btn btn-secondary" data-id="${d.id}">Zarejestruj zwrot</button>
      `;
      card.querySelector("button").addEventListener("click", () => navigate(`return/${d.id}`));
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
        : "";
      card.innerHTML = `
        <div class="plate">${escapeHtml(r.vehicleModel)} • ${escapeHtml(r.vehiclePlate)}</div>
        <div class="tenant">Najemca: ${escapeHtml(r.tenantName)}</div>
        <div class="tenant">Data zakończenia: ${returnDate}</div>
        ${pdfLink}
      `;
      listEl.appendChild(card);
    });
  }

  filterInput.addEventListener("input", renderFiltered);
  renderFiltered();
}

function formatDate(timestampMs) {
  return new Date(timestampMs).toLocaleDateString("pl-PL");
}

// ---------- VEHICLES (baza pojazdów) ----------
function normalizePlateId(plate) {
  return (plate || "").trim().toUpperCase().replace(/\s+/g, "");
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
        <div class="tenant">Serwis olejowy: ${v.lastOilServiceDate || "—"} • Serwis chłodni: ${v.lastCoolingServiceDate || "—"}</div>
        <button class="btn btn-secondary" data-id="${v.plateId}">Edytuj</button>
      `;
      card.querySelector("button").addEventListener("click", () => navigate(`vehicle/${v.plateId}`));
      listEl.appendChild(card);
    });
  } catch (e) {
    listEl.innerHTML = `<p class="error">Błąd wczytywania: ${escapeHtml(e.message)}</p>`;
  }
}

async function renderVehicleForm(plateId) {
  const tpl = document.getElementById("tpl-vehicle-form");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  const form = document.getElementById("vehicleForm");
  const errorEl = document.getElementById("vehicleFormError");
  const submitBtn = document.getElementById("vehicleSubmitBtn");

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
        form.elements["lastCoolingServiceDate"].value = v.lastCoolingServiceDate || "";
        form.elements["lastMileage"].value = v.lastMileage || "";
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
    const plate = fd.get("plate").trim();
    const newPlateId = normalizePlateId(plate);

    const vehicle = {
      plateId: newPlateId,
      plate,
      make: fd.get("make") || "",
      model: fd.get("model") || "",
      vin: fd.get("vin") || "",
      lastOilServiceDate: fd.get("lastOilServiceDate") || "",
      lastCoolingServiceDate: fd.get("lastCoolingServiceDate") || "",
      lastMileage: fd.get("lastMileage") || ""
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      await setDoc(doc(db, "vehicles", newPlateId), vehicle);
      showToast("Zapisano pojazd.");
      navigate("vehicles");
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
    items.slice(0, 8).forEach((item) => {
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

// ---------- HANDOVER VIEW ----------
async function renderHandover() {
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
      const docRef = doc(collection(db, "rentals"));
      record.id = docRef.id;

      // Wszystkie te operacje są od siebie niezależne — równolegle zamiast
      // po kolei, żeby zapis i wysyłka protokołu nie trwały niepotrzebnie
      // długo (suma czasów zamiast najdłuższego z nich).
      const [, photoUrls, sigUrl, damageMapUrl, photoDataUrls] = await Promise.all([
        setDoc(docRef, record),
        uploadPhotos(docRef.id, "wydanie"),
        uploadSignature(docRef.id, "wydanie"),
        uploadDamageMap(docRef.id, "wydanie"),
        Promise.all(currentPhotos.map(fileToDataUrl))
      ]);
      const sigDataUrl = sigPad.toDataUrl();
      const damageMapDataUrl = damageMap.toDataUrl();
      const pdfBlob = await generateProtocolPdf(record, "wydanie", sigDataUrl, damageMapDataUrl, photoDataUrls);
      const pdfUrl = await uploadPdf(docRef.id, "wydanie", pdfBlob);

      await setDoc(docRef, {
        ...record,
        handoverPhotoUrls: photoUrls,
        handoverSignatureUrl: sigUrl,
        handoverDamageMapUrl: damageMapUrl,
        handoverProtocolPdfUrl: pdfUrl
      });

      await sendProtocolEmail(docRef.id, "wydanie", pdfUrl, record.tenantEmail, LESSOR_EMAIL, record.vehiclePlate, record.handoverTimestamp);

      // Zapisz aktualny schemat uszkodzeń w bazie pojazdu, żeby podpowiadał
      // się przy zwrocie tego wynajmu i przy kolejnym wydaniu tego pojazdu.
      try {
        await updateVehicleDamageMarks(record.vehiclePlate, damageMap.getMarks());
      } catch (e) {
        // Brak wpisu pojazdu w bazie nie powinien blokować zapisu wydania.
      }

      showToast("Zapisano i wysłano protokół wydania.");
      navigate("list");
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
      // Równolegle zamiast po kolei — patrz komentarz przy wydaniu pojazdu.
      const [photoUrls, sigUrl, damageMapUrl, photoDataUrls] = await Promise.all([
        uploadPhotos(rentalId, "zwrot"),
        uploadSignature(rentalId, "zwrot"),
        uploadDamageMap(rentalId, "zwrot"),
        Promise.all(currentPhotos.map(fileToDataUrl))
      ]);
      const sigDataUrl = sigPad.toDataUrl();
      const damageMapDataUrl = damageMap.toDataUrl();
      const pdfBlob = await generateProtocolPdf(updated, "zwrot", sigDataUrl, damageMapDataUrl, photoDataUrls);
      const pdfUrl = await uploadPdf(rentalId, "zwrot", pdfBlob);

      updated.returnPhotoUrls = photoUrls;
      updated.returnSignatureUrl = sigUrl;
      updated.returnDamageMapUrl = damageMapUrl;
      updated.returnProtocolPdfUrl = pdfUrl;

      await setDoc(doc(db, "rentals", rentalId), updated);
      await sendProtocolEmail(rentalId, "zwrot", pdfUrl, updated.tenantEmail, updated.lessorEmail, updated.vehiclePlate, updated.returnTimestamp);

      // Zaktualizuj ostatni przebieg i schemat uszkodzeń w bazie pojazdów,
      // żeby przy kolejnym wydaniu tego pojazdu podpowiedziały się aktualne
      // dane, jeśli pojazd tam jest.
      try {
        await setDoc(
          doc(db, "vehicles", normalizePlateId(updated.vehiclePlate)),
          { lastMileage: mileageAtReturn, lastDamageMapMarks: damageMap.getMarks() },
          { merge: true }
        );
      } catch (e) {
        // Brak wpisu pojazdu w bazie nie powinien blokować zapisu zwrotu.
      }

      const distanceMsg = Number.isFinite(distanceTraveled) ? ` (przejechano ${distanceTraveled} km)` : "";
      showToast(`Zapisano i wysłano protokół zwrotu${distanceMsg}.`);
      navigate("list");
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
async function fileToDataUrl(file) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext("2d").drawImage(bitmap, 0, 0);
      bitmap.close();
      return canvas.toDataURL("image/jpeg", 0.9);
    } catch (e) {
      // Spadamy do zwykłego odczytu pliku, jeśli dekodowanie się nie uda.
    }
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadPhotos(rentalId, phase) {
  return Promise.all(
    currentPhotos.map(async (file) => {
      const path = `rentals/${rentalId}/${phase}/${crypto.randomUUID()}.jpg`;
      const r = ref(storage, path);
      await uploadBytes(r, file);
      return getDownloadURL(r);
    })
  );
}

async function uploadSignature(rentalId, phase) {
  const blob = await sigPad.toBlob();
  const r = ref(storage, `rentals/${rentalId}/${phase}/signature.png`);
  await uploadBytes(r, blob);
  return getDownloadURL(r);
}

async function uploadDamageMap(rentalId, phase) {
  const blob = await damageMap.toBlob();
  const r = ref(storage, `rentals/${rentalId}/${phase}/uszkodzenia.png`);
  await uploadBytes(r, blob);
  return getDownloadURL(r);
}

async function uploadPdf(rentalId, phase, blob) {
  const r = ref(storage, `rentals/${rentalId}/${phase}/protokol.pdf`);
  await uploadBytes(r, blob, { contentType: "application/pdf" });
  return getDownloadURL(r);
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

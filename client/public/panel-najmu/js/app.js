import { firebaseConfig, LESSOR_EMAIL, FUNCTIONS_REGION } from "./firebase-config.js";
import { initSignaturePad } from "./signature.js";
import { generateProtocolPdf } from "./pdf.js";

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

// ---------- Auth (anonymous — single operator, no login screen needed) ----------
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

function render() {
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

// ---------- HANDOVER VIEW ----------
function renderHandover() {
  const tpl = document.getElementById("tpl-handover");
  appEl.replaceChildren(tpl.content.cloneNode(true));
  wirePhotoStrip();
  sigPad = initSignaturePad(document.getElementById("sigPad"));
  appEl.querySelector('[data-action="clear-sig"]').addEventListener("click", () => sigPad.clear());

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
    const record = {
      vehiclePlate: fd.get("vehiclePlate"),
      vehicleModel: fd.get("vehicleModel"),
      vehicleMileageAtHandover: fd.get("mileage"),
      vehicleFuelAtHandover: fd.get("fuel"),
      vehicleMileageAtReturn: "",
      vehicleFuelAtReturn: "",
      tenantName: fd.get("tenantName"),
      tenantIdNumber: fd.get("tenantId"),
      tenantPhone: fd.get("tenantPhone"),
      tenantEmail: fd.get("tenantEmail"),
      lessorEmail: LESSOR_EMAIL,
      handoverTimestamp: Date.now(),
      returnTimestamp: 0,
      closedTimestamp: 0,
      handoverNotes: fd.get("notes") || "",
      returnNotes: "",
      handoverPhotoUrls: [],
      returnPhotoUrls: [],
      handoverSignatureUrl: "",
      returnSignatureUrl: "",
      handoverProtocolPdfUrl: "",
      returnProtocolPdfUrl: "",
      status: "wydany"
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      const docRef = doc(collection(db, "rentals"));
      record.id = docRef.id;
      await setDoc(docRef, record);

      const photoUrls = await uploadPhotos(docRef.id, "wydanie");
      const sigUrl = await uploadSignature(docRef.id, "wydanie");
      const sigDataUrl = sigPad.toDataUrl();
      const pdfBlob = await generateProtocolPdf(record, "wydanie", sigDataUrl);
      const pdfUrl = await uploadPdf(docRef.id, "wydanie", pdfBlob);

      await setDoc(docRef, {
        ...record,
        handoverPhotoUrls: photoUrls,
        handoverSignatureUrl: sigUrl,
        handoverProtocolPdfUrl: pdfUrl
      });

      await sendProtocolEmail(docRef.id, "wydanie", pdfUrl, record.tenantEmail, LESSOR_EMAIL);

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
  sigPad = initSignaturePad(document.getElementById("sigPad"));
  appEl.querySelector('[data-action="clear-sig"]').addEventListener("click", () => sigPad.clear());

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
    const updated = {
      ...record,
      vehicleMileageAtReturn: fd.get("mileage"),
      vehicleFuelAtReturn: fd.get("fuel"),
      returnNotes: fd.get("notes") || "",
      returnTimestamp: now,
      closedTimestamp: now, // uruchamia 10-dniowy zegar czyszczenia
      status: "zwrocony"
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Zapisywanie…";
    try {
      const photoUrls = await uploadPhotos(rentalId, "zwrot");
      const sigUrl = await uploadSignature(rentalId, "zwrot");
      const sigDataUrl = sigPad.toDataUrl();
      const pdfBlob = await generateProtocolPdf(updated, "zwrot", sigDataUrl);
      const pdfUrl = await uploadPdf(rentalId, "zwrot", pdfBlob);

      updated.returnPhotoUrls = photoUrls;
      updated.returnSignatureUrl = sigUrl;
      updated.returnProtocolPdfUrl = pdfUrl;

      await setDoc(doc(db, "rentals", rentalId), updated);
      await sendProtocolEmail(rentalId, "zwrot", pdfUrl, updated.tenantEmail, updated.lessorEmail);

      showToast("Zapisano i wysłano protokół zwrotu.");
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

async function uploadPhotos(rentalId, phase) {
  const urls = [];
  for (const file of currentPhotos) {
    const path = `rentals/${rentalId}/${phase}/${crypto.randomUUID()}.jpg`;
    const r = ref(storage, path);
    await uploadBytes(r, file);
    urls.push(await getDownloadURL(r));
  }
  return urls;
}

async function uploadSignature(rentalId, phase) {
  const blob = await sigPad.toBlob();
  const r = ref(storage, `rentals/${rentalId}/${phase}/signature.png`);
  await uploadBytes(r, blob);
  return getDownloadURL(r);
}

async function uploadPdf(rentalId, phase, blob) {
  const r = ref(storage, `rentals/${rentalId}/${phase}/protokol.pdf`);
  await uploadBytes(r, blob, { contentType: "application/pdf" });
  return getDownloadURL(r);
}

async function sendProtocolEmail(rentalId, phase, pdfUrl, tenantEmail, lessorEmail) {
  const callable = httpsCallable(functions, "sendProtocolEmail");
  await callable({ rentalId, phase, pdfUrl, tenantEmail, lessorEmail });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// ---------- PWA service worker ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

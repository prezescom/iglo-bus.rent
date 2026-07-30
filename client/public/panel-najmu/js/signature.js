// Pole podpisu: w formularzu pokazuje tylko placeholder do dotknięcia
// (żeby przypadkowe przewijanie formularza nigdy nie narysowało podpisu).
// Dopiero dotknięcie otwiera pełnoekranowy panel; jeśli telefon jest w
// pionie, prosimy o fizyczny obrót zamiast symulować to przez CSS —
// próba obracania panelu programowo gryzła się z naturalnym obrotem
// strony przez przeglądarkę i dawała podwójny/odwrócony obrót.

let modalEl, modalCanvas, modalCtx;
let hasStroke = false;
let drawing = false;
let onConfirm = null;
let shownLandscapeOnce = false;

function ensureModal() {
  if (modalEl) return;
  modalEl = document.getElementById("signatureModal");
  modalCanvas = document.getElementById("modalSigCanvas");
  modalCtx = modalCanvas.getContext("2d");
  const rotateHint = document.getElementById("modalSigRotateHint");
  const canvasWrap = document.getElementById("modalSigCanvasWrap");

  function clearCanvas() {
    modalCtx.fillStyle = "#FFFFFF";
    modalCtx.fillRect(0, 0, modalCanvas.width, modalCanvas.height);
    modalCtx.strokeStyle = "#16202A";
    modalCtx.lineWidth = 3;
    modalCtx.lineCap = "round";
    modalCtx.lineJoin = "round";
    hasStroke = false;
  }

  function posFromEvent(e) {
    const rect = modalCanvas.getBoundingClientRect();
    const scaleX = modalCanvas.width / rect.width;
    const scaleY = modalCanvas.height / rect.height;
    const point = e.touches ? e.touches[0] : e;
    return {
      x: (point.clientX - rect.left) * scaleX,
      y: (point.clientY - rect.top) * scaleY
    };
  }

  function start(e) {
    e.preventDefault();
    drawing = true;
    const { x, y } = posFromEvent(e);
    modalCtx.beginPath();
    modalCtx.moveTo(x, y);
  }

  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = posFromEvent(e);
    modalCtx.lineTo(x, y);
    modalCtx.stroke();
    hasStroke = true;
  }

  function end() {
    drawing = false;
  }

  modalCanvas.addEventListener("mousedown", start);
  modalCanvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  modalCanvas.addEventListener("touchstart", start, { passive: false });
  modalCanvas.addEventListener("touchmove", move, { passive: false });
  modalCanvas.addEventListener("touchend", end);

  document.getElementById("modalSigClear").addEventListener("click", clearCanvas);
  document.getElementById("modalSigCancel").addEventListener("click", closeModal);
  document.getElementById("modalSigConfirm").addEventListener("click", () => {
    if (!hasStroke) return;
    const dataUrl = modalCanvas.toDataURL("image/png");
    const callback = onConfirm;
    closeModal();
    if (callback) callback(dataUrl);
  });

  modalEl._updateOrientation = () => {
    const landscape = window.innerWidth > window.innerHeight;
    if (!landscape) {
      rotateHint.hidden = false;
      canvasWrap.hidden = true;
      return;
    }
    rotateHint.hidden = true;
    canvasWrap.hidden = false;
    // Dopasuj bufor canvasu tylko przy pierwszym wejściu w poziom w tej
    // sesji podpisu — kolejne drobne zmiany rozmiaru (np. pasek adresu)
    // nie powinny czyścić już narysowanego podpisu.
    if (!shownLandscapeOnce) {
      shownLandscapeOnce = true;
      // Liczymy dostępne miejsce z rozmiaru panelu i przycisków, a NIE z
      // aktualnego rozmiaru samego canvasu — jego dotychczasowe atrybuty
      // width/height wpływają na to, jak flexbox go mierzy, więc odczyt
      // "z samego siebie" potrafi dawać błędną, rosnącą w pętli wartość.
      const wrapRect = canvasWrap.getBoundingClientRect();
      const actionsHeight = document.querySelector(".signature-modal-actions").getBoundingClientRect().height;
      modalCanvas.width = Math.round(wrapRect.width);
      modalCanvas.height = Math.round(wrapRect.height - actionsHeight);
      clearCanvas();
    }
  };

  window.addEventListener("resize", () => {
    if (!modalEl.hidden) modalEl._updateOrientation();
  });
  window.addEventListener("orientationchange", () => {
    if (!modalEl.hidden) setTimeout(() => modalEl._updateOrientation(), 50);
  });
  // Na iOS Safari zwijanie/rozwijanie klawiatury ekranowej nie zawsze
  // wywołuje window "resize" — visualViewport jest w tym bardziej niezawodny.
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      if (!modalEl.hidden) modalEl._updateOrientation();
    });
  }
}

function openModal(onConfirmCallback) {
  ensureModal();
  // Jeśli jakieś pole tekstowe miało otwartą klawiaturę ekranową, zamknij ją
  // najpierw — inaczej jej zwijanie w trakcie otwierania panelu przesuwa
  // pomiary rozmiaru.
  if (document.activeElement && document.activeElement.blur) {
    document.activeElement.blur();
  }
  onConfirm = onConfirmCallback;
  shownLandscapeOnce = false;
  modalEl.hidden = false;
  requestAnimationFrame(() => modalEl._updateOrientation());
  setTimeout(() => {
    if (!modalEl.hidden) modalEl._updateOrientation();
  }, 350);
}

function closeModal() {
  if (modalEl) modalEl.hidden = true;
  onConfirm = null;
}

export function initSignatureField({ placeholder, preview, editBtn }) {
  let signatureDataUrl = null;

  function showSigned(dataUrl) {
    signatureDataUrl = dataUrl;
    preview.src = dataUrl;
    preview.hidden = false;
    placeholder.hidden = true;
    editBtn.hidden = false;
  }

  function open() {
    openModal(showSigned);
  }

  placeholder.addEventListener("click", open);
  editBtn.addEventListener("click", open);

  return {
    isEmpty: () => !signatureDataUrl,
    clear: () => {
      signatureDataUrl = null;
      preview.hidden = true;
      editBtn.hidden = true;
      placeholder.hidden = false;
    },
    toDataUrl: () => signatureDataUrl,
    toBlob: () => fetch(signatureDataUrl).then((r) => r.blob())
  };
}

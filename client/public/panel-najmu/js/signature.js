// Pole podpisu: w formularzu pokazuje tylko placeholder do dotknięcia
// (żeby przypadkowe przewijanie formularza nigdy nie narysowało podpisu).
// Dopiero dotknięcie otwiera pełnoekranowy panel w poziomie do złożenia
// podpisu palcem/myszą; po zatwierdzeniu w formularzu widać podgląd.

let modalEl, modalCanvas, modalCtx;
let hasStroke = false;
let drawing = false;
let onConfirm = null;

function ensureModal() {
  if (modalEl) return;
  modalEl = document.getElementById("signatureModal");
  modalCanvas = document.getElementById("modalSigCanvas");
  modalCtx = modalCanvas.getContext("2d");

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

  const inner = modalEl.querySelector(".signature-modal-inner");
  modalEl._resizeAndClear = () => {
    // Obracamy panel tylko wtedy, gdy ekran faktycznie jest w pionie —
    // jeśli urządzenie już jest trzymane poziomo, obrót tylko by przeszkadzał.
    const portrait = window.innerHeight >= window.innerWidth;
    inner.classList.toggle("is-rotated", portrait);
    inner.classList.toggle("is-flat", !portrait);
    // Wymiary bufora ustawiane po realnym wyrenderowaniu panelu, żeby
    // podpis był ostry i zgodny 1:1 z dotykiem/myszą.
    const rect = modalCanvas.getBoundingClientRect();
    modalCanvas.width = Math.round(rect.width);
    modalCanvas.height = Math.round(rect.height);
    clearCanvas();
  };

  window.addEventListener("resize", () => {
    if (!modalEl.hidden) modalEl._resizeAndClear();
  });
  window.addEventListener("orientationchange", () => {
    if (!modalEl.hidden) setTimeout(() => modalEl._resizeAndClear(), 50);
  });
}

function openModal(onConfirmCallback) {
  ensureModal();
  onConfirm = onConfirmCallback;
  modalEl.hidden = false;
  requestAnimationFrame(() => modalEl._resizeAndClear());
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

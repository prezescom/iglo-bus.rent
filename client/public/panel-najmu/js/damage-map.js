// Schemat pojazdu (4 widoki) do zaznaczania uszkodzeń.
// Przepływ: dotknięcie nakładki aktywuje pole na JEDNO zaznaczenie -> dotknięcie
// miejsca uszkodzenia stawia znacznik "na próbę" (pomarańczowy) i pokazuje
// przycisk "Zatwierdź" -> zatwierdzenie zapisuje znacznik na czerwono i wraca
// do stanu nieaktywnego (nakładka wraca), więc kolejne zaznaczenie znów
// wymaga świadomej aktywacji.
export function initDamageMap({ canvas, overlay, confirmBtn, diagramUrl }) {
  const ctx = canvas.getContext("2d");
  let marks = [];
  let pendingMark = null;
  let imageReady = false;

  const bgImage = new Image();
  bgImage.onload = () => {
    imageReady = true;
    redraw();
  };
  bgImage.src = diagramUrl;

  function redraw() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (imageReady) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }
    marks.forEach(({ x, y }) => drawMark(x, y, "#C0392B"));
    if (pendingMark) drawMark(pendingMark.x, pendingMark.y, "#D98E2A");
  }

  function drawMark(x, y, color) {
    const s = 9;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - s, y - s);
    ctx.lineTo(x + s, y + s);
    ctx.moveTo(x + s, y - s);
    ctx.lineTo(x - s, y + s);
    ctx.stroke();
  }

  function posFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const point = e.changedTouches ? e.changedTouches[0] : e;
    return {
      x: (point.clientX - rect.left) * scaleX,
      y: (point.clientY - rect.top) * scaleY
    };
  }

  function activate(e) {
    e.preventDefault();
    overlay.hidden = true;
  }

  function handleCanvasTap(e) {
    if (!overlay.hidden) return; // nakładka widoczna = pole nieaktywne
    e.preventDefault();
    const { x, y } = posFromEvent(e);
    pendingMark = { x, y };
    confirmBtn.hidden = false;
    redraw();
  }

  function confirmMark() {
    if (!pendingMark) return;
    marks.push(pendingMark);
    pendingMark = null;
    confirmBtn.hidden = true;
    overlay.hidden = false;
    redraw();
  }

  // preventDefault() na touchend tłumi następujące po nim syntetyczne
  // zdarzenie "click", więc jeden dotyk nie wywołuje akcji podwójnie.
  overlay.addEventListener("click", activate);
  overlay.addEventListener("touchend", activate, { passive: false });
  canvas.addEventListener("click", handleCanvasTap);
  canvas.addEventListener("touchend", handleCanvasTap, { passive: false });
  confirmBtn.addEventListener("click", confirmMark);

  redraw();

  return {
    isEmpty: () => marks.length === 0,
    clear: () => {
      marks = [];
      pendingMark = null;
      confirmBtn.hidden = true;
      overlay.hidden = false;
      redraw();
    },
    toBlob: () => new Promise((resolve) => canvas.toBlob(resolve, "image/png")),
    toDataUrl: () => canvas.toDataURL("image/png")
  };
}

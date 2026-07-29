// Schemat pojazdu (4 widoki) do zaznaczania uszkodzeń dotknięciem/kliknięciem.
// Każde dotknięcie/kliknięcie stawia czerwony "X" w tym miejscu.
export function initDamageMap(canvas, diagramUrl) {
  const ctx = canvas.getContext("2d");
  let marks = [];
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
    marks.forEach(({ x, y }) => drawMark(x, y));
  }

  function drawMark(x, y) {
    const s = 9;
    ctx.strokeStyle = "#C0392B";
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

  function handleTap(e) {
    e.preventDefault();
    const { x, y } = posFromEvent(e);
    marks.push({ x, y });
    drawMark(x, y);
  }

  // preventDefault() na touchend tłumi następujące po nim syntetyczne
  // zdarzenie "click", więc jeden dotyk nie stawia dwóch znaczników.
  canvas.addEventListener("click", handleTap);
  canvas.addEventListener("touchend", handleTap, { passive: false });

  redraw();

  return {
    isEmpty: () => marks.length === 0,
    clear: () => {
      marks = [];
      redraw();
    },
    toBlob: () => new Promise((resolve) => canvas.toBlob(resolve, "image/png")),
    toDataUrl: () => canvas.toDataURL("image/png")
  };
}

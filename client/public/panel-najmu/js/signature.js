// Prosty pad do podpisu palcem/myszą na <canvas>.
export function initSignaturePad(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#16202A";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  let drawing = false;
  let hasStroke = false;

  function posFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
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
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = posFromEvent(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasStroke = true;
  }

  function end(e) {
    drawing = false;
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", end);

  return {
    isEmpty: () => !hasStroke,
    clear: () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      hasStroke = false;
    },
    toBlob: () => new Promise((resolve) => canvas.toBlob(resolve, "image/png")),
    toDataUrl: () => canvas.toDataURL("image/png")
  };
}

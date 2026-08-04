// Schemat pojazdu (4 widoki) do zaznaczania uszkodzeń.
// Przepływ: dotknięcie nakładki aktywuje pole (raz, na cały czas edycji) ->
// dotknięcie miejsca uszkodzenia stawia znacznik "na próbę" (pomarańczowy)
// i pokazuje przyciski "Zatwierdź"/"Odrzuć" -> zatwierdzenie zapisuje
// znacznik na czerwono, odrzucenie go kasuje. Pole zostaje aktywne, gotowe
// od razu na kolejne zaznaczenie. Niezatwierdzony (pomarańczowy) znacznik
// nigdy nie trafia do eksportu (toDataUrl/toBlob/getMarks) — nawet jeśli
// ktoś zapomni go zatwierdzić lub odrzucić przed zapisaniem protokołu.
export function initDamageMap({ canvas, overlay, confirmBtn, discardBtn, pendingActions, diagramUrl }) {
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
    // Zamknij ewentualną klawiaturę ekranową z poprzednio aktywnego pola —
    // inaczej jej zwijanie tuż po dotknięciu może przesunąć układ i sprawić
    // wrażenie, że dotyk trafił w zupełnie inne pole.
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    overlay.hidden = true;
  }

  function handleCanvasTap(e) {
    if (!overlay.hidden) return; // nakładka widoczna = pole nieaktywne
    e.preventDefault();
    const { x, y } = posFromEvent(e);
    pendingMark = { x, y };
    pendingActions.hidden = false;
    redraw();
  }

  function confirmMark() {
    if (!pendingMark) return;
    marks.push(pendingMark);
    pendingMark = null;
    pendingActions.hidden = true;
    // Pole zostaje aktywne — nie trzeba aktywować od nowa dla kolejnego
    // zaznaczenia, jeśli jest więcej niż jedno uszkodzenie do oznaczenia.
    redraw();
  }

  function discardMark() {
    pendingMark = null;
    pendingActions.hidden = true;
    redraw();
  }

  // preventDefault() na touchend tłumi następujące po nim syntetyczne
  // zdarzenie "click", więc jeden dotyk nie wywołuje akcji podwójnie.
  overlay.addEventListener("click", activate);
  overlay.addEventListener("touchend", activate, { passive: false });
  canvas.addEventListener("click", handleCanvasTap);
  canvas.addEventListener("touchend", handleCanvasTap, { passive: false });
  confirmBtn.addEventListener("click", confirmMark);
  discardBtn.addEventListener("click", discardMark);

  redraw();

  // Eksport, który celowo pomija ewentualny niezatwierdzony znacznik —
  // odrzuca go "po cichu" (bez czyszczenia UI), żeby zapis protokołu nigdy
  // nie zawierał czegoś, czego operator nie zdążył potwierdzić.
  function redrawWithoutPending() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (imageReady) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }
    marks.forEach(({ x, y }) => drawMark(x, y, "#C0392B"));
  }

  return {
    isEmpty: () => marks.length === 0,
    clear: () => {
      marks = [];
      pendingMark = null;
      pendingActions.hidden = true;
      overlay.hidden = false;
      redraw();
    },
    // Podmienia zaznaczenia na podpowiedziane z bazy pojazdu (np. to, co
    // zostało zaznaczone przy wydaniu — punkt startowy dla zwrotu, albo to,
    // co zostało przy ostatnim zwrocie — punkt startowy dla kolejnego
    // wydania tego samego pojazdu). Pole i tak wymaga aktywacji, żeby
    // dodać nowe zaznaczenie.
    setMarks: (newMarks) => {
      marks = Array.isArray(newMarks) ? newMarks.map(({ x, y }) => ({ x, y })) : [];
      pendingMark = null;
      pendingActions.hidden = true;
      overlay.hidden = false;
      redraw();
    },
    getMarks: () => marks.map(({ x, y }) => ({ x, y })),
    toBlob: () => {
      redrawWithoutPending();
      return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    },
    toDataUrl: () => {
      redrawWithoutPending();
      return canvas.toDataURL("image/png");
    }
  };
}

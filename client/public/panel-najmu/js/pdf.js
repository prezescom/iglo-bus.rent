// Generuje protokół PDF (wydania lub zwrotu).
// Wymaga globalnego window.jspdf (wgrywanego przez CDN w index.html).

// Paleta kolorów spójna z resztą aplikacji (zob. css/style.css: --accent itd.).
const COLOR_PRIMARY = [30, 95, 140]; // #1E5F8C
const COLOR_PRIMARY_DARK = [20, 69, 106]; // #14456A
const COLOR_BAND_BG = [235, 241, 246]; // jasny pasek pod nagłówkami sekcji
const COLOR_ROW_BG = [246, 248, 250]; // jasne tło wierszy danych
const COLOR_LINE = [221, 227, 232];
const COLOR_INK = [22, 32, 42];
const COLOR_MUTED = [103, 117, 127];
const COLOR_GREEN = [46, 125, 50];
const COLOR_AMBER = [180, 110, 20];
const COLOR_WHITE = [255, 255, 255];

const LEFT = 40;
const RIGHT = 40;

// Znaczniki na schemacie uszkodzeń używają tych samych kolorów co
// js/damage-map.js (EXISTING_MARK_COLOR / NEW_MARK_COLOR), żeby legenda w
// PDF-ie odpowiadała temu, co operator widział na ekranie.
const MARK_COLOR_EXISTING = [30, 95, 140];
const MARK_COLOR_NEW = [192, 57, 43];

export async function generateProtocolPdf(record, phase, signatureDataUrl, damageMapDataUrl, photoDataUrls) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  await useCustomFont(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - LEFT - RIGHT;
  const phaseTitle = phase === "wydanie" ? "PROTOKÓŁ WYDANIA" : "PROTOKÓŁ ZWROTU";

  let logoDataUrl = null;
  try {
    logoDataUrl = await getLogoDataUrl();
  } catch (e) {
    // Brak logo nie powinien blokować generowania protokołu.
  }

  let y = drawPageChrome(doc, pageWidth, logoDataUrl, phaseTitle);

  // ---- Karta tytułowa pojazdu ----
  const titleCardH = 54;
  doc.setFillColor(...COLOR_ROW_BG);
  doc.roundedRect(LEFT, y, contentWidth, titleCardH, 4, 4, "F");
  doc.setFont("Roboto", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLOR_INK);
  doc.text(String(record.vehicleModel || "-"), LEFT + 14, y + 24);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(`VIN: ${record.vehicleVin || "-"}`, LEFT + 14, y + 40);

  doc.setFont("Roboto", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("NR REJESTRACYJNY", pageWidth - RIGHT - 14, y + 18, { align: "right" });
  doc.setFont("Roboto", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLOR_PRIMARY_DARK);
  doc.text(String(record.vehiclePlate || "-"), pageWidth - RIGHT - 14, y + 38, { align: "right" });
  y += titleCardH + 10;

  // ---- Pasek informacyjny: przebieg / paliwo / data ----
  const isHandover = phase === "wydanie";
  const infoItems = isHandover
    ? [
        ["PRZEBIEG (WYDANIE)", `${record.vehicleMileageAtHandover ?? "-"} km`],
        ["PALIWO (WYDANIE)", `${record.vehicleFuelAtHandover ?? "-"} %`],
        ["DATA WYDANIA", formatDate(record.handoverTimestamp)]
      ]
    : [
        ["PRZEBIEG (ZWROT)", `${record.vehicleMileageAtReturn ?? "-"} km`],
        ["PALIWO (ZWROT)", `${record.vehicleFuelAtReturn ?? "-"} %`],
        ["DATA ZWROTU", formatDate(record.returnTimestamp)]
      ];
  y = drawInfoStrip(doc, y, contentWidth, infoItems);
  if (!isHandover && record.distanceTraveled !== "" && record.distanceTraveled != null) {
    y += 14;
    doc.setFont("Roboto", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(`Przebyty przebieg w trakcie wynajmu: ${record.distanceTraveled} km`, LEFT, y);
    doc.setTextColor(...COLOR_INK);
    y += 6;
  }
  y += 12;

  // ---- Najemca ----
  y = drawSectionHeader(doc, "NAJEMCA", y, contentWidth);
  const isCompany = record.tenantType === "firma";
  y = drawDataRow(doc, y, contentWidth, [
    [isCompany ? "NAZWA FIRMY" : "IMIĘ I NAZWISKO", record.tenantName],
    [isCompany ? "NIP" : "PESEL", isCompany ? record.tenantNip : record.tenantPesel],
    ["TELEFON", record.tenantPhone]
  ]);
  y = drawDataRow(doc, y, contentWidth, [
    ["E-MAIL", record.tenantEmail],
    ["ADRES", formatAddress(record)]
  ], [1, 1]);
  y += 8;

  // ---- Kierowca ----
  y = drawSectionHeader(doc, "KIEROWCA", y, contentWidth);
  y = drawDataRow(doc, y, contentWidth, [
    ["IMIĘ I NAZWISKO", record.driverName],
    ["NR BLANKIETU PRAWA JAZDY", record.driverLicenseNumber]
  ]);
  y += 8;

  // ---- Stan pojazdu ----
  y = drawSectionHeader(doc, "STAN POJAZDU", y, contentWidth);
  const conditionRows = isHandover
    ? [
        ["Karoseria", record.handoverBodyCondition],
        ["Przestrzeń pasażerska", record.handoverPassengerAreaCondition],
        ["Przestrzeń ładunkowa", record.handoverCargoAreaCondition]
      ]
    : [
        ["Karoseria", record.returnBodyCondition],
        ["Przestrzeń pasażerska", record.returnPassengerAreaCondition],
        ["Przestrzeń ładunkowa", record.returnCargoAreaCondition]
      ];
  y = drawConditionTable(doc, y, contentWidth, conditionRows);
  y += 8;

  // ---- Wyposażenie | Uwagi (dwie kolumny) ----
  const equipmentTitle = isHandover ? "PRZEKAZANE WYPOSAŻENIE" : "ZWRÓCONE WYPOSAŻENIE";
  const equipmentLines = buildEquipmentLines(record, phase);
  const notes = isHandover ? record.handoverNotes : record.returnNotes;
  const colGap = 16;
  const colW = (contentWidth - colGap) / 2;
  y = drawTwoColumnBody(doc, y, contentWidth, colW, colGap, equipmentTitle, equipmentLines, "UWAGI", notes);
  y += 10;

  // ---- Podpis ----
  y = drawSignatureBox(doc, y, contentWidth, pageWidth, pageHeight, signatureDataUrl);

  // ---- Strona: schemat uszkodzeń ----
  if (damageMapDataUrl) {
    doc.addPage();
    let dy = drawPageChrome(doc, pageWidth, logoDataUrl, phaseTitle);
    doc.setFont("Roboto", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...COLOR_INK);
    doc.text("Oględziny pojazdu", LEFT, dy);
    dy += 16;
    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLOR_MUTED);
    doc.text("Schemat pojazdu — zaznaczone uszkodzenia", LEFT, dy);
    dy += 16;

    // Legenda tylko na protokole zwrotu — przy wydaniu rozróżnianie
    // pochodzenia znaczników nie jest potrzebne.
    const legendH = isHandover ? 0 : 34;
    const mapBottomLimit = pageHeight - 56 - legendH;
    const mapBoxH = mapBottomLimit - dy;

    doc.setDrawColor(...COLOR_LINE);
    doc.setLineWidth(1);
    doc.roundedRect(LEFT, dy, contentWidth, mapBoxH, 4, 4, "S");

    try {
      const img = await loadImage(damageMapDataUrl);
      const pad = 6;
      const availW = contentWidth - pad * 2;
      const availH = mapBoxH - pad * 2;
      const scale = Math.min(availW / img.naturalWidth, availH / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const imgX = LEFT + (contentWidth - w) / 2;
      const imgY = dy + (mapBoxH - h) / 2;
      doc.addImage(damageMapDataUrl, "PNG", imgX, imgY, w, h);
    } catch (e) {
      // Jeśli nie uda się zmierzyć obrazu, wstaw go rozciągnięty na cały box.
      doc.addImage(damageMapDataUrl, "PNG", LEFT + 6, dy + 6, contentWidth - 12, mapBoxH - 12);
    }

    if (!isHandover) {
      const legendY = dy + mapBoxH + 18;
      drawDamageLegendItem(doc, LEFT, legendY, MARK_COLOR_EXISTING, "Uszkodzenie zgłoszone przy wydaniu");
      drawDamageLegendItem(doc, LEFT, legendY + 16, MARK_COLOR_NEW, "Nowe uszkodzenie stwierdzone przy zwrocie");
    }
  }

  // ---- Strona(y): zdjęcia ----
  if (photoDataUrls && photoDataUrls.length) {
    doc.addPage();
    let py = drawPageChrome(doc, pageWidth, logoDataUrl, phaseTitle);
    doc.setFont("Roboto", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...COLOR_INK);
    doc.text("Dokumentacja fotograficzna", LEFT, py);
    py += 24;

    const maxW = contentWidth;
    const maxH = 220; // budżet na zdjęcie — mieszczą się 2-3 na stronie

    for (const src of photoDataUrls) {
      let w = maxW;
      let h = maxH;
      try {
        const img = await loadImage(src);
        const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
        w = img.naturalWidth * scale;
        h = img.naturalHeight * scale;
      } catch (e) {
        // Jeśli zdjęcie się nie wczyta do pomiaru, wstaw je w rozmiarze
        // maksymalnym zamiast pomijać — protokół i tak ma być kompletny.
      }

      if (py + h > pageHeight - 56) {
        doc.addPage();
        py = drawPageChrome(doc, pageWidth, logoDataUrl, phaseTitle);
      }

      doc.addImage(src, formatFromDataUrl(src), LEFT, py, w, h);
      py += h + 16;
    }
  }

  addFooterToAllPages(doc, pageWidth, pageHeight, phaseTitle);

  return doc.output("blob");
}

// ---------- Elementy graficzne ----------

// Rysowany na początku każdej strony: górny pasek marki, logo + nazwa po
// lewej, tytuł protokołu po prawej, linia oddzielająca. Zwraca współrzędną Y,
// od której można zacząć rysować właściwą treść strony.
function drawPageChrome(doc, pageWidth, logoDataUrl, phaseTitle) {
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 6, "F");

  const headerY = 34;
  let textX = LEFT;
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", LEFT, 16, 26, 26);
    textX = LEFT + 34;
  }
  doc.setFont("Roboto", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_PRIMARY_DARK);
  doc.text("IGLO-BUS.rent", textX, headerY);

  doc.setFont("Roboto", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(phaseTitle, pageWidth - RIGHT, headerY, { align: "right" });

  doc.setDrawColor(...COLOR_LINE);
  doc.setLineWidth(1);
  doc.line(LEFT, 48, pageWidth - RIGHT, 48);

  doc.setTextColor(...COLOR_INK);
  return 70;
}

function drawSectionHeader(doc, title, y, width) {
  const h = 20;
  doc.setFillColor(...COLOR_BAND_BG);
  doc.rect(LEFT, y, width, h, "F");
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(LEFT, y, 3, h, "F");
  doc.setFont("Roboto", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY_DARK);
  doc.text(title, LEFT + 12, y + 14);
  doc.setTextColor(...COLOR_INK);
  return y + h + 8;
}

// Wiersz z N kolumnami danych (etykieta wielkimi literami + wartość).
// `widths` to opcjonalne proporcje kolumn (domyślnie równe).
function drawDataRow(doc, y, width, items, widths) {
  const rowH = 30;
  doc.setFillColor(...COLOR_ROW_BG);
  doc.roundedRect(LEFT, y, width, rowH, 3, 3, "F");

  const ratios = widths || items.map(() => 1);
  const totalRatio = ratios.reduce((a, b) => a + b, 0);
  let colX = LEFT + 12;
  const usable = width - 24;
  items.forEach(([label, value], i) => {
    const colW = (usable * ratios[i]) / totalRatio;
    doc.setFont("Roboto", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(label, colX, y + 12);
    doc.setFont("Roboto", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLOR_INK);
    const wrapped = doc.splitTextToSize(String(value || "-"), colW - 8);
    doc.text(wrapped[0] || "-", colX, y + 25);
    colX += colW;
  });
  return y + rowH + 6;
}

function drawInfoStrip(doc, y, width, items) {
  const h = 34;
  doc.setFillColor(...COLOR_BAND_BG);
  doc.roundedRect(LEFT, y, width, h, 4, 4, "F");
  const colW = width / items.length;
  items.forEach(([label, value], i) => {
    const cx = LEFT + colW * i + colW / 2;
    doc.setFont("Roboto", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(label, cx, y + 14, { align: "center" });
    doc.setFont("Roboto", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_PRIMARY_DARK);
    doc.text(String(value || "-"), cx, y + 27, { align: "center" });
  });
  return y + h;
}

function drawConditionTable(doc, y, width, rows) {
  const headerH = 18;
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(LEFT, y, width, headerH, "F");
  doc.setFont("Roboto", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_WHITE);
  doc.text("ELEMENT", LEFT + 12, y + 12);
  doc.text("STAN", LEFT + width - 12, y + 12, { align: "right" });
  y += headerH;

  const rowH = 20;
  rows.forEach(([label, value], i) => {
    if (i % 2 === 1) {
      doc.setFillColor(...COLOR_ROW_BG);
      doc.rect(LEFT, y, width, rowH, "F");
    }
    doc.setFont("Roboto", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...COLOR_INK);
    doc.text(label, LEFT + 12, y + 14);

    const isClean = value === "czysta";
    doc.setFont("Roboto", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...(isClean ? COLOR_GREEN : COLOR_AMBER));
    doc.text(isClean ? "Czysta" : (value === "brudna" ? "Brudna" : String(value || "-")), LEFT + width - 12, y + 14, { align: "right" });
    doc.setTextColor(...COLOR_INK);
    y += rowH;
  });

  doc.setDrawColor(...COLOR_LINE);
  doc.setLineWidth(1);
  doc.rect(LEFT, y - rows.length * rowH - headerH, width, rows.length * rowH + headerH, "S");
  return y;
}

// Dwie kolumny obok siebie: lista wyposażenia (wiersz po wierszu) i notatka
// tekstowa (zawijana). Wysokość bloku dopasowuje się do dłuższej kolumny.
function drawTwoColumnBody(doc, y, width, colW, colGap, leftTitle, leftLines, rightTitle, notesText) {
  const bandH = 20;
  // Nagłówek lewej kolumny
  doc.setFillColor(...COLOR_BAND_BG);
  doc.rect(LEFT, y, colW, bandH, "F");
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(LEFT, y, 3, bandH, "F");
  doc.setFont("Roboto", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY_DARK);
  doc.text(leftTitle, LEFT + 12, y + 14);

  // Nagłówek prawej kolumny
  const rightX = LEFT + colW + colGap;
  doc.setFillColor(...COLOR_BAND_BG);
  doc.rect(rightX, y, colW, bandH, "F");
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(rightX, y, 3, bandH, "F");
  doc.setFont("Roboto", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY_DARK);
  doc.text(rightTitle, rightX + 12, y + 14);

  let bodyY = y + bandH + 14;
  doc.setTextColor(...COLOR_INK);

  doc.setFont("Roboto", "normal");
  doc.setFontSize(9.5);
  let leftEndY = bodyY;
  if (leftLines.length) {
    leftLines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, colW - 12);
      doc.text(wrapped, LEFT, leftEndY);
      leftEndY += wrapped.length * 13;
    });
  } else {
    doc.setTextColor(...COLOR_MUTED);
    doc.text("brak", LEFT, leftEndY);
    leftEndY += 13;
    doc.setTextColor(...COLOR_INK);
  }

  const wrappedNotes = doc.splitTextToSize(notesText || "-", colW - 12);
  doc.text(wrappedNotes, rightX, bodyY);
  const rightEndY = bodyY + wrappedNotes.length * 13;

  return Math.max(leftEndY, rightEndY) + 6;
}

function drawSignatureBox(doc, y, contentWidth, pageWidth, pageHeight, signatureDataUrl) {
  const boxH = 100;
  const boxY = Math.max(y, pageHeight - 56 - boxH);
  doc.setFont("Roboto", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY_DARK);
  doc.text("PODPIS NAJEMCY", LEFT, boxY - 4);

  doc.setDrawColor(...COLOR_LINE);
  doc.setLineWidth(1);
  doc.roundedRect(LEFT, boxY, contentWidth, boxH, 4, 4, "S");
  if (signatureDataUrl) {
    doc.addImage(signatureDataUrl, "PNG", LEFT + 10, boxY + 10, 200, 70);
  }
  doc.setFont("Roboto", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_MUTED);
  const disclaimer = doc.splitTextToSize(
    "Podpisując niniejszy protokół, najemca potwierdza zapoznanie się ze stanem pojazdu opisanym powyżej oraz zgodność powyższych danych ze stanem faktycznym.",
    contentWidth - 230
  );
  doc.text(disclaimer, LEFT + 230, boxY + 20);
  doc.setTextColor(...COLOR_INK);
  return boxY + boxH;
}

function drawDamageLegendItem(doc, x, y, color, label) {
  const s = 5;
  doc.setDrawColor(...color);
  doc.setLineWidth(2.5);
  doc.setLineCap?.("round");
  doc.line(x - s, y - s, x + s, y + s);
  doc.line(x + s, y - s, x - s, y + s);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(label, x + 14, y + 3);
  doc.setTextColor(...COLOR_INK);
}

function buildEquipmentLines(record, phase) {
  if (phase === "wydanie") {
    return [
      record.equipmentShelf && "• Półka double-deck",
      record.equipmentCargoBar && "• Poprzeczka do blokowania ładunku",
      record.equipmentStraps && "• Zapinki (6 szt.)",
      record.equipmentPowerCable && "• Kabel do zasilania chłodni na postoju"
    ].filter(Boolean);
  }
  if (!record.returnedEquipment || !Object.keys(record.returnedEquipment).length) return [];
  const equipmentLabels = {
    equipmentShelf: "Półka double-deck",
    equipmentCargoBar: "Poprzeczka do blokowania ładunku",
    equipmentStraps: "Zapinki (6 szt.)",
    equipmentPowerCable: "Kabel do zasilania chłodni na postoju"
  };
  return Object.entries(record.returnedEquipment).map(
    ([field, returned]) => `• ${equipmentLabels[field] || field}: ${returned ? "zwrócone" : "NIE ZWRÓCONE"}`
  );
}

function addFooterToAllPages(doc, pageWidth, pageHeight, phaseTitle) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLOR_LINE);
    doc.setLineWidth(1);
    const ruleY = pageHeight - 34;
    doc.line(LEFT, ruleY, pageWidth - RIGHT, ruleY);
    doc.setFontSize(8);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(...COLOR_MUTED);
    doc.text(`IGLO-BUS.RENT • ${phaseTitle} POJAZDU`, LEFT, pageHeight - 20);
    doc.text(`Strona ${i} z ${pageCount}`, pageWidth - RIGHT, pageHeight - 20, { align: "right" });
    doc.setTextColor(...COLOR_INK);
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function formatFromDataUrl(dataUrl) {
  const match = /^data:image\/(\w+);/.exec(dataUrl);
  if (!match) return "JPEG";
  const type = match[1].toUpperCase();
  return type === "JPG" ? "JPEG" : type;
}

function formatDate(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("pl-PL");
}

function formatAddress(record) {
  const streetPart = [record.tenantStreet, record.tenantHouseNumber].filter(Boolean).join(" ");
  const streetWithApt = record.tenantApartmentNumber ? `${streetPart}/${record.tenantApartmentNumber}` : streetPart;
  const cityPart = [record.tenantPostalCode, record.tenantCity].filter(Boolean).join(", ");
  return [streetWithApt, cityPart].filter(Boolean).join(", ");
}

// jsPDF's built-in fonts (Helvetica/Times/Courier) only support WinAnsi and
// can't render Polish diacritics (ą ć ę ł ń ó ś ź ż), so a real Unicode
// font (Roboto, Apache 2.0) is embedded instead — fetched once and cached
// as base64 for reuse across every generated protocol in this session.
let cachedFontsBase64 = null;

function getFontsBase64() {
  if (!cachedFontsBase64) {
    cachedFontsBase64 = Promise.all([
      fetchAsBase64("/panel-najmu/fonts/Roboto-Regular.ttf"),
      fetchAsBase64("/panel-najmu/fonts/Roboto-Bold.ttf")
    ]);
  }
  return cachedFontsBase64;
}

let cachedLogoDataUrl = null;

function getLogoDataUrl() {
  if (!cachedLogoDataUrl) {
    cachedLogoDataUrl = fetchAsBase64("/panel-najmu/img/logo.png").then((b64) => `data:image/png;base64,${b64}`);
  }
  return cachedLogoDataUrl;
}

async function fetchAsBase64(url) {
  const buffer = await fetch(url).then((r) => r.arrayBuffer());
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function useCustomFont(doc) {
  const [regularBase64, boldBase64] = await getFontsBase64();
  doc.addFileToVFS("Roboto-Regular.ttf", regularBase64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFileToVFS("Roboto-Bold.ttf", boldBase64);
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
  doc.setFont("Roboto", "normal");
}

// Generuje protokół PDF (wydania lub zwrotu).
// Wymaga globalnego window.jspdf (wgrywanego przez CDN w index.html).
export async function generateProtocolPdf(record, phase, signatureDataUrl, damageMapDataUrl, photoDataUrls) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  await useCustomFont(doc);

  const left = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 50;

  doc.setFontSize(16);
  doc.setFont("Roboto", "bold");
  doc.text(
    phase === "wydanie" ? "Protokół wydania pojazdu" : "Protokół zwrotu pojazdu",
    left, y
  );
  y += 30;

  doc.setFontSize(11);
  const line = (label, value) => {
    doc.setFont("Roboto", "bold");
    doc.text(label, left, y);
    doc.setFont("Roboto", "normal");
    doc.text(String(value || "-"), left + 150, y);
    y += 20;
  };
  const heading = (text) => {
    doc.setFont("Roboto", "bold");
    doc.text(text, left, y);
    y += 20;
    doc.setFont("Roboto", "normal");
  };

  line("Pojazd:", record.vehicleModel);
  line("Nr rejestracyjny:", record.vehiclePlate);

  if (phase === "wydanie") {
    line("Przebieg (wydanie):", `${record.vehicleMileageAtHandover} km`);
    line("Paliwo (wydanie) (%):", record.vehicleFuelAtHandover);
    line("Data wydania:", formatDate(record.handoverTimestamp));
  } else {
    line("Przebieg (zwrot):", `${record.vehicleMileageAtReturn} km`);
    line("Paliwo (zwrot) (%):", record.vehicleFuelAtReturn);
    line("Data zwrotu:", formatDate(record.returnTimestamp));
    if (record.distanceTraveled !== "" && record.distanceTraveled != null) {
      line("Przebyty przebieg:", `${record.distanceTraveled} km`);
    }
  }

  y += 10;
  heading("Najemca:");
  const isCompany = record.tenantType === "firma";
  line("Typ:", isCompany ? "Firma" : "Osoba prywatna");
  line(isCompany ? "Nazwa firmy:" : "Imię i nazwisko:", record.tenantName);
  line(isCompany ? "NIP:" : "PESEL:", isCompany ? record.tenantNip : record.tenantPesel);
  line("Telefon:", record.tenantPhone);
  line("E-mail:", record.tenantEmail);
  line("Adres:", formatAddress(record));

  y += 10;
  heading("Kierowca:");
  line("Imię i nazwisko:", record.driverName);
  line("Nr blankietu prawa jazdy:", record.driverLicenseNumber);

  y += 10;
  heading("Stan pojazdu:");
  if (phase === "wydanie") {
    line("Karoseria:", record.handoverBodyCondition);
    line("Przestrzeń pasażerska:", record.handoverPassengerAreaCondition);
    line("Przestrzeń ładunkowa:", record.handoverCargoAreaCondition);
  } else {
    line("Karoseria:", record.returnBodyCondition);
    line("Przestrzeń pasażerska:", record.returnPassengerAreaCondition);
    line("Przestrzeń ładunkowa:", record.returnCargoAreaCondition);
  }

  if (phase === "wydanie") {
    y += 10;
    heading("Przekazane wyposażenie:");
    const equipment = [
      record.equipmentShelf && "Półka double-deck",
      record.equipmentCargoBar && "Poprzeczka do blokowania ładunku",
      record.equipmentStraps && "Zapinki (6 szt.)",
      record.equipmentPowerCable && "Kabel do zasilania chłodni na postoju"
    ].filter(Boolean);
    const equipmentText = equipment.length ? equipment.join(", ") : "brak";
    const wrappedEquipment = doc.splitTextToSize(equipmentText, 500);
    doc.text(wrappedEquipment, left, y);
    y += wrappedEquipment.length * 14 + 10;
  }

  y += 10;
  heading("Uwagi:");
  const notes = phase === "wydanie" ? record.handoverNotes : record.returnNotes;
  const wrapped = doc.splitTextToSize(notes || "-", 500);
  doc.text(wrapped, left, y);
  y += wrapped.length * 14 + 20;

  // Podpis zawsze na samym dole strony — jeśli treść powyżej jest krótka,
  // zostaje dosunięty w dół; jeśli wyjątkowo długa, ląduje zaraz pod nią.
  const sigY = Math.max(y + 20, pageHeight - 110);
  doc.setFont("Roboto", "bold");
  doc.text("Podpis najemcy:", left, sigY);
  if (signatureDataUrl) {
    doc.addImage(signatureDataUrl, "PNG", left, sigY + 10, 220, 80);
  }

  if (damageMapDataUrl) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont("Roboto", "bold");
    doc.text("Schemat pojazdu — zaznaczone uszkodzenia", left, 50);
    doc.addImage(damageMapDataUrl, "PNG", left, 70, 500, 333);
  }

  if (photoDataUrls && photoDataUrls.length) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont("Roboto", "bold");
    doc.text("Zdjęcia", left, 50);
    doc.setFontSize(11);
    doc.setFont("Roboto", "normal");

    const maxW = pageWidth - left * 2;
    const maxH = 220; // budżet na zdjęcie — mieszczą się 2-3 na stronie
    let photoY = 70;

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

      if (photoY + h > pageHeight - 40) {
        doc.addPage();
        photoY = 50;
      }

      doc.addImage(src, formatFromDataUrl(src), left, photoY, w, h);
      photoY += h + 16;
    }
  }

  return doc.output("blob");
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
      loadFontAsBase64("/panel-najmu/fonts/Roboto-Regular.ttf"),
      loadFontAsBase64("/panel-najmu/fonts/Roboto-Bold.ttf")
    ]);
  }
  return cachedFontsBase64;
}

async function loadFontAsBase64(url) {
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

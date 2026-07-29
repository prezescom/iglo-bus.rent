// Generuje jednostronicowy protokół PDF (wydania lub zwrotu).
// Wymaga globalnego window.jspdf (wgrywanego przez CDN w index.html).
export async function generateProtocolPdf(record, phase, signatureDataUrl) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const left = 40;
  let y = 50;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text(
    phase === "wydanie" ? "PROTOKÓŁ WYDANIA POJAZDU" : "PROTOKÓŁ ZWROTU POJAZDU",
    left, y
  );
  y += 30;

  doc.setFontSize(11);
  const line = (label, value) => {
    doc.setFont(undefined, "bold");
    doc.text(label, left, y);
    doc.setFont(undefined, "normal");
    doc.text(String(value || "-"), left + 150, y);
    y += 20;
  };

  line("Pojazd:", record.vehicleModel);
  line("Nr rejestracyjny:", record.vehiclePlate);

  if (phase === "wydanie") {
    line("Przebieg (wydanie):", `${record.vehicleMileageAtHandover} km`);
    line("Paliwo (wydanie):", record.vehicleFuelAtHandover);
    line("Data wydania:", formatDate(record.handoverTimestamp));
  } else {
    line("Przebieg (zwrot):", `${record.vehicleMileageAtReturn} km`);
    line("Paliwo (zwrot):", record.vehicleFuelAtReturn);
    line("Data zwrotu:", formatDate(record.returnTimestamp));
    if (record.distanceTraveled !== "" && record.distanceTraveled != null) {
      line("Przebyty przebieg:", `${record.distanceTraveled} km`);
    }
  }

  y += 10;
  line("Najemca:", record.tenantName);
  line("Nr blankietu prawa jazdy:", record.tenantLicenseNumber);
  line("Telefon:", record.tenantPhone);
  line("E-mail:", record.tenantEmail);
  line("Adres:", formatAddress(record));

  y += 10;
  doc.setFont(undefined, "bold");
  doc.text("Stan pojazdu:", left, y);
  y += 20;
  doc.setFont(undefined, "normal");
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
    doc.setFont(undefined, "bold");
    doc.text("Przekazane wyposażenie:", left, y);
    y += 16;
    doc.setFont(undefined, "normal");
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
  doc.setFont(undefined, "bold");
  doc.text("Uwagi:", left, y);
  y += 16;
  doc.setFont(undefined, "normal");
  const notes = phase === "wydanie" ? record.handoverNotes : record.returnNotes;
  const wrapped = doc.splitTextToSize(notes || "-", 500);
  doc.text(wrapped, left, y);
  y += wrapped.length * 14 + 20;

  doc.setFont(undefined, "bold");
  doc.text("Podpis najemcy:", left, y);
  y += 10;
  if (signatureDataUrl) {
    doc.addImage(signatureDataUrl, "PNG", left, y, 220, 80);
  }

  return doc.output("blob");
}

function formatDate(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("pl-PL");
}

function formatAddress(record) {
  const streetPart = [record.tenantStreet, record.tenantHouseNumber].filter(Boolean).join(" ");
  const streetWithApt = record.tenantApartmentNumber ? `${streetPart}/${record.tenantApartmentNumber}` : streetPart;
  const cityPart = [record.tenantPostalCode, record.tenantCity].filter(Boolean).join(" ");
  return [streetWithApt, cityPart].filter(Boolean).join(", ");
}

// Generowanie umów najmu: wypełnianie oryginalnych szablonów Word (.docx)
// danymi najemcy/pojazdu/formularza przy użyciu docxtemplater (PizZip +
// Docxtemplater, wgrywane przez <script> w index.html jako window.PizZip /
// window.Docxtemplater) — zachowuje pełne formatowanie oryginału: tabele,
// nagłówki, style. PDF nie jest generowany automatycznie — Word/Google Docs
// zamieniają .docx na PDF jednym kliknięciem (Plik → Zapisz jako PDF).
//
// Każdy z 6 typów umowy można podmienić z panelu (patrz
// wireContractTemplateManager w js/app.js) bez zmiany kodu — wgrany plik
// trafia do Firebase Storage pod deterministyczną ścieżką
// contract-templates/{templateKey}.docx, którą generateContractDocx
// sprawdza jako pierwszą, zanim spadnie na wbudowany plik statyczny
// poniżej. Wymagane tagi dla każdego typu — patrz CONTRACT-TEMPLATES.md.
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const TEMPLATE_FILES = {
  konsument_umowa: "/panel-najmu/contracts/templates/umowa-konsument.docx",
  konsument_ramowa: "/panel-najmu/contracts/templates/umowa-ramowa-konsument.docx",
  konsument_jednostkowa: "/panel-najmu/contracts/templates/umowa-najmu-jednostkowego-konsument.docx",
  firma_ramowa: "/panel-najmu/contracts/templates/umowa-ramowa-firma.docx",
  firma_scalona_elektroniczna: "/panel-najmu/contracts/templates/umowa-najmu-scalona-epodpis.docx",
  firma_scalona_papierowa: "/panel-najmu/contracts/templates/umowa-najmu-scalona-papierowa.docx"
};

// Szablony, w których w oryginalnym pliku Word brakuje otwierającego "["
// przed "kod_pocztowy]" (literówka źródłowa) — patrz generateContractDocx.
const TEMPLATES_NEEDING_KOD_POCZTOWY_FIX = new Set(["firma_scalona_elektroniczna", "firma_scalona_papierowa"]);

// Dla Firmy nie ma osobnego wariantu "umowa najmu jednostkowego" — jeden
// samodzielny dokument łączy umowę ramową i najem konkretnego pojazdu, więc
// zarówno "Umowa" jak i "Umowa najmu jednostkowego" prowadzą do tego samego
// dokumentu dla Firmy — w wersji do podpisu elektronicznego lub papierowej,
// zależnie od signatureForm.
export function resolveTemplateKey(partyType, contractType, signatureForm) {
  if (partyType === "firma") {
    if (contractType === "ramowa") return "firma_ramowa";
    return signatureForm === "papierowa" ? "firma_scalona_papierowa" : "firma_scalona_elektroniczna";
  }
  if (contractType === "ramowa") return "konsument_ramowa";
  if (contractType === "jednostkowa") return "konsument_jednostkowa";
  return "konsument_umowa";
}

function streetLine(tenant) {
  const base = [tenant.street, tenant.houseNumber].filter(Boolean).join(" ");
  return tenant.apartmentNumber ? `${base}/${tenant.apartmentNumber}` : base;
}

// Każdy szablon ma własne, dosłowne nazwy tokenów (wielkość liter i pisownia
// różnią się między dokumentami — tak jak w oryginalnych plikach Word), więc
// mapowanie budowane jest osobno dla każdego z nich zamiast jednego wspólnego
// zestawu kluczy.
function buildTemplateData(templateKey, { tenant, vehicle, form }) {
  const street = streetLine(tenant);
  switch (templateKey) {
    case "konsument_umowa":
      return {
        data_zawarcia: form.contractDate,
        imię_nazwisko: tenant.name,
        pesel: tenant.pesel,
        seria_numer: tenant.idNumber,
        ulica: street,
        kod_pocztowy: tenant.postalCode,
        miejscowość: tenant.city,
        "e-mail": tenant.email,
        telefon: tenant.phone,
        model: vehicle.model,
        nr_rejestracyjny: vehicle.plate,
        VIN: vehicle.vin,
        data_od: form.periodFrom,
        data_do: form.periodTo,
        kaucja: form.depositAmount
      };
    case "konsument_ramowa":
      return {
        data_zawarcia: form.contractDate,
        imię_nazwisko: tenant.name,
        PESEL: tenant.pesel,
        Seria_Numer: tenant.idNumber,
        ulica: street,
        kod_pocztowy: tenant.postalCode,
        miejscowość: tenant.city,
        "e-mail": tenant.email,
        telefon: tenant.phone,
        model: vehicle.model,
        nr_rejestracyjny: vehicle.plate,
        VIN: vehicle.vin,
        kaucja: form.depositAmount
      };
    case "konsument_jednostkowa":
      // Uwaga: szablon używa tokenów [imię_nazwisko]/[pesel] zarówno dla
      // Najemcy jak i dla „Kierującego Pojazdem (jeśli inna osoba niż
      // Najemca)" — docxtemplater podstawia tę samą wartość w obu miejscach,
      // więc jeśli kierowcą jest ktoś inny niż Najemca, tę sekcję trzeba
      // poprawić ręcznie w wygenerowanym dokumencie Word.
      return {
        data_zawarcia: form.contractDate,
        imię_nazwisko: tenant.name,
        PESEL: tenant.pesel,
        pesel: tenant.pesel,
        seria_numer: tenant.idNumber,
        ulica: street,
        kod_pocztowy: tenant.postalCode,
        miejscowość: tenant.city,
        "e-mail": tenant.email,
        telefon: tenant.phone,
        data_zawarcia_ramowej: form.ramowaDate,
        data_zgłoszenia: form.applicationDate,
        data_potwierdzenia: form.confirmationDate,
        model: vehicle.model,
        nr_rejestracyjny: vehicle.plate,
        VIN: vehicle.vin,
        data_od: form.periodFrom,
        data_do: form.periodTo,
        czynsz: form.rentAmount,
        VAT: form.vatAmount,
        czynsz_brutto: form.grossRentAmount,
        kaucja: form.depositAmount,
        miejsce_wydania: form.handoverPlace,
        miejsce_zwrotu: form.returnPlace
      };
    case "firma_ramowa":
      return {
        data_zawarcia: form.contractDate,
        reprezentant: tenant.representative,
        firma: tenant.name,
        NIP: tenant.nip,
        KRS: tenant.krs,
        ulica: street,
        kod_pocztowy: tenant.postalCode,
        Miasto: tenant.city,
        model: vehicle.model,
        nr_rejestracyjny: vehicle.plate,
        VIN: vehicle.vin,
        kaucja: form.depositAmount,
        umowa_od: form.periodFrom,
        umowa_do: form.periodTo
      };
    case "firma_scalona_elektroniczna":
      return {
        data_zawarcia: form.contractDate,
        "nazwa firmy": tenant.name,
        NIP: tenant.nip,
        KRS: tenant.krs,
        ulica: street,
        kod_pocztowy: tenant.postalCode,
        Miejscowość: tenant.city,
        reprezentant: tenant.representative,
        "model samochodu": vehicle.model,
        nr_rejestracyjny: vehicle.plate,
        VIN: vehicle.vin,
        czynsz: form.rentAmount,
        umowa_od: form.periodFrom,
        umowa_do: form.periodTo
      };
    case "firma_scalona_papierowa":
      return {
        data_zawarcia: form.contractDate,
        "nazwa firmy": tenant.name,
        NIP: tenant.nip,
        KRS: tenant.krs,
        ulica: street,
        kod_pocztowy: tenant.postalCode,
        Miejscowość: tenant.city,
        reprezentant: tenant.representative,
        "model samochodu": vehicle.model,
        nr_rejestracyjny: vehicle.plate,
        VIN: vehicle.vin,
        czynsz: form.rentAmount,
        kaucja: form.depositAmount,
        umowa_od: form.periodFrom,
        umowa_do: form.periodTo
      };
    default:
      throw new Error(`Nieznany typ szablonu: ${templateKey}`);
  }
}

// `storage` (opcjonalny, instancja Firebase Storage z app.js) — gdy podany,
// najpierw próbuje własnego, wgranego przez pracownika szablonu; brak
// (jeszcze nigdy nie podmieniony, albo błąd odczytu) cicho wraca do
// wbudowanego pliku statycznego z TEMPLATE_FILES.
export async function generateContractDocx(templateKey, ctx, storage) {
  const builtinUrl = TEMPLATE_FILES[templateKey];
  if (!builtinUrl) throw new Error(`Nieznany typ szablonu: ${templateKey}`);

  let url = builtinUrl;
  let isCustomTemplate = false;
  if (storage) {
    try {
      url = await getDownloadURL(ref(storage, `contract-templates/${templateKey}.docx`));
      isCustomTemplate = true;
    } catch (e) {
      // Brak własnego szablonu dla tego typu umowy — zostajemy przy wbudowanym.
    }
  }

  const buffer = await fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Nie udało się pobrać wzoru umowy (${r.status}).`);
    return r.arrayBuffer();
  });

  const zip = new window.PizZip(buffer);

  // Poprawka literówki źródłowej dotyczy tylko wbudowanych plików — świeżo
  // wgrany, własny szablon ma być poprawny sam w sobie.
  if (!isCustomTemplate && TEMPLATES_NEEDING_KOD_POCZTOWY_FIX.has(templateKey)) {
    // W oryginalnych wzorach brakuje otwierającego "[" przed "kod_pocztowy]"
    // (literówka w plikach źródłowych „Umowa najmu scalona…") — bez tej
    // poprawki pole nie zostałoby podstawione.
    const xmlPath = "word/document.xml";
    const xml = zip.file(xmlPath).asText();
    zip.file(xmlPath, xml.replace("<w:t>kod_pocztowy]</w:t>", "<w:t>[kod_pocztowy]</w:t>"));
  }

  const doc = new window.Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: "[", end: "]" },
    nullGetter: () => ""
  });

  doc.render(buildTemplateData(templateKey, ctx));

  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
}

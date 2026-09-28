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

// Liczba dób między datami "YYYY-MM-DD" (UTC, żeby zmiana czasu nie
// przesuwała wyniku) — ta sama zasada co kalkulator na stronie głównej.
export function countRentalDays(isoFrom, isoTo) {
  if (!isoFrom || !isoTo) return 0;
  const [y1, m1, d1] = isoFrom.split("-").map(Number);
  const [y2, m2, d2] = isoTo.split("-").map(Number);
  const days = Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
  return days > 0 ? days : 0;
}

// [stawka dobowa] = czynsz / liczba dób, zaokrąglone do grosza, format PL
// ("183,33"). Pusty tekst, gdy brakuje czynszu albo okres jest niepoprawny.
export function computeDailyRate(rentAmount, isoFrom, isoTo) {
  const rent = Number(rentAmount);
  const days = countRentalDays(isoFrom, isoTo);
  if (!rent || !days) return "";
  return (Math.round((rent / days) * 100) / 100).toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Podpowiedź czynszu z cennika strony głównej (fleetVehicles.pricingTiers) —
// TA SAMA zasada co kalkulator na stronie (client/src/lib/fleet-pricing.ts,
// tam TypeScript w bundle'u Vite, tu czysty JS panelu — przy zmianie zasad
// liczenia poprawić oba miejsca): zakres po minDays/maxDays, przy nakładaniu
// się wygrywa wyższe "od", otwarty zakres (30+) to cena miesięczna / 30.
export function suggestRentFromPricing(tiers, days) {
  const valid = (tiers || []).filter((t) => t.pricePln > 0);
  if (!valid.length || days <= 0) return null;
  const matching = valid.filter((t) => days >= t.minDays && (t.maxDays == null || days <= t.maxDays));
  const pool = matching.length ? matching : valid.filter((t) => t.minDays <= days);
  const tier = pool.length
    ? pool.reduce((a, b) => (b.minDays > a.minDays ? b : a))
    : valid.reduce((a, b) => (b.minDays < a.minDays ? b : a));
  // Cena miesięczna: sumę liczymy przed zaokrągleniem (30 dób = pełna
  // cena z cennika, a nie 30 × zaokrąglona stawka dobowa).
  const isMonthly = tier.maxDays == null;
  const total = isMonthly ? Math.round((tier.pricePln * days) / 30) : tier.pricePln * days;
  const dailyRate = isMonthly ? Math.round(tier.pricePln / 30) : tier.pricePln;
  return { tier, dailyRate, total };
}

// Dobiera pozycję cennika do pojazdu z bazy po modelu (np. pojazd "Toyota
// ProAce City" → "Toyota ProAce City (S)", a nie "Toyota ProAce (M)") —
// wygrywa najdłuższy tytuł cennika, którego nazwa bez "(S)/(M)/(L)" zawiera
// się w marce+modelu pojazdu.
export function matchPricingVehicle(fleetVehicles, vehicle) {
  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  const name = norm([vehicle?.make, vehicle?.model].filter(Boolean).join(" "));
  if (!name) return null;
  let best = null;
  let bestLen = 0;
  for (const fv of fleetVehicles) {
    const title = norm((fv.titlePl || "").replace(/\([^)]*\)/g, ""));
    const model = title.replace(/^toyota /, "");
    const hit = name.includes(title) ? title.length : name.includes(model) ? model.length : 0;
    if (hit > bestLen) {
      best = fv;
      bestLen = hit;
    }
  }
  return best;
}

// Tagi dostępne w KAŻDYM szablonie (niezależnie od typu umowy) — wgrany
// własny wzór może ich użyć w dowolnym miejscu. Patrz CONTRACT-TEMPLATES.md.
function commonTemplateData({ tenant, vehicle, form }) {
  return {
    // Aliasy nazwy firmy/modelu — różne wzory używają różnych nazw tagów.
    firma: tenant.name,
    "nazwa firmy": tenant.name,
    model: vehicle.model,
    "model samochodu": vehicle.model,
    kaucja: form.depositAmount,
    "stawka dobowa": form.dailyRate,
    "limit km": form.mileageLimitKm,
    wyjazd_zagraniczny: form.foreignTravel
  };
}

// Word przy pisaniu zamienia proste cudzysłowy na drukarskie („…”, “…”)
// i potrafi wstawić twardą spację, więc tag ["nazwa firmy"] we wgranym
// wzorze często nie jest znak w znak taki jak klucz danych. Porównujemy
// nazwy tagów po normalizacji: bez cudzysłowów, spacje/podkreślenia jako
// jedna spacja, bez wielkości liter ([nazwa_firmy] = ["Nazwa firmy"]).
function normalizeTagName(name) {
  return String(name)
    .replace(/["'„”“‟«»‘’‚]/g, "")
    .replace(/[\s_]+/g, " ")
    .trim()
    .toLowerCase();
}

// `unknownTags` (Set) zbiera tagi ze wzoru, dla których nie ma żadnych danych
// (literówka / inna nazwa niż w CONTRACT-TEMPLATES.md) — panel pokazuje je
// po wygenerowaniu umowy, zamiast cicho zostawiać puste pole.
function makeTolerantParser(unknownTags) {
  return (tag) => ({
    get(scope) {
      if (tag === ".") return scope;
      if (scope == null) return undefined;
      if (Object.prototype.hasOwnProperty.call(scope, tag)) return scope[tag];
      const wanted = normalizeTagName(tag);
      const key = Object.keys(scope).find((k) => normalizeTagName(k) === wanted);
      if (key === undefined) {
        unknownTags.add(tag);
        return undefined;
      }
      return scope[key];
    }
  });
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
// Zwraca { blob, unknownTags } — unknownTags to tagi ze wzoru bez danych.
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

  const unknownTags = new Set();
  const doc = new window.Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: "[", end: "]" },
    parser: makeTolerantParser(unknownTags),
    nullGetter: () => ""
  });

  doc.render({ ...commonTemplateData(ctx), ...buildTemplateData(templateKey, ctx) });

  const blob = doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
  return { blob, unknownTags: [...unknownTags] };
}

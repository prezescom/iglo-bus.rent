/**
 * Firebase Cloud Functions for the car rental app.
 *
 * Functions:
 *  1. sendProtocolEmail       — callable from the app, emails the signed PDF
 *     protocol to the tenant and the lessor.
 *  2. cleanupOldRentals       — scheduled daily, deletes photos/PDFs/Firestore
 *     docs for rentals closed more than 10 days ago.
 *  3. onApplicationCreated    — Firestore trigger, fires when a candidate
 *     submits the job form (iglo-bus.rent/praca): emails a confirmation to
 *     the candidate, notifies kontakt@iglo-bus.rent, and appends a row to
 *     the recruitment .xlsx in Storage.
 *  4. cleanupOldApplications  — scheduled daily, deletes job application
 *     docs older than 90 days.
 *
 * Setup required (see PANEL-NAJMU-SETUP.md):
 *   firebase functions:secrets:set ZOHO_PASS
 *   firebase deploy --only functions
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const path = require("path");
const ExcelJS = require("exceljs");

admin.initializeApp();

const REGION = "europe-west1";
const RETENTION_DAYS = 10;
const APPLICATION_RETENTION_DAYS = 90;
const LOGO_PATH = path.join(__dirname, "assets", "logo.png");
const LOGO_CID = "iglobuslogo";
const APPLICATIONS_XLSX_PATH = "recruitment/aplikacje.xlsx";

// Adres skrzynki Zoho, z której wysyłane są protokoły — to nie jest sekret
// (widoczny publicznie na stronie), więc trzyma się go wprost w kodzie.
const ZOHO_USER = "kontakt@iglo-bus.rent";

// Hasło do tej skrzynki — jedyna prawdziwa tajemnica, trzymana w Secret Manager.
const zohoPass = defineSecret("ZOHO_PASS");

function formatDateRRMMDD(timestamp) {
  const d = timestamp ? new Date(timestamp) : new Date();
  const rr = String(d.getFullYear() % 100).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${rr}${mm}${dd}`;
}

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: ZOHO_USER,
      pass: zohoPass.value(),
    },
  });
}

// Stopka wspólna dla wszystkich maili wysyłanych z kontakt@iglo-bus.rent
// (protokoły wydania/zwrotu pojazdu i potwierdzenie aplikacji o pracę) —
// jedno miejsce, żeby nie rozjeżdżały się przy zmianach.
function emailFooterText() {
  return `Pozdrawiam,
Jacek Małachowski

iglo-bus.rent | Wypożyczalnia samochodów mroźni i chłodni
+48 530 410 504
kontakt@iglo-bus.rent
www.iglo-bus.rent

Dostawa w całej Polsce • −20 °C do +20 °C • Rejestracja temperatury`;
}

function emailFooterHtml() {
  return `
    <div style="margin-top: 16px;">
      <p style="margin: 0;">Pozdrawiam,</p>
      <p style="margin: 0; font-weight: bold;">Jacek Małachowski</p>
      <p style="margin: 12px 0 0;">iglo-bus.rent | Wypożyczalnia samochodów mroźni i chłodni</p>
      <p style="margin: 0;">+48 530 410 504</p>
      <p style="margin: 0;">kontakt@iglo-bus.rent</p>
      <img src="cid:${LOGO_CID}" alt="IGLO-BUS.rent" width="110" style="display: block; margin: 14px 0;" />
      <p style="margin: 0 0 8px;"><a href="https://www.iglo-bus.rent" style="color: #1E5F8C; text-decoration: underline;">www.iglo-bus.rent</a></p>
      <hr style="border: none; border-top: 1px solid #999; width: 250px; margin: 0 0 8px; text-align: left;" />
      <p style="margin: 0; font-size: 9pt; color: #444;">Dostawa w całej Polsce • −20 °C do +20 °C • Rejestracja temperatury</p>
    </div>
  `;
}

/**
 * Callable function: emails the protocol PDF to tenant + lessor.
 * Called from app.js (sendProtocolEmail) after saving each protocol.
 */
exports.sendProtocolEmail = onCall(
  { region: REGION, secrets: [zohoPass] },
  async (request) => {
    const { rentalId, phase, pdfUrl, tenantEmail, lessorEmail, vehiclePlate, timestamp } = request.data;

    if (!pdfUrl || !tenantEmail || !lessorEmail) {
      throw new HttpsError(
        "invalid-argument",
        "Brakuje pdfUrl, tenantEmail lub lessorEmail."
      );
    }

    const subjectSuffix = `${vehiclePlate || rentalId} ${formatDateRRMMDD(timestamp)}`;
    const subject = phase === "wydanie"
      ? `Protokół wydania pojazdu — ${subjectSuffix}`
      : `Protokół zwrotu pojazdu — ${subjectSuffix}`;

    const phaseWord = phase === "wydanie" ? "wydania" : "zwrotu";
    const bodyText = `Szanowni Państwo,

W załączeniu protokół ${phaseWord} pojazdu.

${emailFooterText()}`;
    const bodyHtml = `
      <div style="font-family: Verdana, sans-serif; font-size: 10pt; color: #000;">
        <p>Szanowni Państwo,</p>
        <p>W załączeniu protokół ${phaseWord} pojazdu.</p>
        <p><a href="${pdfUrl}">Pobierz protokół PDF</a></p>
        ${emailFooterHtml()}
      </div>
    `;

    try {
      await getTransporter().sendMail({
        from: ZOHO_USER,
        to: [tenantEmail, lessorEmail],
        subject,
        text: bodyText,
        html: bodyHtml,
        attachments: [{ filename: "logo.png", path: LOGO_PATH, cid: LOGO_CID }],
      });
      return { success: true };
    } catch (err) {
      console.error("Błąd wysyłki maila:", err);
      throw new HttpsError("internal", "Nie udało się wysłać e-maila.");
    }
  }
);

/**
 * Scheduled function: runs once a day, deletes the bulky raw Storage files
 * (zdjęcia, podpis, schemat uszkodzeń) for any rental whose closedTimestamp
 * is older than 10 days — but keeps the protocol PDF (protokol.pdf) and the
 * Firestore rental document forever, so closed rentals stay permanently
 * visible/searchable in Historia with a working link to their protocol.
 * Rentals that are still open (status == "wydany", closedTimestamp == 0)
 * are never touched. A rental already cleaned up (photosCleanedUp == true)
 * is skipped on subsequent runs.
 */
exports.cleanupOldRentals = onSchedule(
  { schedule: "every day 03:00", timeZone: "Europe/Warsaw", region: REGION },
  async () => {
    const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

    const snapshot = await admin
      .firestore()
      .collection("rentals")
      .where("status", "==", "zwrocony")
      .where("closedTimestamp", "<", cutoff)
      .where("closedTimestamp", ">", 0)
      .get();

    const pending = snapshot.docs.filter((doc) => !doc.data().photosCleanedUp);

    if (pending.length === 0) {
      console.log("Brak wynajmów do wyczyszczenia.");
      return;
    }

    const bucket = admin.storage().bucket();

    for (const doc of pending) {
      const rentalId = doc.id;
      try {
        const [files] = await bucket.getFiles({ prefix: `rentals/${rentalId}/` });
        const filesToDelete = files.filter((f) => !f.name.endsWith("-protokol.pdf"));
        await Promise.all(filesToDelete.map((f) => f.delete()));
        await doc.ref.update({
          photosCleanedUp: true,
          handoverPhotoUrls: [],
          returnPhotoUrls: [],
          handoverSignatureUrl: "",
          returnSignatureUrl: "",
          handoverDamageMapUrl: "",
          returnDamageMapUrl: ""
        });
        console.log(`Wyczyszczono zdjęcia/podpisy wynajmu ${rentalId} (${filesToDelete.length} plików), protokoły zachowane.`);
      } catch (err) {
        console.error(`Błąd czyszczenia wynajmu ${rentalId}:`, err);
      }
    }
  }
);

// Etykiety PL dla wartości zapisywanych przez formularz (client/src/lib/applications.ts)
// — używane w mailu powiadomienia i w pliku Excel.
const EMPLOYMENT_STATUS_LABELS = {
  student: "Student",
  etat: "Pracownik etatowy",
  przedsiebiorca: "Przedsiębiorca",
  bezrobotny: "Bezrobotny",
  emeryt: "Emeryt",
};
const EMPLOYMENT_FORM_LABELS = {
  umowa_o_prace: "Umowa o pracę",
  zlecenie: "Umowa zlecenie",
  b2b: "Kontrakt B2B",
};
const START_AVAILABILITY_LABELS = {
  jutro: "Od jutra",
  nowy_miesiac: "Od nowego miesiąca",
  pozniej: "Później",
};

const APPLICATIONS_XLSX_HEADERS = [
  "Data zgłoszenia",
  "Stanowisko",
  "Imię",
  "Nazwisko",
  "Rok urodzenia",
  "Miejsce zamieszkania",
  "Województwo",
  "Telefon",
  "E-mail",
  "Status zawodowy",
  "Forma zatrudnienia",
  "Rok prawa jazdy kat. B",
  "Doświadczenie - auta dostawcze",
  "Doświadczenie - transport leków",
  "Niepełny etat OK",
  "Może zacząć",
  "Oczekiwania finansowe (netto/cały etat)",
];

/**
 * Dopisuje wiersz z nową aplikacją do wspólnego pliku
 * recruitment/aplikacje.xlsx w Firebase Storage — pobiera istniejący plik
 * (jeśli jest), dokleja wiersz i nadpisuje. Plik nie jest "żywym" arkuszem
 * (jak Google Sheets) — trzeba go pobrać na nowo, żeby zobaczyć zmiany.
 */
async function appendApplicationToExcel(app) {
  const bucket = admin.storage().bucket();
  const file = bucket.file(APPLICATIONS_XLSX_PATH);
  const workbook = new ExcelJS.Workbook();

  let worksheet;
  const [exists] = await file.exists();
  if (exists) {
    const [buffer] = await file.download();
    await workbook.xlsx.load(buffer);
    worksheet = workbook.getWorksheet("Aplikacje");
  }
  // Nagłówek nie zgadza się z aktualną listą kolumn (np. plik powstał przed
  // dodaniem nowego pola) — arkusz jest przebudowywany od zera zamiast
  // dopisywać kolumnę w złym miejscu. Traci to stare wiersze, ale to jedyny
  // bezpieczny sposób, żeby dane nie rozjechały się względem nagłówków.
  const currentHeaders = worksheet?.getRow(1)?.values?.slice(1) || [];
  const headersMatch =
    currentHeaders.length === APPLICATIONS_XLSX_HEADERS.length &&
    APPLICATIONS_XLSX_HEADERS.every((h, i) => currentHeaders[i] === h);
  if (!worksheet || !headersMatch) {
    if (worksheet) workbook.removeWorksheet(worksheet.id);
    worksheet = workbook.addWorksheet("Aplikacje");
    worksheet.addRow(APPLICATIONS_XLSX_HEADERS);
    worksheet.getRow(1).font = { bold: true };
  }

  worksheet.addRow([
    new Date(app.createdAt || Date.now()).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" }),
    app.position || "",
    app.firstName || "",
    app.lastName || "",
    app.birthYear || "",
    app.city || "",
    app.voivodeship || "",
    app.phone || "",
    app.email || "",
    EMPLOYMENT_STATUS_LABELS[app.employmentStatus] || app.employmentStatus || "",
    EMPLOYMENT_FORM_LABELS[app.employmentForm] || app.employmentForm || "",
    app.licenseYear || "",
    app.experienceDelivery ? "Tak" : "Nie",
    app.experienceMeds ? "Tak" : "Nie",
    app.partTimeOk ? "Tak" : "Nie",
    START_AVAILABILITY_LABELS[app.startAvailability] || app.startAvailability || "",
    app.salaryExpectation ? `${app.salaryExpectation} zł` : "",
  ]);

  const buffer = await workbook.xlsx.writeBuffer();
  await file.save(Buffer.from(buffer), {
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/**
 * Firestore trigger: odpala się przy każdym nowym zgłoszeniu z formularza
 * iglo-bus.rent/praca (kolekcja "applications", zapisywana wprost z
 * przeglądarki — patrz client/src/lib/applications.ts i firestore.rules).
 * Wysyła potwierdzenie do kandydata, powiadomienie na kontakt@iglo-bus.rent
 * i dopisuje wiersz do pliku Excel w Storage.
 */
exports.onApplicationCreated = onDocumentCreated(
  { document: "applications/{applicationId}", region: REGION, secrets: [zohoPass] },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const app = snap.data();

    if (!app.email) {
      console.error("Aplikacja bez adresu e-mail, pomijam wysyłkę:", event.params.applicationId);
      return;
    }

    const candidateName = `${app.firstName || ""} ${app.lastName || ""}`.trim();
    const transporter = getTransporter();

    // Treść potwierdzenia dla kandydata — ustalona dosłownie z klientem, ta
    // sama stopka co protokoły wydania/zwrotu pojazdu.
    const confirmationText = `Potwierdzamy przyjęcie aplikacji na stanowisko Kierowcy kat.B - transport leków. Zastrzegamy sobie prawo do skontaktowania się jedynie z wybranymi kandydatami.

${emailFooterText()}`;
    const confirmationHtml = `
      <div style="font-family: Verdana, sans-serif; font-size: 10pt; color: #000;">
        <p>Potwierdzamy przyjęcie aplikacji na stanowisko Kierowcy kat.B - transport leków. Zastrzegamy sobie prawo do skontaktowania się jedynie z wybranymi kandydatami.</p>
        ${emailFooterHtml()}
      </div>
    `;

    try {
      await transporter.sendMail({
        from: ZOHO_USER,
        to: app.email,
        subject: "Potwierdzenie przyjęcia aplikacji — Kierowca kat. B, transport leków",
        text: confirmationText,
        html: confirmationHtml,
        attachments: [{ filename: "logo.png", path: LOGO_PATH, cid: LOGO_CID }],
      });
    } catch (err) {
      console.error("Błąd wysyłki potwierdzenia do kandydata:", err);
    }

    const notificationText = [
      `Nowa aplikacja: ${app.position || "Kierowca kat. B - transport leków"}`,
      "",
      `Imię i nazwisko: ${candidateName}`,
      `Rok urodzenia: ${app.birthYear || ""}`,
      `Miejsce zamieszkania: ${app.city || ""}`,
      `Województwo: ${app.voivodeship || ""}`,
      `Telefon: ${app.phone || ""}`,
      `E-mail: ${app.email}`,
      `Status zawodowy: ${EMPLOYMENT_STATUS_LABELS[app.employmentStatus] || app.employmentStatus || ""}`,
      `Forma zatrudnienia: ${EMPLOYMENT_FORM_LABELS[app.employmentForm] || app.employmentForm || ""}`,
      `Rok prawa jazdy kat. B: ${app.licenseYear || ""}`,
      `Doświadczenie - auta dostawcze: ${app.experienceDelivery ? "Tak" : "Nie"}`,
      `Doświadczenie - transport leków: ${app.experienceMeds ? "Tak" : "Nie"}`,
      `Niepełny etat OK: ${app.partTimeOk ? "Tak" : "Nie"}`,
      `Może zacząć: ${START_AVAILABILITY_LABELS[app.startAvailability] || app.startAvailability || ""}`,
      `Oczekiwania finansowe: ${app.salaryExpectation ? `${app.salaryExpectation} zł netto` : ""}`,
    ].join("\n");

    try {
      await transporter.sendMail({
        from: ZOHO_USER,
        to: ZOHO_USER,
        subject: `Nowa aplikacja: ${candidateName} — Kierowca kat. B, transport leków`,
        text: notificationText,
      });
    } catch (err) {
      console.error("Błąd wysyłki powiadomienia o nowej aplikacji:", err);
    }

    try {
      await appendApplicationToExcel(app);
    } catch (err) {
      console.error("Błąd zapisu aplikacji do pliku Excel:", err);
    }
  }
);

/**
 * Scheduled function: raz dziennie usuwa z Firestore aplikacje o pracę
 * starsze niż 90 dni (RODO — ograniczenie retencji). Wiersz w pliku Excel
 * w Storage (recruitment/aplikacje.xlsx) zostaje jako trwały rejestr
 * rekrutacyjny, zgodnie z klauzulą zgody „również na potrzeby przyszłych
 * rekrutacji" w formularzu.
 */
exports.cleanupOldApplications = onSchedule(
  { schedule: "every day 03:30", timeZone: "Europe/Warsaw", region: REGION },
  async () => {
    const cutoff = Date.now() - APPLICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000;

    const snapshot = await admin
      .firestore()
      .collection("applications")
      .where("createdAt", "<", cutoff)
      .get();

    if (snapshot.empty) {
      console.log("Brak aplikacji do usunięcia.");
      return;
    }

    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Usunięto ${snapshot.size} aplikacji starszych niż ${APPLICATION_RETENTION_DAYS} dni.`);
  }
);

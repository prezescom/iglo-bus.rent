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
 *  5. setProtocolPassword     — callable, operator-only (request.auth from
 *     the panel). Generates a new random, unguessable link token for one
 *     phase (wydanie/zwrot) of one rental, hashes and stores the password
 *     the operator typed in against that token (client/public/panel-najmu/
 *     protokol/ links to it as .../protokol/#<token> — NOT the rentalId, so
 *     the URL itself carries no guessable information). Any previous token
 *     for that rental is invalidated in the same call, so handover and
 *     return always get their own, separate link.
 *  6. verifyProtocolPassword  — callable, PUBLIC (no panel login, no Basic
 *     Auth — this is the whole point). Checks a submitted password against
 *     the hash stored for that link token and, on success, mints a Firebase
 *     custom token scoped to that one rental via a "protocolAccess" claim
 *     (see firestore.rules / storage.rules).
 *  7. expireProtocolAccess    — callable, requires the tenant's own scoped
 *     custom token. Called by protokol.js right after saving each phase
 *     (handover or return) to immediately deactivate that phase's link token
 *     AND password, and revokes the tenant's Firebase refresh tokens so an
 *     already-issued session can't silently renew itself past that point —
 *     the next phase needs a brand new link + password set via
 *     setProtocolPassword.
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
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

admin.initializeApp();

const REGION = "europe-west1";
const RETENTION_DAYS = 10;
const APPLICATION_RETENTION_DAYS = 90;
const PROTOCOL_PASSWORD_MIN_LENGTH = 6;
const PROTOCOL_PASSWORD_MAX_ATTEMPTS = 8;
const PROTOCOL_PASSWORD_LOCK_MS = 15 * 60 * 1000;
const LOGO_PATH = path.join(__dirname, "assets", "logo.png");
const LOGO_CID = "iglobuslogo";
const APPLICATIONS_XLSX_PATH = "recruitment/aplikacje.xlsx";

// Adres skrzynki Zoho, z której wysyłane są protokoły — to nie jest sekret
// (widoczny publicznie na stronie), więc trzyma się go wprost w kodzie.
const ZOHO_USER = "kontakt@iglo-bus.rent";

// Hasło do tej skrzynki — jedyna prawdziwa tajemnica, trzymana w Secret Manager.
const zohoPass = defineSecret("ZOHO_PASS");

// Losowy, nieodgadnialny token do linku samoobsługowego protokołu — to ON
// (nie rentalId) trafia do URL-a (.../protokol/#<token>), więc sam link
// niczego o wynajmie nie zdradza i nie da się go odgadnąć znając nr
// rejestracyjny/datę. 21 bajtów losowości (168 bitów) zakodowane base64url.
function generateProtocolToken() {
  return crypto.randomBytes(21).toString("base64url");
}

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
 * Callable function (operator-only, request.auth wymagane — patrz
 * firestore.rules): tworzy NOWY, osobny link samoobsługowy dla jednej fazy
 * (wydanie albo zwrot) jednego wynajmu. Generuje losowy token (funkcja
 * generateProtocolToken powyżej), hashuje podane przez pracownika hasło i
 * zapisuje oba w protocolAccess/{token} — token, nie rentalId, jest kluczem
 * dokumentu i tym, co trafia do URL-a, więc sam link (bez hasła) niczego nie
 * zdradza. Poprzedni token tego wynajmu (jeśli był) jest od razu kasowany,
 * więc wydanie i zwrot zawsze mają swój OSOBNY link — stary automatycznie
 * przestaje działać, zanim jeszcze powstanie nowy.
 * Aktualny token/faza są też zapisywane na rentals/{rentalId}
 * (activeProtocolToken/activeProtocolPhase), żeby panel mógł pokazać/
 * skopiować bieżący link bez dodatkowego wywołania (patrz "Pokaż link" w
 * app.js) — same hasze pozostają wyłącznie w protocolAccess, nieczytelnym
 * dla klienta.
 */
exports.setProtocolPassword = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Wymagane zalogowanie do panelu.");
  }
  const { rentalId, password, phase } = request.data;
  if (!rentalId || typeof rentalId !== "string") {
    throw new HttpsError("invalid-argument", "Brakuje rentalId.");
  }
  if (phase !== "wydanie" && phase !== "zwrot") {
    throw new HttpsError("invalid-argument", "Brakuje poprawnej fazy (wydanie/zwrot).");
  }
  if (!password || typeof password !== "string" || password.length < PROTOCOL_PASSWORD_MIN_LENGTH) {
    throw new HttpsError("invalid-argument", `Hasło musi mieć co najmniej ${PROTOCOL_PASSWORD_MIN_LENGTH} znaków.`);
  }

  const rentalRef = admin.firestore().collection("rentals").doc(rentalId);
  const rentalSnap = await rentalRef.get();
  if (!rentalSnap.exists) {
    throw new HttpsError("not-found", "Nie znaleziono wynajmu o tym identyfikatorze.");
  }
  const previousToken = rentalSnap.data().activeProtocolToken || "";

  const token = generateProtocolToken();
  const passwordHash = await bcrypt.hash(password, 10);

  const writes = [
    admin.firestore().collection("protocolAccess").doc(token).set({
      rentalId,
      phase,
      passwordHash,
      createdAt: Date.now(),
      failedAttempts: 0,
      lockedUntil: 0
    }),
    rentalRef.update({ activeProtocolToken: token, activeProtocolPhase: phase })
  ];
  if (previousToken) {
    writes.push(admin.firestore().collection("protocolAccess").doc(previousToken).delete());
  }
  await Promise.all(writes);

  return { token };
});

/**
 * Callable function, PUBLICZNA (wywoływana z client/public/panel-najmu/
 * protokol/, bez Basic Auth i bez logowania operatorskiego): weryfikuje
 * hasło do jednego linku (token z URL-a, patrz setProtocolPassword) i w
 * razie zgodności wydaje Firebase custom token z claimem "protocolAccess" =
 * ID wynajmu, do którego ten link należy, ograniczającym dostęp WYŁĄCZNIE do
 * tego jednego dokumentu (patrz firestore.rules/storage.rules). Wydanie i
 * zwrot mają teraz OSOBNE tokeny/linki (patrz setProtocolPassword) — ten
 * sam token nigdy nie obsługuje obu faz.
 *
 * Prosty licznik nieudanych prób w Firestore (nie IP-based, bo to prosta
 * apka jednego operatora) blokuje dany link na 15 minut po 8 błędnych
 * próbach — wystarczające utrudnienie brute-force przy hasłach wpisywanych
 * ręcznie przez pracownika.
 */
exports.verifyProtocolPassword = onCall({ region: REGION }, async (request) => {
  const { token, password } = request.data;
  if (!token || typeof token !== "string" || !password || typeof password !== "string") {
    throw new HttpsError("invalid-argument", "Brakuje tokenu lub hasła.");
  }

  const accessRef = admin.firestore().collection("protocolAccess").doc(token);
  const snap = await accessRef.get();
  // Token nie istnieje (nigdy nie wydany, albo już wygasł po zapisaniu tej
  // fazy / nadpisaniu nowym linkiem) — osobny, jasny komunikat: to nie jest
  // "złe hasło", to nieaktualny link. Nie zdradza to nic o samym wynajmie,
  // bo token jest losowy i niepowiązany z rentalId w żaden odgadnialny sposób.
  if (!snap.exists) {
    throw new HttpsError("not-found", "Ten link jest nieprawidłowy lub już wygasł. Poproś wypożyczalnię o nowy.");
  }

  const access = snap.data();
  const genericError = () => new HttpsError("permission-denied", "Nieprawidłowe hasło.");
  const now = Date.now();
  if (access.lockedUntil && access.lockedUntil > now) {
    throw new HttpsError("resource-exhausted", "Zbyt wiele nieudanych prób. Spróbuj ponownie za kilka minut.");
  }

  const matches = await bcrypt.compare(password, access.passwordHash || "");
  if (!matches) {
    const failedAttempts = (access.failedAttempts || 0) + 1;
    const update = { failedAttempts };
    if (failedAttempts >= PROTOCOL_PASSWORD_MAX_ATTEMPTS) {
      update.lockedUntil = now + PROTOCOL_PASSWORD_LOCK_MS;
      update.failedAttempts = 0;
    }
    await accessRef.update(update);
    throw genericError();
  }

  await accessRef.update({ failedAttempts: 0, lockedUntil: 0 });

  const customToken = await admin.auth().createCustomToken(`protocol-${access.rentalId}`, {
    protocolAccess: access.rentalId,
    protocolAccessToken: token
  });
  return { customToken, rentalId: access.rentalId, phase: access.phase };
});

/**
 * Callable, wywoływana przez samego najemcę (protokol.js) zaraz po zapisaniu
 * KAŻDEJ fazy protokołu (wydania lub zwrotu) — dezaktywuje TEN JEDEN link
 * (usuwa protocolAccess/{token}, więc żadne hasło już do niego nie pasuje —
 * próba wejścia pod tym samym adresem daje "link nieprawidłowy lub wygasł",
 * a nie ekran hasła) i unieważnia odświeżanie sesji tego najemcy w Firebase
 * Auth (revokeRefreshTokens) — gdyby przeglądarka miała gdzieś zapamiętany
 * token dostępu, nie odnowi go już po wygaśnięciu. Kolejna faza (np. zwrot
 * po wydaniu) wymaga NOWEGO, osobnego linku + hasła, ustawionych ręcznie
 * przez pracownika w panelu ("Szkice protokołów" / lista aktywnych wynajmów
 * → "Ustaw nowe hasło"/"Ustaw hasło do samoobsługowego zwrotu" — patrz
 * setProtocolPassword powyżej).
 * Autoryzacja: wołający musi mieć custom token zawężony właśnie do tego
 * konkretnego linku (claimy protocolAccess/protocolAccessToken wydane przez
 * verifyProtocolPassword) — nie da się w ten sposób dezaktywować cudzego
 * protokołu ani cudzego linku.
 */
exports.expireProtocolAccess = onCall({ region: REGION }, async (request) => {
  const claims = request.auth && request.auth.token;
  const rentalId = claims && claims.protocolAccess;
  const token = claims && claims.protocolAccessToken;
  if (!rentalId || !token) {
    throw new HttpsError("permission-denied", "Brak uprawnień do tego protokołu.");
  }

  await admin.firestore().collection("protocolAccess").doc(token).delete();

  const rentalRef = admin.firestore().collection("rentals").doc(rentalId);
  const rentalSnap = await rentalRef.get();
  if (rentalSnap.exists && rentalSnap.data().activeProtocolToken === token) {
    await rentalRef.update({ activeProtocolToken: "", activeProtocolPhase: "" });
  }

  try {
    await admin.auth().revokeRefreshTokens(request.auth.uid);
  } catch (e) {
    // Najlepszy wysiłek — usunięcie tokenu dostępu powyżej i tak blokuje
    // każde KOLEJNE logowanie/zapytanie wymagające nowej weryfikacji hasła.
    console.error("Nie udało się unieważnić sesji najemcy:", e);
  }

  return { success: true };
});

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
        // Hasło/link do samoobsługowego protokołu (jeśli w ogóle był aktywny —
        // patrz activeProtocolToken w setProtocolPassword) nie ma już czego
        // chronić — wynajem jest zamknięty i wyczyszczony, link przestaje
        // mieć sens.
        const activeToken = doc.data().activeProtocolToken;
        await doc.ref.update({
          photosCleanedUp: true,
          handoverPhotoUrls: [],
          returnPhotoUrls: [],
          handoverSignatureUrl: "",
          returnSignatureUrl: "",
          handoverDamageMapUrl: "",
          returnDamageMapUrl: "",
          activeProtocolToken: "",
          activeProtocolPhase: ""
        });
        if (activeToken) {
          await admin.firestore().collection("protocolAccess").doc(activeToken).delete();
        }
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

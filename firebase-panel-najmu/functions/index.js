/**
 * Firebase Cloud Functions for the car rental app.
 *
 * Two functions:
 *  1. sendProtocolEmail  — callable from the app, emails the signed PDF
 *     protocol to the tenant and the lessor.
 *  2. cleanupOldRentals  — scheduled daily, deletes photos/PDFs/Firestore
 *     docs for rentals closed more than 10 days ago.
 *
 * Setup required (see PANEL-NAJMU-SETUP.md):
 *   firebase functions:secrets:set ZOHO_PASS
 *   firebase deploy --only functions
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const path = require("path");

admin.initializeApp();

const REGION = "europe-west1";
const RETENTION_DAYS = 10;
const LOGO_PATH = path.join(__dirname, "assets", "logo.png");
const LOGO_CID = "iglobuslogo";

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

Pozdrawiam,
Jacek Małachowski

iglo-bus.rent | Wypożyczalnia samochodów mroźni i chłodni
+48 530 410 504
kontakt@iglo-bus.rent
www.iglo-bus.rent

Dostawa w całej Polsce • −20 °C do +20 °C • Rejestracja temperatury`;
    const bodyHtml = `
      <div style="font-family: Verdana, sans-serif; font-size: 10pt; color: #000;">
        <p>Szanowni Państwo,</p>
        <p>W załączeniu protokół ${phaseWord} pojazdu.</p>
        <p><a href="${pdfUrl}">Pobierz protokół PDF</a></p>
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
 * Scheduled function: runs once a day, deletes Storage files and Firestore
 * documents for any rental whose closedTimestamp is older than 10 days.
 * Rentals that are still open (status == "wydany", closedTimestamp == 0)
 * are never touched.
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

    if (snapshot.empty) {
      console.log("Brak wynajmów do wyczyszczenia.");
      return;
    }

    const bucket = admin.storage().bucket();

    for (const doc of snapshot.docs) {
      const rentalId = doc.id;
      try {
        // Delete all files under rentals/{rentalId}/
        await bucket.deleteFiles({ prefix: `rentals/${rentalId}/` });
        // Delete the Firestore document itself
        await doc.ref.delete();
        console.log(`Wyczyszczono wynajem ${rentalId}`);
      } catch (err) {
        console.error(`Błąd czyszczenia wynajmu ${rentalId}:`, err);
      }
    }
  }
);

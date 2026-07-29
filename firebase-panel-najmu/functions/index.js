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

admin.initializeApp();

const REGION = "europe-west1";
const RETENTION_DAYS = 10;

// Adres skrzynki Zoho, z której wysyłane są protokoły — to nie jest sekret
// (widoczny publicznie na stronie), więc trzyma się go wprost w kodzie.
const ZOHO_USER = "biuro@iglo-bus.rent";

// Hasło do tej skrzynki — jedyna prawdziwa tajemnica, trzymana w Secret Manager.
const zohoPass = defineSecret("ZOHO_PASS");

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
    const { rentalId, phase, pdfUrl, tenantEmail, lessorEmail } = request.data;

    if (!pdfUrl || !tenantEmail || !lessorEmail) {
      throw new HttpsError(
        "invalid-argument",
        "Brakuje pdfUrl, tenantEmail lub lessorEmail."
      );
    }

    const subject = phase === "wydanie"
      ? `Protokół wydania pojazdu — ${rentalId}`
      : `Protokół zwrotu pojazdu — ${rentalId}`;

    const bodyText = phase === "wydanie"
      ? "W załączniku przesyłamy podpisany protokół wydania pojazdu."
      : "W załączniku przesyłamy podpisany protokół zwrotu pojazdu.";

    try {
      await getTransporter().sendMail({
        from: ZOHO_USER,
        to: [tenantEmail, lessorEmail],
        subject,
        text: bodyText,
        html: `<p>${bodyText}</p><p><a href="${pdfUrl}">Pobierz protokół PDF</a></p>`,
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

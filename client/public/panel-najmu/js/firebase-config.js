// Wklej tu konfigurację ze swojego projektu Firebase:
// Firebase Console → ⚙ Ustawienia projektu → Twoje aplikacje → SDK setup and configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCRghtIaGNJAoplm12SNAWQWQyJYKKTF1Y",
  authDomain: "iglo-bus.firebaseapp.com",
  projectId: "iglo-bus",
  storageBucket: "iglo-bus.firebasestorage.app",
  messagingSenderId: "410105237800",
  appId: "1:410105237800:web:8e1bac043d5f079cbc001d"
};

// Adres e-mail wynajmującego (Ciebie) — kopia każdego protokołu tu trafia.
export const LESSOR_EMAIL = "biuro@iglo-bus.rent";

// Region, w którym wdrożone są Cloud Functions (musi zgadzać się z functions/index.js)
export const FUNCTIONS_REGION = "europe-west1";

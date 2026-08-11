import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Ten sam projekt Firebase co panel-najmu (client/public/panel-najmu/js/firebase-config.js).
// apiKey Firebase nie jest sekretem — dostęp kontrolują reguły Firestore (firestore.rules),
// które publicznie udostępniają tylko opublikowane wpisy bloga.
const firebaseConfig = {
  apiKey: "AIzaSyCRghtIaGNJAoplm12SNAWQWQyJYKKTF1Y",
  authDomain: "iglo-bus.firebaseapp.com",
  projectId: "iglo-bus",
  storageBucket: "iglo-bus.firebasestorage.app",
  messagingSenderId: "410105237800",
  appId: "1:410105237800:web:8e1bac043d5f079cbc001d",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

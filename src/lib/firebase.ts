// Fil: src/lib/firebase.ts

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
// import { getAnalytics, isSupported, Analytics } from "firebase/analytics"; // Temporarily commented out

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDioR4sem2UtVTFBMbjDjFKfWnJ6kbUjL4",
  authDomain: "rellivery-fe6f8.firebaseapp.com",
  projectId: "rellivery-fe6f8",
  storageBucket: "rellivery-fe6f8.firebasestorage.app",
  messagingSenderId: "936317972049",
  appId: "1:936317972049:web:806ce356cefe8cde83d270",
  measurementId: "G-9MKCP83DJJ"
};

// Initialiser Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Få den eksisterende appen hvis den allerede er initialisert
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Initialiser Analytics kun hvis det støttes av nettleseren
// let analytics: Analytics | undefined; // Temporarily commented out
// if (typeof window !== 'undefined') { // Sjekk om vi er i nettlesermiljø
//   isSupported().then((supported) => {
//     if (supported) {
//       analytics = getAnalytics(app);
//       console.log("Firebase Analytics initialisert");
//     } else {
//       console.log("Firebase Analytics støttes ikke i denne nettleseren.");
//     }
//   }).catch(err => {
//     console.error("Feil ved initialisering av Firebase Analytics:", err);
//   });
// }

// const storage = getStorage(app); // Aktiver denne linjen hvis du bruker Firebase Storage

// Temporarily export without analytics
export { app, auth, db };
// export { app, auth, db, analytics }; // Original export

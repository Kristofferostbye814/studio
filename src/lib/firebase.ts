'use client'; // Beholder denne hvis noen deler av auth krever klientkontekst tidlig

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// Importer andre Firebase-tjenester du trenger, f.eks. Firestore:
// import { getFirestore, Firestore } from 'firebase/firestore';

// TODO: Erstatt dette med dine egne Firebase prosjektinnstillinger
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Valgfritt, for Analytics
};

let app: FirebaseApp;
let auth: Auth;
// let db: Firestore; // Hvis du bruker Firestore

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
// db = getFirestore(app); // Hvis du bruker Firestore

export { app, auth /*, db */ };

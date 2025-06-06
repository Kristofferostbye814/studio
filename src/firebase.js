// 1. Importer funksjonen for å initialisere appen
import { initializeApp } from "firebase/app";

// 2. Din unike Firebase-konfigurasjon
const firebaseConfig = {
  apiKey: "AIzaSyCJuQgO9xQvFkEZnfRDpcqYfCZpoKAAfLWI",
  authDomain: "relivery-simplified.firebaseapp.com",
  projectId: "relivery-simplified",
  storageDomain: "relivery-simplified.storage.appspot.com",
  messagingSenderId: "754302744194",
  appId: "1:754302744194:web:8c4f85935629d5cbca69b6"
};

// 3. Initialiser Firebase-appen med konfigurasjonen din
const app = initializeApp(firebaseConfig);

// 4. Eksporter den initialiserte appen
export default app;
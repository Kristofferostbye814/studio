
import { 
  Auth,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail // Importer sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './firebase'; // Importerer den initialiserte auth-instansen
import type { User } from '@/types';

function mapFirebaseUserToAppUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '', // Firebase email kan være null, appens type krever string
    name: firebaseUser.displayName || undefined,
    avatarUrl: firebaseUser.photoURL || undefined,
  };
}

export async function login(email: string, password?: string): Promise<User | null> {
  if (!password) {
    throw new Error("Passord er påkrevd for innlogging.");
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUserToAppUser(userCredential.user);
  } catch (error: any) {
    // Firebase kaster feil med `code` (f.eks. 'auth/user-not-found', 'auth/wrong-password')
    // Disse kan håndteres mer spesifikt i UI om ønskelig
    console.error("Firebase login error:", error.code, error.message);
    throw error; // Kaster videre slik at AuthContext/AuthForm kan håndtere det
  }
}

export async function signup(name: string, email: string, password?: string): Promise<User | null> {
  if (!password) {
    throw new Error("Passord er påkrevd for registrering.");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Oppdater brukerens profil med navn
    await updateProfile(userCredential.user, { displayName: name });
    
    // Firebase brukerobjektet oppdateres ikke umiddelbart med displayName etter updateProfile.
    // Vi returnerer et User-objekt med det navnet vi nettopp satte.
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
      name: name, // Bruk navnet som ble sendt inn
      avatarUrl: userCredential.user.photoURL || undefined, // photoURL settes typisk senere
    };
  } catch (error: any) {
    console.error("Firebase signup error:", error.code, error.message);
    throw error; // Kaster videre
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase logout error:", error);
    throw error;
  }
}

// Wrapper for onAuthStateChanged for å mappe FirebaseUser til User
export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(mapFirebaseUserToAppUser(firebaseUser));
    } else {
      callback(null);
    }
  });
}

// Funksjon for å hente den nåværende autentiserte brukeren synkront (kan være null ved oppstart)
export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser;
}

// Funksjon for å oppdatere brukerens passord
export async function updateUserPassword(newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    try {
      await firebaseUpdatePassword(user, newPassword);
    } catch (error: any) {
      console.error("Firebase updatePassword error:", error.code, error.message);
      // Firebase kan kaste 'auth/requires-recent-login'
      // Dette bør håndteres i UI ved å be brukeren logge inn på nytt.
      throw error;
    }
  } else {
    throw new Error("Bruker ikke logget inn.");
  }
}

// Funksjon for å sende e-post for tilbakestilling av passord
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Firebase sendPasswordResetEmail error:", error.code, error.message);
    // Firebase kan kaste 'auth/user-not-found', 'auth/invalid-email' etc.
    throw error;
  }
}

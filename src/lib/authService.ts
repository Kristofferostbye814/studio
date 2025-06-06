
import { 
  Auth,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile as firebaseUpdateProfile, // Renamed to avoid conflict
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './firebase'; 
import type { User } from '@/types';

function mapFirebaseUserToAppUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '', 
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
    console.error("Firebase login error:", error.code, error.message);
    throw error; 
  }
}

export async function signup(name: string, email: string, password?: string): Promise<User | null> {
  if (!password) {
    throw new Error("Passord er påkrevd for registrering.");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(userCredential.user, { displayName: name });
    
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
      name: name, 
      avatarUrl: userCredential.user.photoURL || undefined, 
    };
  } catch (error: any) {
    console.error("Firebase signup error:", error.code, error.message);
    throw error; 
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

export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(mapFirebaseUserToAppUser(firebaseUser));
    } else {
      callback(null);
    }
  });
}

export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser;
}

export async function updateUserPassword(newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    try {
      await firebaseUpdatePassword(user, newPassword);
    } catch (error: any) {
      console.error("Firebase updatePassword error:", error.code, error.message);
      throw error;
    }
  } else {
    throw new Error("Bruker ikke logget inn.");
  }
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Firebase sendPasswordResetEmail error:", error.code, error.message);
    throw error;
  }
}

// Ny funksjon for å oppdatere brukerprofil (navn, og senere avatarUrl)
export async function updateUserProfileData(data: { name?: string; avatarUrl?: string }): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    try {
      const profileUpdate: { displayName?: string; photoURL?: string } = {};
      if (data.name !== undefined) profileUpdate.displayName = data.name; // Tillat tom streng for å fjerne navn om ønskelig
      if (data.avatarUrl) profileUpdate.photoURL = data.avatarUrl;

      if (Object.keys(profileUpdate).length > 0) {
        await firebaseUpdateProfile(user, profileUpdate);
        // AuthContext sin onAuthStateChanged bør fange opp endringene
      }
    } catch (error: any) {
      console.error("Firebase updateUserProfileData error:", error.code, error.message);
      throw error;
    }
  } else {
    throw new Error("Bruker ikke logget inn for profil-oppdatering.");
  }
}

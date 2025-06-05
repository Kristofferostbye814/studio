
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types';
import { 
  login as apiLogin, 
  logout as apiLogout, 
  signup as apiSignup,
  onAuthStateChanged // Importerer den nye onAuthStateChanged fra authService
} from '@/lib/authService';
import { useRouter } from 'next/navigation';
import type { FirebaseError } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<User | null>;
  signup: (name: string, email: string, password?: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Starter som true til første auth state er kjent
  const router = useRouter();

  useEffect(() => {
    // Lytter på endringer i autentiseringstilstand fra Firebase
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false); // Auth-tilstand er nå kjent
    });

    // Rydder opp lytteren når komponenten unmountes
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await apiLogin(email, password);
      // setUser blir satt av onAuthStateChanged-lytteren
      if (loggedInUser) router.push('/dashboard');
      return loggedInUser;
    } catch (error: any) {
      setUser(null);
      // Kaster feilen videre slik at AuthForm kan vise en toast
      // Firebase-feil har ofte en 'code' property som kan brukes for mer spesifikke meldinger
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        throw new Error("Ugyldig e-post eller passord.");
      }
      throw error; 
    } finally {
      // setIsLoading(false); // isLoading settes nå primært av onAuthStateChanged
    }
  };

  const signup = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      const signedUpUser = await apiSignup(name, email, password);
      // setUser blir satt av onAuthStateChanged-lytteren
      if (signedUpUser) router.push('/dashboard');
      return signedUpUser;
    } catch (error: any) {
      setUser(null);
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error("Denne e-postadressen er allerede i bruk.");
      }
      throw error;
    } finally {
      // setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true); // Kan settes for umiddelbar UI-respons
    try {
        await apiLogout();
        // setUser(null) blir håndtert av onAuthStateChanged
        router.push('/login');
    } catch (error) {
        console.error("Logout failed:", error);
        // Håndter logout-feil om nødvendig, selv om det er sjeldent
    } finally {
        // setIsLoading(false) blir håndtert av onAuthStateChanged
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

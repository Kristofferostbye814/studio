'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types';
import { getAuthenticatedUser, login as apiLogin, logout as apiLogout, signup as apiSignup } from '@/lib/authService';
import { useRouter } from 'next/navigation';

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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authenticatedUser = getAuthenticatedUser();
    setUser(authenticatedUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await apiLogin(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        router.push('/dashboard');
        return loggedInUser;
      } else {
        // User not found or credentials incorrect
        setUser(null);
        throw new Error("Ugyldig e-post eller passord.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null); // Ensure user is null on failure
      throw error; // Re-throw to be caught by UI
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      const signedUpUser = await apiSignup(name, email, password);
      setUser(signedUpUser);
      if (signedUpUser) router.push('/dashboard');
      return signedUpUser;
    } catch (error) {
      console.error("Signup failed:", error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await apiLogout();
    setUser(null);
    router.push('/login');
    setIsLoading(false);
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

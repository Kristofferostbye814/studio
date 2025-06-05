// Fil: src/app/signup/page.tsx (eller tilsvarende for din registreringsside)
'use client'; // Viktig for Next.js App Router for å indikere at dette er en klientkomponent

import React, { useState } from 'react';
import { auth } from '@/lib/firebase'; // Importer auth fra din firebase.ts-fil
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Importer Link for navigering hvis du har andre sider, f.eks. en innloggingsside
// import Link from 'next/link'; 

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Forhindre standard skjemainnsending
    setError(null); // Nullstill tidligere feil
    setSuccessMessage(null); // Nullstill tidligere suksessmeldinger

    if (password.length < 6) {
      setError("Passordet må være minst 6 tegn langt.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Brukeren er nå registrert og logget inn
      const user = userCredential.user;
      console.log("Bruker registrert:", user);
      setSuccessMessage(`Bruker ${user.email} er registrert! Du kan nå logge inn.`);
      // Her kan du omdirigere brukeren, f.eks. til innloggingssiden eller en profilside
      // For eksempel, hvis du bruker Next.js router:
      // import { useRouter } from 'next/navigation';
      // const router = useRouter();
      // router.push('/login'); 
      setEmail(''); // Tøm feltene
      setPassword('');
    } catch (error: any) {
      console.error("Feil ved registrering:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError("Denne e-postadressen er allerede i bruk.");
      } else if (error.code === 'auth/invalid-email') {
        setError("Ugyldig e-postadresse.");
      } else {
        setError("En feil oppstod under registrering. Prøv igjen.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Opprett ny bruker</h1>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-postadresse
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="din@epost.no"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Passord
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Minst 6 tegn"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150"
          >
            Registrer bruker
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          Har du allerede en konto? 
          {/* <Link href="/login" className="text-blue-600 hover:underline">
            Logg inn her
          </Link> */}
          {/* TODO: Aktiver Link når innloggingssiden er klar */}
           <a href="/login" className="text-blue-600 hover:underline"> Logg inn her</a>
        </p>
      </div>
    </div>
  );
}

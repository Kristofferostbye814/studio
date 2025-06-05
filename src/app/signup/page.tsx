'use client';
import { AuthForm } from '@/components/auth/AuthForm';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);
  
  if (isLoading || (!isLoading && user)) {
    // Show a loading state or redirect
    return <div className="flex items-center justify-center min-h-screen"><p>Laster...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <AuthForm mode="signup" />

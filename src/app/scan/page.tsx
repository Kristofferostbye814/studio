'use client';

import { QrScannerComponent } from '@/components/scan/QrScannerComponent';
import { useAuth } from '@/contexts/AuthContext'; // Assuming auth might be needed
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ScanPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen"><p>Laster...</p></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <QrScannerComponent />
    </div>
  );
}

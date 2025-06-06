
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QrCode, Camera, Zap, CalendarDays, CheckCircle, XCircle, Loader2, VideoOff } from 'lucide-react';
import Image from 'next/image';
import type { RentalItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock function to simulate fetching item details from a QR code
const fetchItemByQrCode = async (qrCodeValue: string): Promise<RentalItem | null> => {
  console.log('Simulating fetch for QR code:', qrCodeValue);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  if (qrCodeValue === 'RELIVERY-123') {
    return {
      id: 'item-qr-123',
      name: 'Profesjonell Drone',
      description: 'DJI Mavic Pro drone med 4K kamera. Perfekt for profesjonelle videoopptak og inspeksjoner.',
      imageUrl: 'https://placehold.co/600x400.png',
      ownerId: 'owner-456',
      dailyRate: 350,
      hourlyRate: 75,
      availability: true,
      category: 'Elektronikk',
      qrCodeValue: 'RELIVERY-123',
      dataAiHint: "drone aerial"
    };
  }
  return null;
};

export function QrScannerComponent() {
  const [scannedItem, setScannedItem] = useState<RentalItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrValueInput, setQrValueInput] = useState('');
  const [showCameraFeed, setShowCameraFeed] = useState(false);
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startUserMedia = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Kamera ikke støttet',
          description: 'Nettleseren din støtter ikke kameratilgang.',
        });
        setHasCameraPermission(false);
        setIsCameraStarting(false);
        return;
      }

      setIsCameraStarting(true);
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Kameratilgang Avslått',
          description: 'Vennligst aktiver kameratilgang i nettleserinnstillingene. Forsikre deg om at du velger bakkameraet hvis mulig.',
        });
      } finally {
        setIsCameraStarting(false);
      }
    };

    if (showCameraFeed) {
      startUserMedia();
    } else {
      if (videoRef.current?.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setHasCameraPermission(null); // Reset permission status when camera is hidden
    }

    return () => { // Cleanup on unmount
      if (videoRef.current?.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCameraFeed, toast]);

  const handleSimulatedScan = async (value?: string) => {
    const codeToScan = value || qrValueInput || 'RELIVERY-123';
    if (!codeToScan) {
        toast({ title: "Ingen QR-kode", description: "Vennligst skriv inn en QR-kode verdi.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    setScannedItem(null);
    // setShowCameraFeed(false); // Don't hide camera on simulated scan
    try {
      const item = await fetchItemByQrCode(codeToScan);
      if (item) {
        setScannedItem(item);
        toast({ title: "Gjenstand Funnet!", description: item.name, variant: "default" });
      } else {
        toast({ title: "Gjenstand Ikke Funnet", description: "QR-koden matcher ingen gjenstander.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Feil ved skanning", description: "Noe gikk galt. Prøv igjen.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <QrCode className="mr-3 h-8 w-8 text-primary" /> Skann & Lei
          </CardTitle>
          <CardDescription>
            Skann en Relivery QR-kode for å se detaljer og leie en gjenstand. For demonstrasjon, bruk simuleringsknappen eller skriv inn "RELIVERY-123".
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setShowCameraFeed(prev => !prev)}
              size="lg"
              className="flex-1 font-headline"
              variant="outline"
              disabled={isCameraStarting}
            >
              {isCameraStarting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {!isCameraStarting && <Camera className="mr-2 h-5 w-5" />}
              {showCameraFeed ? 'Skjul Kamera' : 'Åpne Kamera'}
            </Button>
            <Button onClick={() => handleSimulatedScan()} size="lg" className="flex-1 font-headline" disabled={isLoading}>
              {isLoading && !qrValueInput ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
              Simuler Skann (RELIVERY-123)
            </Button>
          </div>

          {showCameraFeed && (
            <div className="bg-card border rounded-lg p-4 text-center mt-6">
              <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
              {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4 text-left">
                  <VideoOff className="h-5 w-5" />
                  <AlertTitle>Kameratilgang Nødvendig</AlertTitle>
                  <AlertDescription>
                    Fikk ikke tilgang til kamera. Vennligst sjekk tillatelser i nettleseren din og prøv igjen.
                  </AlertDescription>
                </Alert>
              )}
               {hasCameraPermission === true && (
                 <p className="text-sm text-muted-foreground mt-2">Pek kameraet mot en QR-kode.</p>
               )}
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-grow">
                <Label htmlFor="qrInput">Eller skriv inn QR-kode manuelt:</Label>
                <Input id="qrInput" value={qrValueInput} onChange={(e) => setQrValueInput(e.target.value)} placeholder="f.eks. RELIVERY-123" />
            </div>
            <Button onClick={() => handleSimulatedScan(qrValueInput)} disabled={isLoading || !qrValueInput}>
                {isLoading && qrValueInput ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null }
                Søk
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && !scannedItem && ( // Show loading only if no item is displayed yet
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Leter etter gjenstand...</p>
        </div>
      )}

      {scannedItem && (
        <Card className="shadow-xl animate-in fade-in-50">
          <CardHeader className="relative">
            <Image
              src={scannedItem.imageUrl}
              alt={scannedItem.name}
              width={600}
              height={400}
              className="rounded-t-lg object-cover w-full max-h-[400px]"
              data-ai-hint={scannedItem.dataAiHint || "rental item"}
            />
             {scannedItem.availability ?
                <Badge className="absolute top-4 right-4 bg-green-500 text-white"><CheckCircle className="mr-1 h-4 w-4" />Tilgjengelig</Badge> :
                <Badge variant="destructive" className="absolute top-4 right-4"><XCircle className="mr-1 h-4 w-4" />Utilgjengelig</Badge>
            }
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <CardTitle className="font-headline text-3xl">{scannedItem.name}</CardTitle>
            <CardDescription className="text-base">{scannedItem.description}</CardDescription>
            <div className="flex flex-wrap gap-4 text-sm">
              {scannedItem.dailyRate && <p className="font-medium"><span className="font-bold text-lg text-primary">{scannedItem.dailyRate},-</span> kr/dag</p>}
              {scannedItem.hourlyRate && <p className="font-medium"><span className="font-bold text-lg text-primary">{scannedItem.hourlyRate},-</span> kr/time</p>}
            </div>
            <p className="text-sm text-muted-foreground">Kategori: {scannedItem.category}</p>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full font-headline" disabled={!scannedItem.availability}>
              <CalendarDays className="mr-2 h-5 w-5" /> Start Leieforhold
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}


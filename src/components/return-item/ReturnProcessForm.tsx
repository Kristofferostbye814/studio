
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Camera, MapPin, CheckCircle, Loader2, Star, Video, VideoOff } from 'lucide-react';
import Image from 'next/image';
import type { RentalItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock function to fetch item details
const fetchItemDetails = async (itemId: string): Promise<RentalItem | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (itemId === 'item1') { // Assuming 'item1' is from ActivityTabs mock ongoing rental
    return { id: 'item1', name: 'Høytrykksspyler', description: 'Kraftig Kärcher høytrykksspyler', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'user2', dailyRate: 200, availability: true, location: 'Henteskap A3, Rema 1000 Nydalen', dataAiHint: "power washer tool" };
  }
  // Add other mock items as needed for testing different return scenarios
  if (itemId === 'item2') {
    return { id: 'item2', name: 'Verktøysett', description: 'Komplett verktøysett', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'user2', dailyRate: 150, availability: true, location: 'Serviceskranke, Byggmakker', dataAiHint: "tool kit" };
  }
  return null;
};

const returnSchema = z.object({
  conditionNotes: z.string().optional(),
  photoConfirmation: z.instanceof(File).optional().nullable().refine(file => file !== null && file !== undefined, {
    message: "Bildebekreftelse er påkrevd.",
  }),
  locationConfirmation: z.string().min(1, {message: "Registrering av ankomst er påkrevd."}), 
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().optional(),
});

type ReturnFormInputs = z.infer<typeof returnSchema>;

export function ReturnProcessForm({ itemId }: { itemId: string }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReturnFormInputs>({
    resolver: zodResolver(returnSchema),
  });

  const [item, setItem] = useState<RentalItem | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const watchedPhoto = watch('photoConfirmation');
  const { toast } = useToast();

  const [showCameraFeed, setShowCameraFeed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      setIsLoadingItem(true);
      const fetchedItem = await fetchItemDetails(itemId);
      setItem(fetchedItem);
      setIsLoadingItem(false);
    };
    loadItem();
  }, [itemId]);

  useEffect(() => {
    if (watchedPhoto instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(watchedPhoto);
    } else if (typeof watchedPhoto === 'string') { // Should not happen with File instance
      setPhotoPreview(watchedPhoto);
    } else {
      setPhotoPreview(null);
    }
  }, [watchedPhoto]);


  useEffect(() => {
    let stream: MediaStream | null = null;
    const startUserMedia = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast({ variant: 'destructive', title: 'Kamera ikke støttet', description: 'Nettleseren din støtter ikke kameratilgang.' });
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
        console.error('Error accessing camera for return:', error);
        setHasCameraPermission(false);
        toast({ variant: 'destructive', title: 'Kameratilgang Avslått', description: 'Vennligst aktiver kameratilgang.' });
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
      setHasCameraPermission(null);
    }
    return () => {
      if (videoRef.current?.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCameraFeed, toast]);

  const handleSnapPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `returbilde-${itemId}.png`, { type: 'image/png' });
            setValue('photoConfirmation', file, { shouldValidate: true });
            setShowCameraFeed(false); // Hide camera after taking photo
            toast({ title: "Bilde tatt!", description: "Bildet er lagt til i returskjemaet."});
          }
        }, 'image/png');
      }
    }
  };

  const handleLocationCheckin = () => {
    setValue('locationConfirmation', `Registrert på: ${item?.location || 'Anvist retursted på gjenvinningsstasjonen'} kl. ${new Date().toLocaleTimeString()}`, {shouldValidate: true});
    toast({ title: "Ankomst Registrert", description: "Din ankomst er bekreftet (simulert)." });
  };

  const onSubmit: SubmitHandler<ReturnFormInputs> = async (data) => {
    setIsSubmitting(true);
    console.log('Return data:', data, 'for item:', item?.name);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Retur Registrert & Abonnement Avsluttet!",
      description: `${item?.name} er markert som returnert. Takk!`,
      action: <CheckCircle className="text-green-500" />,
    });
    setIsSubmitting(false);
    // TODO: Redirect or update UI, e.g. to /dashboard
  };
  
  const StarRating = ({ fieldName }: { fieldName: "rating" }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const currentRating = watch(fieldName) || 0;
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer h-7 w-7 transition-colors ${
              (hoverRating || currentRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
            }`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setValue(fieldName, star, { shouldValidate: true })}
          />
        ))}
      </div>
    );
  };

  if (isLoadingItem) {
    return <div className="flex justify-center items-center py-10"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg">Laster gjenstandsdetaljer...</p></div>;
  }

  if (!item) {
    return <Card><CardContent><p className="text-destructive text-center py-10">Kunne ikke finne gjenstanden for retur.</p></CardContent></Card>;
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Returner: {item.name}</CardTitle>
        {item.imageUrl && <Image src={item.imageUrl} alt={item.name} width={400} height={250} className="rounded-md object-cover my-4" data-ai-hint={item.dataAiHint || "rental item"} />}
        <CardDescription>Følg stegene nedenfor for å fullføre returen og avslutte leieforholdet. Dette må gjøres på gjenvinningsstasjonen.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>1. Bekreft ankomst til retursted</Label>
            {item.location && <p className="text-sm text-muted-foreground">Avtalt retursted: <strong>{item.location}</strong></p>}
            <Button type="button" variant="outline" onClick={handleLocationCheckin} className="w-full">
              <MapPin className="mr-2 h-4 w-4" /> Registrer Ankomst (Simulert)
            </Button>
            {watch('locationConfirmation') && <p className="text-sm text-green-600 mt-1">{watch('locationConfirmation')}</p>}
            {errors.locationConfirmation && <p className="text-sm text-destructive">{errors.locationConfirmation.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoConfirmationInput">2. Bildebevis av gjenstand på anvist plass</Label>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCameraFeed(prev => !prev)} className="flex-1" disabled={isCameraStarting}>
                    {isCameraStarting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Video className="mr-2 h-4 w-4"/>}
                    {showCameraFeed ? 'Skjul Kamera' : 'Åpne Kamera'}
                </Button>
                <Input 
                    id="photoConfirmationInput" 
                    type="file" 
                    accept="image/*" 
                    className="flex-1"
                    onChange={(e) => setValue('photoConfirmation', e.target.files?.[0] || null, {shouldValidate: true})} 
                />
            </div>
            {showCameraFeed && (
              <div className="bg-card border rounded-lg p-4 text-center mt-2">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden"></canvas>
                {hasCameraPermission === false && (
                  <Alert variant="destructive" className="mt-4 text-left">
                    <VideoOff className="h-5 w-5" />
                    <AlertTitle>Kameratilgang Nødvendig</AlertTitle>
                    <AlertDescription>
                      Fikk ikke tilgang til kamera. Vennligst sjekk tillatelser og prøv igjen, eller last opp en fil manuelt.
                    </AlertDescription>
                  </Alert>
                )}
                {hasCameraPermission === true && (
                    <Button type="button" onClick={handleSnapPhoto} className="mt-2 w-full">
                        <Camera className="mr-2 h-4 w-4"/> Ta Bilde & Bruk
                    </Button>
                )}
              </div>
            )}
            {photoPreview && <Image src={photoPreview} alt="Forhåndsvisning av bilde" width={200} height={150} className="mt-2 rounded-md object-cover" data-ai-hint="item condition" />}
            {errors.photoConfirmation && <p className="text-sm text-destructive">{errors.photoConfirmation.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditionNotes">3. Eventuelle merknader om tilstand (valgfritt)</Label>
            <Textarea id="conditionNotes" {...register('conditionNotes')} placeholder="F.eks. Normal slitasje, liten ripe på venstre side..." />
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <Label>4. Vurdering av leieobjektet (valgfritt)</Label>
            <StarRating fieldName="rating" />
            {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">5. Tilbakemelding til eier (valgfritt)</Label>
            <Textarea id="feedback" {...register('feedback')} placeholder="Var alt som forventet? Noe eier bør vite?" />
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-headline" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Fullfør Retur & Avslutt Leieforhold
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}



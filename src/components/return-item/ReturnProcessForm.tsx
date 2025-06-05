'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Camera, MapPin, CheckCircle, Loader2, Info, MessageSquare, Star } from 'lucide-react';
import Image from 'next/image';
import type { RentalItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock function to fetch item details
const fetchItemDetails = async (itemId: string): Promise<RentalItem | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (itemId === 'item1') { // Assuming 'item1' is from ActivityTabs mock ongoing rental
    return { id: 'item1', name: 'Høytrykksspyler', description: 'Kraftig Kärcher høytrykksspyler', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'user2', dailyRate: 200, availability: true, location: 'Henteskap A3, Rema 1000 Nydalen', dataAiHint: "power washer tool" };
  }
  return null;
};

const returnSchema = z.object({
  conditionNotes: z.string().optional(),
  photoConfirmation: z.instanceof(File).optional().nullable(),
  locationConfirmation: z.string().optional(), // Could be a more complex object if using actual GPS
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
    if (watchedPhoto) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(watchedPhoto);
    } else {
      setPhotoPreview(null);
    }
  }, [watchedPhoto]);

  const handleLocationCheckin = () => {
    // Simulate location check-in
    setValue('locationConfirmation', `Registrert på: ${item?.location || 'Avtalt sted'} kl. ${new Date().toLocaleTimeString()}`);
    toast({ title: "Lokasjon Registrert", description: "Din posisjon er bekreftet (simulert)." });
  };

  const onSubmit: SubmitHandler<ReturnFormInputs> = async (data) => {
    setIsSubmitting(true);
    console.log('Return data:', data, 'for item:', item?.name);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Retur Registrert!",
      description: `${item?.name} er markert som returnert. Takk!`,
      action: <CheckCircle className="text-green-500" />,
    });
    // Potentially redirect user or update UI (e.g., to dashboard)
    setIsSubmitting(false);
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
        <Image src={item.imageUrl} alt={item.name} width={400} height={250} className="rounded-md object-cover my-4" data-ai-hint={item.dataAiHint || "rental item"} />
        <CardDescription>Følg stegene nedenfor for å fullføre returen.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="conditionNotes">Eventuelle merknader om tilstand</Label>
            <Textarea id="conditionNotes" {...register('conditionNotes')} placeholder="F.eks. Normal slitasje, liten ripe på venstre side..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoConfirmation">Bildebekreftelse av gjenstand</Label>
            <Input id="photoConfirmation" type="file" accept="image/*" 
                onChange={(e) => setValue('photoConfirmation', e.target.files?.[0] || null, {shouldValidate: true})}
            />
            {photoPreview && <Image src={photoPreview} alt="Forhåndsvisning av bilde" width={200} height={150} className="mt-2 rounded-md object-cover" data-ai-hint="item condition" />}
            {errors.photoConfirmation && <p className="text-sm text-destructive">{errors.photoConfirmation.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Bekreftelse av retursted</Label>
            {item.location && <p className="text-sm text-muted-foreground">Avtalt retursted: <strong>{item.location}</strong></p>}
            <Button type="button" variant="outline" onClick={handleLocationCheckin} className="w-full">
              <MapPin className="mr-2 h-4 w-4" /> Registrer Ankomst (Simulert)
            </Button>
            {watch('locationConfirmation') && <p className="text-sm text-green-600 mt-1">{watch('locationConfirmation')}</p>}
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <Label>Gi en vurdering av leieobjektet (valgfritt)</Label>
            <StarRating fieldName="rating" />
            {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Tilbakemelding til eier (valgfritt)</Label>
            <Textarea id="feedback" {...register('feedback')} placeholder="Var alt som forventet? Noe eier bør vite?" />
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-headline" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Fullfør Retur
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
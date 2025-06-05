'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UploadCloud, Info, Wand2, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
// import { suggestCategoryAndDescription } from '@/ai/flows'; // Assuming this exists

// Mock AI function
const mockSuggestCategoryAndDescription = async (itemName: string, image?: File): Promise<{ category: string; description: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing
  return {
    category: itemName.toLowerCase().includes('verktøy') ? 'Verktøy' : (itemName.toLowerCase().includes('sykkel') ? 'Sport & Fritid' : 'Annet'),
    description: `Dette er en ${itemName.toLowerCase()} av god kvalitet, perfekt for dine behov. ${image ? `Bildet viser detaljer om ${itemName.toLowerCase()}.` : ''} Den er godt vedlikeholdt og klar til bruk.`,
  };
};


const listItemSchema = z.object({
  name: z.string().min(3, { message: 'Navn må være minst 3 tegn.' }),
  description: z.string().min(10, { message: 'Beskrivelse må være minst 10 tegn.' }),
  category: z.string().min(1, { message: 'Kategori er påkrevd.' }),
  imageFile: z.instanceof(File).optional().nullable(), // For new image upload
  imageUrl: z.string().optional(), // For existing image URL when editing
  hourlyRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().positive({ message: 'Timepris må være et positivt tall.' }).optional()
  ),
  dailyRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().positive({ message: 'Dagspris må være et positivt tall.' }).optional()
  ),
  availability: z.boolean().default(true),
}).refine(data => data.hourlyRate || data.dailyRate, {
  message: "Minst én pris (time/dag) må angis.",
  path: ["hourlyRate"], // Arbitrary path for error display
});

type ListItemFormInputs = z.infer<typeof listItemSchema>;

// Mock categories
const categories = ['Verktøy', 'Sport & Fritid', 'Elektronikk', 'Hjem & Hage', 'Festutstyr', 'Kjøretøy', 'Annet'];

export function ListItemForm({ itemIdToEdit }: { itemIdToEdit?: string }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ListItemFormInputs>({
    resolver: zodResolver(listItemSchema),
    defaultValues: {
      availability: true,
    }
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const watchedImageFile = watch('imageFile');
  const watchedName = watch('name');

  useEffect(() => {
    if (watchedImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(watchedImageFile);
    } else {
      // If editing and imageUrl exists, it should be set as preview initially
      // This logic needs to be added if editing functionality is fully implemented
    }
  }, [watchedImageFile]);
  
  // TODO: Add useEffect to fetch item data if itemIdToEdit is provided and populate form

  const handleAiSuggest = async () => {
    if (!watchedName && !watchedImageFile) {
      toast({ title: "Mangler input", description: "Skriv inn et navn eller last opp et bilde for AI-forslag.", variant: "destructive" });
      return;
    }
    setIsAiLoading(true);
    try {
      // const suggestions = await suggestCategoryAndDescription(watchedName, watchedImageFile || undefined);
      const suggestions = await mockSuggestCategoryAndDescription(watchedName, watchedImageFile || undefined);
      setValue('category', suggestions.category, { shouldValidate: true });
      setValue('description', suggestions.description, { shouldValidate: true });
      toast({ title: "AI Forslag Anvendt!", description: "Kategori og beskrivelse er oppdatert." });
    } catch (error) {
      toast({ title: "AI Feil", description: "Kunne ikke hente AI-forslag.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ListItemFormInputs> = async (data) => {
    setIsSubmitting(true);
    console.log('Form data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: itemIdToEdit ? "Gjenstand Oppdatert!" : "Gjenstand Listet!",
      description: `${data.name} er nå ${itemIdToEdit ? 'oppdatert' : 'tilgjengelig for utleie'}.`,
    });
    reset(); // Reset form after successful submission
    setImagePreview(null);
    setIsSubmitting(false);
    // Potentially redirect user or update UI
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center">
          <UploadCloud className="mr-3 h-8 w-8 text-primary" /> 
          {itemIdToEdit ? "Rediger Utleieobjekt" : "List Nytt Utleieobjekt"}
        </CardTitle>
        <CardDescription>
          {itemIdToEdit ? "Oppdater detaljene for ditt utleieobjekt." : "Del dine gjenstander med Relivery-fellesskapet. Fyll ut detaljene nedenfor."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Navn på gjenstand</Label>
            <Input id="name" {...register('name')} placeholder="F.eks. Høytrykksspyler Kärcher K5" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageFile">Bilde av gjenstand</Label>
            <div className="flex items-center gap-4">
                <label htmlFor="imageFile" className="flex-grow cursor-pointer border-2 border-dashed border-muted hover:border-primary rounded-md p-4 text-center transition-colors">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <span className="mt-2 block text-sm text-muted-foreground">Klikk for å laste opp bilde</span>
                    <Input id="imageFile" type="file" accept="image/*" className="sr-only"
                        onChange={(e) => setValue('imageFile', e.target.files?.[0] || null, {shouldValidate: true})}
                    />
                </label>
                {imagePreview && (
                    <div className="w-32 h-32 relative rounded-md overflow-hidden border">
                    <Image src={imagePreview} alt="Forhåndsvisning" layout="fill" objectFit="cover" data-ai-hint="product image" />
                    </div>
                )}
            </div>
            {errors.imageFile && <p className="text-sm text-destructive">{errors.imageFile.message}</p>}
          </div>

          <Button type="button" variant="outline" onClick={handleAiSuggest} disabled={isAiLoading} className="w-full">
            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Bruk AI for å foreslå kategori og beskrivelse
          </Button>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select onValueChange={(value) => setValue('category', value, { shouldValidate: true })} value={watch('category')}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Velg kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea id="description" {...register('description')} placeholder="Detaljert beskrivelse av gjenstanden, tilstand, eventuelt tilbehør..." rows={4} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Timepris (kr)</Label>
              <Input id="hourlyRate" type="number" {...register('hourlyRate')} placeholder="F.eks. 50" />
              {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyRate">Dagspris (kr)</Label>
              <Input id="dailyRate" type="number" {...register('dailyRate')} placeholder="F.eks. 250" />
              {errors.dailyRate && <p className="text-sm text-destructive">{errors.dailyRate.message}</p>}
            </div>
          </div>
          {errors.hourlyRate && errors.hourlyRate.message?.includes("Minst én pris") && (
             <p className="text-sm text-destructive col-span-full">{errors.hourlyRate.message}</p>
          )}


          <div className="flex items-center space-x-2">
            <Checkbox id="availability" {...register('availability')} checked={watch('availability')} onCheckedChange={(checked) => setValue('availability', !!checked)} />
            <Label htmlFor="availability" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Gjør tilgjengelig for utleie umiddelbart
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-headline" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {itemIdToEdit ? "Lagre Endringer" : "List Gjenstand"}
          </Button>
        </CardFooter>
      </form>
    </Card>
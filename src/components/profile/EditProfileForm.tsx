
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfileData } from '@/lib/authService';

const editProfileSchema = z.object({
  name: z.string().min(2, { message: 'Navn må være minst 2 tegn' }).max(50, { message: 'Navn kan ikke være lengre enn 50 tegn' }),
  email: z.string().email(), // Email is read-only, but included for form structure
});

type EditProfileFormInputs = z.infer<typeof editProfileSchema>;

export function EditProfileForm() {
  const { user } = useAuth(); // We'll need a way to trigger re-fetch or update context if not auto
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<EditProfileFormInputs>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({ // Use reset to update form values when user object changes
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);


  const onSubmit: SubmitHandler<EditProfileFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await updateUserProfileData({ name: data.name });
      toast({
        title: "Profil Oppdatert!",
        description: "Ditt navn har blitt endret.",
      });
      // The user object in AuthContext should update via onAuthStateChanged
      // If not, we might need a way to manually trigger a refresh of the user object in AuthContext
    } catch (error: any) {
      toast({
        title: "Feil ved profiloppdatering",
        description: error.message || "En ukjent feil oppstod.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Navn</Label>
        <Input
          id="name"
          type="text"
          {...register('name')}
          placeholder="Ditt fulle navn"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-post (kan ikke endres)</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          readOnly
          className="bg-muted/50 cursor-not-allowed"
        />
      </div>
      
      {/* Placeholder for avatar upload in the future */}
      {/*
      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Profilbilde URL (valgfritt)</Label>
        <Input
          id="avatarUrl"
          type="text"
          {...register('avatarUrl')}
          placeholder="https://example.com/path/to/your/image.png"
        />
        {errors.avatarUrl && <p className="text-sm text-destructive">{errors.avatarUrl.message}</p>}
      </div>
      */}

      <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Lagre Endringer
      </Button>
    </form>
  );
}

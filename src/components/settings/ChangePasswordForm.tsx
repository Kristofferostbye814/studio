'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { updateUserPassword } from '@/lib/authService'; // Importer den nye funksjonen
import type { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/navigation';

const changePasswordSchema = z.object({
  newPassword: z.string().min(6, { message: 'Nytt passord må være minst 6 tegn' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passordene stemmer ikke overens",
  path: ["confirmPassword"], // Angir hvilket felt feilmeldingen skal knyttes til
});

type ChangePasswordFormInputs = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordFormInputs>({
    resolver: zodResolver(changePasswordSchema),
  });

  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<ChangePasswordFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await updateUserPassword(data.newPassword);
      toast({
        title: "Passord Oppdatert!",
        description: "Ditt passord har blitt endret.",
      });
      reset(); // Tøm skjemaet etter vellykket endring
    } catch (error: any) {
      const firebaseError = error as FirebaseError;
      let errorMessage = "En feil oppstod under endring av passord.";
      if (firebaseError.code === 'auth/requires-recent-login') {
        errorMessage = "Denne handlingen krever nylig innlogging. Vennligst logg ut og inn igjen, og prøv på nytt.";
        // Vurder å omdirigere til login eller vise en modal for re-autentisering
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = "Passordet er for svakt. Velg et sterkere passord.";
      }
      toast({
        title: "Feil ved passordendring",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nytt Passord</Label>
        <Input
          id="newPassword"
          type="password"
          {...register('newPassword')}
          placeholder="••••••••"
        />
        {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Bekreft Nytt Passord</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          placeholder="••••••••"
        />
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Lagre Endringer
      </Button>
    </form>
  );
}

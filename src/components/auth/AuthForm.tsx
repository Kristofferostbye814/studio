
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { sendPasswordResetEmail } from '@/lib/authService'; // Importer den nye funksjonen

const loginSchema = z.object({
  email: z.string().email({ message: 'Ugyldig e-postadresse' }),
  password: z.string().min(1, { message: 'Passord er påkrevd' }), // Simplified for mock
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Navn må være minst 2 tegn' }),
  email: z.string().email({ message: 'Ugyldig e-postadresse' }),
  password: z.string().min(6, { message: 'Passord må være minst 6 tegn' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type SignupFormInputs = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === 'login';
  const schema = isLogin ? loginSchema : signupSchema;
  type FormInputs = typeof schema extends typeof loginSchema ? LoginFormInputs : SignupFormInputs;

  const { register, handleSubmit, formState: { errors }, getValues, trigger } = useForm<FormInputs>({
    resolver: zodResolver(schema),
  });

  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(data.email, (data as LoginFormInputs).password);
        toast({ title: "Vellykket innlogging!", description: "Velkommen tilbake." });
      } else {
        const { name, email, password } = data as SignupFormInputs;
        await signup(name, email, password);
        toast({ title: "Registrering vellykket!", description: "Velkommen til Relivery." });
      }
    } catch (error: any) {
      toast({
        title: "Feil",
        description: error.message || (isLogin ? "Innlogging feilet." : "Registrering feilet."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    // Valider e-postfeltet først
    const emailIsValid = await trigger("email");
    if (!emailIsValid) {
      toast({
        title: "E-post mangler",
        description: "Vennligst skriv inn din e-postadresse for å tilbakestille passordet.",
        variant: "destructive",
      });
      return;
    }

    const email = getValues("email");
    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(email);
      toast({
        title: "E-post for tilbakestilling sendt",
        description: `Hvis en konto med e-posten ${email} eksisterer, har vi sendt instruksjoner for tilbakestilling av passord. Sjekk din innboks (og spamfilter).`,
      });
    } catch (error: any) {
      // Vi viser en generisk melding selv om e-posten ikke finnes, for å unngå at brukere kan sjekke hvilke e-poster som er registrert.
      console.error("Password reset error:", error);
       toast({
        title: "E-post for tilbakestilling sendt",
        description: `Hvis en konto med e-posten ${email} eksisterer, har vi sendt instruksjoner for tilbakestilling av passord. Sjekk din innboks (og spamfilter).`,
      });
    } finally {
      setIsResettingPassword(false);
    }
  };


  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary">
          {isLogin ? 'Logg Inn' : 'Opprett Konto'}
        </CardTitle>
        <CardDescription>
          {isLogin ? 'Få tilgang til din Relivery-konto.' : 'Bli med i Relivery-fellesskapet i dag!'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Navn</Label>
              <Input id="name" type="text" {...register('name' as any)} placeholder="Ditt Navn" />
              {errors.name && <p className="text-sm text-destructive">{(errors.name as any).message}</p>}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input id="email" type="email" {...register('email')} placeholder="deg@eksempel.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Passord</Label>
              {isLogin && (
                <Button
                  type="button"
                  variant="link"
                  onClick={handlePasswordReset}
                  disabled={isResettingPassword}
                  className="p-0 h-auto text-sm"
                >
                  {isResettingPassword && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Glemt passord?
                </Button>
              )}
            </div>
            <Input id="password" type="password" {...register('password')} placeholder="••••••••" />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full font-headline" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? 'Logg Inn' : 'Opprett Konto'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? "Har du ikke konto? " : "Har du allerede en konto? "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href={isLogin ? '/signup' : '/login'}>
              {isLogin ? 'Opprett en her' : 'Logg inn her'}
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

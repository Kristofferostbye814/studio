'use client';

import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Innstillinger</h1>
        <p className="text-muted-foreground">
          Administrer dine konto-innstillinger.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Endre Passord</CardTitle>
          <CardDescription>
            Oppdater passordet for din konto. Velg et sterkt og unikt passord.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {/* Flere innstillingskort kan legges til her senere */}
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Profilinformasjon</CardTitle>
          <CardDescription>Oppdater din personlige informasjon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Kommer snart...</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Varslinger</CardTitle>
          <CardDescription>Administrer dine varslingspreferanser.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Kommer snart...</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}

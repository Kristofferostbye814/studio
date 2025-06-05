'use client';

// This component is part of a disabled feature (listing items for rent).
// It is kept to avoid build errors.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DisabledListItemForm() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Skjema Deaktivert</CardTitle>
        <CardDescription>
          Dette skjemaet for å legge til eller redigere utleieobjekter er for øyeblikket deaktivert.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">Vennligst sjekk tilbake senere eller kontakt support for mer informasjon.</p>
      </CardContent>
    </Card>
  );
}

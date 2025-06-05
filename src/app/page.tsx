import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, UploadCloud, Repeat, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 text-primary">
              Velkommen til Relivery
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-3xl mx-auto">
              Bli med på den sirkulære revolusjonen, helt enkelt! Hos Relivery tror vi på en fremtid hvor det å dele, leie og reparere er like naturlig som å kjøpe nytt.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="font-headline">
                <Link href="/signup">Opprett Konto</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="font-headline">
                <Link href="/dashboard">Utforsk Min Side</Link>
              </Button>
            </div>
            <div className="mt-12">
              <Image
                src="https://placehold.co/800x400.png"
                alt="Circular economy concept"
                width={800}
                height={400}
                className="rounded-lg shadow-xl mx-auto"
                data-ai-hint="circular economy community"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12 text-accent">
              Enklere tilgang, smartere forbruk
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<QrCode className="w-10 h-10 text-primary" />}
                title="Skann & Lei"
                description="Finn en Relivery QR-kode, skann med telefonen og lei på sekunder. Tilgang når du trenger det."
              />
              <FeatureCard
                icon={<UploadCloud className="w-10 h-10 text-primary" />}
                title="Del Dine Ressurser"
                description="Har du ting som samler støv? Legg dem ut for utleie, hjelp andre og tjen litt ekstra."
              />
              <FeatureCard
                icon={<Repeat className="w-10 h-10 text-primary" />}
                title="Enkle Returer"
                description="Smertefri returprosess. Følg enkle instruksjoner, bekreft med bilde, og du er ferdig!"
              />
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <Users className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-headline text-3xl md:text-4xl font-semibold mb-6 text-accent">
              Vår visjon: Sammen skaper vi en sirkulær fremtid!
            </h2>
            <p className="text-lg text-foreground/80 mb-8 max-w-3xl mx-auto">
              Hver gang du leier, låner eller reparerer gjennom Relivery, tar du et aktivt valg for en mer bærekraftig verden. Du bidrar til å forlenge levetiden til produkter, redusere avfall, og bygge et samfunn som verdsetter ressurser høyere.
            </p>
             <Image
                src="https://placehold.co/700x350.png"
                alt="Community working together"
                width={700}
                height={350}
                className="rounded-lg shadow-lg mx-auto"
                data-ai-hint="sustainability community"
              />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold mb-6 text-primary">
              Klar til å starte din sirkulære reise?
            </h2>
            <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
              Opprett en konto i dag eller logg deg inn for å utforske mulighetene. Fant en Relivery-gjenstand? Skann QR-koden!
            </p>
            <Button size="lg" asChild className="font-headline">
              <Link href="/signup">Bli Med Nå</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-gray-100 dark:bg-gray-800 border-t">
        <div className="container mx-auto px-4 text-center text-foreground/70">
          <p>&copy; {new Date().getFullYear()} Relivery Simplified. Alle rettigheter reservert.</p>
          <p className="text-sm mt-2">Sammen for en sirkulær fremtid!</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline text-2xl text-accent">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-foreground/70 text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

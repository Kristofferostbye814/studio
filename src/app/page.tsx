import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, UploadCloud, Repeat, Users, TrendingUp, ShieldCheck, Clock, ShoppingBag, Recycle, Gift } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        {/* Info Bar */}
        <section className="bg-primary text-primary-foreground py-3">
          <div className="container mx-auto px-4 text-center flex items-center justify-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>Åpent i dag: 10:00 - 17:00</span>
          </div>
        </section>

        {/* Hero Section (Simplified or placeholder, original content can be adapted/removed) */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4 text-primary">
              Velkommen til Relivery
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-3xl mx-auto">
              Bli med på den sirkulære revolusjonen, helt enkelt!
            </p>
          </div>
        </section>

        {/* Promo Cards Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <PromoCard
                icon={<ShoppingBag className="w-10 h-10" />}
                title="Butikker"
                variant="primary"
                href="/shops"
              />
              <PromoCard
                icon={<Users className="w-10 h-10" />}
                title="Aktivitetskalender"
                variant="default"
                href="/calendar"
              />
              <PromoCard
                icon={<Recycle className="w-10 h-10" />}
                title="Levere til ombruk"
                variant="default"
                href="/recycle"
              />
              <PromoCard
                icon={<Gift className="w-10 h-10" />}
                title="Gavekort"
                variant="default"
                href="/giftcards"
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

      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4 text-center text-foreground/70">
          <p>&copy; {new Date().getFullYear()} Relivery Simplified. Alle rettigheter reservert.</p>
          <p className="text-sm mt-2">Sammen for en sirkulær fremtid!</p>
        </div>
      </footer>
    </div>
  );
}

interface PromoCardProps {
  icon: React.ReactNode;
  title: string;
  variant: 'primary' | 'default';
  href: string;
}

function PromoCard({ icon, title, variant, href }: PromoCardProps) {
  const isPrimary = variant === 'primary';
  return (
    <Link href={href} passHref>
      <Card 
        className={cn(
          "text-center shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center p-6 aspect-[4/3] sm:aspect-square md:aspect-[4/3]",
          isPrimary ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-card text-card-foreground hover:bg-muted"
        )}
      >
        {isPrimary ? (
          <div className="mb-3">{icon}</div>
        ) : (
          <div className="mb-3 bg-primary text-primary-foreground p-3 rounded-full w-fit">
            {icon}
          </div>
        )}
        <p className={cn("font-semibold", isPrimary ? "text-primary-foreground" : "text-foreground")}>{title}</p>
      </Card>
    </Link>
  );
}

// Original FeatureCard, kept for reference or other uses, but not used in current promo layout
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

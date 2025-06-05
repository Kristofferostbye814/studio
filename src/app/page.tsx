import Image from 'next/image';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Logo } from '@/components/shared/Logo';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center py-12 md:py-20">
        <section className="container mx-auto px-4 text-center max-w-3xl">
          {/* Logo removed from here */}
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6 text-primary">
            Vi leier ut – sammen
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-6">
            Vi begynner med å gjenbruke det vi har, og bygger veien videre herfra.
            Når du leier hos oss, gir du nytt liv til produkter som fortsatt virker – og gir andre mulighet til å reparere, bruke og sirkulere videre.
          </p>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 font-semibold">
            Enkelt for deg. Bra for alle.
          </p>
          <p className="text-md text-foreground/70">
            Logg inn eller opprett en konto via knappene øverst for å komme i gang.
          </p>
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

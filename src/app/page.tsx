
import Image from 'next/image';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PackageSearch, QrCode, Zap, ThumbsUp } from 'lucide-react';
import { cn } from "@/lib/utils";


interface StepCardProps {
  icon: React.ReactNode;
  stepNumber: string;
  title: string;
  className?: string;
}

const StepCard: React.FC<StepCardProps> = ({ icon, stepNumber, title, className }) => {
  return (
    <div className={cn("flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <div className="relative mb-4">
        <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
          {stepNumber}
        </div>
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      </div>
      <h3 className="font-headline text-xl font-semibold mb-2 text-primary">{title}</h3>
    </div>
  );
};


export default function HomePage() {
  const steps = [
    {
      icon: <PackageSearch size={36} />,
      title: "Finn produktet",
    },
    {
      icon: <QrCode size={36} />,
      title: "Skann QR-koden",
    },
    {
      icon: <Zap size={36} />,
      title: "Aktiver leie",
    },
    {
      icon: <ThumbsUp size={36} />,
      title: "Ferdig – bruk det du trenger!",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <PublicHeader />
      <main className="flex-grow flex flex-col items-center justify-center py-12 md:py-20">
        <section className="container mx-auto px-4 text-center max-w-3xl mb-16">
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

        <section className="container mx-auto px-4 text-center mb-12 md:mb-20">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-10 text-primary">
            Så enkelt er det:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                icon={step.icon}
                stepNumber={(index + 1).toString()}
                title={step.title}
              />
            ))}
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

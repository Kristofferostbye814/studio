import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';

export function PublicHeader() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Logg Inn</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Opprett Konto</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
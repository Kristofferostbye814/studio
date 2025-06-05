// This layout is part of a disabled feature (listing items for rent).
// It is kept to avoid build errors.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Funksjon Deaktivert',
};

export default function DisabledListItemLayout({ children }: { children: React.ReactNode }) {
  // Using a very minimal layout for this disabled page.
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          {children}
        </main>
      </body>
    </html>
  );
}

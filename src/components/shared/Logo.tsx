import Link from 'next/link';
import { Recycle } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ className, iconSize = 28, textSize = "text-2xl" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Recycle size={iconSize} className="text-primary" />
      <span className={`font-headline font-semibold ${textSize} text-primary`}>Relivery</span>
    </Link>
  );
}

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RentalItem } from "@/types";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CalendarClock, CheckCircle, CircleOff, Edit3, Eye, Repeat, CalendarDays, DollarSign } from 'lucide-react'; // Added CalendarDays, DollarSign

interface RentalCardProps {
  item: RentalItem;
  rentalStatus?: 'ongoing' | 'available' | 'rented_out' | 'unavailable' | 'history';
  startDate?: string; // For ongoing rentals
  currentCost?: number; // For ongoing rentals
}

export function RentalCard({ item, rentalStatus, startDate, currentCost }: RentalCardProps) {
  const getStatusBadge = () => {
    switch (rentalStatus) {
      case 'ongoing':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Pågående leie</Badge>;
      case 'available':
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Tilgjengelig</Badge>;
      case 'rented_out':
        return <Badge variant="secondary">Utleid</Badge>;
      case 'unavailable':
        return <Badge variant="outline">Utilgjengelig</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={item.imageUrl || "https://placehold.co/400x300.png"}
          alt={item.name}
          width={400}
          height={225}
          className="object-cover w-full h-48"
          data-ai-hint={item.dataAiHint || "rental item"}
        />
        {rentalStatus && <div className="absolute top-2 right-2">{getStatusBadge()}</div>}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-1 truncate">{item.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden text-ellipsis">
          {item.description}
        </CardDescription>
        
        {rentalStatus === 'ongoing' && startDate && (
          <div className="space-y-1 text-sm mb-2">
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Leid siden: {new Date(startDate).toLocaleDateString()}</span>
            </div>
            {typeof currentCost === 'number' && (
              <div className="flex items-center text-foreground">
                <DollarSign className="mr-2 h-4 w-4 text-primary" />
                <span className="font-semibold">Påløpt kostnad: {currentCost},- kr</span>
              </div>
            )}
          </div>
        )}

        {rentalStatus !== 'ongoing' && (item.dailyRate || item.hourlyRate) && (
          <div className="flex justify-between items-center text-sm mb-2">
            {item.dailyRate && <p><span className="font-semibold">{item.dailyRate},-</span> kr/dag</p>}
            {item.hourlyRate && <p><span className="font-semibold">{item.hourlyRate},-</span> kr/time</p>}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        {rentalStatus === 'ongoing' && (
          <Button asChild className="w-full font-headline">
            <Link href={`/return-item/${item.id}`}>
              <Repeat className="mr-2 h-4 w-4" /> Returner & Avslutt Leie
            </Link>
          </Button>
        )}
        {rentalStatus === 'available' && (
           <Button variant="outline" asChild className="w-full font-headline">
             <Link href={`/list-item?edit=${item.id}`}> {/* This link will lead to a disabled page, which is fine for now */}
               <Edit3 className="mr-2 h-4 w-4" /> Administrer
             </Link>
           </Button>
        )}
        {rentalStatus === 'rented_out' && (
           <Button variant="outline" disabled className="w-full font-headline">
             <CalendarClock className="mr-2 h-4 w-4" /> Utleid
           </Button>
        )}
         {rentalStatus === 'unavailable' && (
           <Button variant="outline" disabled className="w-full font-headline">
             <CircleOff className="mr-2 h-4 w-4" /> Utilgjengelig
           </Button>
        )}
        {!rentalStatus && ( 
            <Button asChild className="w-full font-headline">
                <Link href={`/scan?item=${item.id}`}> 
                    <Eye className="mr-2 h-4 w-4" /> Vis & Lei
                </Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}

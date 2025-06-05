import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RentalItem } from "@/types";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CalendarClock, CheckCircle, CircleOff, Edit3, Eye, Repeat } from 'lucide-react';

interface RentalCardProps {
  item: RentalItem;
  rentalStatus?: 'ongoing' | 'available' | 'rented_out' | 'unavailable' | 'history';
}

export function RentalCard({ item, rentalStatus }: RentalCardProps) {
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
          height={225} // Aspect ratio 16:9
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
        <div className="flex justify-between items-center text-sm">
          {item.dailyRate && <p><span className="font-semibold">{item.dailyRate},-</span> kr/dag</p>}
          {item.hourlyRate && <p><span className="font-semibold">{item.hourlyRate},-</span> kr/time</p>}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {rentalStatus === 'ongoing' && (
          <Button asChild className="w-full font-headline">
            <Link href={`/return-item/${item.id}`}>
              <Repeat className="mr-2 h-4 w-4" /> Returner
            </Link>
          </Button>
        )}
        {rentalStatus === 'available' && (
           <Button variant="outline" asChild className="w-full font-headline">
             <Link href={`/list-item?edit=${item.id}`}>
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
        {!rentalStatus && ( // Generic view, e.g. search results
            <Button asChild className="w-full font-headline">
                <Link href={`/scan?item=${item.id}`}> {/* Simulate scanning this item */}
                    <Eye className="mr-2 h-4 w-4" /> Vis
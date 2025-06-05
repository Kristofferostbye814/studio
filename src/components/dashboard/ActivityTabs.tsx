
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RentalCard } from "./RentalCard";
import type { ActiveRental, ListedItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { PackageOpen, HandCoins, History, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card"; // Added import

// Mock Data
const mockOngoingRentals: ActiveRental[] = [
  { id: 'r1', itemId: 'item1', renterId: 'user1', startDate: '2023-10-01', itemDetails: { id: 'item1', name: 'Høytrykksspyler', description: 'Kraftig Kärcher høytrykksspyler', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'user2', dailyRate: 200, availability: true, dataAiHint: "power washer" } },
  { id: 'r2', itemId: 'item2', renterId: 'user1', startDate: '2023-10-05', itemDetails: { id: 'item2', name: 'Verktøysett', description: 'Komplett verktøysett for hjemmefiksere', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'user3', dailyRate: 150, availability: true, dataAiHint: "tool kit" } },
];

const mockMyListings: ListedItem[] = [
  { id: 'item3', name: 'Sykkelvogn', description: 'Praktisk sykkelvogn for barn', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'user1', dailyRate: 100, availability: true, currentRental: { id: 'cr1', itemId: 'item3', renterId: 'user4', startDate: '2023-10-03' }, dataAiHint: "bike trailer" },
  { id: 'item4', name: 'Partytelt', description: 'Stort partytelt 3x6 meter', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'user1', dailyRate: 300, availability: false, dataAiHint: "party tent" },
];

const mockRentalHistory: ActiveRental[] = [
    { id: 'rh1', itemId: 'item5', renterId: 'user1', startDate: '2023-09-01', endDate: '2023-09-05', totalCost: 800, itemDetails: { id: 'item5', name: 'Boremaskin', description: 'Bosch boremaskin', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'user6', dailyRate: 160, availability: true, dataAiHint: "drill machine"} },
];


export function ActivityTabs() {

  function EmptyState({ message }: { message: string }) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground text-lg">{message}</p>
        {message.includes("listet") && 
          <Button asChild className="mt-4 font-headline">
            <Link href="/list-item">List din første gjenstand</Link>
          </Button>
        }
        {message.includes("leier") && 
          <Button asChild className="mt-4 font-headline">
            <Link href="/scan">Skann & Lei</Link>
          </Button>
        }
      </div>
    );
  }

  return (
    <Tabs defaultValue="ongoing" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
        <TabsTrigger value="ongoing" className="font-headline">
            <PackageOpen className="mr-2 h-5 w-5" /> Ting Jeg Leier
        </TabsTrigger>
        <TabsTrigger value="listings" className="font-headline">
            <HandCoins className="mr-2 h-5 w-5" /> Ting Jeg Leier Ut
        </TabsTrigger>
        <TabsTrigger value="history" className="font-headline">
            <History className="mr-2 h-5 w-5" /> Historikk
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ongoing">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockOngoingRentals.length > 0 ? mockOngoingRentals.map(rental => (
            <RentalCard key={rental.id} item={rental.itemDetails!} rentalStatus="ongoing" />
          )) : <EmptyState message="Du leier ingen gjenstander for øyeblikket." />}
        </div>
      </TabsContent>
      <TabsContent value="listings">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockMyListings.length > 0 ? mockMyListings.map(item => (
            <RentalCard key={item.id} item={item} rentalStatus={item.currentRental ? 'rented_out' : (item.availability ? 'available' : 'unavailable')} />
          )) : <EmptyState message="Du har ingen gjenstander listet for utleie." />}
        </div>
      </TabsContent>
      <TabsContent value="history">
        <div className="space-y-6">
          {mockRentalHistory.length > 0 ? mockRentalHistory.map(rental => (
            <Card key={rental.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                   <Image src={rental.itemDetails?.imageUrl || "https://placehold.co/300x200.png"} alt={rental.itemDetails?.name || "Historisk leie"} width={200} height={150} className="h-48 w-full object-cover md:w-48" data-ai-hint={rental.itemDetails?.dataAiHint || "rented item"}/>
                </div>
                <div className="p-6 flex-grow">
                  <CardTitle className="font-headline text-xl mb-2">{rental.itemDetails?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-1">Leid fra: {new Date(rental.startDate).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground mb-1">Returnert: {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'Pågående'}</p>
                  <p className="text-sm text-muted-foreground mb-3">Totalpris: {rental.totalCost ? `${rental.totalCost},- kr` : 'N/A'}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><ThumbsUp className="mr-1 h-4 w-4" /> Gi Vurdering</Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/return-item/${rental.itemId}?history=true`}>
                            <History className="mr-1 h-4 w-4" /> Vis Detaljer
                        </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )) : <EmptyState message="Ingen tidligere leieforhold." />}
        </div>
      </TabsContent>
    </Tabs>
  );
}

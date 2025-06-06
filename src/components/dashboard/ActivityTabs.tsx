
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RentalCard } from "./RentalCard";
import type { ActiveRental } from "@/types";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { PackageOpen, History, ThumbsUp } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

// Mock Data
// Added totalCost to ongoing rentals to simulate accrued cost or rental fee
export const mockOngoingRentals: ActiveRental[] = [
  { id: 'r1', itemId: 'item1', renterId: 'user1', startDate: '2023-10-01', totalCost: 450, itemDetails: { id: 'item1', name: 'Høytrykksspyler', description: 'Kraftig Kärcher høytrykksspyler', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'station-owner', dailyRate: 200, availability: true, dataAiHint: "power washer" } },
  { id: 'r2', itemId: 'item2', renterId: 'user1', startDate: '2023-10-05', totalCost: 220, itemDetails: { id: 'item2', name: 'Verktøysett', description: 'Komplett verktøysett for hjemmefiksere', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'station-owner', dailyRate: 150, availability: true, dataAiHint: "tool kit" } },
];

const mockRentalHistory: ActiveRental[] = [
    { id: 'rh1', itemId: 'item5', renterId: 'user1', startDate: '2023-09-01', endDate: '2023-09-05', totalCost: 800, itemDetails: { id: 'item5', name: 'Boremaskin', description: 'Bosch boremaskin', imageUrl: 'https://placehold.co/300x200.png', ownerId: 'station-owner', dailyRate: 160, availability: true, dataAiHint: "drill machine"} },
];


export function ActivityTabs() {

  function EmptyState({ message }: { message: string }) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground text-lg">{message}</p>
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
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-6">
        <TabsTrigger value="ongoing" className="font-headline">
            <PackageOpen className="mr-2 h-5 w-5" /> Ting Jeg Leier
        </TabsTrigger>
        <TabsTrigger value="history" className="font-headline">
            <History className="mr-2 h-5 w-5" /> Historikk
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ongoing">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockOngoingRentals.length > 0 ? mockOngoingRentals.map(rental => (
            <RentalCard key={rental.id} item={rental.itemDetails!} rentalStatus="ongoing" startDate={rental.startDate} currentCost={rental.totalCost} />
          )) : <EmptyState message="Du leier ingen gjenstander for øyeblikket." />}
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

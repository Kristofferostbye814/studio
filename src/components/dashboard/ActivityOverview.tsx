'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, ListChecks, PackageOpen, QrCode, PlusCircle } from "lucide-react";
import type { User } from "@/types";

interface ActivityOverviewProps {
  user: User | null;
  activeRentalsCount: number;
  listedItemsCount: number;
  totalEarnings: number;
}

export function ActivityOverview({ user, activeRentalsCount, listedItemsCount, totalEarnings }: ActivityOverviewProps) {
  return (
    <div className="mb-8">
      <h2 className="font-headline text-2xl md:text-3xl font-semibold mb-2">
        Velkommen tilbake, <span className="text-primary">{user?.name?.split(' ')[0] || 'Bruker'}</span>!
      </h2>
      <p className="text-muted-foreground mb-6">Her er en rask oversikt over din Relivery-aktivitet.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Aktive Leieforhold" value={activeRentalsCount.toString()} icon={<PackageOpen className="h-6 w-6 text-primary" />} />
        <StatCard title="Dine Utleieobjekter" value={listedItemsCount.toString()} icon={<ListChecks className="h-6 w-6 text-primary" />} />
        <StatCard title="Total Inntjening" value={`${totalEarnings},- kr`} icon={<DollarSign className="h-6 w-6 text-primary" />} />
        <Card className="flex flex-col justify-center items-center p-6 bg-primary/5 hover:bg-primary/10 transition-colors">
            <CardTitle className="font-headline text-lg mb-2 text-center">Klar for mer?</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button asChild className="flex-1 font-headline">
                    <Link href="/scan"><QrCode className="mr-2 h-4 w-4"/>Skann & Lei</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 font-headline">
                    <Link href="/list-item"><PlusCircle className="mr-2 h-4 w-4"/>List Nytt</Link>
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

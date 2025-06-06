
'use client';

import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { UserCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Min Profil</h1>
        <p className="text-muted-foreground">
          Administrer din profilinformasjon.
        </p>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.avatarUrl} alt={user?.name || 'Bruker'} data-ai-hint="person avatar" />
          <AvatarFallback className="text-2xl">
            {user ? getInitials(user.name) : <UserCircle size={40}/>}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user?.name || 'Navn ikke satt'}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rediger Profil</CardTitle>
          <CardDescription>
            Oppdater ditt navn. E-postadressen kan ikke endres her.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfileForm />
        </CardContent>
      </Card>

      {/* Senere kan vi legge til flere kort, f.eks.:
      <Card>
        <CardHeader>
          <CardTitle>Endre Profilbilde</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Kommer snart...</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}

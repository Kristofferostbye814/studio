'use client';

import { ActivityTabs } from "@/components/dashboard/ActivityTabs";
import { ActivityOverview } from "@/components/dashboard/ActivityOverview";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for counts and earnings
const mockActiveRentalsCount = 2;
const mockTotalEarnings = 1250;

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <ActivityOverview 
        user={user}
        activeRentalsCount={mockActiveRentalsCount}
        totalEarnings={mockTotalEarnings}
      />
      <ActivityTabs />
    </div>
  );
}

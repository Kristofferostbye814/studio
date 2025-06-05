
'use client';

import { ActivityTabs } from "@/components/dashboard/ActivityTabs";
import { ActivityOverview } from "@/components/dashboard/ActivityOverview";
import { useAuth } from "@/contexts/AuthContext";
import { mockOngoingRentals } from "@/components/dashboard/ActivityTabs"; // Import mock data to get count

// Use length of mockOngoingRentals for activeRentalsCount
const mockActiveRentalsCount = mockOngoingRentals.length;
// const mockTotalEarnings = 1250; // Removed

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <ActivityOverview 
        user={user}
        activeRentalsCount={mockActiveRentalsCount}
        // totalEarnings={mockTotalEarnings} // Removed
      />
      <ActivityTabs />
    </div>
  );
}

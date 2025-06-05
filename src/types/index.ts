export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface RentalItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ownerId: string;
  hourlyRate?: number;
  dailyRate?: number;
  category?: string;
  availability: boolean;
  location?: string; // For return process
  qrCodeValue?: string; // For scanning
}

export interface ActiveRental {
  id: string;
  itemId: string;
  renterId: string;
  startDate: string;
  endDate?: string; // Null if ongoing
  totalCost?: number;
  itemDetails?: RentalItem; // Denormalized for easier display
}

export interface ListedItem extends RentalItem {
  rentalHistory?: ActiveRental[]; // History of rentals for this item
  currentRental?: ActiveRental; // If currently rented out
}

export interface Earnings {
  totalEarned: number;
  monthlyBreakdown: { month: string; amount: number }[];
}
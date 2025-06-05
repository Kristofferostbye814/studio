
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
  ownerId: string; // Should ideally be a station ID or similar if items belong to the station
  hourlyRate?: number;
  dailyRate?: number;
  category?: string;
  availability: boolean;
  location?: string; 
  qrCodeValue?: string; 
  dataAiHint?: string; 
}

export interface ActiveRental {
  id: string;
  itemId: string;
  renterId: string; // User's ID
  startDate: string;
  endDate?: string; 
  totalCost?: number; // Can be accrued cost for ongoing, or final cost for history
  itemDetails?: RentalItem; 
}

// This type might not be needed if users can't list items
// export interface ListedItem extends RentalItem {
//   rentalHistory?: ActiveRental[]; 
//   currentRental?: ActiveRental; 
// }

// This type is not relevant if customers are only renting
// export interface Earnings {
//   totalEarned: number;
//   monthlyBreakdown: { month: string; amount: number }[];
// }

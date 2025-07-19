export interface PickupRequest {
  id: string;
  date: string;
  quantity: number;
  status: 'Collected' | 'Pending' | 'Cancelled' | 'Scheduled';
  pointsEarned: number | null;
}
export interface PickupRequest {
  id: string;
  date: string;
  quantity: number;
  status: 'Collected' | 'Pending' | 'Canceled' | 'Scheduled';
  pointsEarned: number | null;
}
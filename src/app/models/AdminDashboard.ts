export interface MaterialBreakdown {
  materialName: string;
  precentage: number;
}

export interface WeeklyPickup {
  day: string;
  count: number;
}

export interface AdminDashboard {
  totalCustomers: number;
  allTimePointsGiven: number;
  todayPickups: number;
  totalWeightCollected: number;
  materialBreakdown: MaterialBreakdown[];
  weeklyPickups: WeeklyPickup[];
}
export interface PickupRequestDetails {
  id: number;
  employee: Employee;
  customer: Customer;
  requestedDate: string;
  scheduledDate: string;
  address: string;
  locationLat: string;
  locationLng: string;
  note: string;
  status: number;
  dateCollected: string;
  totalPointsGiven: number;
  pickupItems: PickupItem[];
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  address: string | null;
  phoneNumber: string;
  role: string | null;
  profilePictureUrl: string | null;
  totalPoints: number | null;
  createdAt: string | null;
}

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  address: string | null;
  phoneNumber: string;
  role: string | null;
  profilePictureUrl: string | null;
  totalPoints: number | null;
  createdAt: string | null;
}

export interface PickupItem {
  id: number;
  materialId: number;
  materialName: string;
  plannedQuantity: number;
  actualQuantity: number;
}
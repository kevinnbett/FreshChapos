
export interface DeliverySlot {
  date: Date;
  dayOfWeek: string;
  isAvailable: boolean;
  capacityUsed: number;
  maxCapacity: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  deliveryDate: Date;
  quantity: number; // in boxes
  totalPrice: number;
  customer: Customer;
}

export enum AppView {
  ORDERING = 'ORDERING',
  HISTORY = 'HISTORY',
  CONFIRMATION = 'CONFIRMATION'
}

export interface Vehicle {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  fuel: string;
  type: string;
  vin: string;
  color?: string;
  mileage?: number;
}

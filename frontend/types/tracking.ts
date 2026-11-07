export type ShipmentStatus =
  | "received"
  | "processing"
  | "in_transit"
  | "at_branch"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export type CountryPhase = "origin" | "destination" | "unknown";

export interface TrackingEvent {
  id: string;
  date: string; // ISO date-time
  status: ShipmentStatus;
  title: string;
  location: string;
  description: string;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: ShipmentStatus;
  receivedDate: string;
  estimatedDelivery: string;
  origin: string;
  destination: string;
  sender: string;
  recipient: string;
  service: string;
  progress: number;
  countryPhase?: CountryPhase;
  countryPhaseLabel?: string;
  packageCount?: number | null;
  events: TrackingEvent[];
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: string;
  hint: string;
}

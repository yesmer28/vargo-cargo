export type CountryPhase = 'origin' | 'destination' | 'unknown';

export interface ScrapedTrackingEvent {
  title: string;
  date: Date;
  rawDate: string;
}

export interface ScrapedTrackingResult {
  trackingNumber: string;
  carrierTrackingNumber?: string;
  internalReference?: string;
  receivedDate: Date | null;
  receivedTime?: string;
  weightLbs: number | null;
  packageCount: number | null;
  countryPhase: CountryPhase;
  countryPhaseLabel: string;
  recipient?: string;
  service?: string;
  events: ScrapedTrackingEvent[];
  scraperId: string;
}

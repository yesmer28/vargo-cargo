import { ScrapedTrackingResult } from '../types/scraped-tracking.types';

export interface TrackingScraper {
  readonly id: string;
  readonly name: string;
  canHandle(trackingNumber: string): boolean;
  scrape(trackingNumber: string): Promise<ScrapedTrackingResult>;
}

export const TRACKING_SCRAPER = Symbol('TRACKING_SCRAPER');

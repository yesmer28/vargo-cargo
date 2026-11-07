import { ScrapedTrackingResult } from '../types/scraped-tracking.types';
import { TrackingScraper } from './tracking-scraper.interface';

export abstract class BaseTrackingScraper implements TrackingScraper {
  abstract readonly id: string;
  abstract readonly name: string;

  abstract canHandle(trackingNumber: string): boolean;
  protected abstract fetchRawHtml(trackingNumber: string): Promise<string>;
  protected abstract parseHtml(
    html: string,
    trackingNumber: string,
  ): ScrapedTrackingResult;

  async scrape(trackingNumber: string): Promise<ScrapedTrackingResult> {
    const normalized = trackingNumber.trim().toUpperCase();
    const html = await this.fetchRawHtml(normalized);
    return this.parseHtml(html, normalized);
  }
}

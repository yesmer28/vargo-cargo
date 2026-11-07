import { Injectable } from '@nestjs/common';
import { TrackingScraper } from './tracking-scraper.interface';
import { CargoTrackScraper } from '../cargotrack/cargotrack.scraper';
import { VoladitoExpressScraper } from '../voladito/voladito.scraper';

@Injectable()
export class TrackingScraperRegistry {
  private readonly scrapers: TrackingScraper[];

  constructor(
    private readonly cargoTrackScraper: CargoTrackScraper,
    private readonly voladitoExpressScraper: VoladitoExpressScraper,
  ) {
    this.scrapers = [cargoTrackScraper, voladitoExpressScraper];
  }

  getFallbackChain(): TrackingScraper[] {
    return [...this.scrapers];
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { BaseTrackingScraper } from '../base/base-tracking.scraper';
import { PlaywrightService } from '../playwright.service';
import { parseCargoTrackHtml } from './cargotrack.parser';

const CARGOTRACK_TRACK_URL = 'https://everest.cargotrack.net/m/track.asp';

@Injectable()
export class CargoTrackScraper extends BaseTrackingScraper {
  readonly id = 'cargotrack';
  readonly name = 'CargoTrack (Everest)';

  private readonly logger = new Logger(CargoTrackScraper.name);

  constructor(private readonly playwrightService: PlaywrightService) {
    super();
  }

  canHandle(_trackingNumber: string): boolean {
    return true;
  }

  protected async fetchRawHtml(trackingNumber: string): Promise<string> {
    this.logger.log(`Consultando CargoTrack para ${trackingNumber}`);

    return this.playwrightService.fetchHtml(CARGOTRACK_TRACK_URL, {
      track: trackingNumber,
      action2: 'process',
    });
  }

  protected parseHtml(html: string, trackingNumber: string) {
    return parseCargoTrackHtml(html, trackingNumber);
  }
}

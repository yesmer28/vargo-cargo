import { Injectable, Logger } from '@nestjs/common';
import { BaseTrackingScraper } from '../base/base-tracking.scraper';
import { PlaywrightService } from '../playwright.service';
import { parseVoladitoExpressHtml } from './voladito.parser';

const VOLADITO_TRACK_URL = 'https://portalvolexpress.com/frmtrack.aspx';

@Injectable()
export class VoladitoExpressScraper extends BaseTrackingScraper {
  readonly id = 'voladito-express';
  readonly name = 'Voladito Express';

  private readonly logger = new Logger(VoladitoExpressScraper.name);

  constructor(private readonly playwrightService: PlaywrightService) {
    super();
  }

  canHandle(_trackingNumber: string): boolean {
    return true;
  }

  protected async fetchRawHtml(trackingNumber: string): Promise<string> {
    this.logger.log(`Consultando Voladito Express para ${trackingNumber}`);

    return this.playwrightService.fetchAspNetForm(VOLADITO_TRACK_URL, {
      txTracking: trackingNumber,
      btBuscar: 'Buscar',
    });
  }

  protected parseHtml(html: string, trackingNumber: string) {
    return parseVoladitoExpressHtml(html, trackingNumber);
  }
}

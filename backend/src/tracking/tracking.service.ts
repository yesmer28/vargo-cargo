import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TrackingScraperRegistry } from './scrapers/base/tracking-scraper.registry';
import { mapScrapedToTrackingInfo, TrackingInfoDto } from './mappers/tracking.mapper';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly scraperRegistry: TrackingScraperRegistry) {}

  async track(trackingNumber: string): Promise<TrackingInfoDto> {
    const normalized = trackingNumber.trim().toUpperCase();

    if (normalized.length < 6) {
      throw new NotFoundException(
        `No encontramos el código de rastreo: "${normalized}".`,
      );
    }

    const scrapers = this.scraperRegistry.getFallbackChain();
    let lastNotFound = false;

    for (const scraper of scrapers) {
      try {
        const scraped = await scraper.scrape(normalized);
        return mapScrapedToTrackingInfo(scraped);
      } catch (error) {
        if (error instanceof Error && error.message === 'TRACKING_NOT_FOUND') {
          lastNotFound = true;
          this.logger.debug(
            `Paquete ${normalized} no encontrado en ${scraper.id}, probando siguiente fuente`,
          );
          continue;
        }

        this.logger.error(
          `Error al rastrear ${normalized} con ${scraper.id}`,
          error instanceof Error ? error.stack : String(error),
        );

        throw new InternalServerErrorException(
          'No pudimos consultar el rastreo en este momento. Intente nuevamente en unos minutos.',
        );
      }
    }

    if (lastNotFound) {
      throw new NotFoundException(
        `No encontramos el código de rastreo: "${normalized}". Revise el código e intente nuevamente.`,
      );
    }

    throw new NotFoundException(
      `No encontramos el código de rastreo: "${normalized}". Revise el código e intente nuevamente.`,
    );
  }
}

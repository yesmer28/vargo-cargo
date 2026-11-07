import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { TrackingScraperRegistry } from './scrapers/base/tracking-scraper.registry';
import { CargoTrackScraper } from './scrapers/cargotrack/cargotrack.scraper';
import { VoladitoExpressScraper } from './scrapers/voladito/voladito.scraper';
import { PlaywrightService } from './scrapers/playwright.service';

@Module({
  imports: [AuthModule],
  controllers: [TrackingController],
  providers: [
    TrackingService,
    TrackingScraperRegistry,
    CargoTrackScraper,
    VoladitoExpressScraper,
    PlaywrightService,
  ],
})
export class TrackingModule {}

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TrackingService } from './tracking.service';

@Controller('tracking')
@UseGuards(JwtAuthGuard)
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':trackingNumber')
  track(@Param('trackingNumber') trackingNumber: string) {
    return this.trackingService.track(trackingNumber);
  }
}

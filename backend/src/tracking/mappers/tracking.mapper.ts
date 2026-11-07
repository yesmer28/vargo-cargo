import {
  CountryPhase,
  ScrapedTrackingEvent,
  ScrapedTrackingResult,
} from '../scrapers/types/scraped-tracking.types';

export type ShipmentStatus =
  | 'received'
  | 'processing'
  | 'in_transit'
  | 'at_branch'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception';

export interface TrackingEventDto {
  id: string;
  date: string;
  status: ShipmentStatus;
  title: string;
  location: string;
  description: string;
}

export interface TrackingInfoDto {
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
  countryPhase: CountryPhase;
  countryPhaseLabel: string;
  packageCount: number | null;
  events: TrackingEventDto[];
}

const ORIGIN_LABEL = 'Estados Unidos';
const DESTINATION_LABEL = 'Nicaragua';

export function mapScrapedToTrackingInfo(
  scraped: ScrapedTrackingResult,
): TrackingInfoDto {
  const events = scraped.events.map((event, index) =>
    mapEvent(event, scraped.countryPhase, index),
  );

  const status = resolveOverallStatus(events, scraped.countryPhase);
  const receivedDate =
    scraped.receivedDate?.toISOString() ??
    events.at(-1)?.date ??
    new Date().toISOString();

  const estimatedDelivery = estimateDelivery(receivedDate);

  return {
    trackingNumber: scraped.trackingNumber,
    status,
    receivedDate,
    estimatedDelivery,
    origin: ORIGIN_LABEL,
    destination: DESTINATION_LABEL,
    sender: '',
    recipient: scraped.recipient ?? '',
    service: scraped.service ?? 'Internacional',
    progress: progressFromStatus(status),
    countryPhase: scraped.countryPhase,
    countryPhaseLabel: scraped.countryPhaseLabel,
    packageCount: scraped.packageCount,
    events: events.reverse(),
  };
}

function mapEvent(
  event: ScrapedTrackingEvent,
  countryPhase: CountryPhase,
  index: number,
): TrackingEventDto {
  const status = mapEventStatus(event.title, countryPhase);
  const location = extractLocation(event.title, countryPhase);

  return {
    id: `evt-${index + 1}`,
    date: event.date.toISOString(),
    status,
    title: event.title,
    location,
    description: buildEventDescription(event.title, countryPhase),
  };
}

function mapEventStatus(
  title: string,
  countryPhase: CountryPhase,
): ShipmentStatus {
  const normalized = title.toLowerCase().trim();

  if (normalized === 'recibido') {
    return 'received';
  }

  if (normalized.includes('entregad')) {
    return 'delivered';
  }

  if (
    normalized.includes('liberándose de aduana') ||
    normalized.includes('liberandose de aduana')
  ) {
    return 'in_transit';
  }

  if (
    normalized.includes('ruta') ||
    normalized.includes('mensajero') ||
    normalized.includes('courier')
  ) {
    return 'out_for_delivery';
  }

  if (
    normalized.includes('oficina') ||
    normalized.includes('sucursal') ||
    normalized.includes('metrocentro') ||
    normalized.includes('branch')
  ) {
    return 'at_branch';
  }

  if (
    normalized.includes('transito') ||
    normalized.includes('vuelo') ||
    normalized.includes('aduana') ||
    normalized.includes('customs') ||
    normalized.includes('destino final') ||
    normalized.includes('enviado a destino')
  ) {
    return 'in_transit';
  }

  if (normalized.includes('entrega registrada')) {
    return 'at_branch';
  }

  if (normalized.includes('recibido')) {
    return countryPhase === 'destination' ? 'at_branch' : 'received';
  }

  return 'processing';
}

function extractLocation(title: string, countryPhase: CountryPhase): string {
  const officeMatch = title.match(/(?:oficina|sucursal)\s+(.+)/i);
  if (officeMatch?.[1]) {
    return officeMatch[1].trim();
  }

  if (countryPhase === 'destination') {
    return DESTINATION_LABEL;
  }

  if (countryPhase === 'origin') {
    return ORIGIN_LABEL;
  }

  return '';
}

function buildEventDescription(
  title: string,
  countryPhase: CountryPhase,
): string {
  if (countryPhase === 'origin') {
    return `${title} en el país de origen.`;
  }

  if (countryPhase === 'destination') {
    return `${title} en el país de destino.`;
  }

  return title;
}

function resolveOverallStatus(
  events: TrackingEventDto[],
  countryPhase: CountryPhase,
): ShipmentStatus {
  if (events.length > 0) {
    return events[0].status;
  }

  if (countryPhase === 'destination') {
    return 'in_transit';
  }

  if (countryPhase === 'origin') {
    return 'received';
  }

  return 'processing';
}

function progressFromStatus(status: ShipmentStatus): number {
  const progressMap: Record<ShipmentStatus, number> = {
    received: 20,
    processing: 35,
    in_transit: 55,
    at_branch: 75,
    out_for_delivery: 90,
    delivered: 100,
    exception: 40,
  };

  return progressMap[status];
}

function estimateDelivery(receivedDateIso: string): string {
  const received = new Date(receivedDateIso);
  received.setDate(received.getDate() + 7);
  return received.toISOString().slice(0, 10);
}

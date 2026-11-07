import * as cheerio from 'cheerio';
import { Element } from 'domhandler';
import {
  CountryPhase,
  ScrapedTrackingEvent,
  ScrapedTrackingResult,
} from '../types/scraped-tracking.types';

const NOT_FOUND_PATTERNS = [
  /no se encontr/i,
  /not found/i,
  /sin resultados/i,
  /invalid tracking/i,
];

export function parseCargoTrackHtml(
  html: string,
  trackingNumber: string,
): ScrapedTrackingResult {
  const $ = cheerio.load(html);
  const bodyText = normalizeText($('body').text());

  if (NOT_FOUND_PATTERNS.some((pattern) => pattern.test(bodyText))) {
    throw new Error('TRACKING_NOT_FOUND');
  }

  const countryPhaseLabel = extractCountryPhaseLabel($);
  const countryPhase = mapCountryPhase(countryPhaseLabel);
  const insertBlock = extractInsertBlockText($);
  const received = parseReceivedBlock(insertBlock);
  const carrierTrackingNumber = extractCarrierTrackingNumber($, insertBlock);
  const events = normalizeCargoTrackEvents(parseTrackingEvents($));

  if (!received.receivedDate && events.length === 0 && !insertBlock) {
    throw new Error('TRACKING_NOT_FOUND');
  }

  return {
    trackingNumber,
    carrierTrackingNumber,
    internalReference: received.internalReference,
    receivedDate: received.receivedDate,
    receivedTime: received.receivedTime,
    weightLbs: received.weightLbs,
    packageCount: received.packageCount,
    countryPhase,
    countryPhaseLabel,
    events,
    scraperId: 'cargotrack',
  };
}

function normalizeText(value: string): string {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractCountryPhaseLabel($: cheerio.CheerioAPI): string {
  let label = '';

  $('table.ntextbig tr').each((_, row) => {
    const text = normalizeText($(row).text());
    if (/pa[ií]s de (origen|destino)/i.test(text)) {
      label = text;
    }
  });

  return label;
}

function mapCountryPhase(label: string): CountryPhase {
  const normalized = label.toLowerCase();

  if (normalized.includes('origen')) {
    return 'origin';
  }

  if (normalized.includes('destino')) {
    return 'destination';
  }

  return 'unknown';
}

function extractInsertBlockText($: cheerio.CheerioAPI): string {
  const insertCell = $('table.insert td').first();
  return normalizeText(insertCell.text());
}

function parseReceivedBlock(text: string): {
  receivedDate: Date | null;
  receivedTime?: string;
  weightLbs: number | null;
  packageCount: number | null;
  internalReference?: string;
} {
  const receivedMatch = text.match(
    /Recibido el\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+a las\s+(\d{1,2}:\d{2}:\d{2}\s*(?:AM|PM))/i,
  );

  const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*lbs/i);
  const packageMatch = text.match(/(\d+)\s*bulto/i);
  const referenceMatch = text.match(/\b(\d{5,8})\b/);

  const receivedDate = receivedMatch
    ? parseCargoTrackDateTime(receivedMatch[1], receivedMatch[2])
    : null;

  return {
    receivedDate,
    receivedTime: receivedMatch?.[2],
    weightLbs: weightMatch ? Number(weightMatch[1]) : null,
    packageCount: packageMatch ? Number(packageMatch[1]) : null,
    internalReference: referenceMatch?.[1],
  };
}

function extractCarrierTrackingNumber(
  $: cheerio.CheerioAPI,
  insertBlock: string,
): string | undefined {
  const searchedBy = normalizeText(
    $('table.ntextbig tr')
      .first()
      .find('strong')
      .text(),
  );
  const searchedMatch = searchedBy.match(/Buscando por\s+(.+)/i);
  if (searchedMatch?.[1]) {
    return searchedMatch[1].trim();
  }

  const lines = insertBlock
    .split(/\s{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (/^\d+$/.test(line)) {
      continue;
    }

    if (/recibido|bulto|lbs/i.test(line)) {
      continue;
    }

    if (line.length >= 8) {
      return line;
    }
  }

  return undefined;
}

function parseTrackingEvents($: cheerio.CheerioAPI): ScrapedTrackingEvent[] {
  const events: ScrapedTrackingEvent[] = [];
  let inEventsSection = false;

  $('table').each((_, table) => {
    const header = normalizeText($(table).text());
    if (/Eventos de Seguimiento/i.test(header)) {
      inEventsSection = true;
      return;
    }

    if (!inEventsSection) {
      return;
    }

    $(table)
      .find('td.ntextrow')
      .each((_, cell) => {
        const event = parseEventCell($(cell));
        if (event) {
          events.push(event);
        }
      });
  });

  return events;
}

function parseEventCell($cell: cheerio.Cheerio<Element>): ScrapedTrackingEvent | null {
  const clone = $cell.clone();
  clone.find('span.ntext').remove();

  const title = normalizeText(clone.text());
  const rawDate = normalizeText($cell.find('span.ntext').text());

  if (!title || !rawDate) {
    return null;
  }

  const date = parseCargoTrackDateTime(rawDate);
  if (!date) {
    return null;
  }

  return { title, date, rawDate };
}

export function normalizeCargoTrackEvents(
  events: ScrapedTrackingEvent[],
): ScrapedTrackingEvent[] {
  return events
    .filter((event) => !shouldHideCargoTrackEvent(event.title))
    .map((event) => ({
      ...event,
      title: normalizeCargoTrackEventTitle(event.title),
    }));
}

function shouldHideCargoTrackEvent(title: string): boolean {
  const normalized = title.toLowerCase().trim();

  if (normalized === 'recibido') {
    return false;
  }

  return /oficina|metrocentro|sucursal|branch/.test(normalized);
}

function normalizeCargoTrackEventTitle(title: string): string {
  const normalized = title.trim().toLowerCase();

  if (normalized === 'delivered' || normalized === 'entregado') {
    return 'Liberándose de aduana';
  }

  return title.trim();
}

export function parseCargoTrackDateTime(
  datePart: string,
  timePart?: string,
): Date | null {
  const combined = timePart ? `${datePart} ${timePart}` : datePart;
  const match = combined.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i,
  );

  if (!match) {
    return null;
  }

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  let hours = match[4] ? Number(match[4]) : 0;
  const minutes = match[5] ? Number(match[5]) : 0;
  const seconds = match[6] ? Number(match[6]) : 0;
  const meridiem = match[7]?.toUpperCase();

  if (meridiem === 'PM' && hours < 12) {
    hours += 12;
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

import * as cheerio from 'cheerio';
import { Element } from 'domhandler';
import {
  CountryPhase,
  ScrapedTrackingEvent,
  ScrapedTrackingResult,
} from '../types/scraped-tracking.types';

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export function parseVoladitoExpressHtml(
  html: string,
  trackingNumber: string,
): ScrapedTrackingResult {
  const $ = cheerio.load(html);
  const packages = parseTable($, 'GridPaquetes');
  const movements = parseTable($, 'GridEntradaGeneral');

  if (packages.rows.length === 0 && movements.rows.length === 0) {
    throw new Error('TRACKING_NOT_FOUND');
  }

  const pkg = packages.rows[0] ?? {};
  const packageStatus = cleanText(pkg['Estado del Paquete']);
  const receivedDate = parseVoladitoDate(cleanText(pkg['Fecha Ingreso']));
  const weightRaw = cleanText(pkg['Peso']);
  const weightLbs = weightRaw ? Number(weightRaw.replace(/[^\d.]/g, '')) : null;
  const recipient = cleanText(pkg['Nombre Completo']);
  const service = cleanText(pkg['Envio']);
  const countryPhase = inferCountryPhase(packageStatus);

  const events: ScrapedTrackingEvent[] = [];

  for (const movement of movements.rows) {
    const event = buildMovementEvent(movement);
    if (event) {
      events.push(event);
    }
  }

  if (packageStatus && receivedDate) {
    events.push({
      title: packageStatus,
      date: receivedDate,
      rawDate: cleanText(pkg['Fecha Ingreso']),
    });
  } else if (packageStatus) {
    events.push({
      title: packageStatus,
      date: new Date(),
      rawDate: packageStatus,
    });
  }

  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    trackingNumber,
    carrierTrackingNumber: cleanText(pkg['Tracking']) || trackingNumber,
    internalReference: cleanText(pkg['Codigo Volid']),
    receivedDate,
    weightLbs: Number.isFinite(weightLbs) ? weightLbs : null,
    packageCount: packages.rows.length || null,
    countryPhase,
    countryPhaseLabel: packageStatus || inferCountryPhaseLabel(countryPhase),
    recipient,
    service,
    events,
    scraperId: 'voladito-express',
  };
}

function parseTable(
  $: cheerio.CheerioAPI,
  tableId: string,
): { headers: string[]; rows: Record<string, string>[] } {
  const table = $(`#${tableId}`);
  const headers = table
    .find('thead th, tr')
    .first()
    .find('th')
    .map((_, cell) => cleanText($(cell).text()))
    .get()
    .filter(Boolean);

  if (headers.length === 0) {
    return { headers: [], rows: [] };
  }

  const rows: Record<string, string>[] = [];

  table.find('tbody tr, tr').each((index, row) => {
    if (index === 0) {
      return;
    }

    const cells = $(row).find('td');
    if (cells.length === 0) {
      return;
    }

    if ($(row).hasClass('empty-row') || cells.length === 1) {
      const rowText = cleanText($(row).text()).toLowerCase();
      if (rowText.includes('no hay registros')) {
        return;
      }
    }

    const record: Record<string, string> = {};
    cells.each((cellIndex, cell) => {
      const header = headers[cellIndex];
      if (!header) {
        return;
      }

      record[header] = extractCellText($(cell));
    });

    if (Object.keys(record).length > 0) {
      rows.push(record);
    }
  });

  return { headers, rows };
}

function extractCellText($cell: cheerio.Cheerio<Element>): string {
  const pill = cleanText($cell.find('.status-pill').text());
  if (pill) {
    return pill;
  }

  return cleanText($cell.text());
}

function buildMovementEvent(
  movement: Record<string, string>,
): ScrapedTrackingEvent | null {
  const date = parseVoladitoDate(cleanText(movement['Fecha y Hora']));

  if (!date) {
    return null;
  }

  return {
    title: 'Entrega registrada',
    date,
    rawDate: cleanText(movement['Fecha y Hora']),
  };
}

function inferCountryPhase(packageStatus: string): CountryPhase {
  const normalized = packageStatus.toLowerCase();

  if (
    normalized.includes('destino final') ||
    normalized.includes('destino') ||
    normalized.includes('entregad')
  ) {
    return 'destination';
  }

  if (
    normalized.includes('origen') ||
    normalized.includes('bodega') ||
    normalized.includes('recibido') ||
    normalized.includes('ingreso')
  ) {
    return 'origin';
  }

  return 'unknown';
}

function inferCountryPhaseLabel(phase: CountryPhase): string {
  if (phase === 'origin') {
    return 'EN EL PAIS DE ORIGEN';
  }

  if (phase === 'destination') {
    return 'EN EL PAIS DE DESTINO';
  }

  return '';
}

export function parseVoladitoDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s+/g, ' ').trim();
  const match = normalized.match(
    /^([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );

  if (!match) {
    return null;
  }

  const month = MONTHS[match[1].slice(0, 3).toLowerCase()];
  if (month === undefined) {
    return null;
  }

  const day = Number(match[2]);
  const year = Number(match[3]);
  let hours = Number(match[4]);
  const minutes = Number(match[5]);
  const meridiem = match[6].toUpperCase();

  if (meridiem === 'PM' && hours < 12) {
    hours += 12;
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return new Date(year, month, day, hours, minutes, 0);
}

function cleanText(value: string | undefined): string {
  return (value ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

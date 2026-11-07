import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  normalizeCargoTrackEvents,
  parseCargoTrackDateTime,
  parseCargoTrackHtml,
} from './cargotrack.parser';

describe('parseCargoTrackHtml', () => {
  const fixtureHtml = readFileSync(
    join(__dirname, '../../../../../Cargotrack.html'),
    'utf-8',
  );

  it('extrae fecha de recibido, peso y eventos del HTML de ejemplo', () => {
    const result = parseCargoTrackHtml(fixtureHtml, '1ZH4F2980358547608');

    expect(result.receivedDate).not.toBeNull();
    expect(result.receivedDate?.getFullYear()).toBe(2026);
    expect(result.receivedDate?.getMonth()).toBe(5);
    expect(result.receivedDate?.getDate()).toBe(10);
    expect(result.receivedTime).toMatch(/8:59:00 AM/i);
    expect(result.weightLbs).toBe(7.3);
    expect(result.packageCount).toBe(1);
    expect(result.countryPhase).toBe('destination');
    expect(result.countryPhaseLabel).toMatch(/destino/i);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].title).toMatch(/^Recibido$/i);
  });

  it('parsea fechas con formato M/D/YYYY y hora AM/PM', () => {
    const date = parseCargoTrackDateTime('6/13/2026', '4:46:35 PM');

    expect(date).not.toBeNull();
    expect(date?.getHours()).toBe(16);
    expect(date?.getMinutes()).toBe(46);
  });
});

describe('normalizeCargoTrackEvents', () => {
  it('oculta eventos de oficina y renombra Delivered', () => {
    const events = normalizeCargoTrackEvents([
      {
        title: 'Delivered',
        date: new Date('2026-06-09T10:52:00'),
        rawDate: '6/9/2026 10:52:00 AM',
      },
      {
        title: 'Recibido en Oficina Metrocentro',
        date: new Date('2026-06-08T20:37:00'),
        rawDate: '6/8/2026 8:37:00 PM',
      },
      {
        title: 'Recibido',
        date: new Date('2026-06-05T14:42:00'),
        rawDate: '6/5/2026 2:42:00 PM',
      },
    ]);

    expect(events).toHaveLength(2);
    expect(events[0].title).toBe('Liberándose de aduana');
    expect(events[1].title).toBe('Recibido');
  });
});

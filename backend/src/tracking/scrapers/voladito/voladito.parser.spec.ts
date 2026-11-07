import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  parseVoladitoDate,
  parseVoladitoExpressHtml,
} from './voladito.parser';

describe('parseVoladitoExpressHtml', () => {
  const fixtureHtml = readFileSync(
    join(
      __dirname,
      '../../../../../Voladito Express Corp _ Tracking.html',
    ),
    'utf-8',
  );

  it('extrae ingreso, peso, movimientos y estado del paquete', () => {
    const result = parseVoladitoExpressHtml(fixtureHtml, 'GFUS01051932130432');

    expect(result.receivedDate).not.toBeNull();
    expect(result.receivedDate?.getMonth()).toBe(4);
    expect(result.receivedDate?.getDate()).toBe(21);
    expect(result.weightLbs).toBe(45);
    expect(result.packageCount).toBe(1);
    expect(result.countryPhase).toBe('destination');
    expect(result.countryPhaseLabel).toBe('ENVIADO A DESTINO FINAL');
    expect(result.recipient).toBe('5G LOGÍSTICA');
    expect(result.service).toBe('MARÍTIMO');
    expect(result.events.length).toBeGreaterThanOrEqual(2);
  });

  it('parsea fechas con formato Mon DD YYYY HH:MMAM/PM', () => {
    const date = parseVoladitoDate('May 21 2026  1:44PM');

    expect(date).not.toBeNull();
    expect(date?.getHours()).toBe(13);
    expect(date?.getMinutes()).toBe(44);
  });
});

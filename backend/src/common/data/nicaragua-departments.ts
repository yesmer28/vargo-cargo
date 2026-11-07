export const NICARAGUA_DEPARTMENTS = [
  'Boaco',
  'Carazo',
  'Chinandega',
  'Chontales',
  'Costa Caribe Norte',
  'Costa Caribe Sur',
  'Estelí',
  'Granada',
  'Jinotega',
  'León',
  'Madriz',
  'Managua',
  'Masaya',
  'Matagalpa',
  'Nueva Segovia',
  'Río San Juan',
  'Rivas',
] as const;

export type NicaraguaDepartment = (typeof NICARAGUA_DEPARTMENTS)[number];

export function isNicaraguaDepartment(value: string): value is NicaraguaDepartment {
  return NICARAGUA_DEPARTMENTS.includes(value as NicaraguaDepartment);
}

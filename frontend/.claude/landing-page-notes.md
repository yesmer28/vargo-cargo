# Landing page de rastreo (Vargo Cargo) — notas de implementación

## Qué se construyó
SPA de rastreo de paquetes en `app/page.tsx` usando App Router, TypeScript y Tailwind v4.

## Estructura de archivos creados
- `types/tracking.ts` — tipos `TrackingInfo`, `TrackingEvent`, `ShipmentStatus`, `StatItem`.
- `data/mockTracking.ts` — datos mock de envíos y estadísticas. Guías de prueba:
  - `VC1234567890` (en tránsito)
  - `VC9988776655` (entregado)
  - `VC5566778899` (incidencia/exception)
- `components/ui/` — primitivos reutilizables: `Button`, `Input`, `Card`, `Badge` (StatusBadge), `Section`.
- `components/Header.tsx` — logo, navegación, toggle de tema, botón contacto.
- `components/Hero.tsx` — título, ilustración SVG animada (camión/avión/caja) + `TrackingForm`.
- `components/TrackingForm.tsx` — input con validación básica + búsqueda async simulada (1.1s delay).
- `components/TrackingSection.tsx` — client component que conecta Hero + TrackingResult, maneja estados loading/error/result.
- `components/TrackingResult.tsx` — info general, barra de progreso animada, mini "mapa" SVG de ruta, timeline.
- `components/Timeline.tsx` — línea de tiempo vertical con iconos por estado, resalta el último evento.
- `components/StatsCards.tsx`, `components/Benefits.tsx`, `components/Footer.tsx`.
- `components/ThemeToggle.tsx` — dark mode con clase `.dark`, persistido en `localStorage`, sin flash (script inline en `app/layout.tsx` head).
- `app/globals.css` — agregado `@custom-variant dark (&:where(.dark, .dark *));` para Tailwind v4.

## Dependencias añadidas
`framer-motion`, `lucide-react` — **instaladas con `pnpm add`**, no con npm.

## ⚠️ Importante: usar pnpm, no npm
Este proyecto usa **pnpm** (`pnpm-lock.yaml` presente, `node_modules` con estructura `.pnpm`).
`npm install` falla con `Cannot read properties of null (reading 'matches')` y se queda colgado indefinidamente.
Usar siempre:
```
pnpm install
pnpm add <paquete>
pnpm run lint
pnpm run build
pnpm run dev
```

## Pendientes / notas para integración futura
- No hay imágenes reales en `public/assets/images` (solo favicons), por lo que toda la ilustración del hero y el mapa de ruta es SVG inline generado a mano.
- Los datos de tracking son mock (`data/mockTracking.ts`). Para conectar con el backend real, reemplazar la lógica de `TrackingForm.handleSubmit` (actualmente hace `mockShipments[trackingNumber]`) por una llamada a la API.
- Lint y build verificados OK con Next 16.2.9 + Turbopack.

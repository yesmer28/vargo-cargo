"use client";

import { TrackingForm } from "@/components/TrackingForm";
import { TrackingInfo } from "@/types/tracking";

interface HeroProps {
  onResult: (result: TrackingInfo | null, error: string | null) => void;
}

export function Hero({ onResult }: HeroProps) {
  return (
    <section
      id="inicio"
      className="border-b border-slate-100 bg-slate-50 px-4 py-12 dark:border-slate-800 dark:bg-slate-900/50 sm:py-16"
    >
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Rastrea tu paquete
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          Ingrese el número de rastreo de su paquete.
        </p>

        <div className="mt-8">
          <TrackingForm onResult={onResult} />
        </div>
      </div>
    </section>
  );
}

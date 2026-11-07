"use client";

import { AlertTriangle, ArrowRight, CalendarClock, Loader2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Timeline } from "@/components/Timeline";
import { STATUS_LABELS } from "@/data/mockTracking";
import { TrackingInfo } from "@/types/tracking";

interface TrackingResultProps {
  result: TrackingInfo | null;
  error: string | null;
  loading: boolean;
}

export function TrackingResult({ result, error, loading }: TrackingResultProps) {
  if (loading) {
    return (
      <Card className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center sm:min-h-[280px] sm:p-10">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        <p className="text-sm text-slate-600 sm:text-base dark:text-slate-300">
          Buscando tu paquete...
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center sm:min-h-[280px] sm:p-10"
        role="alert"
      >
        <AlertTriangle className="h-8 w-8 text-brand-red" />
        <p className="font-semibold text-slate-900 dark:text-white">
          No encontramos tu paquete
        </p>
        <p className="max-w-md text-sm break-words text-slate-500 dark:text-slate-400">
          {error}
        </p>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const receivedDate = new Date(result.receivedDate).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Card className="h-full w-full min-w-0 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">Código</p>
          <h2 className="text-lg font-bold break-all text-slate-900 sm:text-xl dark:text-white">
            {result.trackingNumber}
          </h2>
        </div>
        {/* <StatusBadge
          status={result.status}
          label={STATUS_LABELS[result.status]}
        />*/}
      </div>

      <div className="mt-4 space-y-3 sm:mt-5">
        {result.countryPhaseLabel ? (
          <div className="rounded-xl bg-brand-blue-soft/60 px-3 py-2 text-center text-sm font-semibold text-brand-blue sm:px-4 dark:bg-brand-blue/10 dark:text-brand-blue-light">
            {result.countryPhaseLabel}
          </div>
        ) : null}

        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 sm:p-4 dark:bg-slate-900/60">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Ruta
            </p>
            <p className="mt-1 flex flex-col gap-1 text-sm font-medium text-slate-900 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 dark:text-white">
              <span className="break-words">{result.origin}</span>
              <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-400 sm:inline" />
              <span className="break-words">{result.destination}</span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 sm:p-4 dark:bg-slate-900/60">
          <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Recibido
            </p>
            <p className="mt-1 text-sm font-medium break-words text-slate-900 dark:text-white">
              {receivedDate}
            </p>
          </div>
        </div>

        {/* <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 sm:p-4 dark:bg-slate-900/60">
          <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Entrega estimada
            </p>
            <p className="mt-1 text-sm font-medium break-words capitalize text-slate-900 dark:text-white">
              {estimatedDelivery}
            </p>
          </div>
        </div> */}
      </div>

      <h3 className="mt-5 mb-4 text-base font-semibold text-slate-900 sm:mt-6 dark:text-white">
        Historial del envío
      </h3>
      <Timeline events={result.events} />
    </Card>
  );
}

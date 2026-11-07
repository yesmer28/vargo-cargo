"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, PackageSearch } from "lucide-react";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { TrackingForm } from "@/components/TrackingForm";
import { TrackingResult } from "@/components/TrackingResult";
import { useAuth } from "@/contexts/AuthContext";
import { TrackingInfo } from "@/types/tracking";

export function TrackingSection() {
  const { isLoading, isAuthenticated } = useAuth();
  const [result, setResult] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  function handleResult(newResult: TrackingInfo | null, newError: string | null) {
    if (newResult === null && newError === null) {
      setSearched(true);
      setResult(null);
      setError(null);
      return;
    }
    setResult(newResult);
    setError(newError);
  }

  const loading = searched && !result && !error;

  useEffect(() => {
    if (!searched || !resultsRef.current) return;

    const isStacked = window.matchMedia("(max-width: 1023px)").matches;
    if (isStacked) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searched, result, error, loading]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSearched(false);
      setResult(null);
      setError(null);
    }
  }, [isAuthenticated]);

  return (
    <section
      id="inicio"
      className="flex w-full flex-1 flex-col border-b border-brand-blue-soft bg-white px-4 py-8 dark:border-brand-blue/20 dark:bg-slate-950 sm:px-6 sm:py-12 lg:min-h-0 lg:py-14"
    >
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-start gap-8 md:gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12">
        <div className="min-w-0 w-full lg:sticky lg:top-24">
          <h1 className="text-2xl font-bold tracking-tight text-brand-blue sm:text-3xl lg:text-4xl dark:text-white">
            Rastree su <span className="text-brand-red">paquete</span>
          </h1>

          <div className="mt-3 sm:mt-8">
            {isLoading ? (
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Loader2 className="h-5 w-5 animate-spin text-brand-blue" />
                Cargando sesión...
              </div>
            ) : isAuthenticated ? (
              <TrackingForm onResult={handleResult} />
            ) : (
              <AuthPanel />
            )}
          </div>
        </div>

        <div
          id="rastreo"
          ref={resultsRef}
          className="flex min-h-0 w-full scroll-mt-24 sm:scroll-mt-28 lg:flex lg:flex-col"
        >
          {!isAuthenticated || !searched ? (
            <div className="flex min-h-[200px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-brand-blue-soft bg-white p-6 text-center sm:min-h-[280px] sm:p-10 lg:min-h-0 dark:border-brand-blue/30 dark:bg-slate-900">
              <PackageSearch className="h-8 w-8 text-brand-blue/40 sm:h-10 sm:w-10 dark:text-brand-blue-light/40" />
              <p className="mt-3 max-w-xs text-sm text-slate-500 sm:mt-4 dark:text-slate-400">
                {isAuthenticated
                  ? "El rastreo de su paquete aparecerá aquí"
                  : "Regístrese o inicie sesión para consultar su paquete"}
              </p>
            </div>
          ) : (
            <TrackingResult result={result} error={error} loading={loading} />
          )}
        </div>
      </div>
    </section>
  );
}

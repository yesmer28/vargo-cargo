"use client";

import { FormEvent, useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchTracking, getTrackingErrorMessage } from "@/lib/tracking-api";
import { TrackingInfo } from "@/types/tracking";
import { useAuth } from "@/contexts/AuthContext";

interface TrackingFormProps {
  onResult: (result: TrackingInfo | null, error: string | null) => void;
}

export function TrackingForm({ onResult }: TrackingFormProps) {
  const { token, logout } = useAuth();
  const [value, setValue] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trackingNumber = value.trim().toUpperCase();

    if (!trackingNumber) {
      setFieldError("Ingrese código de rastreo.");
      return;
    }

    if (trackingNumber.length < 6) {
      setFieldError("El código de rastreo debe tener al menos 6 caracteres.");
      return;
    }

    setFieldError("");
    setLoading(true);
    onResult(null, null);

    try {
      if (!token) {
        onResult(null, "Debe iniciar sesión para rastrear paquetes.");
        return;
      }

      const result = await fetchTracking(trackingNumber, token);
      onResult(result, null);
    } catch (error) {
      if (error instanceof Error && error.message === "UNAUTHORIZED") {
        logout();
      }

      onResult(null, getTrackingErrorMessage(trackingNumber, error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-w-0 text-left"
      aria-label="Formulario de rastreo de paquete"
    >
      <label
        htmlFor="tracking-number"
        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        código de rastreo
      </label>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="relative w-full">
            <Input
              id="tracking-number"
              name="tracking-number"
              placeholder="Ejemplo: 1ZH4F2980358547608"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (fieldError) setFieldError("");
              }}
              error={fieldError}
              autoComplete="off"
              inputMode="text"
              className="pr-11 text-base"
            />
            {value ? (
              <button
                type="button"
                onClick={() => {
                  setValue("");
                  setFieldError("");
                }}
                className="absolute right-3 top-3 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Limpiar código de rastreo"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full shrink-0 sm:w-auto cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              Rastrear
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

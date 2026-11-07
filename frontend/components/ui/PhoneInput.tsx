"use client";

import { Select } from "@/components/ui/Select";
import {
  PHONE_COUNTRIES,
  PhoneCountry,
  extractPhoneDigits,
  formatPhoneDigits,
} from "@/lib/phone";

interface PhoneInputProps {
  id: string;
  country: PhoneCountry;
  value: string;
  onCountryChange: (country: PhoneCountry) => void;
  onChange: (formattedValue: string, digits: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
}

export function PhoneInput({
  id,
  country,
  value,
  onCountryChange,
  onChange,
  onBlur,
  error,
  required = false,
}: PhoneInputProps) {
  const config = PHONE_COUNTRIES[country];

  function handleCountryChange(nextCountry: PhoneCountry) {
    onCountryChange(nextCountry);
    onChange("", "");
  }

  function handlePhoneChange(rawValue: string) {
    const digits = extractPhoneDigits(rawValue).slice(0, config.maxDigits);
    onChange(formatPhoneDigits(country, digits), digits);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-44">
          <Select
            id={`${id}-country`}
            value={country}
            onChange={(event) => handleCountryChange(event.target.value as PhoneCountry)}
            aria-label="Código de área"
            required={required}
          >
            {(Object.keys(PHONE_COUNTRIES) as PhoneCountry[]).map((code) => (
              <option key={code} value={code}>
                {PHONE_COUNTRIES[code].label}
              </option>
            ))}
          </Select>
        </div>

        <div className="min-w-0 flex-1">
          <input
            id={id}
            name={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            value={value}
            placeholder={config.placeholder}
            onChange={(event) => handlePhoneChange(event.target.value)}
            onBlur={onBlur}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/40 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              error
                ? "border-brand-red-light focus:border-brand-red"
                : "border-slate-200 focus:border-brand-blue dark:border-slate-700"
            }`}
          />
        </div>
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-sm text-brand-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

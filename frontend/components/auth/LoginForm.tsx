"use client";

import { FormEvent, useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { normalizePhoneForApi, PhoneCountry } from "@/lib/phone";
import { validateLoginPhone } from "@/lib/register-validation";

export function LoginForm() {
  const { login } = useAuth();
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>("NI");
  const [phone, setPhone] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const error = validateLoginPhone(phoneCountry, phoneDigits);
    if (error) {
      setPhoneError(error);
      setFormError("Ingrese un teléfono válido.");
      return;
    }

    setPhoneError("");
    setFormError("");
    setLoading(true);

    try {
      await login({ phone: normalizePhoneForApi(phoneCountry, phoneDigits) });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No pudimos iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Iniciar sesión" noValidate>
      <div>
        <label
          htmlFor="login-phone"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Teléfono <span className="text-brand-red">*</span>
        </label>
        <PhoneInput
          id="login-phone"
          country={phoneCountry}
          value={phone}
          onCountryChange={(country) => {
            setPhoneCountry(country);
            setPhoneError("");
          }}
          onChange={(formatted, digits) => {
            setPhone(formatted);
            setPhoneDigits(digits);
            setPhoneError("");
          }}
          onBlur={() => {
            const error = validateLoginPhone(phoneCountry, phoneDigits);
            setPhoneError(error ?? "");
          }}
          error={phoneError}
          required
        />
      </div>

      {formError ? (
        <p className="text-sm text-brand-red" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={loading} className="w-full cursor-pointer">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Ingresando...
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            Iniciar sesión
          </>
        )}
      </Button>
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { NICARAGUA_DEPARTMENTS } from "@/lib/nicaragua-departments";
import { normalizePhoneForApi, PhoneCountry } from "@/lib/phone";
import {
  RegisterField,
  RegisterFieldErrors,
  validateRegisterField,
  validateRegisterForm,
} from "@/lib/register-validation";

export function RegisterForm() {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>("NI");
  const [phone, setPhone] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [department, setDepartment] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const formValues = {
    firstName,
    lastName,
    email,
    phoneCountry,
    phoneDigits,
    department,
    municipality,
  };

  function clearFieldError(field: RegisterField) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validateField(field: RegisterField) {
    const message = validateRegisterField(field, formValues);
    setFieldErrors((current) => {
      const next = { ...current };
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
    return message;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const errors = validateRegisterForm(formValues);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError("Complete todos los campos obligatorios.");
      return;
    }

    setFormError("");
    setLoading(true);

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: normalizePhoneForApi(phoneCountry, phoneDigits),
        department,
        municipality: municipality.trim(),
      });
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "No pudimos completar el registro.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Registro de usuario" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="register-first-name"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Nombres <span className="text-brand-red">*</span>
          </label>
          <Input
            id="register-first-name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              clearFieldError("firstName");
            }}
            onBlur={() => validateField("firstName")}
            error={fieldErrors.firstName}
            autoComplete="given-name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="register-last-name"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Apellidos <span className="text-brand-red">*</span>
          </label>
          <Input
            id="register-last-name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              clearFieldError("lastName");
            }}
            onBlur={() => validateField("lastName")}
            error={fieldErrors.lastName}
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Correo <span className="text-brand-red">*</span>
        </label>
        <Input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError("email");
          }}
          onBlur={() => validateField("email")}
          error={fieldErrors.email}
          autoComplete="email"
          inputMode="email"
          required
        />
      </div>

      <div>
        <label
          htmlFor="register-phone"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Teléfono <span className="text-brand-red">*</span>
        </label>
        <PhoneInput
          id="register-phone"
          country={phoneCountry}
          value={phone}
          onCountryChange={(country) => {
            setPhoneCountry(country);
            clearFieldError("phone");
          }}
          onChange={(formatted, digits) => {
            setPhone(formatted);
            setPhoneDigits(digits);
            clearFieldError("phone");
          }}
          onBlur={() => validateField("phone")}
          error={fieldErrors.phone}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="register-department"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Departamento <span className="text-brand-red">*</span>
          </label>
          <Select
            id="register-department"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              clearFieldError("department");
            }}
            onBlur={() => validateField("department")}
            error={fieldErrors.department}
            required
          >
            <option value="">Seleccione...</option>
            {NICARAGUA_DEPARTMENTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label
            htmlFor="register-municipality"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Municipio <span className="text-brand-red">*</span>
          </label>
          <Input
            id="register-municipality"
            value={municipality}
            onChange={(e) => {
              setMunicipality(e.target.value);
              clearFieldError("municipality");
            }}
            onBlur={() => validateField("municipality")}
            error={fieldErrors.municipality}
            required
          />
        </div>
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
            Registrando...
          </>
        ) : (
          <>
            <UserPlus className="h-5 w-5" />
            Crear cuenta
          </>
        )}
      </Button>
    </form>
  );
}

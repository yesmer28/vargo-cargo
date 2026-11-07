import { NICARAGUA_DEPARTMENTS } from "@/lib/nicaragua-departments";
import {
  PhoneCountry,
  extractPhoneDigits,
  validatePhone,
} from "@/lib/phone";

export type RegisterField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "department"
  | "municipality";

export type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountry: PhoneCountry;
  phoneDigits: string;
  department: string;
  municipality: string;
}

export function validateRegisterField(
  field: RegisterField,
  values: RegisterFormValues,
): string | null {
  switch (field) {
    case "firstName": {
      const value = values.firstName.trim();
      if (!value) return "Ingrese sus nombres.";
      if (value.length < 2) return "Los nombres deben tener al menos 2 caracteres.";
      if (!NAME_PATTERN.test(value)) {
        return "Los nombres solo pueden contener letras.";
      }
      return null;
    }
    case "lastName": {
      const value = values.lastName.trim();
      if (!value) return "Ingrese sus apellidos.";
      if (value.length < 2) return "Los apellidos deben tener al menos 2 caracteres.";
      if (!NAME_PATTERN.test(value)) {
        return "Los apellidos solo pueden contener letras.";
      }
      return null;
    }
    case "email": {
      const value = values.email.trim();
      if (!value) return "Ingrese su correo.";
      if (!EMAIL_PATTERN.test(value)) return "Ingrese un correo válido.";
      return null;
    }
    case "phone":
      return validatePhone(values.phoneCountry, values.phoneDigits);
    case "department": {
      if (!values.department) return "Seleccione su departamento.";
      if (!NICARAGUA_DEPARTMENTS.includes(values.department as (typeof NICARAGUA_DEPARTMENTS)[number])) {
        return "Seleccione un departamento válido.";
      }
      return null;
    }
    case "municipality": {
      const value = values.municipality.trim();
      if (!value) return "Ingrese su municipio.";
      if (value.length < 2) return "El municipio debe tener al menos 2 caracteres.";
      return null;
    }
    default:
      return null;
  }
}

export function validateRegisterForm(values: RegisterFormValues): RegisterFieldErrors {
  const fields: RegisterField[] = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "department",
    "municipality",
  ];

  return fields.reduce<RegisterFieldErrors>((errors, field) => {
    const message = validateRegisterField(field, values);
    if (message) {
      errors[field] = message;
    }
    return errors;
  }, {});
}

export function validateLoginPhone(
  phoneCountry: PhoneCountry,
  phoneInput: string,
): string | null {
  const digits = extractPhoneDigits(phoneInput).slice(
    0,
    phoneCountry === "NI" ? 8 : 10,
  );
  return validatePhone(phoneCountry, digits);
}

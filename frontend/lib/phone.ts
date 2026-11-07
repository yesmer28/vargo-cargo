export type PhoneCountry = "NI" | "US";

export interface PhoneCountryConfig {
  dialCode: string;
  label: string;
  mask: string;
  maxDigits: number;
  placeholder: string;
}

export const PHONE_COUNTRIES: Record<PhoneCountry, PhoneCountryConfig> = {
  NI: {
    dialCode: "505",
    label: "Nicaragua (+505)",
    mask: "####-####",
    maxDigits: 8,
    placeholder: "8888-7777",
  },
  US: {
    dialCode: "1",
    label: "USA (+1)",
    mask: "(###) ###-####",
    maxDigits: 10,
    placeholder: "(305) 555-1234",
  },
};

export function extractPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function applyPhoneMask(digits: string, mask: string): string {
  let result = "";
  let digitIndex = 0;

  for (const char of mask) {
    if (digitIndex >= digits.length) {
      break;
    }

    if (char === "#") {
      result += digits[digitIndex];
      digitIndex += 1;
    } else {
      result += char;
    }
  }

  return result;
}

export function formatPhoneDigits(country: PhoneCountry, digits: string): string {
  const config = PHONE_COUNTRIES[country];
  const trimmed = digits.slice(0, config.maxDigits);
  return applyPhoneMask(trimmed, config.mask);
}

export function normalizePhoneForApi(country: PhoneCountry, digits: string): string {
  const config = PHONE_COUNTRIES[country];
  return `${config.dialCode}${digits.slice(0, config.maxDigits)}`;
}

export function parseStoredPhone(storedPhone: string): {
  country: PhoneCountry;
  digits: string;
} {
  const normalized = extractPhoneDigits(storedPhone);

  if (normalized.startsWith("505")) {
    return {
      country: "NI",
      digits: normalized.slice(3, 11),
    };
  }

  if (normalized.startsWith("1")) {
    return {
      country: "US",
      digits: normalized.slice(1, 11),
    };
  }

  if (normalized.length === 8) {
    return { country: "NI", digits: normalized };
  }

  return { country: "US", digits: normalized.slice(-10) };
}

export function validatePhone(country: PhoneCountry, digits: string): string | null {
  const config = PHONE_COUNTRIES[country];

  if (!digits) {
    return "Ingrese su teléfono.";
  }

  if (digits.length !== config.maxDigits) {
    return country === "NI"
      ? "El teléfono de Nicaragua debe tener 8 dígitos."
      : "El teléfono de USA debe tener 10 dígitos.";
  }

  return null;
}

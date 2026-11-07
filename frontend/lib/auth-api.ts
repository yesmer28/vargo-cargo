import { API_BASE_URL } from "@/lib/api-config";
import {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string | string[];
    };

    if (Array.isArray(data.message)) {
      return data.message[0] ?? "No pudimos completar la solicitud.";
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  } catch {
    // ignore parse errors
  }

  return "No pudimos completar la solicitud.";
}

function authHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AuthResponse>;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AuthResponse>;
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("UNAUTHORIZED");
  }

  return response.json() as Promise<AuthUser>;
}

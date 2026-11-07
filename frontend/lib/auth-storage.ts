import { AuthUser } from "@/types/auth";

const TOKEN_KEY = "vargo_auth_token";
const USER_KEY = "vargo_auth_user";

export interface StoredSession {
  token: string;
  user: AuthUser;
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    typeof user.firstName === "string" &&
    typeof user.lastName === "string" &&
    typeof user.email === "string" &&
    typeof user.phone === "string"
  );
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);

  if (!token || !rawUser) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser) as unknown;
    if (!isAuthUser(user)) {
      return null;
    }

    return { token, user };
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** @deprecated Use getStoredSession */
export function getStoredToken(): string | null {
  return getStoredSession()?.token ?? null;
}

/** @deprecated Use setStoredSession */
export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** @deprecated Use clearStoredSession */
export function clearStoredToken(): void {
  clearStoredSession();
}

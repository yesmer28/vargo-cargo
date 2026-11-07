"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchCurrentUser, loginUser, registerUser } from "@/lib/auth-api";
import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from "@/lib/auth-storage";
import {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((accessToken: string, profile: AuthUser) => {
    setStoredSession(accessToken, profile);
    setToken(accessToken);
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const storedSession = getStoredSession();

    if (!storedSession) {
      setIsLoading(false);
      return;
    }

    setToken(storedSession.token);
    setUser(storedSession.user);
    setIsLoading(false);

    fetchCurrentUser(storedSession.token)
      .then((profile) => {
        applySession(storedSession.token, profile);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
          logout();
        }
      });
  }, [applySession, logout]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginUser(payload);
      applySession(response.accessToken, response.user);
    },
    [applySession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await registerUser(payload);
      applySession(response.accessToken, response.user);
    },
    [applySession],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}

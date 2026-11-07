"use client";

import { Loader2, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AuthUserMenu() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex max-w-[220px] items-center gap-2 rounded-xl border border-brand-blue-soft bg-brand-blue-soft/40 px-2 py-1.5 sm:max-w-none sm:px-3 dark:border-brand-blue/30 dark:bg-brand-blue/10">
      <UserRound className="h-4 w-4 shrink-0 text-brand-blue dark:text-brand-blue-light" />
      <span className="min-w-0 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
        {user.firstName} {user.lastName}
      </span>
      <button
        type="button"
        onClick={logout}
        className="ml-auto inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:text-brand-red dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-red-light"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

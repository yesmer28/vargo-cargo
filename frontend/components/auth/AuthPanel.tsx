"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

type AuthMode = "login" | "register";

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="w-full min-w-0">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Para rastrear su paquete, inicie sesión o regístrese.
      </p>

      <div className="mt-4 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer transition-colors ${
            mode === "login"
              ? "bg-white text-brand-blue shadow-sm dark:bg-slate-800 dark:text-brand-blue-light"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer transition-colors ${
            mode === "register"
              ? "bg-white text-brand-blue shadow-sm dark:bg-slate-800 dark:text-brand-blue-light"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Registrarse
        </button>
      </div>

      <div className="mt-6">
        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

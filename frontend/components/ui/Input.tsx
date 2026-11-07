import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/40 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
            error
              ? "border-brand-red-light focus:border-brand-red"
              : "border-slate-200 focus:border-brand-blue dark:border-slate-700"
          } ${className}`}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-brand-red" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

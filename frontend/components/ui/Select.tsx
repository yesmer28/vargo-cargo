import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/40 dark:bg-slate-900 dark:text-slate-100 ${
            error
              ? "border-brand-red-light focus:border-brand-red"
              : "border-slate-200 focus:border-brand-blue dark:border-slate-700"
          } ${className}`}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-brand-red" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

import { HTMLAttributes, ReactNode } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id?: string;
}

export function Section({ className = "", children, id, ...props }: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`} {...props}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

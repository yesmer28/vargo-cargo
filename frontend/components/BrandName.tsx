interface BrandNameProps {
  className?: string;
}

export function BrandName({ className = "" }: BrandNameProps) {
  return (
    <span className={className}>
      <span className="text-brand-blue dark:text-brand-blue-light">Var</span>
      <span className="text-brand-red dark:text-brand-red-light">go</span>{" "}
      <span className="text-brand-blue dark:text-brand-blue-light">Car</span>
      <span className="text-brand-red dark:text-brand-red-light">go</span>
    </span>
  );
}

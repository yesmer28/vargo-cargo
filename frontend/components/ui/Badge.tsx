import { ShipmentStatus } from "@/types/tracking";

const statusStyles: Record<ShipmentStatus, string> = {
  received: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  processing: "bg-brand-blue-soft text-brand-blue dark:bg-brand-blue/10 dark:text-brand-blue-light",
  in_transit: "bg-brand-blue-soft text-brand-blue dark:bg-brand-blue/10 dark:text-brand-blue-light",
  at_branch: "bg-brand-red-soft text-brand-red dark:bg-brand-red/10 dark:text-brand-red-light",
  out_for_delivery: "bg-brand-blue-soft text-brand-blue dark:bg-brand-blue/10 dark:text-brand-blue-light",
  delivered: "bg-brand-blue text-white dark:bg-brand-blue-light dark:text-white",
  exception: "bg-brand-red-soft text-brand-red dark:bg-brand-red/10 dark:text-brand-red-light",
};

export function StatusBadge({
  status,
  label,
}: {
  status: ShipmentStatus;
  label: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {label}
    </span>
  );
}

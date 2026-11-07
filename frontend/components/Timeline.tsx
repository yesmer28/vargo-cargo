"use client";

import { motion } from "framer-motion";
import {
  PackageCheck,
  ClipboardList,
  Truck,
  Building2,
  Bike,
  CheckCircle2,
  AlertTriangle,
  Circle,
} from "lucide-react";
import { TrackingEvent, ShipmentStatus } from "@/types/tracking";

const statusIcons: Record<ShipmentStatus, typeof Circle> = {
  received: PackageCheck,
  processing: ClipboardList,
  in_transit: Truck,
  at_branch: Building2,
  out_for_delivery: Bike,
  delivered: CheckCircle2,
  exception: AlertTriangle,
};

const statusColors: Record<ShipmentStatus, string> = {
  received: "bg-slate-400",
  processing: "bg-brand-blue-light",
  in_transit: "bg-brand-blue",
  at_branch: "bg-brand-red",
  out_for_delivery: "bg-brand-blue-light",
  delivered: "bg-brand-blue",
  exception: "bg-brand-red",
};

export function Timeline({ events }: { events: TrackingEvent[] }) {
  const lastIndex = events.length - 1;

  return (
    <ol className="relative space-y-6 sm:space-y-8" aria-label="Línea de tiempo del envío">
      {events.map((event, index) => {
        const Icon = statusIcons[event.status];
        const isLatest = index === lastIndex;

        return (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="relative flex gap-3 pl-1 sm:gap-4"
          >
            {index !== lastIndex && (
              <span
                className="absolute left-[15px] top-9 h-[calc(100%-1.25rem)] w-0.5 bg-slate-200 sm:left-[19px] sm:top-10 sm:h-[calc(100%-1.5rem)] dark:bg-slate-700"
                aria-hidden="true"
              />
            )}

            <span
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white sm:h-10 sm:w-10 ${statusColors[event.status]} ${
                isLatest ? "ring-4 ring-brand-blue-soft dark:ring-brand-blue/30" : ""
              }`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>

            <div
              className={`min-w-0 flex-1 pb-2 ${
                isLatest
                  ? "rounded-xl bg-brand-blue-soft/60 p-3 ring-1 ring-brand-blue-soft sm:p-4 dark:bg-brand-blue/5 dark:ring-brand-blue/20"
                  : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-900 sm:text-base dark:text-white">
                  {event.title}
                </h4>
                {isLatest && (
                  <span className="rounded-full bg-brand-red px-2 py-0.5 text-xs font-semibold text-white">
                    Estado actual
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs break-words text-slate-500 sm:text-sm dark:text-slate-400">
                {new Date(event.date).toLocaleString("es-CO", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}{" "}
                · {event.location}
              </p>
              <p className="mt-2 text-xs break-words text-slate-600 sm:text-sm dark:text-slate-300">
                {event.description}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

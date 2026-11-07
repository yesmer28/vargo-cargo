"use client";

import { motion } from "framer-motion";
import { PackageCheck, Truck, Boxes, Clock, LucideIcon } from "lucide-react";
import { BrandName } from "@/components/BrandName";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { quickStats } from "@/data/mockTracking";

const icons: Record<string, LucideIcon> = {
  PackageCheck,
  Truck,
  Boxes,
  Clock,
};

export function StatsCards() {
  return (
    <Section id="estadisticas" className="bg-slate-50 dark:bg-slate-900/40">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          <BrandName /> en números
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Operación logística a gran escala, con visibilidad total para cada cliente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => {
          const Icon = icons[stat.icon];
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="flex h-full flex-col gap-3 p-6 transition-transform hover:-translate-y-1">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue-soft text-brand-blue dark:bg-brand-blue/10 dark:text-brand-blue-light">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{stat.label}</p>
                <p className="text-xs text-slate-400">{stat.hint}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

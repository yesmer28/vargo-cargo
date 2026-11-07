"use client";

import { motion } from "framer-motion";
import { Radar, BellRing, Globe2, ShieldCheck } from "lucide-react";
import { BrandName } from "@/components/BrandName";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

const benefits = [
  {
    icon: Radar,
    title: "Seguimiento en tiempo real",
    description:
      "Visualiza la ubicación y el estado de tu paquete en cada etapa del proceso, desde la recolección hasta la entrega.",
  },
  {
    icon: BellRing,
    title: "Notificaciones instantáneas",
    description:
      "Recibe alertas automáticas cada vez que tu envío cambia de estado o presenta una novedad.",
  },
  {
    icon: Globe2,
    title: "Cobertura nacional e internacional",
    description:
      "Operamos rutas terrestres, aéreas y marítimas con aliados estratégicos en toda la región.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad y confiabilidad",
    description:
      "Tus envíos están protegidos con monitoreo constante y protocolos de manejo certificados.",
  },
];

export function Benefits() {
  return (
    <Section id="beneficios">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Por qué elegir <BrandName />
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          La experiencia logística que tu negocio y tus clientes merecen.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="h-full p-6 transition-transform hover:-translate-y-1">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-red text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-semibold text-slate-900 dark:text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {benefit.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

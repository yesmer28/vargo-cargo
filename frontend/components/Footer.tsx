import Image from "next/image";
import { Globe, Send, Camera, Mail, Phone, MapPin } from "lucide-react";
import { BrandName } from "@/components/BrandName";

const socials = [
  { icon: Globe, label: "Sitio web", href: "#" },
  { icon: Send, label: "Telegram", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-blue-soft bg-white dark:border-brand-blue/30 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/web-app-manifest-192x192.png"
                alt="Vargo Cargo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold">
                <BrandName />
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Conectamos personas y negocios a través de soluciones logísticas
              rápidas, seguras y confiables.
            </p>
            <div className="mt-4 flex gap-3">
              {/*socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-blue-soft text-brand-blue transition-colors hover:bg-brand-blue hover:text-white dark:border-brand-blue/30 dark:text-brand-blue-light dark:hover:bg-brand-blue dark:hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })*/}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Navegación</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Rastrear paquete</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Servicios</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Carga desde china</li>
              <li>Carga desde panamá</li>
              <li>Carga desde estados unidos</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Contacto</h4>
            <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                <span className="break-words">+505 5783-7982 </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 text-brand-blue h-4 w-4 shrink-0" />
                <span className="break-all">contacto@vargocargo.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                <span className="break-words">Miami, FL, Estados Unidos</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          © {new Date().getFullYear()} Vargo Cargo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

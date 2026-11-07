import Image from "next/image";
import { ChevronDown, Mail } from "lucide-react";
import { BrandName } from "@/components/BrandName";
import { AuthUserMenu } from "@/components/auth/AuthUserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CONTACT_EMAIL, WHATSAPP_URL } from "@/lib/contact";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-blue-soft/80 bg-white/90 backdrop-blur-md dark:border-brand-blue/30 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2">
          <Image
            src="/assets/images/web-app-manifest-192x192.png"
            alt="Vargo Cargo"
            width={80}
            height={80}
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight">
            <BrandName />
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-blue-soft hover:text-brand-blue dark:text-slate-200 dark:hover:bg-brand-blue/10 dark:hover:text-brand-blue-light"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Contactar
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>

            <div className="invisible absolute right-0 top-full z-50 w-52 pt-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-brand-blue-soft hover:text-brand-blue dark:text-slate-200 dark:hover:bg-brand-blue/10 dark:hover:text-brand-blue-light"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-brand-blue" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-brand-red-soft hover:text-brand-red dark:text-slate-200 dark:hover:bg-brand-red/10 dark:hover:text-brand-red-light"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <AuthUserMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

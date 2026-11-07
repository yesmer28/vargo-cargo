import { WHATSAPP_URL } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function WhatsAppFloatButton() {
  return (
    <div className="group fixed bottom-20 right-15 md:bottom-30 md:right-22 z-40 sm:bottom-6 sm:right-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2 scale-95 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100"
      >
        <div className="relative whitespace-nowrap rounded-2xl rounded-br-sm border border-[#c8e6b8] bg-[#dcf8c6] px-4 py-2.5 text-sm font-semibold text-[#303030] shadow-md dark:border-[#004d40] dark:bg-[#005c4b] dark:text-[#e9edef]">
          👋 Contáctenos
        </div>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-400 text-white shadow-lg shadow-brand-blue/30 hover:bg-brand-green-light sm:h-16 sm:w-16"
      >
        <WhatsAppIcon className="relative h-7 w-7 sm:h-8 sm:w-8" />
      </a>
    </div>
  );
}

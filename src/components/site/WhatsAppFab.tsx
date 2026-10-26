"use client";

import { useI18n } from "@/i18n/LocaleProvider";
import { whatsappHref } from "@/lib/partners";

export function WhatsAppFab() {
  const { locale, dict } = useI18n();
  const text =
    locale === "fr"
      ? "Bonjour, je prépare un mariage à Marrakesh — je vous trouve via Wedding Planner Marrakesh"
      : "Hello, I am planning a Marrakesh wedding — I found you through Wedding Planner Marrakesh";
  return (
    <a
      href={whatsappHref(text)}
      target="_blank"
      rel="noreferrer"
      title={dict.whatsapp.title}
      className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center border border-ink bg-ink text-cream shadow-float transition hover:bg-teal"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm0 1.67c4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24-1.4 0-2.79-.36-4.01-1.04l-.29-.17-3.12.82.83-3.04-.18-.31a8.2 8.2 0 0 1-1.24-4.5c0-4.54 3.7-8.24 8.01-8.24zM8.53 7.53c-.2 0-.52.07-.79.38-.27.31-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.07 3.32 5.11 4.52 2.53 1 3.05.8 3.6.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.05-1-.27-.12-.47-.18-.67.18s-.77 1-.94 1.2c-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.89-.79-1.5-1.77-1.67-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.61-.91-2.2-.24-.58-.48-.5-.67-.51z" />
      </svg>
      <span className="sr-only">{dict.whatsapp.label}</span>
    </a>
  );
}

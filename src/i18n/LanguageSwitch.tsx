"use client";

import { usePathname } from "next/navigation";
import { localePath } from "@/i18n";
import { useI18n } from "@/i18n/LocaleProvider";

export function LanguageSwitch() {
  const { locale, dict } = useI18n();
  const pathname = usePathname() || "/";
  const next = locale === "fr" ? "en" : "fr";
  const href = localePath(next, pathname);

  return (
    <a
      href={href}
      hrefLang={next}
      target="_top"
      rel="alternate"
      className="grid h-8 w-8 shrink-0 place-items-center border border-sand-deep text-[10px] font-semibold tracking-[0.16em] text-ink-soft transition hover:border-ink hover:text-ink"
      aria-label={dict.nav.switchLocaleLabel}
    >
      {dict.nav.switchLocale}
    </a>
  );
}

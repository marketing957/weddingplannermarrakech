"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { getDictionary, type Dictionary, type Locale } from "@/i18n";

const LocaleContext = createContext<{ locale: Locale; dict: Dictionary } | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDictionary(locale);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return <LocaleContext.Provider value={{ locale, dict }}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useI18n must be used inside LocaleProvider");
  return ctx;
}

import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n";

export async function getRequestLocale(): Promise<Locale> {
  const h = await headers();
  const value = h.get("x-locale");
  if (value && isLocale(value)) return value;
  return DEFAULT_LOCALE;
}

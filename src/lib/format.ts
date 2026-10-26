import { formatMoney, type Currency } from "@/lib/currency";
import type { Locale } from "@/i18n";

export function initials(name: string) {
  const parts = name.replace(/['’]/g, "").split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Format a euro-denominated amount in the visitor's currency. */
export function money(
  n: number | null | undefined,
  currency: Currency = "EUR",
  locale: Locale = "en",
) {
  return formatMoney(n, currency, locale);
}

export function moneyNight(
  n: number | null | undefined,
  currency: Currency = "EUR",
  locale: Locale = "en",
) {
  return formatMoney(n, currency, locale);
}

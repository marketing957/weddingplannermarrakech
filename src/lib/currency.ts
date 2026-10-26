import type { Locale } from "@/i18n";

/** Display currencies. Catalog figures and saved plans stay in euros. */
export const CURRENCIES = ["EUR", "USD", "GBP", "MAD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const BASE_CURRENCY: Currency = "EUR";
export const CURRENCY_COOKIE = "wpm-currency";

/**
 * Euros to each display currency. Mid-market, 9–12 October 2026.
 * USD and GBP from the ECB via Frankfurter; MAD from the spot market.
 * Conversions are indicative — vendor quotes are not FX-locked.
 */
export const EUR_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.1206,
  GBP: 0.84763,
  MAD: 10.93,
};

export function isCurrency(value: string | null | undefined): value is Currency {
  return !!value && (CURRENCIES as readonly string[]).includes(value);
}

export function convertFromEur(amountEur: number, currency: Currency): number {
  return amountEur * EUR_RATES[currency];
}

function numberLocale(currency: Currency, locale: Locale): string {
  if (locale === "fr") return "fr-FR";
  if (currency === "USD") return "en-US";
  if (currency === "GBP") return "en-GB";
  if (currency === "MAD") return "en-US";
  return "en-IE";
}

function normalizeSpaces(value: string) {
  return value.replace(/[\u00a0\u202f]/g, " ");
}

export function formatMoney(
  amountEur: number | null | undefined,
  currency: Currency = BASE_CURRENCY,
  locale: Locale = "en",
): string {
  if (amountEur == null || Number.isNaN(amountEur)) return "";
  const formatted = new Intl.NumberFormat(numberLocale(currency, locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(convertFromEur(amountEur, currency));
  return normalizeSpaces(formatted);
}

export function formatMoneyShort(
  amountEur: number,
  currency: Currency = BASE_CURRENCY,
  locale: Locale = "en",
): string {
  const converted = convertFromEur(amountEur, currency);
  if (Math.abs(converted) < 1000) return formatMoney(amountEur, currency, locale);
  return normalizeSpaces(
    new Intl.NumberFormat(numberLocale(currency, locale), {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(converted),
  );
}

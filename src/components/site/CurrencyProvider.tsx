"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/LocaleProvider";
import {
  CURRENCY_COOKIE,
  formatMoney,
  formatMoneyShort,
  type Currency,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (next: Currency) => void;
  format: (amountEur: number | null | undefined) => string;
  short: (amountEur: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  currency: initial,
  children,
}: {
  currency: Currency;
  children: ReactNode;
}) {
  const router = useRouter();
  const { locale } = useI18n();
  const [currency, setCurrencyState] = useState(initial);

  useEffect(() => {
    setCurrencyState(initial);
  }, [initial]);

  const setCurrency = useCallback(
    (next: Currency) => {
      setCurrencyState(next);
      document.cookie = `${CURRENCY_COOKIE}=${next}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.refresh();
    },
    [router],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      format: (amountEur) => formatMoney(amountEur, currency, locale),
      short: (amountEur) => formatMoneyShort(amountEur, currency, locale),
    }),
    [currency, locale, setCurrency],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}

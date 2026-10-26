"use client";

import { CURRENCIES, isCurrency } from "@/lib/currency";
import { useI18n } from "@/i18n/LocaleProvider";
import { useCurrency } from "@/components/site/CurrencyProvider";

export function CurrencySwitch() {
  const { dict } = useI18n();
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      aria-label={dict.nav.currencyLabel}
      title={dict.nav.currencyNote}
      onChange={(event) => {
        if (isCurrency(event.target.value)) setCurrency(event.target.value);
      }}
      className="h-8 cursor-pointer border border-sand-deep bg-transparent px-1.5 text-[10px] font-semibold tracking-[0.14em] text-ink-soft outline-none transition hover:border-ink hover:text-ink"
    >
      {CURRENCIES.map((code) => (
        <option key={code} value={code}>
          {code}
        </option>
      ))}
    </select>
  );
}

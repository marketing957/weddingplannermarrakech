"use client";

import { Check, Star } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/i18n/LocaleProvider";

export function SectionHeading({ title, subtitle, id }: { title: string; subtitle?: string; id?: string }) {
  return (
    <div id={id} className="scroll-mt-28">
      <h3 className="font-display text-[1.65rem] font-medium leading-tight text-ink">{title}</h3>
      {subtitle ? <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{subtitle}</p> : null}
    </div>
  );
}

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <span className="font-display text-lg font-semibold leading-snug text-ink">{children}</span>
      {hint ? <span className="max-w-[16rem] text-right text-[12px] leading-snug text-muted">{hint}</span> : null}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  variant = "track",
}: {
  options: Array<{ value: T; label: string; sub?: string; disabled?: boolean }>;
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  variant?: "track" | "chips";
}) {
  if (variant === "chips") {
    return (
      <div role="radiogroup" className="flex flex-wrap justify-end gap-1.5">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={o.disabled}
              onClick={() => onChange(o.value)}
              className={`border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition disabled:opacity-40 ${
                active ? "border-ink bg-ink text-cream" : "border-sand-deep bg-white text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      className={`inline-flex w-full gap-px border border-sand-deep bg-sand-deep ${size === "sm" ? "text-xs" : "text-sm"}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center px-3 ${
              size === "sm" ? "py-1.5" : "py-2.5"
            } font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
              active ? "bg-ink text-cream" : "bg-cream text-ink-soft hover:text-ink"
            }`}
          >
            <span className="truncate">{o.label}</span>
            {o.sub ? <span className="text-[11px] font-normal text-muted">{o.sub}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export function FeatureList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-3 grid gap-1.5 text-sm text-ink-soft sm:grid-cols-3">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

export function VendorHint({ rating }: { rating: number | null }) {
  const { dict } = useI18n();
  if (rating == null) return null;
  return (
    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
      <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
      {dict.sim.reserved} <span className="font-semibold text-ink">★{Number(rating).toFixed(1)}</span>{" "}
      {dict.sim.reservedTail}
    </p>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-sand-deep bg-white p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CheckBox({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`mt-0.5 grid h-[16px] w-[16px] shrink-0 place-items-center border transition disabled:opacity-70 ${
        checked ? "border-ink bg-ink text-cream" : "border-sand-deep bg-white"
      }`}
    >
      {checked ? (
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
          <path d="M2 6.2 4.6 9 10 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : null}
    </button>
  );
}

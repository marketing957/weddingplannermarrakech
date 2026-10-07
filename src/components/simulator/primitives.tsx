"use client";

import { Check, Star } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({ title, subtitle, id }: { title: string; subtitle?: string; id?: string }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h3 className="text-xl font-semibold text-ink">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
    </div>
  );
}

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <span className="text-sm font-semibold text-ink">{children}</span>
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: Array<{ value: T; label: string; sub?: string; disabled?: boolean }>;
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="radiogroup"
      className={`inline-flex w-full flex-wrap gap-1 rounded-xl bg-sand p-1 ${size === "sm" ? "text-xs" : "text-sm"}`}
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
            className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg px-3 ${
              size === "sm" ? "py-1.5" : "py-2"
            } font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
              active ? "bg-cream text-teal shadow-sm" : "text-ink-soft hover:text-ink"
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
  if (rating == null) return null;
  return (
    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
      <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
      A top-rated vendor <span className="font-semibold text-ink">★{Number(rating).toFixed(1)}</span> is
      reserved for you · revealed with your plan
    </p>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-sand-deep bg-white/70 p-5 shadow-card ${className}`}>
      {children}
    </div>
  );
}

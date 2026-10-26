"use client";

import { AlertCircle, CheckCircle2, Minus, Plus } from "lucide-react";
import type { Estimate } from "@/lib/pricing";
import { useCurrency } from "@/components/site/CurrencyProvider";
import type { RealWedding } from "@/lib/supabase/types";
import { t, localePath } from "@/i18n";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useI18n } from "@/i18n/LocaleProvider";

const GROUP_COLORS = [
  "#2c3a34",
  "#b08948",
  "#161411",
  "#8d5a38",
  "#5a6354",
  "#8a8378",
  "#4a453e",
  "#ddd4c6",
];

export function BudgetSummary({
  est,
  target,
  onTarget,
  onReset,
  comparables,
}: {
  est: Estimate;
  target: number;
  onTarget: (n: number) => void;
  onReset: () => void;
  comparables: RealWedding[];
}) {
  const { locale, dict } = useI18n();
  const { currency, format, short } = useCurrency();
  const diff = est.total - target;
  const within = Math.abs(diff) <= target * 0.03;
  const step = target >= 100000 ? 10000 : target >= 30000 ? 5000 : 1000;
  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";
  const signupHref = `/sign-up?returnTo=${localePath(locale, "/plan")}`;

  const r = 48;
  const c = 2 * Math.PI * r;
  const segments = est.breakdown.reduce<Array<{ len: number; start: number }>>((acc, b) => {
    const start = acc.length ? acc[acc.length - 1].start + acc[acc.length - 1].len : 0;
    acc.push({ len: b.share * c, start });
    return acc;
  }, []);

  return (
    <div className="space-y-px bg-sand-deep">
      <div className="bg-ink p-6 text-cream">
        <div className="flex items-center justify-between">
          <p className="kicker text-saffron">{dict.sim.estimate}</p>
          <span className="border border-white/15 px-2 py-0.5 text-[10px] font-semibold tracking-[0.16em] text-white/55">
            {currency}
          </span>
        </div>
        <p className="mt-4 font-display text-[2.85rem] font-medium leading-none tabular-nums tracking-tight text-white">
          {format(est.total)}
        </p>
        <p className="mt-4 text-[13px] text-white/50">
          {format(est.perGuest)} {dict.sim.perGuest} · {est.eventCount}{" "}
          {est.eventCount > 1 ? dict.sim.events : dict.sim.event} · {format(est.low)}–{format(est.high)}
        </p>
        {est.overCapacity ? (
          <p className="mt-3 flex items-start gap-1.5 text-xs text-saffron-soft">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {t(dict.sim.capacity, { n: est.venueMax })}
          </p>
        ) : null}
        <LocaleLink
          href={signupHref}
          className="mt-6 flex items-center justify-center border border-saffron bg-saffron px-4 py-3 text-center text-[13px] font-semibold tracking-wide text-ink hover:bg-saffron-soft"
        >
          {dict.sim.seeVendorsCta}
        </LocaleLink>
        <button
          type="button"
          onClick={onReset}
          className="mt-3.5 w-full text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 hover:text-white/70"
        >
          {dict.sim.resetStandard}
        </button>
      </div>

      <div className="bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-ink">{dict.sim.target}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={dict.sim.target}
              onClick={() => onTarget(Math.max(step, target - step))}
              className="grid h-8 w-8 place-items-center border border-sand-deep text-ink hover:border-ink"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[4.75rem] text-center text-[15px] font-semibold tabular-nums">{short(target)}</span>
            <button
              type="button"
              aria-label={dict.sim.target}
              onClick={() => onTarget(target + step)}
              className="grid h-8 w-8 place-items-center bg-ink text-cream hover:bg-teal"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className={`mt-2.5 text-sm ${within ? "text-olive" : diff > 0 ? "text-terracotta" : "text-olive"}`}>
          {within ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> {dict.sim.onTarget}
            </span>
          ) : diff > 0 ? (
            t(dict.sim.over, { n: format(diff) })
          ) : (
            t(dict.sim.under, { n: format(-diff) })
          )}
        </p>
      </div>

      <div className="bg-white p-5">
        <p className="font-display text-xl font-medium text-ink">{dict.sim.whereGoes}</p>
        <div className="relative mx-auto mt-5 h-[148px] w-[148px]">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#efeae2" strokeWidth="13" />
            {est.breakdown.map((b, i) => (
              <circle
                key={b.group}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={GROUP_COLORS[i]}
                strokeWidth="13"
                strokeLinecap="butt"
                strokeDasharray={`${segments[i].len} ${c - segments[i].len}`}
                strokeDashoffset={-segments[i].start}
              />
            ))}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-[1.65rem] font-medium leading-none tabular-nums text-ink">
                {short(est.total)}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">{dict.sim.total}</p>
            </div>
          </div>
        </div>
        <ul className="mt-5 space-y-2">
          {est.breakdown.map((b, i) => (
            <li key={b.group} className="flex items-center gap-3 text-[13px]">
              <span className="h-2 w-2 shrink-0" style={{ background: GROUP_COLORS[i] }} />
              <span className="flex-1 text-ink-soft">
                {dict.sim.groups[b.group as keyof typeof dict.sim.groups] ?? b.label}
              </span>
              <span className="tabular-nums text-muted">{Math.round(b.share * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-5">
        <p className="text-sm font-semibold text-ink">{dict.sim.comparable}</p>
        <p className="mt-0.5 text-xs text-muted">{dict.sim.comparableSub}</p>
        <ul className="mt-3 divide-y divide-sand-deep">
          {comparables.map((w) => (
            <li key={w.id} className="flex items-center justify-between gap-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-ink">{w.location}</p>
                <p className="text-xs text-muted">
                  {new Date(w.wedding_month).toLocaleDateString(dateLocale, { month: "short", year: "numeric" })} ·{" "}
                  {w.guest_count} {dict.plan.guests}
                </p>
              </div>
              <span className="font-display text-lg font-medium tabular-nums text-ink">{short(w.total_cost)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

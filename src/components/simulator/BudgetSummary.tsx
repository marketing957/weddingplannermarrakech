"use client";

import { AlertCircle, CheckCircle2, Minus, Plus } from "lucide-react";
import type { Estimate } from "@/lib/pricing";
import { eur, eurShort } from "@/lib/pricing";
import type { RealWedding } from "@/lib/supabase/types";

const GROUP_COLORS = [
  "#0e4f5c", // venue
  "#d99a2b", // fnb
  "#2e7d5b", // planning
  "#b5451b", // decor
  "#3b6f7a", // photo
  "#e3b65a", // music
  "#7a5c3e", // beauty
  "#9bb7bb", // traditions
];

export function BudgetSummary({
  est,
  target,
  onTarget,
  comparables,
}: {
  est: Estimate;
  target: number;
  onTarget: (n: number) => void;
  comparables: RealWedding[];
}) {
  const diff = est.total - target;
  const within = Math.abs(diff) <= target * 0.03;
  const step = target >= 100000 ? 10000 : target >= 30000 ? 5000 : 1000;

  // Donut ring: precompute each segment's start offset.
  const r = 44;
  const c = 2 * Math.PI * r;
  const segments = est.breakdown.reduce<Array<{ len: number; start: number }>>((acc, b) => {
    const start = acc.length ? acc[acc.length - 1].start + acc[acc.length - 1].len : 0;
    acc.push({ len: b.share * c, start });
    return acc;
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-teal p-6 text-cream shadow-float">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-soft/80">Your estimate</p>
        <p className="mt-1 font-display text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
          {eur.format(est.total)}
        </p>
        <p className="mt-2 text-sm text-teal-soft">
          {eur.format(est.perGuest)} / guest · {est.eventCount} event{est.eventCount > 1 ? "s" : ""} ·{" "}
          {eur.format(est.low)}–{eur.format(est.high)}
        </p>

        <div className="mt-5 rounded-xl bg-teal-deep/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Target budget</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Decrease target"
                onClick={() => onTarget(Math.max(step, target - step))}
                className="grid h-8 w-8 place-items-center rounded-full bg-cream/10 transition hover:bg-cream/20"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[4.5rem] text-center font-semibold tabular-nums">{eurShort(target)}</span>
              <button
                type="button"
                aria-label="Increase target"
                onClick={() => onTarget(target + step)}
                className="grid h-8 w-8 place-items-center rounded-full bg-cream/10 transition hover:bg-cream/20"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p
            className={`mt-3 flex items-center gap-1.5 text-sm ${
              within ? "text-olive-soft" : diff > 0 ? "text-saffron-soft" : "text-olive-soft"
            }`}
          >
            {within ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> On target.
              </>
            ) : diff > 0 ? (
              <>
                <AlertCircle className="h-4 w-4" /> {eur.format(diff)} over target.
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> {eur.format(-diff)} under target.
              </>
            )}
          </p>
        </div>

        {est.overCapacity ? (
          <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-terracotta/30 px-3 py-2 text-xs text-cream">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            This venue type caps around {est.venueMax} guests. Switch venue or trim the list.
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-sand-deep bg-white/70 p-5 shadow-card">
        <p className="text-sm font-semibold text-ink">Where it goes</p>
        <div className="mt-4 flex items-center gap-5">
          <svg viewBox="0 0 110 110" className="h-28 w-28 shrink-0 -rotate-90">
            <circle cx="55" cy="55" r={r} fill="none" stroke="#f3ece2" strokeWidth="14" />
            {est.breakdown.map((b, i) => (
              <circle
                key={b.group}
                cx="55"
                cy="55"
                r={r}
                fill="none"
                stroke={GROUP_COLORS[i]}
                strokeWidth="14"
                strokeDasharray={`${segments[i].len} ${c - segments[i].len}`}
                strokeDashoffset={-segments[i].start}
                className="transition-all duration-500"
              />
            ))}
          </svg>
          <div>
            <p className="font-display text-2xl font-semibold tabular-nums">{eurShort(est.total)}</p>
            <p className="text-xs text-muted">Total</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {est.breakdown.map((b, i) => (
            <li key={b.group} className="flex items-center gap-3 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: GROUP_COLORS[i] }} />
              <span className="flex-1 text-ink-soft">{b.label}</span>
              <span className="tabular-nums text-muted">{Math.round(b.share * 100)}%</span>
              <span className="w-20 text-right tabular-nums font-medium">{eurShort(b.amount)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-sand-deep bg-white/70 p-5 shadow-card">
        <p className="text-sm font-semibold text-ink">Comparable weddings</p>
        <p className="mt-0.5 text-xs text-muted">Real estimates closest to your guest count</p>
        <ul className="mt-4 divide-y divide-sand-deep/70">
          {comparables.map((w) => (
            <li key={w.id} className="flex items-center justify-between gap-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-ink">{w.location}</p>
                <p className="text-xs text-muted">
                  {new Date(w.wedding_month).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} ·{" "}
                  {w.guest_count} guests
                </p>
              </div>
              <span className="font-display text-lg font-semibold tabular-nums text-teal">
                {eurShort(w.total_cost)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

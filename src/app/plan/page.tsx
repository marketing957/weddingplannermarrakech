import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { MfaChallenge } from "@/components/auth/MfaChallenge";
import { MfaSettings } from "@/components/auth/MfaSettings";
import { getAuthUser } from "@/lib/auth";
import { getPricingConfig, getSavedPlans } from "@/lib/data";
import { money } from "@/lib/format";
import { getRequestCurrency } from "@/lib/currency-server";
import { getRequestLocale } from "@/i18n/request";
import { needsMfaChallenge } from "@/lib/mfa";

export const metadata: Metadata = { title: "Your plan", robots: { index: false, follow: false } };

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-5 py-14"><div className="h-64 animate-pulse rounded-2xl bg-sand" /></div>}>
      <PlanBody />
    </Suspense>
  );
}

async function PlanBody() {
  const user = await getAuthUser();
  if (!user) redirect("/login?returnTo=/plan");
  if (await needsMfaChallenge()) {
    return (
      <div className="mx-auto max-w-md px-5 py-14">
        <div className="border border-sand-deep bg-white p-6">
          <MfaChallenge />
        </div>
      </div>
    );
  }

  const [plans, config, currency, locale] = await Promise.all([
    getSavedPlans(user.id),
    getPricingConfig(),
    getRequestCurrency(),
    getRequestLocale(),
  ]);
  const matched = Object.values(config.matched).slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-10 pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Workspace</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Your plan</h1>
      <p className="mt-2 text-ink-soft">Saved budgets and the team that fits them.</p>

      {plans.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-sand-deep bg-white/70 p-8">
          <p className="font-display text-xl font-semibold text-ink">No plan saved yet.</p>
          <p className="mt-2 text-sm text-ink-soft">
            Build a budget in the simulator and it will appear here, with the vendors matched to it.
          </p>
          <LocaleLink
            href="/#simulator"
            className="mt-5 inline-block rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-cream"
          >
            Open the simulator
          </LocaleLink>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {plans.map((p) => (
            <li key={p.id} className="rounded-2xl border border-sand-deep bg-white/70 p-6 shadow-card">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">
                    Saved {new Date(p.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="font-display text-3xl font-semibold text-teal">{money(p.estimate, currency, locale)}</p>
                  <p className="text-sm text-ink-soft">{p.guests} guests</p>
                </div>
                <LocaleLink href="/#simulator" className="text-sm font-semibold text-teal hover:underline">
                  Adjust in simulator
                </LocaleLink>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {(p.breakdown ?? []).map((b) => (
                  <li key={b.group} className="flex justify-between text-sm text-ink-soft">
                    <span>{b.label}</span>
                    <span className="tabular-nums">{money(b.amount, currency, locale)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ink">Your matched team</h2>
        <p className="mt-1 text-sm text-muted">Top-rated in each category your plan includes.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {matched.map((m) => (
            <li key={m.category} className="rounded-xl border border-sand-deep bg-white/70 p-4">
              <p className="text-xs uppercase tracking-wider text-muted">{m.category.replace(/-/g, " ")}</p>
              <p className="mt-1 font-semibold text-ink">{m.name}</p>
              <p className="text-sm text-teal">★ {m.score.toFixed(1)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl bg-sand p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Month-by-month checklist</h2>
        <ol className="mt-4 space-y-2 text-sm text-ink-soft">
          <li>12 months — guest range, budget ceiling, shortlist three venue types, sign a planner.</li>
          <li>9 months — confirm venue and date, block hotel rooms, send save-the-dates.</li>
          <li>6 months — lock caterer, photographer, music and decor.</li>
          <li>3 months — tasting, guest transport, legal paperwork at home.</li>
          <li>The weekend — welcome dinner, ceremony, farewell brunch.</li>
        </ol>
      </section>

      <p className="mt-10 text-sm text-ink-soft">
        Wissal reviews saved plans and sends a personalised shortlist as a PDF. Signed in as {user.email}.
      </p>
      <MfaSettings />
    </div>
  );
}

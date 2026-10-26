import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { Suspense } from "react";
import { Camera, Music, UtensilsCrossed, Lightbulb, Flower2, Sparkles, Car, Theater } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { getVendorCategories, getVendors, revealVendorPrices } from "@/lib/data";
import { money } from "@/lib/format";
import { getRequestCurrency } from "@/lib/currency-server";
import { getRequestLocale } from "@/i18n/request";

export const metadata: Metadata = {
  title: "Wedding vendors in Marrakesh",
  description:
    "Photographers, DJs, florists and caterers for a Marrakesh wedding, with real prices behind a free account.",
  alternates: { canonical: "/vendors" },
};

const ICONS: Record<string, typeof Camera> = {
  camera: Camera,
  photo_camera: Camera,
  music: Music,
  utensils: UtensilsCrossed,
  lightbulb: Lightbulb,
  flower: Flower2,
  sparkles: Sparkles,
  car: Car,
  theater: Theater,
  theater_comedy: Theater,
};

export default function VendorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-12">
      <p className="kicker">
        The catalogue, every vendor priced
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
        Every wedding vendor in Marrakesh, with real prices.
      </h1>
      <p className="mt-3 text-ink-soft">
        Verified vendors · 8 categories · prices updated 2026 · no pay-to-play
      </p>
      <Suspense fallback={<div className="mt-10 h-64 animate-pulse rounded-2xl bg-sand" />}>
        <VendorCats />
      </Suspense>
    </div>
  );
}

async function VendorCats() {
  const [cats, vendorsRaw, user, currency, locale] = await Promise.all([
    getVendorCategories(),
    getVendors(),
    getAuthUser(),
    getRequestCurrency(),
    getRequestLocale(),
  ]);
  const vendors = user ? await revealVendorPrices(vendorsRaw) : vendorsRaw;
  const countBy = Object.fromEntries(
    cats.map((c) => [c.slug, vendors.filter((v) => v.category_slug === c.slug).length]),
  );
  const minBy = Object.fromEntries(
    cats.map((c) => {
      const prices = vendors
        .filter((v) => v.category_slug === c.slug)
        .map((v) => v.price_from)
        .filter((n): n is number => n != null);
      return [c.slug, prices.length ? Math.min(...prices) : null];
    }),
  );
  const popular = cats.filter((c) => c.most_booked);

  return (
    <>
      <p className="mt-4 text-sm text-muted">
        {vendors.length}+ vendors · {cats.length} categories · verified portfolios
      </p>
      {popular.length ? (
        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">
          Popular: {popular.map((c) => c.name.toLowerCase()).join(" · ")}
        </p>
      ) : null}
      <h2 className="mt-10 font-display text-2xl font-semibold text-ink">Pick a category</h2>
      <p className="text-sm text-muted">{String(cats.length).padStart(2, "0")} categories</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((c) => {
          const Icon = ICONS[c.icon] ?? Sparkles;
          return (
            <LocaleLink
              key={c.slug}
              href={`/vendors/${c.slug}`}
              className="border border-sand-deep bg-white p-5 transition hover:border-ink"
            >
              <Icon className="h-6 w-6 text-ink" />
              <p className="mt-3 font-display text-lg font-medium text-ink">{c.name}</p>
              <p className="mt-1 text-xs text-muted">
                {countBy[c.slug] ?? 0} vendors
                {user && minBy[c.slug] != null ? ` · from ${money(minBy[c.slug], currency, locale)}` : " · prices with an account"}
              </p>
              {c.most_booked ? (
                <span className="mt-3 inline-block border border-saffron px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-saffron">
                  Most booked
                </span>
              ) : null}
            </LocaleLink>
          );
        })}
      </div>
      <ol className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          ["01", "Every vendor verified, portfolio checked, style-tagged."],
          ["02", "Create a free account. The real price comes into focus."],
          ["03", "Build your budget and talk to Wissal."],
        ].map(([n, t]) => (
          <li key={n} className="border border-sand-deep bg-sand p-5">
            <p className="kicker">{n}</p>
            <p className="mt-2 text-sm text-ink-soft">{t}</p>
          </li>
        ))}
      </ol>
      <div className="mt-12 bg-ink p-8 text-cream">
        <p className="font-display text-2xl font-medium">Stop guessing prices</p>
        <p className="mt-2 text-sm text-white/55">Real quotes for {vendors.length}+ vendors. Free, forever.</p>
        <LocaleLink
          href="/sign-up?returnTo=/vendors"
          className="mt-5 inline-block bg-saffron px-5 py-2.5 text-sm font-semibold text-ink hover:bg-saffron-soft"
        >
          Create a free account
        </LocaleLink>
      </div>
    </>
  );
}

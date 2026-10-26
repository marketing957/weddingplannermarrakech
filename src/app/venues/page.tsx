import type { Metadata } from "next";
import { Suspense } from "react";
import { VenuesBrowser } from "@/components/catalog/VenuesBrowser";
import { Accordion } from "@/components/site/Accordion";
import { getAuthUser } from "@/lib/auth";
import { getVenueStyles, getVenues, getVoteTallies, revealVenuePrices } from "@/lib/data";
import { money } from "@/lib/format";
import { getRequestCurrency } from "@/lib/currency-server";
import { getRequestLocale } from "@/i18n/request";

export const metadata: Metadata = {
  title: "Wedding venues in Marrakesh",
  description:
    "Marrakesh wedding venues with capacity and a price per night — riads, palaces, Palmeraie villas and Agafay camps.",
  alternates: { canonical: "/venues" },
  openGraph: {
    images: [
      {
        url: "/photos/koutoubia.jpg",
        width: 1280,
        height: 960,
        alt: "Koutoubia Mosque in the Marrakesh medina",
      },
    ],
  },
};

export default function VenuesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Catalog</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
        Marrakesh wedding venues, priced by night.
      </h1>
      <p className="mt-3 text-ink-soft">
        Riads, palaces, gardens · price per night · prices updated 2026 · real quotes, not brochures
      </p>
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded-2xl bg-sand" />}>
        <VenuesBody />
      </Suspense>
      <div className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold text-ink">About Marrakesh wedding venues</h2>
        <div className="mt-4">
          <Suspense fallback={null}>
            <VenueFaqs />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function VenueFaqs() {
  const [currency, locale] = await Promise.all([getRequestCurrency(), getRequestLocale()]);
  const price = (n: number) => money(n, currency, locale);
  return (
    <Accordion
      items={[
        {
          id: "v1",
          section: "general",
          sort_order: 1,
          link_href: null,
          link_label: null,
          question: "What kinds of venues are there?",
          answer:
            "Marrakesh splits across four styles. Intimate riads in the medina seat under 80. Garden estates in the Palmeraie handle 80 to 150. Palaces take 150 to 300. Desert camps and kasbahs trade convenience for a view.",
        },
        {
          id: "v2",
          section: "general",
          sort_order: 2,
          link_href: null,
          link_label: null,
          question: "What do venues cost?",
          answer: `Hire ranges from about ${price(1500)} a night for a boutique riad to more than ${price(60000)} for an exclusive palace buyout. Most couples spend ${price(5000)} to ${price(20000)} on the venue line. Peak months run 30 to 50 percent higher. Always confirm whether catering and rooms are included.`,
        },
      ]}
    />
  );
}

async function VenuesBody() {
  const [venues, styles, votes, user] = await Promise.all([
    getVenues(),
    getVenueStyles(),
    getVoteTallies("venue"),
    getAuthUser(),
  ]);
  const priced = user ? await revealVenuePrices(venues) : venues;
  return (
    <>
      <p className="mt-4 text-sm text-muted">
        {priced.length} venues · riads, palaces, gardens · price per night
      </p>
      <VenuesBrowser venues={priced} styles={styles} votes={votes} signedIn={!!user} />
    </>
  );
}

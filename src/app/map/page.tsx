import type { Metadata } from "next";
import { Suspense } from "react";
import { VenueMap } from "@/components/map/VenueMap";
import { getVenues } from "@/lib/data";
import { pinForVenue } from "@/lib/geo";
import { mapPhotoFields } from "@/lib/photos";
import { getRequestLocale } from "@/i18n/request";

export const metadata: Metadata = {
  title: "Marrakesh wedding map",
  description:
    "Interactive map of Marrakesh wedding zones — Medina, Palmeraie, Agafay and the Atlas — for couples hiring a wedding planner in Marrakesh.",
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Free tool</p>
      <h1 className="mt-3 font-display text-4xl font-semibold italic text-ink sm:text-5xl">
        where to marry
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Medina riads, Palmeraie gardens, Agafay camps and Atlas kasbahs — plotted so you can see drive times
        before you fall in love with a courtyard.
      </p>
      <div className="mt-8">
        <Suspense fallback={<div className="h-[62vh] min-h-[420px] animate-pulse bg-sand" />}>
          <MapPins />
        </Suspense>
      </div>
    </div>
  );
}

async function MapPins() {
  const [venues, locale] = await Promise.all([getVenues(), getRequestLocale()]);
  const pins = venues.map((v) => {
    const { lat, lng } = pinForVenue(v.slug, v.zone);
    return {
      slug: v.slug,
      name: v.name,
      zone: v.zone,
      capacity: v.capacity_seated,
      tier: v.tier,
      lat,
      lng,
      ...mapPhotoFields(v, locale),
    };
  });

  return <VenueMap pins={pins} />;
}

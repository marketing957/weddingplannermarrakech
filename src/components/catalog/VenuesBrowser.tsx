"use client";

import { useMemo, useState } from "react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useSearchParams } from "next/navigation";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { PriceLock } from "@/components/site/PriceLock";
import { VoteButtons } from "@/components/site/VoteButtons";
import { companyLogoSrc } from "@/lib/logos";
import { useCurrency } from "@/components/site/CurrencyProvider";
import type { Venue, VenueStyle, VoteCount } from "@/lib/supabase/types";

export function VenuesBrowser({
  venues,
  styles,
  votes,
  signedIn,
}: {
  venues: Venue[];
  styles: VenueStyle[];
  votes: Record<string, VoteCount>;
  signedIn: boolean;
}) {
  const params = useSearchParams();
  const { format } = useCurrency();
  const zoneParam = params.get("zone");
  const [tab, setTab] = useState<"selection" | "all">(zoneParam ? "all" : "selection");
  const [style, setStyle] = useState<string | null>(null);
  const [zone, setZone] = useState<string | null>(zoneParam);

  const zones = useMemo(() => [...new Set(venues.map((v) => v.zone))].sort(), [venues]);

  const rows = useMemo(() => {
    let list = tab === "selection" ? venues.filter((v) => v.wpm_selection) : venues;
    if (style) list = list.filter((v) => v.style_slugs.includes(style) || v.styles.includes(style));
    if (zone) list = list.filter((v) => v.zone === zone);
    if (list.length === 0 && tab === "selection" && !zone) list = venues.slice(0, 12);
    return list;
  }, [venues, tab, style, zone]);

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("selection")}
          className={`border px-3 py-1.5 text-sm font-medium ${
            tab === "selection" ? "border-ink bg-ink text-cream" : "border-sand-deep bg-white text-ink-soft"
          }`}
        >
          WPM selection
        </button>
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`border px-3 py-1.5 text-sm font-medium ${
            tab === "all" ? "border-ink bg-ink text-cream" : "border-sand-deep bg-white text-ink-soft"
          }`}
        >
          All venues
        </button>
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Browse by zone</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setZone(null)}
          className={`border px-3 py-1 text-xs ${!zone ? "border-ink bg-ink text-cream" : "border-sand-deep bg-white text-ink-soft"}`}
        >
          All zones
        </button>
        {zones.map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => {
              setZone(z);
              setTab("all");
            }}
            className={`border px-3 py-1 text-xs ${
              zone === z ? "border-ink bg-ink text-cream" : "border-sand-deep bg-white text-ink-soft"
            }`}
          >
            {z}
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Browse by style</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStyle(null)}
          className={`border px-3 py-1 text-xs ${!style ? "border-ink bg-ink text-cream" : "border-sand-deep bg-white text-ink-soft"}`}
        >
          All
        </button>
        {styles.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setStyle(s.slug)}
            className={`border px-3 py-1 text-xs ${
              style === s.slug ? "border-ink bg-ink text-cream" : "border-sand-deep bg-white text-ink-soft"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto border border-sand-deep bg-white">
        <table className="min-w-[820px] w-full text-left text-sm">
          <thead className="bg-sand text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">Venue</th>
              <th className="px-3 py-3">Style</th>
              <th className="px-3 py-3">Guests</th>
              <th className="px-3 py-3">Community</th>
              <th className="px-3 py-3">Score</th>
              <th className="px-3 py-3">Price · night</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v, i) => {
              const t = votes[v.id];
              return (
                <tr key={v.id} className="border-t border-sand-deep/70 hover:bg-sand/40">
                  <td className="px-3 py-3 tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-3 py-3">
                    <LocaleLink href={`/venues/${v.slug}`} className="flex items-center gap-3">
                      <CompanyLogo name={v.name} src={companyLogoSrc({ slug: v.slug, name: v.name })} size={40} />
                      <span>
                        <span className="block font-semibold text-ink hover:text-saffron">{v.name}</span>
                        <span className="block text-xs text-muted">
                          {v.zone} · {v.tier}
                        </span>
                      </span>
                    </LocaleLink>
                  </td>
                  <td className="px-3 py-3 text-ink-soft">{v.styles.slice(0, 3).join(" / ")}</td>
                  <td className="px-3 py-3 tabular-nums">{v.capacity_seated}</td>
                  <td className="px-3 py-3">
                    <VoteButtons
                      targetType="venue"
                      targetId={v.id}
                      up={t?.up ?? 0}
                      down={t?.down ?? 0}
                      signedIn={signedIn}
                      returnTo="/venues"
                    />
                  </td>
                  <td className="px-3 py-3 font-semibold tabular-nums text-teal">{Number(v.score_overall).toFixed(1)}</td>
                  <td className="px-3 py-3">
                    <PriceLock revealed={signedIn} href="/venues">
                      <span className="font-semibold tabular-nums">
                        {v.price_night_low != null ? format(v.price_night_low) : ""}
                      </span>
                    </PriceLock>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

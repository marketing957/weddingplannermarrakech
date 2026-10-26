"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarRange,
  ClipboardCheck,
  Gavel,
  ListOrdered,
  Map,
  Search,
} from "lucide-react";
import { VenueMap, type MapPin } from "@/components/map/VenueMap";
import { ChecklistApp } from "@/components/checklist/ChecklistApp";
import { TIMELINE } from "@/lib/checklist";
import type { MonthData } from "@/lib/supabase/types";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useI18n } from "@/i18n/LocaleProvider";

const SEASON_KEY = "wpm:season-month";

type Tab = "map" | "season" | "checklist" | "timeline" | "legal" | "catalog";

const TAB_META: Array<{ id: Tab; hash: string; icon: typeof Map }> = [
  { id: "map", hash: "tools-map", icon: Map },
  { id: "season", hash: "tools-season", icon: CalendarRange },
  { id: "checklist", hash: "tools-checklist", icon: ClipboardCheck },
  { id: "timeline", hash: "tools-timeline", icon: ListOrdered },
  { id: "legal", hash: "tools-legal", icon: Gavel },
  { id: "catalog", hash: "tools-catalog", icon: Search },
];

const HASH_TO_TAB: Record<string, Tab> = Object.fromEntries(TAB_META.map((t) => [t.hash, t.id])) as Record<string, Tab>;

export type CatalogItem = {
  slug: string;
  name: string;
  meta: string;
  href: string;
  logoSrc?: string | null;
};

export function HomeTools({
  pins,
  months,
  venues,
  planners,
  vendors,
}: {
  pins: MapPin[];
  months: MonthData[];
  venues: CatalogItem[];
  planners: CatalogItem[];
  vendors: CatalogItem[];
}) {
  const [tab, setTab] = useState<Tab>("map");
  const { dict } = useI18n();
  const labels: Record<Tab, string> = {
    map: dict.tools.map,
    season: dict.tools.season,
    checklist: dict.tools.checklist,
    timeline: dict.tools.timeline,
    legal: dict.tools.legal,
    catalog: dict.tools.catalog,
  };

  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (HASH_TO_TAB[h]) setTab(HASH_TO_TAB[h]);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  function open(next: Tab, hash: string) {
    setTab(next);
    history.replaceState(null, "", `#${hash}`);
  }

  return (
    <section className="relative scroll-mt-36">
      <div id="tools" className="absolute -top-6" />
      {TAB_META.map((t) => (
        <div key={t.hash} id={t.hash} className="absolute -top-6" />
      ))}
      <div className="mb-6">
        <p className="kicker">{dict.home.toolsKicker}</p>
        <h2 className="mt-2 font-display text-4xl font-medium text-ink">{dict.home.toolsTitle}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{dict.home.toolsLede}</p>
      </div>

      <div className="overflow-hidden border border-sand-deep bg-white">
        <div
          role="tablist"
          aria-label={dict.tools.dock}
          className="flex gap-0 overflow-x-auto border-b border-sand-deep bg-cream/60 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TAB_META.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => open(t.id, t.hash)}
                className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
                  on ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {labels[t.id]}
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6">
          {tab === "map" ? <VenueMap compact pins={pins} /> : null}
          {tab === "season" ? <SeasonPanel months={months} /> : null}
          {tab === "checklist" ? <ChecklistApp compact /> : null}
          {tab === "timeline" ? <TimelinePanel /> : null}
          {tab === "legal" ? <LegalPanel /> : null}
          {tab === "catalog" ? <CatalogPanel venues={venues} planners={planners} vendors={vendors} /> : null}
        </div>
      </div>
    </section>
  );
}

function SeasonPanel({ months }: { months: MonthData[] }) {
  const [picked, setPicked] = useState<number | null>(null);
  const { dict } = useI18n();

  useEffect(() => {
    const raw = localStorage.getItem(SEASON_KEY);
    if (raw) setPicked(Number(raw));
  }, []);

  const selected = months.find((m) => m.month === picked);
  const best = useMemo(
    () => [...months].sort((a, b) => Number(b.score) - Number(a.score))[0],
    [months],
  );

  function choose(month: number) {
    setPicked(month);
    localStorage.setItem(SEASON_KEY, String(month));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-soft">
          {selected ? (
            <>
              {dict.tools.yourDate} <span className="font-semibold text-ink">{selected.name}</span> · {selected.verdict}
            </>
          ) : (
            <>
              {dict.tools.tapMonth} {best?.name}
            </>
          )}
        </p>
        <LocaleLink href="/wedding-date-optimizer" className="text-sm font-semibold text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink">
          {dict.tools.fullSeason}
        </LocaleLink>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {months.map((m) => {
          const on = m.month === picked;
          return (
            <button
              key={m.month}
              type="button"
              onClick={() => choose(m.month)}
              className={`border p-3.5 text-left transition ${
                on ? "border-ink bg-sand" : "border-sand-deep bg-cream/50 hover:border-ink"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-lg font-semibold text-ink">{m.name}</span>
                <span className="text-xs font-semibold text-saffron">{Number(m.score).toFixed(1)}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-soft">{m.verdict}</p>
              <p className="mt-2 text-[11px] text-muted">
                {m.temp_high}° / {m.temp_low}° · {m.rain_days} {dict.tools.rainDays}
              </p>
            </button>
          );
        })}
      </div>
      {selected ? (
        <p className="mt-4 border border-sand-deep bg-sand px-4 py-3 text-sm text-ink-soft">{selected.note}</p>
      ) : null}
    </div>
  );
}

function TimelinePanel() {
  const { dict } = useI18n();
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {TIMELINE.map((step) => (
        <li key={step.month} className="border border-sand-deep bg-cream/40 p-4">
          <p className="kicker">{step.month}</p>
          <h3 className="mt-1 font-display text-lg font-medium text-ink">{step.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{step.body}</p>
          <LocaleLink href={step.href} className="mt-2 inline-block text-sm font-semibold text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink">
            {dict.tools.open}
          </LocaleLink>
        </li>
      ))}
    </ol>
  );
}

function LegalPanel() {
  const { dict } = useI18n();
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="border border-sand-deep bg-cream/40 p-5">
        <h3 className="font-display text-xl font-medium text-ink">{dict.tools.celebration}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{dict.tools.celebrationBody}</p>
      </div>
      <div className="border border-sand-deep bg-cream/40 p-5">
        <h3 className="font-display text-xl font-medium text-ink">{dict.tools.civil}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{dict.tools.civilBody}</p>
      </div>
      <ul className="border border-sand-deep bg-white p-5 text-sm leading-relaxed text-ink-soft lg:col-span-2">
        {dict.tools.legalItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <LocaleLink href="/legal" className="text-sm font-semibold text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink">
        {dict.tools.fullLegal}
      </LocaleLink>
    </div>
  );
}

function CatalogPanel({
  venues,
  planners,
  vendors,
}: {
  venues: CatalogItem[];
  planners: CatalogItem[];
  vendors: CatalogItem[];
}) {
  const [q, setQ] = useState("");
  const { dict } = useI18n();
  const needle = q.trim().toLowerCase();

  function filter(list: CatalogItem[]) {
    const rows = needle ? list.filter((i) => `${i.name} ${i.meta}`.toLowerCase().includes(needle)) : list;
    return rows.slice(0, 8);
  }

  const cols = [
    { title: dict.nav.venues, href: "/venues", rows: filter(venues) },
    { title: dict.nav.planners, href: "/planners", rows: filter(planners) },
    { title: dict.nav.vendors, href: "/vendors", rows: filter(vendors) },
  ];

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={dict.tools.search}
        className="mb-5 h-11 w-full border border-sand-deep bg-cream/50 px-4 text-sm outline-none focus:border-ink"
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {cols.map((col) => (
          <div key={col.title}>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">{col.title}</h3>
              <LocaleLink href={col.href} className="text-xs font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink">
                {dict.tools.all}
              </LocaleLink>
            </div>
            <ul className="space-y-1">
              {col.rows.map((row) => (
                <li key={row.slug}>
                  <LocaleLink href={row.href} className="flex items-center gap-2 px-3 py-2 hover:bg-sand">
                    <CompanyLogo name={row.name} src={row.logoSrc} size={32} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{row.name}</span>
                      <span className="block truncate text-[11px] text-muted">{row.meta}</span>
                    </span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

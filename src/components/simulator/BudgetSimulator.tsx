"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import type { PricingConfig, ServiceCategory, ServiceSection } from "@/lib/supabase/types";
import {
  FNB_META,
  PRESETS,
  closestWeddings,
  estimate,
  initialState,
  type FnbTier,
  type SimulatorState,
} from "@/lib/pricing";
import { t } from "@/i18n";
import { useI18n } from "@/i18n/LocaleProvider";
import { BudgetSummary } from "./BudgetSummary";
import { SavePlanForm } from "./SavePlanForm";
import { Card, CheckBox, FeatureList, FieldLabel, SectionHeading, Segmented, VendorHint } from "./primitives";
import { HERO_AGAFAY, HERO_PALMERAIE, STYLE_HOTEL, STYLE_PALACE, STYLE_RIAD } from "@/lib/real-photos";

const MIN_GUESTS = 20;
const MAX_GUESTS = 200;

const MODEL_IDS = ["intimate", "palmeraie", "desert"] as const;

const VENUE_PHOTOS: Record<string, string> = {
  riad: STYLE_RIAD.src,
  villa: HERO_PALMERAIE.src,
  hotel: STYLE_HOTEL.src,
  desert: HERO_AGAFAY.src,
  palace: STYLE_PALACE.src,
};

export function BudgetSimulator({ config }: { config: PricingConfig }) {
  const { dict } = useI18n();
  const [state, setState] = useState<SimulatorState>(() => initialState(config));
  const [preset, setPreset] = useState<string | null>("intimate");
  const [lastPreset, setLastPreset] = useState("intimate");
  const [bannerOff, setBannerOff] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const est = useMemo(() => estimate(config, state), [config, state]);
  const comparables = useMemo(() => closestWeddings(config.realWeddings, state.guests), [config, state.guests]);
  const dirty = preset === null;

  const update = (patch: Partial<SimulatorState>) => {
    setPreset(null);
    setBannerOff(false);
    setState((s) => ({ ...s, ...patch }));
  };

  const setTier = (categoryId: string, key: string) => {
    setPreset(null);
    setBannerOff(false);
    setState((s) => ({ ...s, tiers: { ...s.tiers, [categoryId]: key } }));
  };

  const toggleEvent = (id: string, enabled: boolean) => {
    setPreset(null);
    setBannerOff(false);
    setState((s) => ({ ...s, events: { ...s.events, [id]: { ...s.events[id], enabled } } }));
  };

  const setFnb = (id: string, fnb: FnbTier) => {
    setPreset(null);
    setBannerOff(false);
    setState((s) => ({ ...s, events: { ...s.events, [id]: { ...s.events[id], fnb } } }));
  };

  const applyPreset = (id: string, announce = false) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setState((s) => p.apply(s));
    setPreset(id);
    setLastPreset(id);
    setBannerOff(true);
    if (announce) {
      const label = dict.sim.models[id as keyof typeof dict.sim.models] ?? id;
      setFlash(t(dict.sim.loaded, { n: label }));
      window.setTimeout(() => setFlash(null), 4200);
    }
  };

  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      applyPreset(id, true);
    };
    window.addEventListener("wpm-apply-preset", on);
    return () => window.removeEventListener("wpm-apply-preset", on);
  }, []);

  const bySection = (section: ServiceSection) => config.categories.filter((c) => c.section === section);

  const fill = ((state.guests - MIN_GUESTS) / (MAX_GUESTS - MIN_GUESTS)) * 100;

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        {flash ? (
          <p className="border border-sand-deep bg-saffron-soft px-4 py-2 text-center text-sm font-medium text-ink">
            {flash}
          </p>
        ) : null}
        {dirty && !bannerOff ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border border-sand-deep bg-white px-4 py-2 sm:justify-center sm:gap-5">
            <p className="text-[13px] text-ink-soft">
              <span className="font-medium text-ink">{dict.sim.changeModel}</span> {dict.sim.editsCleared}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyPreset(lastPreset)}
                className="bg-ink px-4 py-1.5 text-[13px] font-semibold text-cream hover:bg-teal"
              >
                {dict.sim.change}
              </button>
              <button
                type="button"
                onClick={() => setBannerOff(true)}
                className="px-3 py-1.5 text-[13px] font-medium text-ink-soft hover:text-ink"
              >
                {dict.sim.continue}
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-3">
          <SectionHeading title={dict.sim.shape} subtitle={dict.sim.shapeSub} />
          <button
            type="button"
            onClick={() => applyPreset("intimate")}
            className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" /> {dict.sim.reset}
          </button>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{dict.sim.model}</p>
          <div className="flex gap-5 text-[15px]">
            {MODEL_IDS.map((id) => {
              const active = preset === id || (!preset && id === lastPreset);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => applyPreset(id)}
                  className={`pb-0.5 transition ${
                    active
                      ? "font-semibold text-ink underline decoration-2 underline-offset-[6px]"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {dict.sim.models[id]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid items-end gap-8 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              {dict.sim.guests} · <span className="text-ink">{state.guests}</span>
            </p>
            <input
              type="range"
              min={MIN_GUESTS}
              max={MAX_GUESTS}
              value={state.guests}
              style={{ ["--fill" as string]: `${fill}%` }}
              onChange={(e) => update({ guests: Number(e.target.value) })}
              className="w-full"
              aria-label={dict.sim.guestCount}
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-muted">
              <span>{MIN_GUESTS}</span>
              <span>{MAX_GUESTS}</span>
            </div>
          </div>
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{dict.sim.season}</p>
            <Segmented
              options={[
                { value: "off", label: dict.sim.low },
                { value: "shoulder", label: dict.sim.mid },
                { value: "peak", label: dict.sim.high },
              ]}
              value={state.seasonId}
              onChange={(v) => update({ seasonId: v })}
            />
          </div>
        </div>

        <Card>
          <FieldLabel hint={dict.sim.whereHint}>{dict.sim.where}</FieldLabel>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {config.venues.map((v) => {
              const active = v.id === state.venueId;
              const over = state.guests > v.max_guests;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => update({ venueId: v.id })}
                  className={`group relative overflow-hidden text-left transition ${
                    active ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : "ring-1 ring-sand-deep hover:ring-ink/50"
                  } ${over && !active ? "opacity-55" : ""}`}
                >
                  <span className="relative block aspect-[3/4] overflow-hidden bg-sand">
                        <Image
                          src={VENUE_PHOTOS[v.id]}
                          alt={`${dict.sim.venueCaptions[v.id as keyof typeof dict.sim.venueCaptions] ?? v.name} wedding venue in Marrakesh`}
                          fill
                          sizes="160px"
                          className="object-cover transition duration-300 group-hover:scale-[1.04]"
                        />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-2.5 pb-2.5 pt-10">
                      <span className="block text-[13px] font-semibold leading-tight text-white">
                        {dict.sim.venueCaptions[v.id as keyof typeof dict.sim.venueCaptions] ?? v.name}
                      </span>
                      <span className={`block text-[11px] tabular-nums ${over ? "text-teal-soft" : "text-white/70"}`}>
                        ≤ {v.max_guests}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-ink-soft">{config.venues.find((v) => v.id === state.venueId)?.tagline}</p>
        </Card>

        <Card>
          <FieldLabel hint={dict.sim.weekendHint}>{dict.sim.weekend}</FieldLabel>
          <ul className="divide-y divide-sand-deep/60">
            {config.events.map((e) => {
              const choice = state.events[e.id];
              const on = choice?.enabled ?? false;
              return (
                <li key={e.id} className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <CheckBox checked={on} disabled={e.is_core} onChange={(v) => toggleEvent(e.id, v)} />
                    <button
                      type="button"
                      disabled={e.is_core}
                      onClick={() => toggleEvent(e.id, !on)}
                      className="text-left disabled:cursor-default"
                    >
                      <span className="block text-sm font-semibold text-ink">
                        {e.name}
                        {e.is_core ? <span className="ml-1.5 text-xs font-normal text-muted">{dict.sim.alwaysOn}</span> : null}
                      </span>
                      <span className="mt-0.5 block max-w-xs text-[12px] leading-snug text-muted">{e.description}</span>
                    </button>
                  </div>
                  <div className={`sm:shrink-0 ${on ? "" : "pointer-events-none opacity-35"}`}>
                    <Segmented<FnbTier>
                      variant="chips"
                      options={(Object.keys(FNB_META) as FnbTier[]).map((k) => ({
                        value: k,
                        label: dict.sim.fnb[k],
                      }))}
                      value={choice?.fnb ?? "standard"}
                      onChange={(v) => setFnb(e.id, v)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <ServiceSectionBlock
          title={dict.sim.core}
          subtitle={dict.sim.coreSub}
          categories={bySection("core")}
          config={config}
          state={state}
          setTier={setTier}
        />
        <ServiceSectionBlock
          title={dict.sim.details}
          subtitle={dict.sim.detailsSub}
          categories={bySection("details")}
          config={config}
          state={state}
          setTier={setTier}
        />
        <ServiceSectionBlock
          title={dict.sim.traditions}
          subtitle={dict.sim.traditionsSub}
          categories={bySection("traditions")}
          config={config}
          state={state}
          setTier={setTier}
        />

        <SavePlanForm state={state} est={est} />
      </div>

      <aside className="lg:sticky lg:top-[104px]">
        <BudgetSummary
          est={est}
          target={state.target}
          onTarget={(n) => setState((s) => ({ ...s, target: n }))}
          onReset={() => applyPreset("palmeraie")}
          comparables={comparables}
        />
      </aside>
    </div>
  );
}

function ServiceSectionBlock({
  title,
  subtitle,
  categories,
  config,
  state,
  setTier,
}: {
  title: string;
  subtitle: string;
  categories: ServiceCategory[];
  config: PricingConfig;
  state: SimulatorState;
  setTier: (categoryId: string, key: string) => void;
}) {
  if (!categories.length) return null;
  return (
    <div className="space-y-4">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="grid gap-3">
        {categories.map((c) => {
          const tiers = config.tiers.filter((t) => t.category_id === c.id);
          const active = tiers.find((t) => t.key === state.tiers[c.id]);
          return (
            <Card key={c.id}>
              <FieldLabel hint={c.description ?? undefined}>{c.name}</FieldLabel>
              <Segmented
                options={tiers.map((t) => ({ value: t.key, label: t.name }))}
                value={state.tiers[c.id]}
                onChange={(v) => setTier(c.id, v)}
              />
              <FeatureList items={active?.features ?? []} />
              {active && (active.fixed_cost > 0 || active.per_guest_cost > 0) ? (
                <VendorHint rating={c.vendor_rating} />
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

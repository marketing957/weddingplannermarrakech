"use client";

import { useMemo, useState } from "react";
import { Sparkles, Users } from "lucide-react";
import type { PricingConfig, ServiceCategory, ServiceSection } from "@/lib/supabase/types";
import {
  AMBITION_META,
  FNB_META,
  PRESETS,
  closestWeddings,
  estimate,
  initialState,
  type Ambition,
  type FnbTier,
  type SimulatorState,
} from "@/lib/pricing";
import { BudgetSummary } from "./BudgetSummary";
import { SavePlanForm } from "./SavePlanForm";
import { Card, FeatureList, FieldLabel, SectionHeading, Segmented, VendorHint } from "./primitives";

const MIN_GUESTS = 2;
const MAX_GUESTS = 400;

export function BudgetSimulator({ config }: { config: PricingConfig }) {
  const [state, setState] = useState<SimulatorState>(() => initialState(config));
  const [preset, setPreset] = useState<string | null>(null);

  const est = useMemo(() => estimate(config, state), [config, state]);
  const comparables = useMemo(() => closestWeddings(config.realWeddings, state.guests), [config, state.guests]);

  const update = (patch: Partial<SimulatorState>) => {
    setPreset(null);
    setState((s) => ({ ...s, ...patch }));
  };

  const setTier = (categoryId: string, key: string) => {
    setPreset(null);
    setState((s) => ({ ...s, tiers: { ...s.tiers, [categoryId]: key } }));
  };

  const toggleEvent = (id: string, enabled: boolean) => {
    setPreset(null);
    setState((s) => ({ ...s, events: { ...s.events, [id]: { ...s.events[id], enabled } } }));
  };

  const setFnb = (id: string, fnb: FnbTier) => {
    setPreset(null);
    setState((s) => ({ ...s, events: { ...s.events, [id]: { ...s.events[id], fnb } } }));
  };

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setState((s) => p.apply(s));
    setPreset(id);
  };

  const bySection = (section: ServiceSection) =>
    config.categories.filter((c) => c.section === section);

  const fill = ((state.guests - MIN_GUESTS) / (MAX_GUESTS - MIN_GUESTS)) * 100;

  return (
    <section id="simulator" className="scroll-mt-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Controls */}
        <div className="space-y-10">
          {/* Shape the weekend */}
          <div className="space-y-6">
            <SectionHeading
              title="Shape the weekend"
              subtitle="Pick a preset to start, then tune guests, season, and ambition."
            />

            <div className="grid gap-2 sm:grid-cols-4">
              {PRESETS.map((p) => {
                const active = preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p.id)}
                    className={`rounded-xl border px-3.5 py-3 text-left transition ${
                      active
                        ? "border-teal bg-teal text-cream shadow-float"
                        : "border-sand-deep bg-white/70 hover:border-teal/50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      <Sparkles className={`h-3.5 w-3.5 ${active ? "text-saffron" : "text-saffron"}`} />
                      {p.label}
                    </span>
                    <span className={`mt-0.5 block text-xs ${active ? "text-teal-soft" : "text-muted"}`}>
                      {p.hint}
                    </span>
                  </button>
                );
              })}
            </div>

            <Card>
              <FieldLabel hint={`${MIN_GUESTS}–${MAX_GUESTS}`}>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal" /> Guests
                </span>
              </FieldLabel>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={MIN_GUESTS}
                  max={MAX_GUESTS}
                  value={state.guests}
                  style={{ ["--fill" as string]: `${fill}%` }}
                  onChange={(e) => update({ guests: Number(e.target.value) })}
                  className="w-full"
                  aria-label="Guest count"
                />
                <input
                  type="number"
                  min={MIN_GUESTS}
                  max={MAX_GUESTS}
                  value={state.guests}
                  onChange={(e) =>
                    update({ guests: Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, Number(e.target.value) || MIN_GUESTS)) })
                  }
                  className="w-20 rounded-lg border border-sand-deep bg-white px-2 py-1.5 text-center text-sm font-semibold tabular-nums outline-none ring-teal/30 focus:ring-2"
                  aria-label="Guest count"
                />
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <FieldLabel>Season</FieldLabel>
                <Segmented
                  options={config.seasons.map((s) => ({ value: s.id, label: s.name, sub: s.months }))}
                  value={state.seasonId}
                  onChange={(v) => update({ seasonId: v })}
                />
                <p className="mt-3 text-xs text-muted">
                  {config.seasons.find((s) => s.id === state.seasonId)?.note}
                </p>
              </Card>
              <Card>
                <FieldLabel>Ambition</FieldLabel>
                <Segmented<Ambition>
                  options={(Object.keys(AMBITION_META) as Ambition[]).map((k) => ({
                    value: k,
                    label: AMBITION_META[k].label,
                  }))}
                  value={state.ambition}
                  onChange={(v) => update({ ambition: v })}
                />
                <p className="mt-3 text-xs text-muted">{AMBITION_META[state.ambition].hint}</p>
              </Card>
            </div>

            <Card>
              <FieldLabel hint="Each type carries its own base. Ambition tunes how the space is dressed.">
                Where you&apos;ll host
              </FieldLabel>
              <div className="grid gap-2 sm:grid-cols-5">
                {config.venues.map((v) => {
                  const active = v.id === state.venueId;
                  const over = state.guests > v.max_guests;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => update({ venueId: v.id })}
                      className={`rounded-xl border px-3 py-3 text-left transition ${
                        active
                          ? "border-teal bg-teal-soft/60 ring-2 ring-teal/40"
                          : "border-sand-deep bg-white hover:border-teal/40"
                      } ${over && !active ? "opacity-60" : ""}`}
                    >
                      <span className="block text-sm font-semibold leading-tight text-ink">{v.name}</span>
                      <span className={`mt-1 block text-xs tabular-nums ${over ? "text-terracotta" : "text-muted"}`}>
                        ≤ {v.max_guests}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                {config.venues.find((v) => v.id === state.venueId)?.tagline}
              </p>
            </Card>

            <Card>
              <FieldLabel hint="Choose which events you host and the F&B tier for each.">The weekend</FieldLabel>
              <ul className="divide-y divide-sand-deep/70">
                {config.events.map((e) => {
                  const choice = state.events[e.id];
                  return (
                    <li key={e.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={choice?.enabled ?? false}
                          disabled={e.is_core}
                          onChange={(ev) => toggleEvent(e.id, ev.target.checked)}
                          className="mt-1 h-4 w-4 accent-teal"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-ink">
                            {e.name}
                            {e.is_core ? <span className="ml-2 text-xs font-normal text-muted">(always on)</span> : null}
                          </span>
                          <span className="block text-xs text-muted">{e.description}</span>
                        </span>
                      </label>
                      <div className={`sm:w-72 ${choice?.enabled ? "" : "pointer-events-none opacity-40"}`}>
                        <Segmented<FnbTier>
                          size="sm"
                          options={(Object.keys(FNB_META) as FnbTier[]).map((k) => ({
                            value: k,
                            label: FNB_META[k].label,
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
          </div>

          <ServiceSectionBlock
            title="Core services"
            subtitle="The structural choices: planning, food, the things you can't skip."
            categories={bySection("core")}
            config={config}
            state={state}
            setTier={setTier}
          />
          <ServiceSectionBlock
            title="The details"
            subtitle="Texture and atmosphere. Tune to taste."
            categories={bySection("details")}
            config={config}
            state={state}
            setTier={setTier}
          />
          <ServiceSectionBlock
            title="Moroccan traditions"
            subtitle="The pieces that make it Marrakech, not just a wedding."
            categories={bySection("traditions")}
            config={config}
            state={state}
            setTier={setTier}
          />

          <SavePlanForm state={state} est={est} />
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24">
          <BudgetSummary
            est={est}
            target={state.target}
            onTarget={(n) => setState((s) => ({ ...s, target: n }))}
            comparables={comparables}
          />
        </aside>
      </div>
    </section>
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
      <div className="grid gap-4">
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

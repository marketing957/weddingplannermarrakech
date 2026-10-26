import type { BudgetGroup, PricingConfig, RealWedding } from "@/lib/supabase/types";

export type Ambition = "relaxed" | "polished" | "lavish";
export type FnbTier = "standard" | "premium" | "luxury";

export type EventChoice = { enabled: boolean; fnb: FnbTier };

export type SimulatorState = {
  guests: number;
  seasonId: string;
  venueId: string;
  ambition: Ambition;
  events: Record<string, EventChoice>;
  tiers: Record<string, string>; // categoryId -> tier key
  target: number;
};

export type BreakdownLine = {
  group: BudgetGroup;
  label: string;
  amount: number;
  share: number; // 0..1
};

export type Estimate = {
  total: number;
  low: number;
  high: number;
  perGuest: number;
  eventCount: number;
  breakdown: BreakdownLine[];
  overCapacity: boolean;
  venueMax: number;
};

export const GROUP_LABELS: Record<BudgetGroup, string> = {
  venue: "Venue & spaces",
  fnb: "Food & beverage",
  planning: "Planning",
  decor: "Florals & decor",
  photo: "Photo & film",
  music: "Music & entertainment",
  beauty: "Beauty & attire",
  traditions: "Traditions & extras",
};

export const GROUP_ORDER: BudgetGroup[] = [
  "venue",
  "fnb",
  "planning",
  "decor",
  "photo",
  "music",
  "beauty",
  "traditions",
];

export const AMBITION_META: Record<Ambition, { label: string; hint: string; venue: number; decor: number }> = {
  relaxed: { label: "Relaxed", hint: "Let the space speak. Minimal dressing.", venue: 0.92, decor: 0.8 },
  polished: { label: "Polished", hint: "Considered, finished, nothing missing.", venue: 1.0, decor: 1.0 },
  lavish: { label: "Lavish", hint: "Installations, lighting design, drama.", venue: 1.15, decor: 1.4 },
};

export const FNB_META: Record<FnbTier, { label: string; hint: string }> = {
  standard: { label: "Standard", hint: "Generous Moroccan buffet, house wine" },
  premium: { label: "Premium", hint: "Plated menu, premium bar" },
  luxury: { label: "Luxury", hint: "Chef-led tasting menu, champagne" },
};

export function roundTo(n: number, step: number) {
  return Math.round(n / step) * step;
}

export function initialState(config: PricingConfig): SimulatorState {
  const events: Record<string, EventChoice> = {};
  for (const e of config.events) events[e.id] = { enabled: e.is_core, fnb: "standard" };

  const tiers: Record<string, string> = {};
  for (const c of config.categories) {
    const def = config.tiers.find((t) => t.category_id === c.id && t.is_default) ??
      config.tiers.find((t) => t.category_id === c.id);
    if (def) tiers[c.id] = def.key;
  }

  return {
    guests: 44,
    seasonId: config.seasons.find((s) => s.id === "peak")?.id ?? config.seasons[0]?.id ?? "",
    venueId: config.venues[0]?.id ?? "",
    ambition: "polished",
    events,
    tiers,
    target: 20000,
  };
}

export function estimate(config: PricingConfig, s: SimulatorState): Estimate {
  const season = config.seasons.find((x) => x.id === s.seasonId);
  const venue = config.venues.find((x) => x.id === s.venueId);
  const seasonMult = Number(season?.multiplier ?? 1);
  const ambition = AMBITION_META[s.ambition];
  const guests = Math.max(2, s.guests);

  const enabledEvents = config.events.filter((e) => s.events[e.id]?.enabled);
  const eventCount = Math.max(1, enabledEvents.length);
  const extraEvents = Math.max(0, enabledEvents.filter((e) => !e.is_core).length);

  const totals: Record<BudgetGroup, number> = {
    venue: 0, fnb: 0, planning: 0, decor: 0, photo: 0, music: 0, beauty: 0, traditions: 0,
  };

  // Venue: hire fee scales with guests, season and how hard the space is dressed.
  if (venue) {
    totals.venue += (venue.base_fee + venue.per_guest * guests) * seasonMult * ambition.venue;
    totals.venue += extraEvents * venue.base_fee * 0.25; // extra spaces / set-ups
  }

  // Food & beverage per event.
  for (const e of enabledEvents) {
    const tier = s.events[e.id]?.fnb ?? "standard";
    const perGuest =
      tier === "luxury" ? e.fnb_luxury : tier === "premium" ? e.fnb_premium : e.fnb_standard;
    totals.fnb += perGuest * guests * seasonMult;
  }

  // Service categories.
  for (const c of config.categories) {
    const tier = config.tiers.find((t) => t.category_id === c.id && t.key === s.tiers[c.id]);
    if (!tier) continue;
    let amount = tier.fixed_cost + tier.per_guest_cost * guests;

    switch (c.id) {
      case "staffing":
        // Staff every event; secondary events are lighter.
        amount = amount * (1 + extraEvents * 0.6);
        break;
      case "decor":
        amount = amount * ambition.decor * (1 + extraEvents * 0.35);
        break;
      case "photo":
        amount += extraEvents * 500;
        break;
      case "music":
        amount += extraEvents * 800;
        break;
    }

    totals[c.budget_group] += amount;
  }

  const total = Object.values(totals).reduce((a, b) => a + b, 0);

  const breakdown: BreakdownLine[] = GROUP_ORDER.map((g) => ({
    group: g,
    label: GROUP_LABELS[g],
    amount: Math.round(totals[g]),
    share: total > 0 ? totals[g] / total : 0,
  }));

  return {
    total: Math.round(total),
    low: Math.round(total * 0.9),
    high: Math.round(total * 1.1),
    perGuest: Math.round(total / guests),
    eventCount,
    breakdown,
    overCapacity: venue ? guests > venue.max_guests : false,
    venueMax: venue?.max_guests ?? 0,
  };
}

export function closestWeddings(all: RealWedding[], guests: number, n = 3): RealWedding[] {
  return [...all]
    .sort((a, b) => Math.abs(a.guest_count - guests) - Math.abs(b.guest_count - guests))
    .slice(0, n);
}

export const PRESETS: Array<{
  id: string;
  label: string;
  hint: string;
  apply: (s: SimulatorState) => SimulatorState;
}> = [
  {
    id: "intimate",
    label: "Intimate riad",
    hint: "40 guests · one evening",
    apply: (s) => ({
      ...s,
      guests: 40,
      venueId: "riad",
      seasonId: "shoulder",
      ambition: "polished",
      target: 25000,
      events: setEvents(s.events, { ceremony_reception: "standard" }),
      tiers: { ...s.tiers, planning: "day_of", decor: "essential", music: "dj", photo: "photo", attire: "caftan_glam", staffing: "essential", henna: "included", hammam: "included", negafa: "none", gnawa: "none" },
    }),
  },
  {
    id: "palmeraie",
    label: "Palmeraie weekend",
    hint: "120 guests · three days",
    apply: (s) => ({
      ...s,
      guests: 120,
      venueId: "villa",
      seasonId: "peak",
      ambition: "polished",
      target: 90000,
      events: setEvents(s.events, { welcome_dinner: "standard", ceremony_reception: "premium", farewell_brunch: "standard" }),
      tiers: { ...s.tiers, planning: "full_weekend", decor: "elevated", music: "dj_live", photo: "photo_film", attire: "gown_suit", staffing: "full", henna: "included", hammam: "included", negafa: "none", gnawa: "included" },
    }),
  },
  {
    id: "desert",
    label: "Desert spectacle",
    hint: "150 guests · full production",
    apply: (s) => ({
      ...s,
      guests: 150,
      venueId: "desert",
      seasonId: "peak",
      ambition: "lavish",
      target: 180000,
      events: setEvents(s.events, { welcome_dinner: "premium", ceremony_reception: "luxury", after_party: "premium" }),
      tiers: { ...s.tiers, planning: "concierge", decor: "production", music: "band_quartet", photo: "crew", attire: "couture", staffing: "white_glove", henna: "included", hammam: "included", negafa: "included", gnawa: "included" },
    }),
  },
  {
    id: "family",
    label: "Family celebration",
    hint: "250 guests · the full tradition",
    apply: (s) => ({
      ...s,
      guests: 250,
      venueId: "palace",
      seasonId: "shoulder",
      ambition: "lavish",
      target: 220000,
      events: setEvents(s.events, { welcome_dinner: "standard", ceremony_reception: "premium" }),
      tiers: { ...s.tiers, planning: "full_weekend", decor: "production", music: "band_quartet", photo: "photo_film", attire: "couture", staffing: "full", henna: "included", hammam: "included", negafa: "included", gnawa: "included" },
    }),
  },
];

function setEvents(
  current: Record<string, EventChoice>,
  enabled: Record<string, FnbTier>,
): Record<string, EventChoice> {
  const next: Record<string, EventChoice> = {};
  for (const id of Object.keys(current)) {
    next[id] = enabled[id] ? { enabled: true, fnb: enabled[id] } : { enabled: false, fnb: current[id].fnb };
  }
  return next;
}


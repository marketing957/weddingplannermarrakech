import { cacheLife, cacheTag } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import type {
  EventType,
  FaqItem,
  Guide,
  MonthData,
  Planner,
  PricingConfig,
  RealWedding,
  SavedPlan,
  Season,
  ServiceCategory,
  ServiceTier,
  Vendor,
  VendorCategory,
  Venue,
  VenueStyle,
  VenueType,
  VoteCount,
} from "@/lib/supabase/types";

const VENUE_PUBLIC =
  "id, slug, name, tier, zone, styles, style_slugs, capacity_seated, capacity_max, sleep_rooms, sleep_guests, min_nights, catering_policy, score_overall, score_quality, score_transparency, score_value, amenities, season_high, season_shoulder, season_low, setting_text, ceremony_text, suits_text, wpm_selection, last_verified, created_at";
const PLANNER_PUBLIC =
  "id, slug, name, tagline, bio, founded_year, languages, price_model, specialties, website, instagram, featured, created_at, website_domain, review_strengths, review_execution, review_suits, review_verdict";
const VENDOR_PUBLIC =
  "id, slug, name, category_slug, website, instagram, styles, languages, score, verified, created_at";

function unwrap<T>(res: { data: unknown; error: { message: string } | null }, label: string): T {
  if (res.error) throw new Error(`Supabase ${label}: ${res.error.message}`);
  return (res.data ?? []) as T;
}

function asVenue(row: unknown): Venue {
  const v = row as Venue;
  return { ...v, price_night_low: v.price_night_low ?? null, price_night_high: v.price_night_high ?? null, costs_text: v.costs_text ?? null };
}

function asPlanner(row: unknown): Planner {
  const p = row as Planner;
  return { ...p, price_from: p.price_from ?? null };
}

function asVendor(row: unknown): Vendor {
  const v = row as Vendor;
  return { ...v, price_from: v.price_from ?? null };
}

async function cookieClientIfSignedIn() {
  const { createCookieClient } = await import("@/lib/supabase/cookie");
  const sb = await createCookieClient();
  const { data } = await sb.auth.getClaims();
  if (!data?.claims) return null;
  return sb;
}

export async function revealVenuePrices(venues: Venue[]): Promise<Venue[]> {
  if (!venues.length) return venues;
  const sb = await cookieClientIfSignedIn();
  if (!sb) return venues;
  const { data } = await sb
    .from("venues")
    .select("id, price_night_low, price_night_high, costs_text")
    .in("id", venues.map((v) => v.id));
  const map = new Map((data ?? []).map((r) => [r.id as string, r]));
  return venues.map((v) => {
    const extra = map.get(v.id);
    return extra
      ? {
          ...v,
          price_night_low: extra.price_night_low as number | null,
          price_night_high: extra.price_night_high as number | null,
          costs_text: extra.costs_text as string | null,
        }
      : v;
  });
}

export async function revealPlannerPrices(planners: Planner[]): Promise<Planner[]> {
  if (!planners.length) return planners;
  const sb = await cookieClientIfSignedIn();
  if (!sb) return planners;
  const { data } = await sb.from("planners").select("id, price_from").in("id", planners.map((p) => p.id));
  const map = new Map((data ?? []).map((r) => [r.id as string, r.price_from as number | null]));
  return planners.map((p) => ({ ...p, price_from: map.has(p.id) ? map.get(p.id)! : p.price_from }));
}

export async function revealVendorPrices(vendors: Vendor[]): Promise<Vendor[]> {
  if (!vendors.length) return vendors;
  const sb = await cookieClientIfSignedIn();
  if (!sb) return vendors;
  const { data } = await sb.from("vendors").select("id, price_from").in("id", vendors.map((v) => v.id));
  const map = new Map((data ?? []).map((r) => [r.id as string, r.price_from as number | null]));
  return vendors.map((v) => ({ ...v, price_from: map.has(v.id) ? map.get(v.id)! : v.price_from }));
}

export async function getPricingConfig(): Promise<PricingConfig> {
  "use cache";
  cacheLife("hours");
  cacheTag("pricing-v3");

  const sb = createServerClient();
  const [seasons, venues, events, categories, tiers, realWeddings] = await Promise.all([
    sb.from("seasons").select("*").order("sort_order"),
    sb.from("venue_types").select("*").order("sort_order"),
    sb.from("event_types").select("*").order("sort_order"),
    sb.from("service_categories").select("*").order("sort_order"),
    sb.from("service_tiers").select("*").order("sort_order"),
    sb.from("real_weddings").select("*").order("guest_count"),
  ]);

  const vendors = unwrap<unknown[]>(
    await sb.from("vendors").select(VENDOR_PUBLIC).eq("verified", true).order("score", { ascending: false }),
    "vendors",
  ).map(asVendor);
  const matched: PricingConfig["matched"] = {};
  for (const v of vendors) {
    if (!matched[v.category_slug]) {
      matched[v.category_slug] = { name: v.name, score: Number(v.score), category: v.category_slug };
    }
  }

  return {
    seasons: unwrap<Season[]>(seasons, "seasons"),
    venues: unwrap<VenueType[]>(venues, "venue_types"),
    events: unwrap<EventType[]>(events, "event_types"),
    categories: unwrap<ServiceCategory[]>(categories, "service_categories"),
    tiers: unwrap<ServiceTier[]>(tiers, "service_tiers"),
    realWeddings: unwrap<RealWedding[]>(realWeddings, "real_weddings"),
    matched,
  };
}

const PLANNER_REV = "2026-10-23-real-planners";

export async function getPlanners(): Promise<Planner[]> {
  return readPlanners(PLANNER_REV);
}

async function readPlanners(revision: string): Promise<Planner[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("planners-v6", revision);

  const sb = createServerClient();
  return unwrap<unknown[]>(
    await sb.from("planners").select(PLANNER_PUBLIC).order("featured", { ascending: false }).order("name"),
    "planners",
  ).map(asPlanner);
}

export async function getPlannerBySlug(slug: string): Promise<Planner | null> {
  return readPlanner(slug, PLANNER_REV);
}

async function readPlanner(slug: string, revision: string): Promise<Planner | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("planners-v6", revision, `planner:${slug}`);

  const sb = createServerClient();
  const { data, error } = await sb.from("planners").select(PLANNER_PUBLIC).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Supabase planner: ${error.message}`);
  return data ? asPlanner(data) : null;
}

export async function getFaqs(section: FaqItem["section"]): Promise<FaqItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("faqs-v3");

  const sb = createServerClient();
  return unwrap<FaqItem[]>(
    await sb.from("faq_items").select("*").eq("section", section).order("sort_order"),
    "faq_items",
  );
}

export async function getGuides(): Promise<Guide[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("guides-v2");

  const sb = createServerClient();
  return unwrap<Guide[]>(
    await sb.from("guides").select("*").order("published_at", { ascending: false }),
    "guides",
  );
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("guides-v2", `guide:${slug}`);

  const sb = createServerClient();
  const { data, error } = await sb.from("guides").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Supabase guide: ${error.message}`);
  return (data as Guide | null) ?? null;
}

export async function getVenues(): Promise<Venue[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("venues-v2");
  const sb = createServerClient();
  return unwrap<unknown[]>(
    await sb.from("venues").select(VENUE_PUBLIC).order("score_overall", { ascending: false }),
    "venues",
  ).map(asVenue);
}

export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("venues-v2", `venue:${slug}`);
  const sb = createServerClient();
  const { data, error } = await sb.from("venues").select(VENUE_PUBLIC).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Supabase venue: ${error.message}`);
  return data ? asVenue(data) : null;
}

export async function getVenueStyles(): Promise<VenueStyle[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("venues-v2");
  const sb = createServerClient();
  return unwrap<VenueStyle[]>(
    await sb.from("venue_styles").select("*").order("sort_order"),
    "venue_styles",
  );
}

export async function getVendorCategories(): Promise<VendorCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("vendors-v5");
  const sb = createServerClient();
  return unwrap<VendorCategory[]>(
    await sb.from("vendor_categories").select("*").order("sort_order"),
    "vendor_categories",
  );
}

const VENDOR_REV = "2026-10-23-all-services";

export async function getVendors(): Promise<Vendor[]> {
  return readVendors(VENDOR_REV);
}

async function readVendors(revision: string): Promise<Vendor[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("vendors-v5", revision);
  const sb = createServerClient();
  return unwrap<unknown[]>(
    await sb.from("vendors").select(VENDOR_PUBLIC).order("score", { ascending: false }),
    "vendors",
  ).map(asVendor);
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  return readVendor(slug, VENDOR_REV);
}

async function readVendor(slug: string, revision: string): Promise<Vendor | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("vendors-v5", revision, `vendor:${slug}`);
  const sb = createServerClient();
  const { data, error } = await sb.from("vendors").select(VENDOR_PUBLIC).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Supabase vendor: ${error.message}`);
  return data ? asVendor(data) : null;
}

export async function getMonths(): Promise<MonthData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("months-v2");
  const sb = createServerClient();
  return unwrap<MonthData[]>(await sb.from("months").select("*").order("month"), "months");
}

export async function getVoteTallies(type: VoteCount["target_type"]): Promise<Record<string, VoteCount>> {
  const sb = createServerClient();
  const { data, error } = await sb.rpc("vote_tallies", { p_type: type });
  if (error) return {};
  const map: Record<string, VoteCount> = {};
  for (const row of (data ?? []) as Array<{ target_id: string; up: number; down: number }>) {
    map[row.target_id] = {
      target_type: type,
      target_id: row.target_id,
      up: Number(row.up),
      down: Number(row.down),
    };
  }
  return map;
}

export async function getSavedPlans(userId: string): Promise<SavedPlan[]> {
  const { createCookieClient } = await import("@/lib/supabase/cookie");
  const sb = await createCookieClient();
  const { data, error } = await sb
    .from("saved_plans")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Supabase saved_plans: ${error.message}`);
  return (data ?? []) as SavedPlan[];
}

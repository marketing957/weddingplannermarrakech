import { cacheLife, cacheTag } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import type {
  EventType,
  FaqItem,
  Guide,
  Planner,
  PricingConfig,
  RealWedding,
  Season,
  ServiceCategory,
  ServiceTier,
  VenueType,
} from "@/lib/supabase/types";

function unwrap<T>(res: { data: T | null; error: { message: string } | null }, label: string): T {
  if (res.error) throw new Error(`Supabase ${label}: ${res.error.message}`);
  return (res.data ?? []) as T;
}

export async function getPricingConfig(): Promise<PricingConfig> {
  "use cache";
  cacheLife("hours");
  cacheTag("pricing");

  const sb = createServerClient();
  const [seasons, venues, events, categories, tiers, realWeddings] = await Promise.all([
    sb.from("seasons").select("*").order("sort_order"),
    sb.from("venue_types").select("*").order("sort_order"),
    sb.from("event_types").select("*").order("sort_order"),
    sb.from("service_categories").select("*").order("sort_order"),
    sb.from("service_tiers").select("*").order("sort_order"),
    sb.from("real_weddings").select("*").order("guest_count"),
  ]);

  return {
    seasons: unwrap<Season[]>(seasons, "seasons"),
    venues: unwrap<VenueType[]>(venues, "venue_types"),
    events: unwrap<EventType[]>(events, "event_types"),
    categories: unwrap<ServiceCategory[]>(categories, "service_categories"),
    tiers: unwrap<ServiceTier[]>(tiers, "service_tiers"),
    realWeddings: unwrap<RealWedding[]>(realWeddings, "real_weddings"),
  };
}

export async function getPlanners(): Promise<Planner[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("planners");

  const sb = createServerClient();
  return unwrap<Planner[]>(await sb.from("planners").select("*").order("name"), "planners");
}

export async function getPlannerBySlug(slug: string): Promise<Planner | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("planners", `planner:${slug}`);

  const sb = createServerClient();
  const { data, error } = await sb.from("planners").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Supabase planner: ${error.message}`);
  return (data as Planner | null) ?? null;
}

export async function getFaqs(section: FaqItem["section"]): Promise<FaqItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("faqs");

  const sb = createServerClient();
  return unwrap<FaqItem[]>(
    await sb.from("faq_items").select("*").eq("section", section).order("sort_order"),
    "faq_items",
  );
}

export async function getGuides(): Promise<Guide[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("guides");

  const sb = createServerClient();
  return unwrap<Guide[]>(
    await sb.from("guides").select("*").order("published_at", { ascending: false }),
    "guides",
  );
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("guides", `guide:${slug}`);

  const sb = createServerClient();
  const { data, error } = await sb.from("guides").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Supabase guide: ${error.message}`);
  return (data as Guide | null) ?? null;
}

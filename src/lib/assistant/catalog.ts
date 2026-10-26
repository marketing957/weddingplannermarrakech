import { getFaqs, getMonths, getPlanners, getVendors, getVenues } from "@/lib/data";
import { featuredFirst, isHouseVendor } from "@/lib/partners";
import type { CatalogBrief } from "./types";

export async function loadCatalogBrief(): Promise<CatalogBrief> {
  try {
    const [venues, planners, vendors, months, general, plannerGuide] = await Promise.all([
      getVenues(),
      getPlanners(),
      getVendors(),
      getMonths(),
      getFaqs("general"),
      getFaqs("planner_guide"),
    ]);

    return {
      venues: venues
        .slice(0, 28)
        .map(
          (v) =>
            `${v.name} | ${v.zone} | ${v.tier} | ${v.capacity_seated} seated | ${v.styles.slice(0, 3).join("/")} | /venues/${v.slug}`,
        )
        .join("\n"),
      planners: featuredFirst(planners)
        .slice(0, 20)
        .map(
          (p) =>
            `${p.name} | ${p.tagline ?? ""} | ${p.languages.join(", ")} | ${p.specialties.slice(0, 3).join(", ")} | /planners/${p.slug}`,
        )
        .join("\n"),
      vendors: [...vendors]
        .sort((a, b) => Number(isHouseVendor(b.slug)) - Number(isHouseVendor(a.slug)))
        .slice(0, 24)
        .map((v) => `${v.name} | ${v.category_slug.replace(/-/g, " ")} | /vendors/${v.slug}`)
        .join("\n"),
      months: months
        .map(
          (m) =>
            `${m.name}: score ${Number(m.score).toFixed(1)}, ${m.verdict}, ${m.temp_high}°/${m.temp_low}°, ${m.rain_days} rain days, ${m.availability} availability`,
        )
        .join("\n"),
      faqs: [...general, ...plannerGuide]
        .slice(0, 16)
        .map((f) => `Q: ${f.question}\nA: ${f.answer}${f.link_href ? `\nSee: ${f.link_href}` : ""}`)
        .join("\n\n"),
    };
  } catch {
    return { venues: "", planners: "", vendors: "", months: "", faqs: "" };
  }
}

export function catalogToPrompt(brief: CatalogBrief): string {
  const blocks = [
    brief.venues && `VENUES\n${brief.venues}`,
    brief.planners && `PLANNERS\n${brief.planners}`,
    brief.vendors && `VENDORS (names only; prices unlock with a free account)\n${brief.vendors}`,
    brief.months && `SEASON MONTHS\n${brief.months}`,
    brief.faqs && `FAQ\n${brief.faqs}`,
  ].filter(Boolean);
  return blocks.join("\n\n").slice(0, 9000);
}

import type { MetadataRoute } from "next";
import { getGuides, getPlanners, getVendors, getVenues } from "@/lib/data";
import { photosForVenue } from "@/lib/photos";
import { absUrl } from "@/lib/seo";
import { localePath } from "@/i18n";

const STATIC_PATHS: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/planners", priority: 0.9, changeFrequency: "weekly" },
  { path: "/venues", priority: 0.9, changeFrequency: "weekly" },
  { path: "/vendors", priority: 0.8, changeFrequency: "weekly" },
  { path: "/map", priority: 0.8, changeFrequency: "monthly" },
  { path: "/wedding-date-optimizer", priority: 0.8, changeFrequency: "monthly" },
  { path: "/checklist", priority: 0.7, changeFrequency: "monthly" },
  { path: "/timeline", priority: 0.7, changeFrequency: "monthly" },
  { path: "/legal", priority: 0.7, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.8, changeFrequency: "weekly" },
  { path: "/our-services", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

function localized(path: string, extra: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">): MetadataRoute.Sitemap {
  const en = absUrl(path);
  const fr = absUrl(localePath("fr", path));
  const languages = { en, fr, "x-default": en };
  return [
    { url: en, alternates: { languages }, ...extra },
    { url: fr, alternates: { languages }, ...extra },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [venues, planners, vendors, guides] = await Promise.all([
    getVenues(),
    getPlanners(),
    getVendors(),
    getGuides(),
  ]);

  const lastModified = "2026-10-09";

  return [
    ...STATIC_PATHS.flatMap((p) =>
      localized(p.path, {
        lastModified,
        changeFrequency: p.changeFrequency,
        priority: p.priority,
      }),
    ),
    ...venues.flatMap((v) =>
      localized(`/venues/${v.slug}`, {
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
        images: photosForVenue(v, "en", 4).map((p) => p.src),
      }),
    ),
    ...planners.flatMap((p) =>
      localized(`/planners/${p.slug}`, { lastModified, changeFrequency: "monthly", priority: 0.7 }),
    ),
    ...vendors.flatMap((v) =>
      localized(`/vendors/${v.slug}`, { lastModified, changeFrequency: "monthly", priority: 0.5 }),
    ),
    ...guides.flatMap((g) =>
      localized(`/guides/${g.slug}`, { lastModified, changeFrequency: "monthly", priority: 0.7 }),
    ),
  ];
}

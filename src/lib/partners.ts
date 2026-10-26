/** House desk. Listed first in every vendor category. */
export const HOUSE = {
  name: "Asimetrica Prod",
  plannerSlug: "asimetrica-prod",
  plannerHref: "/planners/asimetrica-prod",
  website: "https://asimetricaprod.com",
  instagram: "@asimetricaprod",
  whatsappE164: "212660305536",
  vendorSlugs: [
    "asimetrica-prod-photo",
    "asimetrica-prod-flowers",
    "asimetrica-prod-dj",
    "asimetrica-prod-catering",
    "asimetrica-prod-cake",
    "asimetrica-prod-beauty",
    "asimetrica-prod-lights",
    "asimetrica-prod-show",
  ],
} as const;

export function isHousePlanner(slug: string): boolean {
  return slug === HOUSE.plannerSlug;
}

export function isHouseVendor(slug: string): boolean {
  return slug.startsWith("asimetrica-prod");
}

export function featuredFirst<T extends { featured: boolean; slug: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ah = isHousePlanner(a.slug) || a.featured ? 1 : 0;
    const bh = isHousePlanner(b.slug) || b.featured ? 1 : 0;
    return bh - ah;
  });
}

export function whatsappHref(text: string): string {
  return `https://wa.me/${HOUSE.whatsappE164}?text=${encodeURIComponent(text)}`;
}

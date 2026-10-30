/** House desk. Leads lighting and LED; other services follow the vote list. */
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

/** Sound, lighting and LED — the lists this desk leads. */
export function leadsCategory(slug: string): boolean {
  return slug === "asimetrica-prod-lights" || slug === "asimetrica-prod-show";
}

export function whatsappHref(text: string): string {
  return `https://wa.me/${HOUSE.whatsappE164}?text=${encodeURIComponent(text)}`;
}

import { ASIMETRICA_SHOTS } from "@/lib/asimetrica";

/** Portfolio photos published on each planner's own website, stored in public/photos/planners. */
const PHOTO_COUNT: Record<string, number> = {
  "amelie-wedding": 6,
  "philocaly-weddings": 5,
  "amaria-events": 6,
  "studio-maev": 6,
  "ceremonia-event": 6,
  "exceptional-moment": 6,
  "redkeys-marrakech": 6,
  "zinevent-marrakech": 6,
  "the-souk-department": 6,
  "boutique-souk": 6,
  "la-perle-events": 6,
  "instants-magiques": 6,
};

export function plannerPhotos(slug: string, name: string): { src: string; alt: string }[] {
  if (slug === "asimetrica-prod") return ASIMETRICA_SHOTS.map(({ src, alt }) => ({ src, alt }));
  const count = PHOTO_COUNT[slug] ?? 0;
  return Array.from({ length: count }, (_, i) => ({
    src: `/photos/planners/${slug}/${i + 1}.webp`,
    alt: `Wedding by ${name}, photo ${i + 1}`,
  }));
}

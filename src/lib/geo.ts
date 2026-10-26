export type LatLng = { lat: number; lng: number };

export const ZONE_META: Record<
  string,
  LatLng & { label: string; drive: string; guests: string; blurb: string; color: string }
> = {
  Medina: {
    lat: 31.6295,
    lng: -7.9811,
    label: "Medina",
    drive: "25 min from airport",
    guests: "20–120",
    blurb: "Riads and palaces inside the walls. Intimate, atmospheric, carts not coaches.",
    color: "#0d6b5c",
  },
  Hivernage: {
    lat: 31.6205,
    lng: -8.008,
    label: "Hivernage",
    drive: "20 min from airport",
    guests: "80–300",
    blurb: "Grand hotels on the edge of the medina. Rooms on site, easy guest access.",
    color: "#0a5247",
  },
  Palmeraie: {
    lat: 31.668,
    lng: -7.973,
    label: "Palmeraie",
    drive: "20 min from airport",
    guests: "50–400",
    blurb: "Palm grove north of the city. Villas, gardens, pools, full creative control.",
    color: "#5a7a4e",
  },
  Agafay: {
    lat: 31.48,
    lng: -8.15,
    label: "Agafay desert",
    drive: "45 min from airport",
    guests: "20–180",
    blurb: "Stone desert camps with the Atlas behind. Spectacular, everything is brought in.",
    color: "#c4a574",
  },
  "Atlas / Asni": {
    lat: 31.246,
    lng: -7.981,
    label: "Atlas / Asni",
    drive: "1 hr from airport",
    guests: "40–120",
    blurb: "Mountain kasbahs. Cooler air, dramatic views, plan the coach transfers.",
    color: "#7a6a4a",
  },
  "Ourika valley": {
    lat: 31.37,
    lng: -7.78,
    label: "Ourika valley",
    drive: "50 min from airport",
    guests: "40–150",
    blurb: "Kasbahs an hour south. Strong for summer dates.",
    color: "#6b8f71",
  },
  "Route d'Amizmiz": {
    lat: 31.548,
    lng: -8.05,
    label: "Route d'Amizmiz",
    drive: "25 min from airport",
    guests: "100–400",
    blurb: "Resort estates on the road south. Scale without the medina's constraints.",
    color: "#8a5a44",
  },
  "Route de Fès": {
    lat: 31.66,
    lng: -7.94,
    label: "Route de Fès",
    drive: "20 min from airport",
    guests: "80–250",
    blurb: "Garden estates heading north-east of the city.",
    color: "#6d7a4e",
  },
  "Route de l'Ourika": {
    lat: 31.58,
    lng: -7.95,
    label: "Route de l'Ourika",
    drive: "20 min from airport",
    guests: "60–250",
    blurb: "Villas on the road toward the valley. Close to town, more space than a riad.",
    color: "#9a6b4a",
  },
  "Route de Ouarzazate": {
    lat: 31.599,
    lng: -7.921,
    label: "Route de Ouarzazate",
    drive: "20 min from airport",
    guests: "80–350",
    blurb: "Palace hotels just outside the city, facing the desert road.",
    color: "#b08a5a",
  },
  "Route du Golf": {
    lat: 31.625,
    lng: -7.955,
    label: "Route du Golf",
    drive: "18 min from airport",
    guests: "80–200",
    blurb: "Golf-course resorts. Green, spacious, hotel logistics.",
    color: "#4e7a5a",
  },
  "Route du Barrage": {
    lat: 31.59,
    lng: -8.025,
    label: "Route du Barrage",
    drive: "25 min from airport",
    guests: "80–250",
    blurb: "Country clubs and gardens on the west side of town.",
    color: "#7a8f5a",
  },
  "Lalla Takerkoust": {
    lat: 31.36,
    lng: -8.13,
    label: "Lalla Takerkoust",
    drive: "40 min from airport",
    guests: "40–150",
    blurb: "Lake and hills. Sunset light, cooler evenings.",
    color: "#4a7a8a",
  },
  Essaouira: {
    lat: 31.5085,
    lng: -9.7595,
    label: "Essaouira",
    drive: "2.5 hr from Marrakesh",
    guests: "40–150",
    blurb: "Atlantic medina and beach villas. A different weekend entirely.",
    color: "#4a6a8a",
  },
  "Skoura / Desert": {
    lat: 31.063,
    lng: -6.579,
    label: "Skoura / Desert",
    drive: "4 hr from Marrakesh",
    guests: "20–80",
    blurb: "Oasis palaces beyond the Atlas. For couples who want the road trip.",
    color: "#c4a574",
  },
};

const EXACT: Record<string, LatLng> = {
  "la-mamounia-wedding-cost": { lat: 31.6208, lng: -8.0006 },
  "royal-mansour-wedding-cost": { lat: 31.6253, lng: -7.9894 },
  "palais-namaskar-wedding-cost": { lat: 31.6892, lng: -7.9681 },
  "selman-marrakech-wedding-cost": { lat: 31.5478, lng: -8.0476 },
  "amanjena-wedding-cost": { lat: 31.5994, lng: -7.9208 },
  "kasbah-tamadot-wedding-cost": { lat: 31.2462, lng: -7.9814 },
  "beldi-country-club-wedding-cost": { lat: 31.5902, lng: -8.0251 },
  "fairmont-royal-palm-wedding-cost": { lat: 31.5448, lng: -8.0552 },
  "mandarin-oriental-wedding-cost": { lat: 31.6249, lng: -7.9548 },
  "dar-ahlam-wedding-cost": { lat: 31.0634, lng: -6.5789 },
  "four-seasons-marrakech-wedding-cost": { lat: 31.6182, lng: -8.0124 },
  "oberoi-marrakech-wedding-cost": { lat: 31.6012, lng: -7.9185 },
  "la-pause-wedding-cost": { lat: 31.492, lng: -8.162 },
  "scarabeo-camp-wedding-cost": { lat: 31.475, lng: -8.148 },
  "inara-camp-wedding-cost": { lat: 31.468, lng: -8.138 },
};

function hashOffset(slug: string): LatLng {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const a = ((h % 1000) / 1000 - 0.5) * 0.028;
  const b = (((h / 1000) % 1000) / 1000 - 0.5) * 0.028;
  return { lat: a, lng: b };
}

export function pinForVenue(slug: string, zone: string): LatLng {
  if (EXACT[slug]) return EXACT[slug];
  const z = ZONE_META[zone] ?? ZONE_META.Palmeraie;
  const o = hashOffset(slug);
  return { lat: z.lat + o.lat, lng: z.lng + o.lng };
}

export const MAP_CENTER: LatLng = { lat: 31.58, lng: -7.98 };
export const MAP_ZOOM = 10;

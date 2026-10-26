import type { Locale } from "@/i18n";
import { realShotsFor, type RealShot } from "@/lib/real-photos";

export type PhotoContext = "riad" | "palace" | "hotel" | "garden" | "desert" | "mountain" | "coast" | "lakeside";

export type VenuePhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  searchQuery: string;
  fileName: string;
  credit: string;
  licenseName: string;
  licenseUrl: string;
  context: PhotoContext;
  setting: string;
};

export type PhotoVenue = {
  slug: string;
  name: string;
  zone: string;
  styles: string[];
  style_slugs?: string[];
  tier?: string;
  capacity_seated?: number;
};

function fileStem(venue: PhotoVenue, setting: string): string {
  const raw = `${venue.name} marrakech wedding ${venue.zone} ${setting}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return raw.slice(0, 96);
}

function contextFor(shot: RealShot, zone: string): PhotoContext {
  const text = `${shot.setting} ${zone}`.toLowerCase();
  if (/agafay|desert|skoura/.test(text)) return "desert";
  if (/atlas|ourika|kasbah/.test(text)) return "mountain";
  if (/essaouira|atlantic|coast/.test(text)) return "coast";
  if (/takerkoust|lake|reservoir|barrage/.test(text)) return "lakeside";
  if (/palmeraie|garden/.test(text)) return "garden";
  if (/mamounia|four seasons|palace|namaskar|aman/.test(text)) return "palace";
  if (/riad|medina|koutoubia|jemaa/.test(text)) return "riad";
  return "hotel";
}

function toPhoto(venue: PhotoVenue, shot: RealShot, locale: Locale, index: number): VenuePhoto {
  const fr = locale === "fr";
  const setting = fr ? shot.settingFr : shot.setting;
  const seated = venue.capacity_seated ? (fr ? `${venue.capacity_seated} couverts` : `${venue.capacity_seated} seated`) : "";
  const searchQuery = fr
    ? `${venue.name} mariage Marrakesh ${venue.zone} ${setting}`
    : `${venue.name} Marrakesh wedding ${venue.zone} ${setting}`;
  const place = fr
    ? `${venue.name}, lieu de mariage à ${venue.zone}, Marrakesh`
    : `${venue.name} wedding venue in ${venue.zone}, Marrakesh`;
  const alt =
    shot.depicts === "venue"
      ? `${place} — ${setting}${seated ? `, ${seated}` : ""}`
      : fr
        ? `${setting} — cadre réel de ${place}${seated ? `, ${seated}` : ""}`
        : `${setting} — the real setting for ${place}${seated ? `, ${seated}` : ""}`;
  const caption =
    shot.depicts === "venue"
      ? fr
        ? `${venue.name} · ${venue.zone}, Marrakesh. ${setting}.`
        : `${venue.name} · ${venue.zone}, Marrakesh. ${setting}.`
      : fr
        ? `${setting}. Photographie du cadre autour de ${venue.name} (${venue.zone}), pas une brochure de l'établissement.`
        : `${setting}. Photograph of the real area around ${venue.name} (${venue.zone}), not a brochure of the property.`;
  return {
    id: `${venue.slug}-${index}`,
    src: shot.src,
    width: shot.width,
    height: shot.height,
    alt,
    caption,
    searchQuery,
    fileName: `${fileStem(venue, shot.setting)}.jpg`,
    credit: shot.credit,
    licenseName: shot.licenseName,
    licenseUrl: shot.licenseUrl,
    context: contextFor(shot, venue.zone),
    setting,
  };
}

export function photosForVenue(venue: PhotoVenue, locale: Locale = "en", count = 4): VenuePhoto[] {
  return realShotsFor(venue.slug, venue.zone, count).map((shot, index) => toPhoto(venue, shot, locale, index));
}

export function heroPhoto(venue: PhotoVenue, locale: Locale = "en"): VenuePhoto {
  return photosForVenue(venue, locale, 1)[0];
}

export function mapPhotoFields(venue: PhotoVenue, locale: Locale = "en") {
  const photo = heroPhoto(venue, locale);
  return {
    photoUrl: photo.src,
    photoAlt: photo.alt,
    photoSearch: photo.searchQuery,
  };
}

export function zonePhoto(zone: string, locale: Locale = "en"): VenuePhoto | null {
  const dummy: PhotoVenue = { slug: `zone-${zone}`, name: zone, zone, styles: [] };
  return photosForVenue(dummy, locale, 1)[0] ?? null;
}

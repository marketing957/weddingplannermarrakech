import { hreflangLanguages, localePath, type Locale } from "@/i18n";

export const SITE_NAME = "Wedding Planner Marrakesh";
export const SITE_TAGLINE = "Independent planners, venues and real costs for a Marrakesh wedding.";

export const SITE_DESCRIPTION =
  "Wedding Planner Marrakesh: compare independent planners, riads and palaces, and run a free budget simulator built from real Marrakesh weddings. No commission.";

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function absUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${p === "/" ? "/" : p}`;
}

export function absLocaleUrl(locale: Locale, path = "/"): string {
  return absUrl(localePath(locale, path));
}

export function pageAlternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: hreflangLanguages(path),
  };
}

export const LOCAL_SEO = {
  city: "Marrakesh",
  region: "Marrakesh-Safi",
  country: "MA",
  countryName: "Morocco",
  email: "hello@weddingplannermarrakech.local",
  sameAs: [] as string[],
};

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: SITE_NAME,
    alternateName: ["WPM", "Wedding Planner Marrakesh"],
    url,
    description: SITE_DESCRIPTION,
    email: LOCAL_SEO.email,
    areaServed: [
      { "@type": "City", name: "Marrakesh" },
      { "@type": "Country", name: "Morocco" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakesh",
      addressRegion: LOCAL_SEO.region,
      addressCountry: LOCAL_SEO.country,
    },
    knowsAbout: [
      "Wedding planner Marrakesh",
      "Destination wedding Marrakesh",
      "Marrakesh wedding venues",
      "Marrakesh wedding budget",
    ],
  };
}

export function websiteLd(locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absLocaleUrl(locale, "/"),
    inLanguage: locale,
    description: SITE_DESCRIPTION,
    publisher: { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
  };
}

export function faqLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function venuePlaceLd(
  venue: {
    name: string;
    slug: string;
    zone: string;
    styles: string[];
    capacity_seated: number;
    setting_text: string | null;
  },
  photos: Array<{
    src: string;
    alt: string;
    caption: string;
    searchQuery: string;
    fileName: string;
    credit: string;
    licenseUrl: string;
  }>,
) {
  const hotelish = /hotel|resort|palace|mamounia|mansour|seasons|fairmont|oriental|oberoi|selman|amanjena/i.test(
    `${venue.name} ${venue.styles.join(" ")}`,
  );
  return {
    "@context": "https://schema.org",
    "@type": hotelish ? ["Hotel", "EventVenue"] : ["EventVenue", "Place"],
    name: venue.name,
    alternateName: `${venue.name} Marrakesh wedding venue`,
    url: absUrl(`/venues/${venue.slug}`),
    description:
      venue.setting_text ??
      `${venue.name} is a wedding venue in ${venue.zone}, Marrakesh, Morocco. Capacity ${venue.capacity_seated} seated.`,
    image: photos.map((p) => p.src),
    photo: photos.map((p) => ({
      "@type": "ImageObject",
      contentUrl: p.src,
      url: p.src,
      name: p.fileName,
      description: p.alt,
      caption: p.caption,
      keywords: p.searchQuery,
      creditText: p.credit,
      acquireLicensePage: p.licenseUrl,
      license: p.licenseUrl,
      encodingFormat: "image/jpeg",
      contentLocation: {
        "@type": "Place",
        name: `${venue.zone}, Marrakesh, Morocco`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Marrakesh",
          addressRegion: venue.zone,
          addressCountry: "MA",
        },
      },
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakesh",
      addressRegion: venue.zone,
      addressCountry: "MA",
    },
    containedInPlace: { "@type": "City", name: "Marrakesh" },
    maximumAttendeeCapacity: venue.capacity_seated,
    keywords: [
      `${venue.name} Marrakesh`,
      `${venue.name} wedding`,
      `wedding venue ${venue.zone} Marrakesh`,
      "Wedding Planner Marrakesh",
      ...photos.map((p) => p.searchQuery),
    ].join(", "),
  };
}

export function breadcrumbLd(crumbs: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

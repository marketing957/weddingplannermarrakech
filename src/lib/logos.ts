import localLogos from "../../public/logos/manifest.json";
import { initials } from "@/lib/format";
import { HOUSE } from "@/lib/partners";

const LOCAL = localLogos as Record<string, string>;

const PALETTES = [
  { bg: "#161411", fg: "#F7F4EF", accent: "#B08948" },
  { bg: "#2C3A34", fg: "#F7F4EF", accent: "#D4B483" },
  { bg: "#6B2D3C", fg: "#F7F4EF", accent: "#E8C9A0" },
  { bg: "#1F3A5F", fg: "#F4EFE6", accent: "#C9A227" },
  { bg: "#3D2914", fg: "#F3E6C8", accent: "#C4A35A" },
  { bg: "#4A3728", fg: "#F7F4EF", accent: "#E6C27A" },
  { bg: "#0F2F2A", fg: "#E8F0E8", accent: "#C9A66B" },
  { bg: "#5C1A1A", fg: "#F7F4EF", accent: "#D4A574" },
  { bg: "#2B2B40", fg: "#F0E6D8", accent: "#C4A882" },
  { bg: "#1A3D2F", fg: "#F7F4EF", accent: "#D2B48C" },
  { bg: "#EDE4D4", fg: "#2C3A34", accent: "#8B5E3C" },
  { bg: "#F7F4EF", fg: "#161411", accent: "#B08948" },
] as const;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function generatedMark(slug: string, name: string): string {
  const p = PALETTES[hash(slug) % PALETTES.length];
  const L = initials(name).replace(/&/g, "");
  const shape = hash(slug) % 4;
  let frame = `<rect width="64" height="64" fill="${p.bg}"/>`;
  if (shape === 1) frame = `<rect width="64" height="64" fill="${p.bg}"/><circle cx="32" cy="32" r="28" fill="none" stroke="${p.accent}" stroke-width="2"/>`;
  if (shape === 2) frame = `<rect width="64" height="64" fill="${p.bg}" rx="12"/>`;
  if (shape === 3) frame = `<rect width="64" height="64" fill="${p.bg}"/><rect x="4" y="4" width="56" height="56" fill="none" stroke="${p.accent}" stroke-width="1.5"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>${name}</title>${frame}<text x="32" y="40" text-anchor="middle" font-family="Georgia, serif" font-size="${L.length > 2 ? 16 : 22}" fill="${p.fg}">${L}</text><rect x="20" y="46" width="24" height="2" fill="${p.accent}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function domainFromWebsite(website?: string | null): string | null {
  if (!website) return null;
  try {
    const href = website.includes("://") ? website : `https://${website}`;
    const host = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
    if (!host || host.endsWith("example.com") || host === "localhost") return null;
    return host;
  } catch {
    return null;
  }
}

export function companyLogoSrc(input: {
  slug: string;
  name?: string;
  website?: string | null;
  websiteDomain?: string | null;
}): string {
  if (LOCAL[input.slug]) return LOCAL[input.slug];
  const domain = domainFromWebsite(input.websiteDomain) ?? domainFromWebsite(input.website);
  if (domain === "asimetricaprod.com") return LOCAL[HOUSE.plannerSlug] ?? "/logos/asimetrica-ink.png";
  if (input.name) return generatedMark(input.slug, input.name);
  return `/logos/${input.slug}.svg`;
}

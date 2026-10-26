/**
 * Unique brand marks for every catalog company that has no official logo file.
 */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "logos");
mkdirSync(outDir, { recursive: true });

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
];

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function palette(slug) {
  return PALETTES[hash(slug) % PALETTES.length];
}

function letters(name) {
  const parts = name.replace(/['’&]/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const MOTIFS = {
  mountain: (c) =>
    `<path d="M8 48 L22 22 L32 36 L42 18 L56 48 Z" fill="${c.accent}"/><path d="M22 22 L26 28 L32 36 L28 36 Z" fill="${c.fg}" opacity=".35"/>`,
  lantern: (c) =>
    `<rect x="26" y="14" width="12" height="4" rx="1" fill="${c.accent}"/>
     <path d="M22 20 h20 l3 8 v16 h-26 v-16 Z" fill="${c.fg}"/>
     <rect x="28" y="26" width="8" height="10" fill="${c.accent}" opacity=".85"/>
     <rect x="24" y="44" width="16" height="4" fill="${c.accent}"/>`,
  kasbah: (c) =>
    `<path d="M12 48 V24 H18 V18 H24 V24 H30 V18 H36 V24 H42 V18 H48 V24 H52 V48 Z" fill="${c.fg}"/>
     <rect x="28" y="32" width="8" height="16" fill="${c.accent}"/>`,
  rose: (c) =>
    `<circle cx="32" cy="30" r="10" fill="${c.accent}"/>
     <circle cx="32" cy="30" r="5" fill="${c.bg}"/>
     <circle cx="32" cy="30" r="2" fill="${c.accent}"/>
     <path d="M32 40 C28 46 24 50 32 52 C40 50 36 46 32 40 Z" fill="${c.fg}" opacity=".8"/>`,
  star: (c) =>
    `<path d="M32 12 L36 26 H50 L38 34 L42 48 L32 40 L22 48 L26 34 L14 26 H28 Z" fill="${c.accent}"/>`,
  olive: (c) =>
    `<path d="M20 44 C28 20 44 16 48 28 C40 48 24 50 20 44 Z" fill="${c.accent}"/>
     <ellipse cx="34" cy="30" rx="5" ry="8" transform="rotate(-30 34 30)" fill="${c.fg}"/>`,
  courtyard: (c) =>
    `<rect x="16" y="16" width="32" height="32" fill="none" stroke="${c.fg}" stroke-width="3"/>
     <rect x="28" y="36" width="8" height="12" fill="${c.accent}"/>
     <circle cx="32" cy="28" r="4" fill="${c.accent}"/>`,
  seed: (c) =>
    `<ellipse cx="32" cy="32" rx="12" ry="18" fill="${c.accent}"/>
     <ellipse cx="32" cy="30" rx="5" ry="10" fill="${c.fg}" opacity=".35"/>`,
  river: (c) =>
    `<path d="M12 20 C22 12 28 28 38 20 C48 12 52 24 56 18 L56 48 C46 40 40 52 30 44 C20 36 16 48 12 42 Z" fill="${c.accent}"/>`,
  flower: (c) =>
    `<circle cx="32" cy="22" r="7" fill="${c.accent}"/>
     <circle cx="22" cy="32" r="7" fill="${c.accent}"/>
     <circle cx="42" cy="32" r="7" fill="${c.accent}"/>
     <circle cx="32" cy="42" r="7" fill="${c.accent}"/>
     <circle cx="32" cy="32" r="5" fill="${c.fg}"/>`,
  arch: (c) =>
    `<path d="M16 50 V30 A16 16 0 0 1 48 30 V50 H40 V32 A8 8 0 0 0 24 32 V50 Z" fill="${c.fg}"/>
     <rect x="28" y="40" width="8" height="10" fill="${c.accent}"/>`,
  palm: (c) =>
    `<path d="M32 52 V28" stroke="${c.fg}" stroke-width="3" stroke-linecap="round"/>
     <path d="M32 28 C18 18 14 28 22 30 C16 22 28 14 32 24 C36 14 48 22 42 30 C50 28 46 18 32 28 Z" fill="${c.accent}"/>`,
  sun: (c) =>
    `<circle cx="32" cy="32" r="10" fill="${c.accent}"/>
     ${[0, 45, 90, 135, 180, 225, 270, 315]
       .map((deg) => {
         const r = (deg * Math.PI) / 180;
         const x1 = 32 + Math.cos(r) * 14;
         const y1 = 32 + Math.sin(r) * 14;
         const x2 = 32 + Math.cos(r) * 22;
         const y2 = 32 + Math.sin(r) * 22;
         return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c.fg}" stroke-width="2.5" stroke-linecap="round"/>`;
       })
       .join("")}`,
  aperture: (c) =>
    `<circle cx="32" cy="32" r="18" fill="none" stroke="${c.fg}" stroke-width="3"/>
     <circle cx="32" cy="32" r="8" fill="${c.accent}"/>
     <path d="M32 14 L38 28 L32 32 Z M50 32 L36 38 L32 32 Z M32 50 L26 36 L32 32 Z M14 32 L28 26 L32 32 Z" fill="${c.fg}" opacity=".55"/>`,
  frame: (c) =>
    `<rect x="14" y="16" width="28" height="22" fill="none" stroke="${c.fg}" stroke-width="3"/>
     <rect x="22" y="24" width="28" height="22" fill="${c.accent}" opacity=".9"/>
     <rect x="22" y="24" width="28" height="22" fill="none" stroke="${c.fg}" stroke-width="2"/>`,
  note: (c) =>
    `<ellipse cx="24" cy="42" rx="8" ry="6" fill="${c.fg}"/>
     <ellipse cx="42" cy="38" rx="8" ry="6" fill="${c.fg}"/>
     <path d="M32 42 V16 H50 V38" fill="none" stroke="${c.accent}" stroke-width="3"/>`,
  flame: (c) =>
    `<path d="M32 50 C18 38 22 24 32 14 C42 24 46 38 32 50 Z" fill="${c.accent}"/>
     <path d="M32 46 C24 38 28 28 32 22 C36 28 40 38 32 46 Z" fill="${c.fg}" opacity=".45"/>`,
  leaf: (c) =>
    `<path d="M16 40 C16 22 32 12 48 16 C48 36 32 52 16 40 Z" fill="${c.accent}"/>
     <path d="M22 36 C30 28 38 24 46 20" fill="none" stroke="${c.fg}" stroke-width="2"/>`,
  cake: (c) =>
    `<rect x="16" y="30" width="32" height="18" rx="2" fill="${c.fg}"/>
     <rect x="20" y="22" width="24" height="10" fill="${c.accent}"/>
     <rect x="30" y="14" width="4" height="8" fill="${c.fg}"/>
     <circle cx="32" cy="13" r="3" fill="${c.accent}"/>`,
  brush: (c) =>
    `<rect x="28" y="12" width="8" height="22" rx="1" fill="${c.fg}"/>
     <path d="M24 34 H40 L36 50 H28 Z" fill="${c.accent}"/>`,
  bolt: (c) =>
    `<path d="M36 10 L20 34 H32 L28 54 L48 28 H34 Z" fill="${c.accent}"/>`,
  horse: (c) =>
    `<path d="M14 44 L22 28 L32 32 L42 22 L50 30 L46 48 H18 Z" fill="${c.fg}"/>
     <circle cx="42" cy="24" r="3" fill="${c.accent}"/>`,
  orange: (c) =>
    `<circle cx="32" cy="34" r="14" fill="${c.accent}"/>
     <path d="M32 20 C28 14 36 12 38 18" fill="none" stroke="${c.fg}" stroke-width="2"/>`,
  pause: (c) =>
    `<circle cx="32" cy="32" r="18" fill="none" stroke="${c.fg}" stroke-width="3"/>
     <rect x="24" y="22" width="6" height="20" fill="${c.accent}"/>
     <rect x="34" y="22" width="6" height="20" fill="${c.accent}"/>`,
  yasmine: (c) =>
    `<circle cx="32" cy="32" r="6" fill="${c.accent}"/>
     ${[0, 60, 120, 180, 240, 300]
       .map((deg) => {
         const r = (deg * Math.PI) / 180;
         const x = 32 + Math.cos(r) * 12;
         const y = 32 + Math.sin(r) * 12;
         return `<ellipse cx="${x}" cy="${y}" rx="5" ry="8" transform="rotate(${deg} ${x} ${y})" fill="${c.fg}"/>`;
       })
       .join("")}`,
  kniza: (c) =>
    `<path d="M32 12 L52 32 L32 52 L12 32 Z" fill="${c.accent}"/>
     <path d="M32 22 L42 32 L32 42 L22 32 Z" fill="${c.fg}"/>`,
  ronsard: (c) =>
    `<circle cx="32" cy="32" r="18" fill="${c.fg}"/>
     <path d="M32 16 C40 24 40 32 32 40 C24 32 24 24 32 16 Z" fill="${c.accent}"/>`,
  rumi: (c) =>
    `<rect x="18" y="18" width="28" height="28" fill="${c.fg}"/>
     <circle cx="32" cy="32" r="8" fill="${c.accent}"/>`,
  zemora: (c) =>
    `<path d="M32 14 L48 26 V46 L32 54 L16 46 V26 Z" fill="${c.fg}"/>
     <circle cx="32" cy="34" r="7" fill="${c.accent}"/>`,
  dinari: (c) =>
    `<circle cx="32" cy="32" r="18" fill="${c.accent}"/>
     <text x="32" y="40" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="${c.bg}">D</text>`,
  charbagh: (c) =>
    `<rect x="14" y="14" width="16" height="16" fill="${c.fg}"/>
     <rect x="34" y="14" width="16" height="16" fill="${c.accent}"/>
     <rect x="14" y="34" width="16" height="16" fill="${c.accent}"/>
     <rect x="34" y="34" width="16" height="16" fill="${c.fg}"/>`,
  paysan: (c) =>
    `<path d="M12 40 L32 16 L52 40 Z" fill="${c.accent}"/>
     <rect x="24" y="40" width="16" height="10" fill="${c.fg}"/>`,
  laarissa: (c) =>
    `<rect x="14" y="22" width="36" height="24" fill="${c.fg}"/>
     <rect x="20" y="16" width="24" height="8" fill="${c.accent}"/>`,
  mirage: (c) =>
    `<path d="M12 40 H52 L42 20 H22 Z" fill="${c.accent}"/>
     <rect x="28" y="24" width="8" height="16" fill="${c.fg}"/>`,
  belive: (c) =>
    `<circle cx="32" cy="32" r="18" fill="${c.accent}"/>
     <path d="M22 34 L32 20 L42 34 Z" fill="${c.fg}"/>`,
  douars: (c) =>
    `<circle cx="24" cy="36" r="10" fill="${c.accent}"/>
     <circle cx="40" cy="36" r="10" fill="${c.fg}" opacity=".9"/>
     <circle cx="32" cy="24" r="8" fill="${c.accent}" opacity=".8"/>`,
  orangers: (c) =>
    `<circle cx="26" cy="34" r="12" fill="${c.accent}"/>
     <circle cx="40" cy="30" r="10" fill="${c.fg}" opacity=".85"/>`,
  villad: (c) =>
    `<text x="32" y="42" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${c.fg}">D</text>`,
};

function wrap(slug, inner, p) {
  const shape = hash(slug) % 4;
  const clipId = `c-${slug.replace(/[^a-z0-9]/gi, "")}`;
  let frame = `<rect width="64" height="64" fill="${p.bg}"/>`;
  if (shape === 1) {
    frame = `<rect width="64" height="64" fill="${p.bg}"/><circle cx="32" cy="32" r="28" fill="${p.bg}" stroke="${p.accent}" stroke-width="2"/>`;
  } else if (shape === 2) {
    frame = `<rect width="64" height="64" fill="${p.bg}" rx="12"/>`;
  } else if (shape === 3) {
    frame = `<rect width="64" height="64" fill="${p.bg}"/><rect x="4" y="4" width="56" height="56" fill="none" stroke="${p.accent}" stroke-width="1.5"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
  <title>${slug}</title>
  ${frame}
  <g>${inner}</g>
</svg>
`.replace(`c-${clipId}`, clipId);
}

function emblem(slug, name, motif) {
  const p = palette(slug);
  const draw = MOTIFS[motif];
  if (draw) return wrap(slug, draw(p), p);
  const L = letters(name).replace(/&/g, "");
  return wrap(
    slug,
    `<text x="32" y="40" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${L.length > 2 ? 16 : 22}" fill="${p.fg}">${L}</text>
     <rect x="20" y="46" width="24" height="2" fill="${p.accent}"/>`,
    p,
  );
}

const COMPANIES = [
  { slug: "atlas-and-ivory", name: "Atlas & Ivory", motif: "mountain" },
  { slug: "dar-celebrations", name: "Dar Celebrations", motif: "lantern" },
  { slug: "la-kasbah-events", name: "La Kasbah Events", motif: "kasbah" },
  { slug: "sahara-rose-weddings", name: "Sahara Rose Weddings", motif: "rose" },
  { slug: "maison-zellige", name: "Maison Zellige", motif: "star" },
  { slug: "olive-and-oud", name: "Olive & Oud", motif: "olive" },
  { slug: "riad-and-rose", name: "Riad & Rose", motif: "courtyard" },
  { slug: "tamarind-collective", name: "Tamarind Collective", motif: "seed" },
  { slug: "ourika-weddings", name: "Ourika Weddings", motif: "river" },
  { slug: "zahra-studio", name: "Zahra Studio", motif: "flower" },
  { slug: "medina-moments", name: "Medina Moments", motif: "arch" },
  { slug: "palm-grove-planners", name: "Palm Grove Planners", motif: "palm" },
  { slug: "kasbah-and-co", name: "Kasbah & Co", motif: "kasbah" },
  { slug: "lumen-weddings", name: "Lumen Weddings", motif: "sun" },
  { slug: "amal-events", name: "Amal Events", motif: "star" },
  { slug: "the-good-day", name: "The Good Day", motif: "sun" },

  { slug: "atlas-lens-studio", name: "Atlas Lens Studio", motif: "aperture" },
  { slug: "noor-frames", name: "Noor Frames", motif: "frame" },
  { slug: "ilaria-costa-photo", name: "Ilaria Costa", motif: "aperture" },
  { slug: "marc-delorme", name: "Marc Delorme", motif: "frame" },
  { slug: "clara-vidal", name: "Clara Vidal", motif: "aperture" },
  { slug: "yassine-photo", name: "Yassine Berrada", motif: "aperture" },
  { slug: "maia-rose", name: "Maia Rose", motif: "rose" },
  { slug: "imane-studio", name: "Imane Studio", motif: "frame" },
  { slug: "fleurs-du-souk", name: "Fleurs du Souk", motif: "flower" },
  { slug: "rosa-medina", name: "Rosa Medina", motif: "rose" },
  { slug: "palm-and-petal", name: "Palm & Petal", motif: "palm" },
  { slug: "jardin-floral", name: "Jardin Floral", motif: "leaf" },
  { slug: "dj-karim-k", name: "DJ Karim K", motif: "note" },
  { slug: "medina-sound", name: "Medina Sound Collective", motif: "note" },
  { slug: "gnawa-brothers", name: "Gnawa Brothers", motif: "note" },
  { slug: "quartet-marrakech", name: "Quartet Marrakesh", motif: "note" },
  { slug: "dj-selma", name: "DJ Selma", motif: "note" },
  { slug: "dar-tajine-traiteur", name: "Dar Tajine Traiteur", motif: "arch" },
  { slug: "maison-saveurs", name: "Maison Saveurs", motif: "leaf" },
  { slug: "chef-amine-privé", name: "Chef Amine Privé", motif: "flame" },
  { slug: "souk-street-food", name: "Souk Street Food", motif: "flame" },
  { slug: "sucre-et-sel", name: "Sucre & Sel", motif: "cake" },
  { slug: "patisserie-amandine", name: "Pâtisserie Amandine", motif: "cake" },
  { slug: "cake-atelier-mk", name: "Cake Atelier MK", motif: "cake" },
  { slug: "glam-by-lina", name: "Glam by Lina", motif: "brush" },
  { slug: "studio-nour-beauty", name: "Studio Nour Beauty", motif: "sun" },
  { slug: "maquillage-sara", name: "Maquillage Sara", motif: "brush" },
  { slug: "lumiere-events", name: "Lumière Events", motif: "bolt" },
  { slug: "desert-rig", name: "Desert Rig", motif: "bolt" },
  { slug: "mk-sonorisation", name: "MK Sonorisation", motif: "note" },
  { slug: "feu-et-sable", name: "Feu & Sable", motif: "flame" },
  { slug: "amariya-marrakech", name: "Amariya Marrakesh", motif: "star" },
  { slug: "oriental-dance-co", name: "Oriental Dance Co", motif: "flower" },
  { slug: "caleche-royale", name: "Calèche Royale", motif: "horse" },

  { slug: "villa-des-orangers-wedding-cost", name: "La Villa des Orangers", motif: "orangers" },
  { slug: "villa-d-marrakech-wedding-cost", name: "Villa D Marrakesh", motif: "villad" },
  { slug: "jnane-rumi-wedding-cost", name: "Jnane Rumi", motif: "rumi" },
  { slug: "palais-ronsard-wedding-cost", name: "Palais Ronsard", motif: "ronsard" },
  { slug: "dar-zemora-wedding-cost", name: "Dar Zemora", motif: "zemora" },
  { slug: "villa-dinari-wedding-cost", name: "Villa Dinari", motif: "dinari" },
  { slug: "ksar-char-bagh-wedding-cost", name: "Ksar Char Bagh", motif: "charbagh" },
  { slug: "la-pause-wedding-cost", name: "La Pause", motif: "pause" },
  { slug: "riad-kniza-wedding-cost", name: "Riad Kniza", motif: "kniza" },
  { slug: "riad-fes-marrakech-wedding-cost", name: "Riad Yasmine", motif: "yasmine" },
  { slug: "palais-paysan-wedding-cost", name: "Palais Paysan", motif: "paysan" },
  { slug: "villa-laarissa-wedding-cost", name: "Villa Laarissa", motif: "laarissa" },
  { slug: "royal-mirage-deluxe-wedding-cost", name: "Royal Mirage Deluxe", motif: "mirage" },
  { slug: "be-live-palmeraie-wedding-cost", name: "Be Live Experience Palmeraie", motif: "belive" },
  { slug: "le-jardin-des-douars-wedding-cost", name: "Le Jardin des Douars", motif: "douars" },
];

const manifest = JSON.parse(readFileSync(join(outDir, "manifest.json"), "utf8"));

for (const c of COMPANIES) {
  const svg = emblem(c.slug, c.name, c.motif);
  writeFileSync(join(outDir, `${c.slug}.svg`), svg);
  manifest[c.slug] = `/logos/${c.slug}.svg`;
}

writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`wrote ${COMPANIES.length} unique logos`);

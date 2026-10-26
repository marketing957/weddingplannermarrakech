/**
 * One-shot collector: official icons for venue/planner/vendor rows.
 * Writes public/logos/{slug}.png and a JSON manifest.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "logos");
mkdirSync(outDir, { recursive: true });

const UA = "Mozilla/5.0 (compatible; WPM-logo-index/1.0)";

/** @type {Array<{ slug: string; domain: string; urls?: string[] }>} */
const TARGETS = [
  {
    slug: "asimetrica-prod",
    domain: "asimetricaprod.com",
    urls: [
      "https://asimetricaprod.com/wp-content/uploads/2025/06/cropped-favicon-outer-192x192.png",
      "https://asimetricaprod.com/wp-content/uploads/2025/06/cropped-favicon-outer-180x180.png",
    ],
  },
  {
    slug: "palais-namaskar-wedding-cost",
    domain: "palaisnamaskar.com",
    urls: ["https://palaisnamaskar.com/wp-content/uploads/2026/04/image-removebg-preview-6-255x255.png"],
  },
  {
    slug: "royal-mansour-wedding-cost",
    domain: "royalmansour.com",
    urls: ["https://www.royalmansour.com/wp-content/uploads/2023/02/favicon.png"],
  },
  { slug: "la-mamounia-wedding-cost", domain: "mamounia.com" },
  { slug: "dar-ahlam-wedding-cost", domain: "darahlam.com" },
  { slug: "selman-marrakech-wedding-cost", domain: "selman-marrakech.com" },
  {
    slug: "amanjena-wedding-cost",
    domain: "aman.com",
    urls: ["https://www.aman.com/themes/custom/aman/assets/dist/media/favicons/apple-touch-icon.png"],
  },
  { slug: "oberoi-marrakech-wedding-cost", domain: "oberoihotels.com" },
  { slug: "kasbah-tamadot-wedding-cost", domain: "virginlimitededition.com" },
  {
    slug: "mandarin-oriental-wedding-cost",
    domain: "mandarinoriental.com",
    urls: ["https://www.mandarinoriental.com/img/icons/favicon-256x256.png"],
  },
  { slug: "four-seasons-marrakech-wedding-cost", domain: "fourseasons.com" },
  { slug: "villa-des-orangers-wedding-cost", domain: "villadesorangers.com" },
  { slug: "villa-d-marrakech-wedding-cost", domain: "villad-marrakech.com" },
  {
    slug: "fairmont-royal-palm-wedding-cost",
    domain: "fairmont.com",
    urls: ["https://www.fairmont.com/content/dam/technical-folder/seo/fairmont/apple-touch-icon.png"],
  },
  { slug: "jnane-rumi-wedding-cost", domain: "jnanerumi.com" },
  { slug: "palais-ronsard-wedding-cost", domain: "palaisronsard.com" },
  { slug: "dar-zemora-wedding-cost", domain: "darzemora.com" },
  { slug: "villa-dinari-wedding-cost", domain: "villadinari.com" },
  { slug: "beldi-country-club-wedding-cost", domain: "beldicountryclub.com" },
  { slug: "les-deux-tours-wedding-cost", domain: "les-deux-tours.com" },
  { slug: "ksar-char-bagh-wedding-cost", domain: "ksar-charbagh.com" },
  { slug: "casa-lalla-takerkoust-wedding-cost", domain: "casalalla.com" },
  { slug: "la-pause-wedding-cost", domain: "lapause.com" },
  {
    slug: "scarabeo-camp-wedding-cost",
    domain: "scarabeocamp.com",
    urls: [
      "https://static1.squarespace.com/static/5f997ef94da0c64db54c7a8f/t/5fbb89ce3e9b65302dd7aa91/1606126033375/logo_SCARABEOCAMP_black.png",
    ],
  },
  { slug: "inara-camp-wedding-cost", domain: "inaracamp.com" },
  {
    slug: "riad-el-fenn-wedding-cost",
    domain: "el-fenn.com",
    urls: ["https://el-fenn.b-cdn.net/wp-content/uploads/2026/03/cropped-favicon-180x180.jpg"],
  },
  { slug: "riad-kniza-wedding-cost", domain: "riadkniza.com" },
  { slug: "riad-fes-marrakech-wedding-cost", domain: "riad-yasmine.com" },
  { slug: "palais-paysan-wedding-cost", domain: "palaispaysan.com" },
  { slug: "villa-laarissa-wedding-cost", domain: "villalaarissa.com" },
  { slug: "royal-mirage-deluxe-wedding-cost", domain: "royalmiragedeluxe.com" },
  { slug: "be-live-palmeraie-wedding-cost", domain: "belivehotels.com" },
  { slug: "kasbah-bab-ourika-wedding-cost", domain: "kasbahbabourika.com" },
  { slug: "domaine-des-remparts-wedding-cost", domain: "domaine-des-remparts.com" },
  { slug: "villa-taj-wedding-cost", domain: "villatajmarrakech.com" },
  { slug: "le-jardin-des-douars-wedding-cost", domain: "jardindesdouars.com" },
];

function googleUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

function absUrl(href, base) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function iconUrlsFromHtml(html, pageUrl) {
  const found = [];
  const re = /<link\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    if (!/rel=["'][^"']*icon[^"']*["']/i.test(tag) && !/rel=["']apple-touch-icon/i.test(tag)) continue;
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    const url = absUrl(href, pageUrl);
    if (url) found.push(url);
  }
  return found;
}

async function getBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return null;
  const type = res.headers.get("content-type") ?? "";
  if (type.includes("text/html")) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 400) return null;
  return buf;
}

function sealSvg(name) {
  const parts = name.replace(/['’]/g, "").split(/\s+/).filter(Boolean);
  const letters =
    parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  const safe = letters.replace(/&/g, "&amp;");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#f7f4ef"/>
  <circle cx="32" cy="32" r="28" stroke="#161411" stroke-width="1.25"/>
  <circle cx="32" cy="32" r="24" stroke="#b08948" stroke-width="0.75"/>
  <text x="32" y="38" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="16" fill="#161411">${safe}</text>
</svg>`;
}

async function collectFor(target) {
  const candidates = [
    ...(target.urls ?? []),
    `https://${target.domain}/apple-touch-icon.png`,
    `https://www.${target.domain}/apple-touch-icon.png`,
    `https://${target.domain}/favicon.ico`,
    googleUrl(target.domain),
  ];
  try {
    const page = `https://www.${target.domain}/`;
    const res = await fetch(page, {
      headers: { "User-Agent": UA },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok) {
      const html = await res.text();
      candidates.unshift(...iconUrlsFromHtml(html, res.url));
    }
  } catch {
    /* homepage optional */
  }

  const seen = new Set();
  for (const url of candidates) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    try {
      const buf = await getBuffer(url);
      if (!buf) continue;
      if (buf.length < 800 && url.includes("gstatic.com")) continue;
      if (buf.length < 800 && url.includes("google.com/s2/favicons")) continue;
      return buf;
    } catch {
      /* try next */
    }
  }
  return null;
}

const sharpMod = await import("sharp").catch(() => null);
const sharp = sharpMod?.default ?? sharpMod;

const manifest = {};
for (const target of TARGETS) {
  const pngPath = join(outDir, `${target.slug}.png`);
  const svgPath = join(outDir, `${target.slug}.svg`);
  process.stdout.write(`${target.slug} … `);
  try {
    const buf = await collectFor(target);
    if (buf && sharp) {
      await sharp(buf).resize(192, 192, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(pngPath);
      manifest[target.slug] = `/logos/${target.slug}.png`;
      console.log("png");
      continue;
    }
    if (buf && !existsSync(pngPath)) {
      writeFileSync(pngPath, buf);
      manifest[target.slug] = `/logos/${target.slug}.png`;
      console.log("raw");
      continue;
    }
  } catch (err) {
    console.log(`fail (${err.message})`);
  }
  const label = target.slug
    .replace(/-wedding-cost$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  writeFileSync(svgPath, sealSvg(label));
  manifest[target.slug] = `/logos/${target.slug}.svg`;
  console.log("svg");
}

writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("wrote", Object.keys(manifest).length, "logos");

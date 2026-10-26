/**
 * Pulls each company's own logo from its website and writes public/logos/{slug}.png.
 * Order of preference: JSON-LD logo, header <img>/<svg> marked as logo, og:logo,
 * apple-touch-icon / large icons, favicon. Companies whose domains do not resolve keep
 * their existing file. Writes scripts/logo-report.json.
 *
 * node scripts/refresh-logos.mjs            all targets
 * node scripts/refresh-logos.mjs slug ...   only those slugs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { lookup } from "node:dns/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "logos");
const manifestPath = join(outDir, "manifest.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

/**
 * sites: homepages to try in order. The first that answers is analysed.
 * logo: the logo file on the company's own site, for pages the scanner reads wrongly.
 * skip: leave the current file alone (domain lapsed or the scanner picks a photo).
 */
const TARGETS = [
  { slug: "palais-namaskar-wedding-cost", sites: ["https://www.palaisnamaskar.com/"] },
  { slug: "royal-mansour-wedding-cost", sites: ["https://www.royalmansour.com/en/marrakech/", "https://www.royalmansour.com/"] },
  { slug: "la-mamounia-wedding-cost", sites: ["https://mamounia.com/en/"], logo: "https://mamounia.com/bundles/apiciuswebsite/images/logo.svg" },
  { slug: "dar-ahlam-wedding-cost", sites: ["https://www.darahlam.com/"] },
  { slug: "selman-marrakech-wedding-cost", sites: ["https://www.selman-marrakech.com/"] },
  { slug: "amanjena-wedding-cost", sites: ["https://www.aman.com/resorts/amanjena", "https://www.aman.com/"] },
  { slug: "oberoi-marrakech-wedding-cost", sites: ["https://www.oberoihotels.com/hotels-in-marrakech/", "https://www.oberoihotels.com/"] },
  { slug: "kasbah-tamadot-wedding-cost", sites: ["https://www.virginlimitededition.com/kasbah-tamadot/", "https://www.virginlimitededition.com/"] },
  { slug: "mandarin-oriental-wedding-cost", sites: ["https://www.mandarinoriental.com/en/marrakech/la-medina", "https://www.mandarinoriental.com/"] },
  { slug: "four-seasons-marrakech-wedding-cost", sites: ["https://www.fourseasons.com/marrakech/", "https://www.fourseasons.com/"] },
  { slug: "villa-des-orangers-wedding-cost", sites: ["https://www.villadesorangers.com/"] },
  { slug: "villa-d-marrakech-wedding-cost", sites: ["https://www.villad-marrakech.com/", "https://villadmarrakech.com/"] },
  { slug: "fairmont-royal-palm-wedding-cost", sites: ["https://www.fairmont.com/marrakech/", "https://www.fairmont.com/"] },
  { slug: "jnane-rumi-wedding-cost", sites: ["https://www.jnanerumi.com/", "https://jnanerumi.com/"] },
  { slug: "palais-ronsard-wedding-cost", sites: ["https://www.palaisronsard.com/"] },
  { slug: "dar-zemora-wedding-cost", sites: ["https://darzemora.com/"], logo: "https://darzemora.com/wp-content/uploads/2023/09/DZ-logo.png" },
  {
    slug: "villa-dinari-wedding-cost",
    sites: ["https://www.villadinari.com/"],
    logo: "https://static.wixstatic.com/media/04e111_213324d9250242b5bea1b5f96abe4135~mv2.png",
  },
  { slug: "beldi-country-club-wedding-cost", sites: ["https://beldicountryclub.com/"], skip: true },
  { slug: "les-deux-tours-wedding-cost", sites: ["https://www.les-deux-tours.com/"] },
  { slug: "ksar-char-bagh-wedding-cost", sites: ["https://www.ksarcharbagh.com/"], skip: true },
  { slug: "casa-lalla-takerkoust-wedding-cost", sites: ["https://www.casalalla.com/"] },
  { slug: "la-pause-wedding-cost", sites: ["https://www.lapause-marrakech.com/", "https://lapause.com/"] },
  { slug: "scarabeo-camp-wedding-cost", sites: ["https://www.scarabeocamp.com/"] },
  { slug: "inara-camp-wedding-cost", sites: ["https://www.inaracamp.com/", "https://inaracamp.com/"] },
  { slug: "riad-el-fenn-wedding-cost", sites: ["https://el-fenn.com/", "https://www.el-fenn.com/"] },
  { slug: "riad-kniza-wedding-cost", sites: ["https://www.riadkniza.com/"] },
  { slug: "riad-fes-marrakech-wedding-cost", sites: ["https://www.riadyasmine.com/", "https://www.riad-yasmine.com/"] },
  { slug: "palais-paysan-wedding-cost", sites: ["https://www.palaispaysan.com/", "https://www.palais-paysan.com/"] },
  { slug: "villa-laarissa-wedding-cost", sites: ["https://www.villalaarissa.com/", "https://villalaarissa.ma/"] },
  { slug: "royal-mirage-deluxe-wedding-cost", sites: ["https://www.royalmiragedeluxe.com/", "https://www.royalmiragehotels.com/"] },
  {
    slug: "be-live-palmeraie-wedding-cost",
    sites: ["https://www.belivehotels.com/en/"],
    logo: "https://belive-api.b-cdn.net/multimedia/images/logo_BeLive_negro.webp",
  },
  { slug: "kasbah-bab-ourika-wedding-cost", sites: ["https://www.kasbahbabourika.com/"] },
  { slug: "domaine-des-remparts-wedding-cost", sites: ["https://www.domaine-des-remparts.com/", "https://www.domainedesremparts.com/"] },
  { slug: "villa-taj-wedding-cost", sites: ["https://www.villatajmarrakech.com/", "https://www.villataj.com/"] },
  { slug: "le-jardin-des-douars-wedding-cost", sites: ["https://www.jardindesdouars.com/"] },

  { slug: "amelie-wedding", sites: ["https://amelie.wedding/"] },
  { slug: "philocaly-weddings", sites: ["https://philocalyevents.com/"] },
  { slug: "amaria-events", sites: ["https://amariaevents.com/"] },
  { slug: "studio-maev", sites: ["https://www.studiomaev.com/"] },
  { slug: "ceremonia-event", sites: ["https://ceremoniaevent.com/"] },
  { slug: "exceptional-moment", sites: ["https://exceptionalmoment.com/"] },
  { slug: "redkeys-marrakech", sites: ["https://redkeys-marrakech.com/"] },
  { slug: "zinevent-marrakech", sites: ["https://zineventmarrakech.com/"] },
  { slug: "the-souk-department", sites: ["https://thesoukdepartment.com/"] },
  { slug: "boutique-souk", sites: ["https://boutiquesouk.com/"] },
  { slug: "la-perle-events", sites: ["https://www.la-perle-events.com/en"] },
  { slug: "instants-magiques", sites: ["https://instantsmagiques-marrakech.com/"] },

  ...[
    ["atlas-lens-studio", "atlaslens.studio"],
    ["noor-frames", "noorframes.com"],
    ["ilaria-costa-photo", "ilariacosta.photo"],
    ["marc-delorme", "marcdelorme.com"],
    ["clara-vidal", "claravidal.com"],
    ["yassine-photo", "yassineberrada.com"],
    ["maia-rose", "maiarose.com"],
    ["imane-studio", "imanestudio.ma"],
    ["fleurs-du-souk", "fleursdusouk.ma"],
    ["rosa-medina", "rosamedina.com"],
    ["palm-and-petal", "palmandpetal.co"],
    ["jardin-floral", "jardinfloral.ma"],
    ["dj-karim-k", "djkarimk.com"],
    ["medina-sound", "medinasound.com"],
    ["quartet-marrakech", "quartetmarrakech.com"],
    ["dar-tajine-traiteur", "dartajine.ma"],
    ["maison-saveurs", "maisonsaveurs.com"],
    ["chef-amine-prive", "chefamine.com"],
    ["sucre-et-sel", "sucreetsel.ma"],
    ["patisserie-amandine", "amandine.ma"],
    ["glam-by-lina", "glambylina.com"],
    ["studio-nour-beauty", "studionour.ma"],
    ["lumiere-events", "lumiere-events.ma"],
    ["desert-rig", "desertrig.com"],
    ["feu-et-sable", "feuetsable.com"],
    ["oriental-dance-co", "orientaldance.ma"],
  ].map(([slug, domain]) => ({
    slug,
    sites: [`https://${domain}/`, `https://www.${domain}/`],
    mustMention: [/marra[kc]/i, /wedding|mariage|event|événement/i],
  })),
];

function abs(href, base) {
  try {
    return new URL(href.trim().replace(/&amp;/g, "&"), base).href;
  } catch {
    return null;
  }
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1] ?? null;
}

function bestFromSrcset(srcset) {
  const parts = srcset.split(",").map((p) => p.trim().split(/\s+/));
  parts.sort((a, b) => parseFloat(b[1] ?? "1") - parseFloat(a[1] ?? "1"));
  return parts[0]?.[0] ?? null;
}

function imgSource(tag) {
  const srcset = attr(tag, "srcset") || attr(tag, "data-srcset");
  return (
    attr(tag, "data-src") ||
    attr(tag, "data-lazy-src") ||
    (srcset ? bestFromSrcset(srcset) : null) ||
    attr(tag, "src")
  );
}

function jsonLdLogos(html, base) {
  const out = [];
  const re = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    for (const hit of m[1].matchAll(/"logo"\s*:\s*(?:"([^"]+)"|\{[^}]*?"(?:url|contentUrl)"\s*:\s*"([^"]+)")/g)) {
      const url = abs((hit[1] || hit[2]).replace(/\\\//g, "/"), base);
      if (url) out.push(url);
    }
  }
  return out;
}

const LOGO_WORD = /logo|brand|site-title|navbar-brand|custom-logo/i;

function headerLogos(html, base) {
  const imgs = [];
  const svgs = [];
  const head = html.slice(0, 400000);

  for (const m of head.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const hay = `${attr(tag, "class") ?? ""} ${attr(tag, "id") ?? ""} ${attr(tag, "alt") ?? ""} ${imgSource(tag) ?? ""}`;
    if (!LOGO_WORD.test(hay)) continue;
    const src = imgSource(tag);
    const url = src && !src.startsWith("data:") ? abs(src, base) : null;
    if (url) imgs.push(url);
    else if (src?.startsWith("data:image/svg")) imgs.push(src);
  }

  for (const m of head.matchAll(/<(a|div|span|figure|header|h1)\b[^>]*(?:class|id)\s*=\s*["'][^"']*(?:logo|brand)[^"']*["'][^>]*>/gi)) {
    const after = head.slice(m.index, m.index + 12000);
    const img = after.match(/<img\b[^>]*>/i);
    const svg = after.match(/<svg\b[\s\S]*?<\/svg>/i);
    if (svg && (!img || svg.index < img.index)) svgs.push(svg[0]);
    if (img) {
      const src = imgSource(img[0]);
      const url = src && !src.startsWith("data:") ? abs(src, base) : null;
      if (url) imgs.push(url);
    }
  }

  for (const m of head.matchAll(/<svg\b[^>]*(?:class|id|aria-label)\s*=\s*["'][^"']*logo[^"']*["'][\s\S]*?<\/svg>/gi)) {
    svgs.push(m[0]);
  }
  return { imgs, svgs };
}

function iconLinks(html, base) {
  const out = [];
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = attr(tag, "rel") ?? "";
    if (!/icon/i.test(rel)) continue;
    const href = attr(tag, "href");
    const url = href ? abs(href, base) : null;
    if (!url) continue;
    const size = parseInt((attr(tag, "sizes") ?? "0").split("x")[0], 10) || (/apple/i.test(rel) ? 180 : 32);
    out.push({ url, size });
  }
  out.sort((a, b) => b.size - a.size);
  return out.map((i) => i.url);
}

async function get(url, accept) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: accept, "Accept-Language": "en,fr;q=0.8" },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  return res;
}

async function resolves(url) {
  try {
    await lookup(new URL(url).hostname);
    return true;
  } catch {
    return false;
  }
}

async function loadImage(url) {
  if (url.startsWith("data:image/svg")) {
    const body = decodeURIComponent(url.split(",")[1] ?? "");
    return Buffer.from(body);
  }
  const res = await get(url, "image/avif,image/webp,image/svg+xml,image/*,*/*;q=0.8");
  if (!res.ok) return null;
  const type = res.headers.get("content-type") ?? "";
  if (type.includes("text/html")) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.length > 200 ? buf : null;
}

async function toPng(buf, isSvg) {
  const input = sharp(buf, isSvg ? { density: 384 } : {});
  const meta = await input.metadata();
  if (!meta.width || !meta.height) return null;
  if (meta.width < 24 || meta.height < 24) return null;

  const trimmed = await sharp(buf, isSvg ? { density: 384 } : {})
    .ensureAlpha()
    .trim({ threshold: 8 })
    .resize({ width: 480, height: 480, fit: "inside", withoutEnlargement: !isSvg })
    .png()
    .toBuffer()
    .catch(() => null);
  if (!trimmed) return null;

  const { data, info } = await sharp(trimmed).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let lum = 0;
  let opaque = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    opaque++;
    lum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }
  if (opaque < info.width * info.height * 0.01) return null;
  const light = lum / opaque > 215 && opaque < info.width * info.height * 0.92;

  const padded = await sharp(trimmed)
    .extend({
      top: 24,
      bottom: 24,
      left: 24,
      right: 24,
      background: light ? { r: 22, g: 20, b: 17, alpha: 1 } : { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .flatten(light ? { background: "#161411" } : false)
    .png()
    .toBuffer();
  return { png: padded, light, width: info.width, height: info.height };
}

async function analyse(target) {
  if (target.skip) return { kind: "skipped" };
  if (target.logo) {
    const buf = await loadImage(target.logo);
    const isSvg = /\.svg(\?|$)/i.test(target.logo) || buf?.slice(0, 300).toString().includes("<svg");
    const out = buf ? await toPng(buf, isSvg) : null;
    if (out) return { site: target.sites[0], kind: "pinned", url: target.logo, ...out };
  }
  for (const site of target.sites) {
    if (!(await resolves(site))) continue;
    let html;
    let base;
    try {
      const res = await get(site, "text/html,application/xhtml+xml");
      if (!res.ok) continue;
      html = await res.text();
      base = res.url;
    } catch {
      continue;
    }
    if (target.mustMention?.some((re) => !re.test(html))) return { site: base, kind: "unrelated-site" };

    const { imgs, svgs } = headerLogos(html, base);
    const ogLogo = html.match(/<meta[^>]+property=["']og:logo["'][^>]*content=["']([^"']+)/i)?.[1];
    const candidates = [
      ...jsonLdLogos(html, base).map((url) => ({ kind: "json-ld", url })),
      ...imgs.map((url) => ({ kind: "header-img", url })),
      ...svgs.map((svg) => ({ kind: "inline-svg", svg })),
      ...(ogLogo ? [{ kind: "og:logo", url: abs(ogLogo, base) }] : []),
      ...iconLinks(html, base).map((url) => ({ kind: "icon", url })),
      { kind: "apple-touch-icon", url: abs("/apple-touch-icon.png", base) },
    ];

    const seen = new Set();
    for (const c of candidates) {
      const key = c.url ?? c.svg?.slice(0, 200);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      try {
        let buf;
        let isSvg = false;
        if (c.svg) {
          let svg = c.svg;
          if (!/xmlns=/.test(svg)) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
          if (/<use\b/i.test(svg) && !/<(path|rect|circle|polygon|text|g)\b/i.test(svg)) continue;
          buf = Buffer.from(svg);
          isSvg = true;
        } else {
          buf = await loadImage(c.url);
          if (!buf) continue;
          isSvg = /\.svg(\?|$)/i.test(c.url) || buf.slice(0, 300).toString().includes("<svg");
          if (/\.ico(\?|$)/i.test(c.url)) continue;
        }
        const out = await toPng(buf, isSvg);
        if (!out) continue;
        if (c.kind === "icon" && out.width < 64) continue;
        return { site: base, ...c, svg: undefined, ...out };
      } catch {
        /* next candidate */
      }
    }
    return { site: base, kind: "none" };
  }
  return { kind: "unreachable" };
}

const only = new Set(process.argv.slice(2));
const work = TARGETS.filter((t) => !only.size || only.has(t.slug));
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const reportPath = join(root, "scripts", "logo-report.json");
let report = {};
try {
  report = JSON.parse(readFileSync(reportPath, "utf8"));
} catch {
  report = {};
}

let cursor = 0;
async function worker() {
  while (cursor < work.length) {
    const target = work[cursor++];
    const result = await analyse(target).catch((err) => ({ kind: "error", error: String(err) }));
    if (result.png) {
      const file = `${target.slug}.png`;
      writeFileSync(join(outDir, file), result.png);
      manifest[target.slug] = `/logos/${file}`;
      report[target.slug] = { status: "updated", kind: result.kind, source: result.url ?? "inline svg", site: result.site, light: result.light };
      console.log(`${target.slug.padEnd(40)} ${result.kind.padEnd(16)} ${result.url ?? "inline svg"}`);
    } else {
      report[target.slug] = { status: result.kind, site: result.site ?? null };
      console.log(`${target.slug.padEnd(40)} ${result.kind}`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

for (const slug of Object.keys(manifest)) {
  if (slug.startsWith("asimetrica-prod-")) manifest[slug] = manifest["asimetrica-prod"];
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
const counts = Object.values(report).reduce((acc, r) => ((acc[r.status] = (acc[r.status] ?? 0) + 1), acc), {});
console.log("\nsummary", counts);

/**
 * For each real planner: downloads up to 6 portfolio photos from its own website into
 * public/photos/planners/{slug}/ and dumps the page facts to scripts/planner-facts.json
 * so profiles can be written from what the company says about itself.
 *
 * node scripts/fetch-planner-media.mjs [slug ...]
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

/** pages: scanned in order. exclude: image URLs that are banners, logos or duplicates. */
export const PLANNER_SITES = {
  "amelie-wedding": { pages: ["https://amelie.wedding/", "https://amelie.wedding/weddings"] },
  "philocaly-weddings": { pages: ["https://philocalyevents.com/"] },
  "amaria-events": {
    pages: ["https://amariaevents.com/", "https://amariaevents.com/fr/mariage-marrakech/wedding-planner/"],
    exclude: /og-image/,
  },
  "studio-maev": { pages: ["https://www.studiomaev.com/", "https://www.studiomaev.com/fr/organisation-mariage-marrakech/"] },
  "ceremonia-event": { pages: ["https://ceremoniaevent.com/"], exclude: /d476e54e7ad4/ },
  "exceptional-moment": { pages: ["https://exceptionalmoment.com/mariage", "https://exceptionalmoment.com/"] },
  "redkeys-marrakech": {
    pages: ["https://redkeys-marrakech.com/organisation-mariage-marrakech", "https://redkeys-marrakech.com/"],
    exclude: /243A6414/,
  },
  "zinevent-marrakech": { pages: ["https://zineventmarrakech.com/"] },
  "the-souk-department": { pages: ["https://thesoukdepartment.com/"] },
  "boutique-souk": { pages: ["https://boutiquesouk.com/"] },
  "la-perle-events": { pages: ["https://www.la-perle-events.com/en", "https://www.la-perle-events.com/en/portfolio"] },
  "instants-magiques": {
    pages: ["https://instantsmagiques-marrakech.com/", "https://instantsmagiques-marrakech.com/galerie/"],
  },
};

const clean = (s) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

function abs(href, base) {
  try {
    return new URL(href.trim().replace(/&amp;/g, "&"), base).href;
  } catch {
    return null;
  }
}

async function get(url, accept) {
  return fetch(url, {
    headers: { "User-Agent": UA, Accept: accept, "Accept-Language": "en,fr;q=0.8" },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
}

function imageCandidates(html, base) {
  const out = [];
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1];
  if (og) out.push(abs(og, base));
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    if (/logo|icon|avatar|flag|payment|badge|sprite/i.test(tag)) continue;
    const srcset = tag.match(/\b(?:data-)?srcset=["']([^"']+)["']/i)?.[1];
    let src = tag.match(/\b(?:data-src|data-lazy-src)=["']([^"']+)["']/i)?.[1];
    if (!src && srcset) {
      const parts = srcset.split(",").map((p) => p.trim().split(/\s+/));
      parts.sort((a, b) => parseFloat(b[1] ?? "0") - parseFloat(a[1] ?? "0"));
      src = parts[0]?.[0];
    }
    src ??= tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (!src || src.startsWith("data:")) continue;
    out.push(abs(src, base));
  }
  for (const m of html.matchAll(/background-image:\s*url\(["']?([^"')]+)["']?\)/gi)) out.push(abs(m[1], base));
  for (const m of html.matchAll(/https?:\/\/[^"'\s()<>\\]+?\.(?:jpe?g|webp)(?=["'\s)\\?])/gi)) {
    if (!/logo|icon|favicon/i.test(m[0])) out.push(m[0]);
  }
  return [...new Set(out.filter((u) => u && /\.(jpe?g|webp|png|avif)(\?|$)|wixstatic|squarespace-cdn|format=/i.test(u)))];
}

function facts(html) {
  const text = (re) => [...html.matchAll(re)].map((m) => clean(m[1])).filter(Boolean);
  const body = clean(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " "));
  return {
    title: clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    description: html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)/i)?.[1] ?? "",
    headings: text(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi).slice(0, 25),
    paragraphs: text(/<p[^>]*>([\s\S]*?)<\/p>/gi).filter((p) => p.length > 60).slice(0, 18),
    emails: [...new Set(body.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? [])].slice(0, 4),
    phones: [...new Set(body.match(/\+\s?\d{3}[\d\s().-]{7,16}\d/g) ?? [])].slice(0, 4),
    instagram: [...new Set([...html.matchAll(/instagram\.com\/([A-Za-z0-9_.]+)/g)].map((m) => m[1]))].slice(0, 3),
    years: [...new Set(body.match(/(?:since|depuis|founded|fondée?|established|créée?)[^.]{0,30}?(19|20)\d\d/gi) ?? [])].slice(0, 4),
  };
}

async function savePhotos(slug, urls) {
  const dir = join(root, "public", "photos", "planners", slug);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const saved = [];
  const seenSizes = new Set();
  for (const url of urls) {
    if (saved.length >= 6) break;
    try {
      const res = await get(url, "image/avif,image/webp,image/*,*/*;q=0.8");
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buf).metadata();
      if (!meta.width || !meta.height || meta.width < 700 || meta.height < 450) continue;
      const ratio = meta.width / meta.height;
      if (ratio < 0.6 || ratio > 2.4) continue;
      const stats = await sharp(buf).stats();
      if (stats.channels.slice(0, 3).every((c) => c.stdev < 25)) continue;
      const key = `${meta.width}x${meta.height}:${buf.length}`;
      if (seenSizes.has(key)) continue;
      seenSizes.add(key);
      const file = `${saved.length + 1}.webp`;
      await sharp(buf).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(dir, file));
      saved.push({ file: `/photos/planners/${slug}/${file}`, source: url, width: meta.width, height: meta.height });
    } catch {
      /* skip */
    }
  }
  return saved;
}

const only = new Set(process.argv.slice(2));
const factsPath = join(root, "scripts", "planner-facts.json");
let all = {};
try {
  all = JSON.parse(readFileSync(factsPath, "utf8"));
} catch {
  all = {};
}

for (const [slug, { pages, exclude }] of Object.entries(PLANNER_SITES)) {
  if (only.size && !only.has(slug)) continue;
  const entry = { site: pages[0], pages: [], photos: [] };
  let images = [];
  for (const page of pages) {
    try {
      const res = await get(page, "text/html");
      const html = await res.text();
      entry.pages.push({ url: res.url, status: res.status, ...facts(html) });
      images.push(...imageCandidates(html, res.url));
    } catch (err) {
      entry.pages.push({ url: page, error: String(err.message ?? err) });
    }
  }
  images = [...new Set(images)].filter((u) => !exclude?.test(u));
  entry.photos = await savePhotos(slug, images);
  all[slug] = entry;
  console.log(`${slug.padEnd(22)} pages:${entry.pages.map((p) => p.status ?? "ERR").join(",")} photos:${entry.photos.length}/${images.length}`);
}
writeFileSync(factsPath, JSON.stringify(all, null, 2) + "\n");

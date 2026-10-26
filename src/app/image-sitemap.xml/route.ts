import { getVenues } from "@/lib/data";
import { photosForVenue } from "@/lib/photos";
import { absUrl } from "@/lib/seo";

function xml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const venues = await getVenues();
  const urls = venues
    .map((venue) => {
      const photos = photosForVenue(venue, "en", 4);
      const images = photos
        .map(
          (p) => `    <image:image>
      <image:loc>${xml(p.src)}</image:loc>
      <image:title>${xml(p.fileName.replace(/\.jpg$/, "").replace(/-/g, " "))}</image:title>
      <image:caption>${xml(p.caption)}</image:caption>
      <image:geo_location>Marrakesh, Morocco</image:geo_location>
      <image:license>${xml(p.licenseUrl)}</image:license>
    </image:image>`,
        )
        .join("\n");
      return `  <url>
    <loc>${xml(absUrl(`/venues/${venue.slug}`))}</loc>
${images}
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

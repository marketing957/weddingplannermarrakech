import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/sign-up", "/plan", "/auth/"],
      },
    ],
    sitemap: [absUrl("/sitemap.xml"), absUrl("/image-sitemap.xml")],
    host: absUrl("/").replace(/\/$/, ""),
  };
}

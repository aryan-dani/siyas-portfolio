import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  /* Fixed stamp — Cache Components forbids impure `new Date()` at prerender. */
  const lastModified = new Date("2026-11-13T00:00:00.000Z");

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/collaborate`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/copyright`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}

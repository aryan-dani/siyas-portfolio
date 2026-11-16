import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { CASE_STUDIES } from "@/lib/case-studies";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  /* Fixed stamp — Cache Components forbids impure `new Date()` at prerender. */
  const lastModified = new Date("2026-11-13T00:00:00.000Z");

  const caseStudyEntries: MetadataRoute.Sitemap = CASE_STUDIES.map((cs) => ({
    url: `${siteUrl}/work/${cs.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

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
      url: `${siteUrl}/ugc-creator-pune`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...caseStudyEntries,
  ];
}

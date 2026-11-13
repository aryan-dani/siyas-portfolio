import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/copyright"],
      },
      {
        userAgent: ["GPTBot", "CCBot", "Google-Extended", "anthropic-ai"],
        disallow: ["/siya/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

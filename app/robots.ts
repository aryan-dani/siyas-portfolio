import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const allowAll = {
    allow: "/",
  } as const;

  return {
    rules: [
      { userAgent: "*", ...allowAll },
      { userAgent: "Googlebot", ...allowAll },
      { userAgent: "Bingbot", ...allowAll },
      { userAgent: "GPTBot", ...allowAll },
      { userAgent: "OAI-SearchBot", ...allowAll },
      { userAgent: "PerplexityBot", ...allowAll },
      { userAgent: "ClaudeBot", ...allowAll },
      { userAgent: "Google-Extended", ...allowAll },
      { userAgent: "anthropic-ai", ...allowAll },
      { userAgent: "CCBot", ...allowAll },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

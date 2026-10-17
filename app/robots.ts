import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
  };
}

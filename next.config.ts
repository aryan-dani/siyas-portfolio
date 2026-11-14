import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'self' https://aryandani.com https://www.aryandani.com http://localhost:* http://127.0.0.1:*;",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    /* WebP only: AVIF pads this site’s transparent hero cutout and floats the
       dress above the baseline. WebP keeps the alpha bbox flush. */
    formats: ["image/webp"],
    // Next 16 only serves qualities listed here; 90 is used for the hero portrait.
    qualities: [60, 75, 90],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/siya/:path*",
        headers: [
          {
            key: "Cache-Control",
            // One week + stale-while-revalidate: long enough to be fast, short
            // enough that swapping a photo or reel file later takes effect.
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async rewrites() {
    const key = process.env.INDEXNOW_KEY?.trim();
    if (!key) return [];
    return [
      {
        source: `/${key}.txt`,
        destination: "/api/indexnow-key",
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

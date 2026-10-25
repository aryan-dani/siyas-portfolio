import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 only serves qualities listed here; 90 is used for the hero portrait.
    qualities: [60, 75, 90],
  },
  async headers() {
    return [
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

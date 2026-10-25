/**
 * Absolute origin of the site, used for metadataBase, structured data and the
 * share card. Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL  (set this if you attach a custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (provided by Vercel at build time)
 *   3. http://localhost:3000
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  return "http://localhost:3000";
}

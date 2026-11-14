/**
 * Site origin + SEO entity constants for Siya Pawar (@heartsfromsiya).
 * Resolution order for URL:
 *   1. NEXT_PUBLIC_SITE_URL
 *   2. VERCEL_PROJECT_PRODUCTION_URL
 *   3. https://www.heartsfromsiya.com (production default)
 *   4. http://localhost:3000 (local only)
 */

export const SITE_NAME = "Siya Pawar (@heartsfromsiya)";
export const CREATOR_NAME = "Siya Pawar";
export const HANDLE = "@heartsfromsiya";
export const LOCATION = "Pune, Maharashtra, India";
export const SERVICE_AREAS = [
  "Pune",
  "Mumbai",
  "Maharashtra",
  "India",
  "Global Remote UGC",
] as const;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/heartsfromsiya/",
  instagramDump: "https://www.instagram.com/siyasideup/",
  youtube: "https://www.youtube.com/@heartsfromsiya",
} as const;

/** Primary keyword clusters — local, commercial UGC, and identity. */
export const PRIMARY_KEYWORDS = [
  "Siya Pawar",
  "HeartsFromSiya",
  "@heartsfromsiya",
  "Siya Pawar Portfolio",
  "Siya Pawar UGC & Collaborations",
  "Influencers in Pune",
  "Top Lifestyle Influencer in Pune",
  "Fashion & Beauty Creator Pune",
  "Pune Content Creator for Brand Collaborations",
  "Gen-Z Influencer Pune",
  "College & Lifestyle Vlogger Pune",
  "UGC Creator India",
  "Hire UGC Creator in Pune",
  "D2C Brand Video Creator India",
  "Instagram Reels Creator for Brands",
  "Aesthetic Product Photography & UGC",
  "PR & Brand Collab Portfolio",
  "Influencer Media Kit & Brand Collaborations India",
  "Lifestyle Fashion Beauty Influencer Pune",
] as const;

export const GEO = {
  region: "IN-MH",
  placename: "Pune",
  latitude: 18.5204,
  longitude: 73.8567,
} as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return "https://www.heartsfromsiya.com";
}

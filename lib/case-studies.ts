import { BRAND_LINKS } from "./content";
import { BLUR } from "./blur-data";

export interface CaseStudy {
  slug: string;
  title: string;
  brand: string;
  brandUrl: string;
  category: string;
  deliverable: string;
  objective: string;
  hookStructure: {
    hook: string;
    body: string;
    cta: string;
  };
  results: {
    label: string;
    value: string;
  }[];
  summary: string;
  reelId?: string;
  videoUrl?: string;
  posterUrl: string;
  blur?: string;
  instagramUrl: string;
  publishedDate: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "mokobara-sundae-backpack",
    title: "Mokobara Sundae Backpack — Aesthetic Everyday Carry UGC",
    brand: "Mokobara",
    brandUrl: BRAND_LINKS.mokobara,
    category: "Everyday Carry & Travel",
    deliverable: "Dedicated D2C Product Reel & Organic Lifestyle Integration",
    objective:
      "Highlight the chic yet highly functional design details of the Sundae backpack for Gen-Z college students and young professionals.",
    hookStructure: {
      hook: "Immediate visual unboxing and aesthetic fit-check with voiceover opening on everyday storage challenges.",
      body: "Walkthrough of dedicated laptop compartments, easy-reach pockets, and seamless shoulder ergonomics during city transit.",
      cta: "Organic recommendation pointing viewers to explore Mokobara's colorways online.",
    },
    results: [
      { label: "Format", value: "0:52 Dedicated Reel" },
      { label: "Focus", value: "Product Functionality & Fit" },
      { label: "Location", value: "Pune, Maharashtra" },
    ],
    summary:
      "A high-retention product showcase pairing tactile aesthetic unboxing with real-world functional utility, shot in natural daylight in Pune.",
    reelId: "04",
    videoUrl: "/siya/reels/featured-04.mp4",
    posterUrl: "/siya/reels/featured-04-poster.jpg",
    blur: BLUR.reel04,
    instagramUrl: "https://www.instagram.com/reel/DdYjCahxxti/",
    publishedDate: "2026-09-15",
  },
  {
    slug: "mokobara-memo-crossbody",
    title: "Mokobara Memo Crossbody — Minimalist Styling & Daily Essentials",
    brand: "Mokobara",
    brandUrl: BRAND_LINKS.mokobara,
    category: "Fashion & Lifestyle Accessories",
    deliverable: "Lifestyle Styling Reel & Tactical What's in My Bag UGC",
    objective:
      "Showcase the effortless versatility of the Memo Crossbody bag across daytime errands, café workspaces, and evening outings.",
    hookStructure: {
      hook: "Fast-paced outfit transition pairing the neutral tones of the bag with casual chic streetwear.",
      body: "Seamless 'what fits inside' reveal featuring daily essentials: phone, lip gloss, keys, cardholder, and sunglasses.",
      cta: "Direct invitation to discover the effortless everyday styling piece on Mokobara.",
    },
    results: [
      { label: "Format", value: "0:48 Styling Reel" },
      { label: "Focus", value: "Everyday Styling & What's In My Bag" },
      { label: "Location", value: "Pune, Maharashtra" },
    ],
    summary:
      "An editorial styling showcase demonstrating how a compact everyday accessory elevates day-to-night Gen-Z outfits effortlessly.",
    reelId: "05",
    videoUrl: "/siya/reels/featured-05.mp4",
    posterUrl: "/siya/reels/featured-05-poster.jpg",
    blur: BLUR.reel05,
    instagramUrl: "https://www.instagram.com/reel/DdOjhsUNG8a/",
    publishedDate: "2026-09-20",
  },
  {
    slug: "pharmeasy-healthcare-delivery",
    title: "PharmEasy — Reliable Healthcare & Medicine Delivery in Pune",
    brand: "PharmEasy",
    brandUrl: BRAND_LINKS.pharmeasy,
    category: "Health & Consumer Tech",
    deliverable: "Authentic Problem-Solution UGC & Doorstep Delivery Reel",
    objective:
      "Build consumer trust around rapid doorstep medicine delivery and authentic healthcare savings for families and busy students.",
    hookStructure: {
      hook: "Relatable everyday situation where getting medicines from an offline counter is inconvenient and time-consuming.",
      body: "Simple tap-and-order app demonstration highlighting prescription upload, genuine product guarantees, and doorstep delivery.",
      cta: "Clear call-to-action encouraging users to download the app and use introductory healthcare codes.",
    },
    results: [
      { label: "Format", value: "Short-Form Video Ad & Story Integration" },
      { label: "Focus", value: "Convenience, Speed & Trust" },
      { label: "Location", value: "Pune & Mumbai" },
    ],
    summary:
      "Relatable lifestyle UGC campaign bridging everyday personal health management with seamless D2C digital app delivery in India.",
    posterUrl: "/siya/photos/siya-pawar-editorial-portrait-pune.jpg",
    instagramUrl: "https://www.instagram.com/heartsfromsiya/",
    publishedDate: "2026-05-10",
  },
  {
    slug: "california-burrito-pune",
    title: "California Burrito — Dining Experience & Gen-Z Foodie Skit",
    brand: "California Burrito",
    brandUrl: BRAND_LINKS["california burrito"],
    category: "Food & Dining",
    deliverable: "Humorous Dining Skit & Fresh Mexican Kitchen Vlog",
    objective:
      "Drive footfall and cravings for California Burrito's fresh bowls, tacos, and burritos among college crowds and food lovers in Pune.",
    hookStructure: {
      hook: "Conversational dining dilemma: craving bold Mexican food and deciding where to go for lunch.",
      body: "High-energy order customisation at the assembly counter showing generous scoops of guacamole, salsa, and grilled fillings.",
      cta: "Enthusiastic food review encouraging viewers to try their signature burritos and rice bowls.",
    },
    results: [
      { label: "Format", value: "0:17 Viral Skit & Foodie Reel" },
      { label: "Focus", value: "Taste, Freshness & Dining Experience" },
      { label: "Location", value: "Pune, Maharashtra" },
    ],
    summary:
      "A punchy, dynamic restaurant visit combining witty humor with mouthwatering close-up food shots to boost brand awareness.",
    reelId: "01",
    videoUrl: "/siya/reels/featured-01.mp4",
    posterUrl: "/siya/reels/featured-01-poster.jpg",
    blur: BLUR.reel01,
    instagramUrl: "https://www.instagram.com/reel/Dewiv69IuFY/",
    publishedDate: "2026-10-12",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}

export type RoleItem = string;

export type ProofStatItem = {
  id: string;
  numericValue: number;
  prefix?: string;
  suffix: string;
  label: string;
  detail: string;
};

export type BrandItem = {
  id: string;
  name: string;
  category: string;
  relationship: string;
  featured: boolean;
  highlightQuote: string;
  deliverableType: string;
};

export type ReelItem = {
  id: string;
  brand: string;
  category: string;
  views: string;
  result: string;
  overlaySerif: string;
  captionSans: string;
  audioName: string;
  duration: string;
  posterSrc: string;
  videoSrc: string;
  instagramUrl: string;
  storyBehind: string;
};

export type ServiceItem = {
  id: string;
  index: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter?: string;
  subtitle: string;
  priceDisplay: string;
  priceSub: string;
  hoverSerifCaption: string;
  deliverables: string[];
  turnaround: string;
  ctaLabel: string;
  rateNote: string;
  inquiryKey: string;
};

export const CONTENT = {
  meta: {
    siteTitle:
      "Siya Pawar (@heartsfromsiya) — Creator, Storyteller & Brand Collaborations",
    siteDescription:
      "Warm, high-retention reels, UGC, and monthly account management by Siya Pawar (@heartsfromsiya). 10M peak monthly views, multiple 1M+ reels, from ₹8,000/3 reels & ₹24k/mo account management.",
    siteUrl: "https://www.instagram.com/heartsfromsiya/",
    ogImage: "/siya/siya-portrait.jpg",
  },

  profile: {
    name: "Siya",
    fullName: "Siya Pawar",
    handle: "@heartsfromsiya",
    secondaryHandle: "@siyasideup",
    bioLine: "pune 📍 · i like making silly videos",
    followersLabel: "9K+ followers",
    location: "Pune, India",
    timezone: "Asia/Kolkata",
    statusText: "Open for brand reels & monthly management",
    email: "siyapawar@gmail.com",
    ccEmail: "daniaryan212@gmail.com",
    instagramUrl: "https://www.instagram.com/heartsfromsiya/",
    instagramReelsUrl: "https://www.instagram.com/heartsfromsiya/reels/",
    instagramDumpUrl: "https://www.instagram.com/siyasideup/",
    youtubeUrl: "https://m.youtube.com/@heartsfromsiya",
    ratesPolicy:
      "₹8,000 / 3 reels · +₹2,000 per extra reel · ₹24,000 / month account management",
    perReelRate: "₹8,000 / 3 reels",
    monthlyRate: "₹24,000",
    mediaKitCta: "Book a Reel or Retainer",
    linkedinUrl: "https://www.linkedin.com/",
    developerName: "Aryan Dani",
    developerUrl: "https://www.aryandani.com",
  },

  hero: {
    wordmark: "siya",
    cutoutSrc: "/siya/siya-portrait.jpg",
    fallbackPortraitSrc: "/siya/siya-portrait.jpg",
    roles: [
      "creator",
      "storyteller",
      "ugc for startups",
      "account manager",
    ] as RoleItem[],
  },

  miniGame: {
    targetCount: 16,
    pillLabel: "catch the hearts",
    rewardTitle: "you caught all 16 hearts.",
    rewardSubtitle: "welcome to the inner circle:",
    handwrittenNote:
      "mention '16 hearts' when you inquire and i'll throw in an extra hook variation on our first reel together.",
    perkCode: "HEARTS16",
    perkDescription:
      "unlocked: +1 bonus first-3-second hook variation added to your first deliverable package.",
  },

  proof: {
    stats: [
      {
        id: "peak-monthly",
        numericValue: 10,
        suffix: "M",
        label: "Peak monthly reach",
        detail:
          "Organic views driven by high-completion storytelling, saves, and shares.",
      },
      {
        id: "million-reels",
        numericValue: 1,
        suffix: "M+",
        label: "Views on viral reels",
        detail:
          "From 1.8M+ monsoon drives to 319K-like everyday moments that travel far beyond follower count.",
      },
      {
        id: "community",
        numericValue: 9,
        suffix: "K+",
        label: "Community on Instagram",
        detail:
          "A warm, high-trust audience that treats recommendations like a text from a close friend.",
      },
    ] as ProofStatItem[],
    brands: [
      {
        id: "pharmeasy",
        name: "PharmEasy",
        category: "Consumer Healthtech",
        relationship: "Brand Collaboration",
        featured: true,
        highlightQuote:
          "Turned everyday health reminders into relatable, zero-jargon storytime reels that felt completely native to the feed.",
        deliverableType: "Concept, filming & edit",
      },
      {
        id: "mokobara",
        name: "Mokobara",
        category: "Travel & Lifestyle",
        relationship: "Creator Collaboration",
        featured: true,
        highlightQuote:
          "Golden-hour visual storytelling pairing warm aesthetic transitions with effortless product presence.",
        deliverableType: "Aesthetic reel & hook",
      },
      {
        id: "emerging-startups",
        name: "Consumer Startups",
        category: "D2C & App Launches",
        relationship: "UGC & Account Management",
        featured: false,
        highlightQuote:
          "Helping fast-growing teams ship founder-friendly reels and full monthly social calendars without sounding like a corporate ad.",
        deliverableType: "₹8K/3 reels · ₹24K/mo",
      },
    ] as BrandItem[],
  },

  work: {
    reels: [
      {
        id: "reel-neighbours",
        brand: "@heartsfromsiya",
        category: "Viral Original · 319K Likes",
        views: "319K likes · 761 comments",
        result:
          "319,000+ likes and 761 comments on an effortless, relatable everyday moment.",
        overlaySerif: "peace and quiet is a myth",
        captionSans: "i can listen to my neighbours cooking bro",
        audioName: "original audio · @heartsfromsiya",
        duration: "0:14",
        posterSrc: "/siya/reels/reel-neighbours-poster.jpg",
        videoSrc: "/siya/reels/reel-neighbours.mp4",
        instagramUrl: "https://www.instagram.com/reel/DZOY5X8oVus/",
        storyBehind:
          "No heavy script or studio setup—just a funny, hyper-relatable observation caught on camera that pulled over 319K likes organically.",
      },
      {
        id: "reel-mokobara",
        brand: "Mokobara",
        category: "Brand Collaboration · #ad",
        views: "High-Save Collab",
        result:
          "Warm everyday styling and product storytelling built for organic saves and shares.",
        overlaySerif: "this tote just gets it",
        captionSans: "this tote just gets it, the bloss tote by @mokobara ⭐️ #ad",
        audioName: "original audio · @siyasideup",
        duration: "0:18",
        posterSrc: "/siya/reels/reel-siyasideup-poster.jpg",
        videoSrc: "/siya/reels/reel-siyasideup.mp4",
        instagramUrl: "https://www.instagram.com/reel/Dd_WN7LRui9/",
        storyBehind:
          "Shot in natural light so the Bloss Tote by Mokobara felt like a genuine everyday carry rather than a staged commercial.",
      },
      {
        id: "reel-audio-head",
        brand: "@heartsfromsiya",
        category: "1M+ Reach Format",
        views: "Viral Audio Reel",
        result:
          "Instant facial expression hook and beat-synced pacing that keeps viewers watching on loop.",
        overlaySerif: "on loop in my head",
        captionSans: "this audio plays in my head all day long🫪",
        audioName: "trending audio · @heartsfromsiya",
        duration: "0:12",
        posterSrc: "/siya/reels/reel-audio-head-poster.jpg",
        videoSrc: "/siya/reels/reel-audio-head.mp4",
        instagramUrl: "https://www.instagram.com/reel/DZ7jFjap0dG/",
        storyBehind:
          "Built around a 1.5-second visual hook and replayable loop timing that drives high completion rates on Reels.",
      },
      {
        id: "reel-comeback",
        brand: "@heartsfromsiya",
        category: "Creator Storytelling",
        views: "High-Retention Cut",
        result:
          "Warm, conversational camera presence that makes the audience feel like they're on FaceTime.",
        overlaySerif: "back in the frame",
        captionSans: "i’mback after so long 😛",
        audioName: "original audio · @heartsfromsiya",
        duration: "0:15",
        posterSrc: "/siya/reels/reel-comeback-poster.jpg",
        videoSrc: "/siya/reels/reel-comeback.mp4",
        instagramUrl: "https://www.instagram.com/reel/DdZL3RJIdEf/",
        storyBehind:
          "Direct-to-camera warmth and effortless energy—the exact tone that makes brand integrations feel native to the feed.",
      },
    ] as ReelItem[],
  },

  services: {
    subcopy:
      "Transparent, creator-direct rates with zero agency markups: ₹8,000 for 3 reels, +₹2,000 per extra reel, and ₹24,000/month for full account management (adjustable according to what you actually require).",
    items: [
      {
        id: "service-reels",
        index: "01",
        titleBefore: "3-Reel ",
        titleAccent: "Starter",
        subtitle: "Creator-led brand reels or UGC pack",
        priceDisplay: "₹8,000",
        priceSub: "for 3 reels · starter pack",
        hoverSerifCaption:
          "Filmed in my space, watched like a FaceTime from a close friend.",
        deliverables: [
          "Three custom hooks & conversational scripts in Siya's natural voice",
          "Golden-hour filming + warm editorial color grade & captions",
          "Instagram Reel posts (@heartsfromsiya) or clean 9:16 brand exports",
        ],
        turnaround: "5–7 days turnaround",
        ctaLabel: "Book 3 Reels (₹8,000)",
        rateNote: "₹8,000 / 3 reels",
        inquiryKey: "single-reel",
      },
      {
        id: "service-monthly",
        index: "02",
        titleBefore: "Monthly Account ",
        titleAccent: "Management",
        subtitle: "End-to-end social & reel management",
        priceDisplay: "₹24,000",
        priceSub: "per month · adjustable to your requirements",
        hoverSerifCaption:
          "You build the product; I'll run the content engine and make people care.",
        deliverables: [
          "Full monthly account management, content calendar & creative direction",
          "Consistent high-retention Reels, hooks, scripting, filming & beat-synced editing",
          "Adjustable scope & deliverables tailored to what your brand actually requires",
        ],
        turnaround: "Monthly retainer · Adjustable",
        ctaLabel: "Book Monthly Management (₹24k)",
        rateNote: "₹24k / month (adjustable)",
        inquiryKey: "account-management",
      },
      {
        id: "service-custom-bundle",
        index: "03",
        titleBefore: "Multi-Reel ",
        titleAccent: "Campaign",
        subtitle: "Scaled packs for launches & paid social",
        priceDisplay: "+₹2,000",
        priceSub: "per extra reel after the 3-reel starter",
        hoverSerifCaption:
          "Multiple hook variations and story arcs that beat ad fatigue.",
        deliverables: [
          "4 reels = ₹10,000 · 5 reels = ₹12,000 · and +₹2,000 for each additional",
          "Selfie-led product storytimes, demos, and relatable everyday skits",
          "Ready-to-run 9:16 exports for both organic reels and Meta/Shorts ads",
        ],
        turnaround: "5–7 days · Custom scope",
        ctaLabel: "Build Custom Bundle",
        rateNote: "₹8K base · +₹2K / reel",
        inquiryKey: "multi-reel-campaign",
      },
    ] as ServiceItem[],
  },
} as const;

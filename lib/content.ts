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
      "Warm, high-retention reels, UGC, and monthly account management by Siya Pawar (@heartsfromsiya). 10M peak monthly views, multiple 1M+ reels, ₹3,000/reel & ₹24k/mo account management.",
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
    ratesPolicy: "₹3,000 / video or reel · ₹24,000 / month account management",
    perReelRate: "₹3,000",
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
        deliverableType: "₹3K/reel · ₹24K/mo retainer",
      },
    ] as BrandItem[],
  },

  work: {
    reels: [
      {
        id: "reel-neighbours",
        brand: "@heartsfromsiya",
        category: "Viral Original",
        views: "319K likes · 761 comments",
        result:
          "319,000+ likes and 761 comments on an effortless, relatable everyday moment.",
        overlaySerif: "peace and quiet is a myth",
        captionSans: "i can listen to my neighbours cooking bro",
        audioName: "original audio · @heartsfromsiya",
        duration: "0:14",
        posterSrc: "/siya/reels/reel-neighbours-poster.jpg",
        videoSrc: "",
        instagramUrl: "https://www.instagram.com/reel/DZOY5X8oVus/",
        storyBehind:
          "No heavy script or studio setup—just a funny, hyper-relatable observation caught on camera that pulled over 319K likes organically.",
      },
      {
        id: "reel-weather",
        brand: "@heartsfromsiya",
        category: "1.8M+ Viral Reel",
        views: "1.8M views · 211K likes",
        result:
          "Crossed 1.8M+ views and 211K likes capturing Pune monsoon mood with friends.",
        overlaySerif: "pune monsoons hit different",
        captionSans: "this weather❤️‍🩹",
        audioName: "monsoon drive · @heartsfromsiya",
        duration: "0:16",
        posterSrc: "/siya/reels/reel-weather-poster.jpg",
        videoSrc: "",
        instagramUrl: "https://www.instagram.com/reel/Dak5At3oA-A/",
        storyBehind:
          "Rain on the sunroof, friends in the car, and an instant mood hook that resonated with 1.8 million viewers.",
      },
      {
        id: "reel-pharmeasy",
        brand: "PharmEasy",
        category: "Brand Collaboration",
        views: "1M+ club format",
        result:
          "Relatable healthtech integration that kept viewers watching past the 3-second ad reflex.",
        overlaySerif: "adulting is mostly drinking water on time",
        captionSans:
          "pov: your body sends a calendar invite you can't decline",
        audioName: "original audio · @heartsfromsiya",
        duration: "0:24",
        posterSrc: "/siya/reels/reel-01-poster.jpg",
        videoSrc: "",
        instagramUrl: "https://www.instagram.com/heartsfromsiya/reels/",
        storyBehind:
          "Healthtech ads usually feel clinical. We flipped the brief into a warm, slightly sarcastic confession with a tight visual hook.",
      },
      {
        id: "reel-mokobara",
        brand: "Mokobara",
        category: "Brand Collaboration",
        views: "High-save collab",
        result:
          "Warm golden-hour transition built for aspirational travel saves and DMs.",
        overlaySerif: "going somewhere warm",
        captionSans:
          "packing my entire personality + three kurtis into one cabin bag",
        audioName: "golden hour edit · @heartsfromsiya",
        duration: "0:19",
        posterSrc: "/siya/reels/reel-02-poster.jpg",
        videoSrc: "",
        instagramUrl: "https://www.instagram.com/heartsfromsiya/reels/",
        storyBehind:
          "Shot in late-afternoon window light so the product popped naturally against warm shadows—zero studio stiffness.",
      },
    ] as ReelItem[],
  },

  services: {
    subcopy:
      "Transparent, creator-direct rates with zero agency markups: ₹3,000 per video or reel, and ₹24,000/month for full account management (adjustable according to what you actually require).",
    items: [
      {
        id: "service-reels",
        index: "01",
        titleBefore: "Single Video / ",
        titleAccent: "Reel",
        subtitle: "Creator-led brand reel or UGC video",
        priceDisplay: "₹3,000",
        priceSub: "per video or /reel",
        hoverSerifCaption:
          "Filmed in my space, watched like a FaceTime from a close friend.",
        deliverables: [
          "Custom hook & conversational script in Siya's natural voice",
          "Golden-hour filming + warm editorial color grade & captions",
          "Instagram Reel post (@heartsfromsiya) or clean 9:16 brand export",
        ],
        turnaround: "3–5 days turnaround",
        ctaLabel: "Book a Reel (₹3,000)",
        rateNote: "₹3,000 / video or reel",
        inquiryKey: "single-reel-3k",
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
        inquiryKey: "monthly-management-24k",
      },
      {
        id: "service-custom-bundle",
        index: "03",
        titleBefore: "Multi-Reel ",
        titleAccent: "Campaign",
        subtitle: "Custom bundle for launches & paid social",
        priceDisplay: "₹3,000×",
        priceSub: "per video · custom multi-reel bundles",
        hoverSerifCaption:
          "Multiple hook variations and story arcs that beat ad fatigue.",
        deliverables: [
          "Batch of 3, 5, or 8+ Reels at ₹3,000 per video with hook variations",
          "Selfie-led product storytimes, demos, and relatable everyday skits",
          "Ready-to-run 9:16 exports for both organic reels and Meta/Shorts ads",
        ],
        turnaround: "5–7 days · Custom scope",
        ctaLabel: "Build Custom Bundle",
        rateNote: "₹3,000 / reel · Custom pack",
        inquiryKey: "multi-reel-bundle",
      },
    ] as ServiceItem[],
  },
} as const;

import { BLUR } from "./blur-data";

/* ---------------------------------------------------------------------------
   Single source of truth for everything written on the site.
   Numbers here are the creator's own published figures; nothing is invented.
--------------------------------------------------------------------------- */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  blur: string;
};

export type Reel = {
  id: string;
  title: string;
  /** The caption as posted on Instagram (emoji omitted for display). */
  caption: string;
  kind: string;
  posted: string;
  duration: string;
  video: string;
  poster: string;
  blur: string;
  instagramUrl: string;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export type InquiryOption = {
  value: "single-reel" | "multi-reel-campaign" | "account-management" | "other";
  label: string;
  /** Used in the subject line and the email body. */
  fullLabel: string;
  subjectPrefix: string;
};

export type HeadingParts = { caps: string; script: string };

export const NAV = [
  { label: "work", href: "#work" },
  { label: "gallery", href: "#gallery" },
  { label: "contact", href: "#contact" },
] as const;

export const BRAND_LINKS = {
  pharmeasy: "https://pharmeasy.in/",
  mokobara: "https://mokobara.com/",
} as const;

export const INQUIRY_OPTIONS: InquiryOption[] = [
  {
    value: "single-reel",
    label: "3-reel starter",
    fullLabel: "3-reel starter — ₹8,000",
    subjectPrefix: "inquiry: 3-reel starter",
  },
  {
    value: "multi-reel-campaign",
    label: "multi-reel pack",
    fullLabel: "multi-reel pack — ₹8,000 / 3 · +₹2,000 each extra",
    subjectPrefix: "inquiry: multi-reel pack",
  },
  {
    value: "account-management",
    label: "monthly management",
    fullLabel: "monthly account management — ₹24,000 / mo (adjustable)",
    subjectPrefix: "inquiry: monthly management",
  },
  {
    value: "other",
    label: "other",
    fullLabel: "other / custom inquiry",
    subjectPrefix: "inquiry: other",
  },
];

const PHOTOS = {
  hero: {
    src: "/siya/photos/siya-hero-cutout-2.png",
    width: 1500,
    height: 2346,
    alt: "Siya looking back over her shoulder in a teal floral dress",
    blur: BLUR.hero,
  },
  about: {
    src: "/siya/photos/siya-7512.jpg",
    width: 1800,
    height: 2400,
    alt: "Siya in glasses and a leopard-print top, smiling over her shoulder in a warmly lit café",
    blur: BLUR.about,
  },
  inset: {
    src: "/siya/photos/siya-7514.jpg",
    width: 2400,
    height: 1350,
    alt: "Close-up selfie of Siya in soft afternoon light with ivy on the wall behind her",
    blur: BLUR.inset,
  },
} satisfies Record<string, Photo>;

export const CONTENT = {
  meta: {
    siteTitle: "Siya Pawar — Creator, Storyteller & Brand Collaborations",
    siteDescription:
      "Warm, high-retention reels, UGC and monthly account management by Siya Pawar (@heartsfromsiya). 2M peak monthly reach, multiple 1M+ reels. From ₹8,000 for 3 reels and ₹24,000 a month for account management.",
  },

  profile: {
    name: "siya",
    fullName: "Siya Pawar",
    handle: "@heartsfromsiya",
    secondaryHandle: "@siyasideup",
    location: "pune, india",
    timezone: "Asia/Kolkata",
    status: "open for collaborations",
    email: "siyapawar@gmail.com",
    ccEmail: "daniaryan212@gmail.com",
    instagramUrl: "https://www.instagram.com/heartsfromsiya/",
    instagramReelsUrl: "https://www.instagram.com/heartsfromsiya/reels/",
    instagramDumpUrl: "https://www.instagram.com/siyasideup/",
    youtubeUrl: "https://m.youtube.com/@heartsfromsiya",
    developerName: "Aryan Dani",
    developerUrl: "https://www.aryandani.com",
  },

  photos: PHOTOS,

  hero: {
    name: "Siya",
    role: "content creator",
    cta: "work with me",
  },

  statement: {
    before: "warm stories people",
    script: "actually",
    after: "finish watching.",
  },

  work: {
    eyebrow: "selected reels",
    title: { caps: "selected", script: "work" } satisfies HeadingParts,
    allReelsLabel: "all reels on @heartsfromsiya",
    carouselBadge: "videos i’ve created",
    favouriteBadge: "client favourite",
    reels: [
      {
        id: "01",
        title: "california burrito",
        caption: "@californiaburrito_in lover 4life",
        kind: "skit",
        posted: "oct 2026",
        duration: "0:17",
        video: "/siya/reels/featured-01.mp4",
        poster: "/siya/reels/featured-01-poster.jpg",
        blur: BLUR.reel01,
        instagramUrl: "https://www.instagram.com/reel/Dewiv69IuFY/",
      },
      {
        id: "02",
        title: "back in the frame",
        caption: "i’m back after so long",
        kind: "story",
        posted: "sep 2026",
        duration: "0:20",
        video: "/siya/reels/featured-02.mp4",
        poster: "/siya/reels/featured-02-poster.jpg",
        blur: BLUR.reel02,
        instagramUrl: "https://www.instagram.com/reel/DdZL3RJIdEf/",
      },
      {
        id: "03",
        title: "phirse bolo",
        caption: "phirse bolo",
        kind: "mood",
        posted: "jun 2026",
        duration: "0:17",
        video: "/siya/reels/featured-03.mp4",
        poster: "/siya/reels/featured-03-poster.jpg",
        blur: BLUR.reel03,
        instagramUrl: "https://www.instagram.com/reel/DZ46Dx3Jo8O/",
      },
      {
        id: "04",
        title: "sundae backpack",
        caption: "the functional but chic, sundae backpack by @mokobara",
        kind: "collab",
        posted: "sep 2026",
        duration: "0:52",
        video: "/siya/reels/featured-04.mp4",
        poster: "/siya/reels/featured-04-poster.jpg",
        blur: BLUR.reel04,
        instagramUrl: "https://www.instagram.com/reel/DdYjCahxxti/",
      },
      {
        id: "05",
        title: "memo crossbody",
        caption: "the effortlessly put together memo crossbody by @mokobara",
        kind: "collab",
        posted: "sep 2026",
        duration: "0:48",
        video: "/siya/reels/featured-05.mp4",
        poster: "/siya/reels/featured-05-poster.jpg",
        blur: BLUR.reel05,
        instagramUrl: "https://www.instagram.com/reel/DdOjhsUNG8a/",
      },
      {
        id: "06",
        title: "traditional transitions",
        caption: "transitions, traditional, reels",
        kind: "edit",
        posted: "oct 2025",
        duration: "0:13",
        video: "/siya/reels/featured-06.mp4",
        poster: "/siya/reels/featured-06-poster.jpg",
        blur: BLUR.reel06,
        instagramUrl: "https://www.instagram.com/reel/DPbUWCcCO46/",
      },
      {
        id: "07",
        title: "thanks dad",
        caption: "thanks dad",
        kind: "story",
        posted: "dec 2025",
        duration: "0:21",
        video: "/siya/reels/featured-08.mp4",
        poster: "/siya/reels/featured-08-poster.jpg",
        blur: BLUR.reel08,
        instagramUrl: "https://www.instagram.com/reel/DSPEYcGiBzQ/",
      },
    ] satisfies Reel[],
  },

  numbers: {
    stats: [
      { value: 2, suffix: "M+", label: "peak monthly reach" },
      { value: 1, suffix: "M+", label: "views on viral reels" },
      { value: 9, suffix: "K+", label: "community on instagram" },
    ] satisfies Stat[],
    clientsLead: "worked with",
    clients: [
      { name: "pharmeasy", href: BRAND_LINKS.pharmeasy },
      { name: "mokobara", href: BRAND_LINKS.mokobara },
    ],
  },

  about: {
    title: { caps: "the person behind the", script: "camera" } satisfies HeadingParts,
    paragraphs: [
      "hi, i’m siya. based in pune, i make warm, silly and deeply relatable short videos, and partner with brands like pharmeasy and mokobara to tell stories people genuinely want to watch.",
      "no studio and no stiff scripts: natural light, hooks that sound like a voice note to a close friend, and edits that keep you watching right to the end.",
    ],
    captionMain: "pune",
    captionInset: "afternoon light",
  },

  gallery: {
    chip: "gallery",
    title: "photos",
    images: [
      {
        src: "/siya/photos/siya-7510.jpg",
        width: 1800,
        height: 2400,
        alt: "siya in soft light, looking toward the camera",
        blur: BLUR.gallery7510,
      },
      {
        src: "/siya/photos/siya-7512.jpg",
        width: 1800,
        height: 2400,
        alt: "siya in glasses and a leopard-print top, smiling over her shoulder",
        blur: BLUR.about,
      },
      {
        src: "/siya/photos/siya-8445.jpg",
        width: 768,
        height: 1024,
        alt: "siya under warm fairy lights in a teal printed kurti",
        blur: BLUR.gallery8445,
      },
      {
        src: "/siya/photos/siya-8447.jpg",
        width: 1800,
        height: 3201,
        alt: "siya posing outdoors at night in warm patio light",
        blur: BLUR.gallery8447,
      },
      {
        src: "/siya/photos/siya-7514.jpg",
        width: 2400,
        height: 1350,
        alt: "close-up of siya in soft afternoon light",
        blur: BLUR.inset,
      },
    ] satisfies Photo[],
  },

  rates: {
    title: { caps: "transparent", script: "rates" } satisfies HeadingParts,
    lead: "creator-direct pricing with zero agency markups.",
    list: [
      {
        id: "starter",
        name: "three reels",
        amount: 8000,
        prefix: "",
        suffix: "",
        detail: "concept, script, shoot and edit. delivered in 5–7 days.",
      },
      {
        id: "extra",
        name: "each extra reel",
        amount: 2000,
        prefix: "+",
        suffix: "",
        detail: "four reels is ₹10,000, five is ₹12,000, and so on.",
      },
      {
        id: "monthly",
        name: "monthly management",
        amount: 24000,
        prefix: "",
        suffix: "/ month",
        detail:
          "strategy, scripting, shooting, editing and posting. adjustable to what you actually require.",
      },
    ],
    counterLabel: "estimate your pack",
    counterMin: 3,
    counterMax: 12,
  },

  contact: {
    title: { caps: "let’s make something people", script: "watch" } satisfies HeadingParts,
    lead: "launching a product, scaling a brand or after monthly content? choose a format and drop a note. it opens in your email app, ready to send.",
    namePlaceholder: "riya, brand lead",
    emailPlaceholder: "riya@brand.com",
    notePlaceholder: "tell me what you’re launching and what you have in mind.",
  },

  footer: {
    copyright: "© 2026 siya pawar. all rights reserved.",
    credit: "designed & developed by",
  },
} as const;

export type SiteContent = typeof CONTENT;

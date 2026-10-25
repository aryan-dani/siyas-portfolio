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
  value: "single-reel" | "multi-reel-campaign" | "account-management";
  label: string;
  /** Used in the subject line and the email body. */
  fullLabel: string;
  subjectPrefix: string;
};

export type HeadingParts = { caps: string; script: string };

export const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Rates", href: "#rates" },
  { label: "Contact", href: "#contact" },
] as const;

export const INQUIRY_OPTIONS: InquiryOption[] = [
  {
    value: "single-reel",
    label: "3-Reel Starter",
    fullLabel: "3-Reel Starter — ₹8,000",
    subjectPrefix: "Inquiry: 3-Reel Starter (₹8,000)",
  },
  {
    value: "multi-reel-campaign",
    label: "Multi-Reel Pack",
    fullLabel: "Multi-Reel Pack — ₹8,000 / 3 · +₹2,000 each extra",
    subjectPrefix: "Inquiry: Multi-Reel Pack (₹8,000/3 · +₹2,000/extra)",
  },
  {
    value: "account-management",
    label: "Monthly Management",
    fullLabel: "Monthly Account Management — ₹24,000 / mo (Adjustable)",
    subjectPrefix: "Inquiry: Monthly Account Management (₹24,000/mo · Adjustable)",
  },
];

const PHOTOS = {
  hero: {
    src: "/siya/photos/siya-7510.jpg",
    width: 1800,
    height: 2400,
    alt: "Siya smiling with her head tilted, in a black and gold embroidered kurta with a chartreuse dupatta",
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
      "Warm, high-retention reels, UGC and monthly account management by Siya Pawar (@heartsfromsiya). 10M peak monthly reach, multiple 1M+ reels. From ₹8,000 for 3 reels and ₹24,000 a month for account management.",
  },

  profile: {
    name: "Siya",
    fullName: "Siya Pawar",
    handle: "@heartsfromsiya",
    secondaryHandle: "@siyasideup",
    location: "Pune, India",
    timezone: "Asia/Kolkata",
    status: "Open for collaborations",
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
    script: "hearts from",
    left: "SI",
    right: "YA",
    roles: "Creator · Storyteller · UGC for startups",
    cta: "Work with me",
  },

  statement: {
    before: "Warm stories people",
    script: "actually",
    after: "finish watching.",
  },

  work: {
    eyebrow: "Selected reels",
    title: { caps: "Selected", script: "work" } satisfies HeadingParts,
    allReelsLabel: "All reels on @heartsfromsiya",
    reels: [
      {
        id: "01",
        title: "California Burrito",
        caption: "@californiaburrito_in lover 4life",
        kind: "Skit",
        posted: "Oct 2026",
        duration: "0:17",
        video: "/siya/reels/featured-01.mp4",
        poster: "/siya/reels/featured-01-poster.jpg",
        blur: BLUR.reel01,
        instagramUrl: "https://www.instagram.com/reel/Dewiv69IuFY/",
      },
      {
        id: "02",
        title: "Back in the frame",
        caption: "i’m back after so long",
        kind: "Story",
        posted: "Sep 2026",
        duration: "0:20",
        video: "/siya/reels/featured-02.mp4",
        poster: "/siya/reels/featured-02-poster.jpg",
        blur: BLUR.reel02,
        instagramUrl: "https://www.instagram.com/reel/DdZL3RJIdEf/",
      },
      {
        id: "03",
        title: "Phirse bolo",
        caption: "phirse bolo",
        kind: "Mood",
        posted: "Jun 2026",
        duration: "0:17",
        video: "/siya/reels/featured-03.mp4",
        poster: "/siya/reels/featured-03-poster.jpg",
        blur: BLUR.reel03,
        instagramUrl: "https://www.instagram.com/reel/DZ46Dx3Jo8O/",
      },
    ] satisfies Reel[],
  },

  numbers: {
    stats: [
      { value: 10, suffix: "M+", label: "Peak monthly reach" },
      { value: 1, suffix: "M+", label: "Views on viral reels" },
      { value: 9, suffix: "K+", label: "Community on Instagram" },
    ] satisfies Stat[],
    clientsLead: "Worked with",
    clients: ["PharmEasy", "Mokobara"],
  },

  about: {
    title: { caps: "The person behind the", script: "camera" } satisfies HeadingParts,
    paragraphs: [
      "Hi, I’m Siya. Based in Pune, I make warm, silly and deeply relatable short videos, and partner with brands like PharmEasy and Mokobara to tell stories people genuinely want to watch.",
      "No studio and no stiff scripts: natural light, hooks that sound like a voice note to a close friend, and edits that keep you watching right to the end.",
    ],
    captionMain: "Pune",
    captionInset: "Afternoon light",
  },

  rates: {
    title: { caps: "Transparent", script: "rates" } satisfies HeadingParts,
    lead: "Creator-direct pricing with zero agency markups.",
    list: [
      {
        id: "starter",
        name: "Three reels",
        amount: 8000,
        prefix: "",
        suffix: "",
        detail: "Concept, script, shoot and edit. Delivered in 5–7 days.",
      },
      {
        id: "extra",
        name: "Each extra reel",
        amount: 2000,
        prefix: "+",
        suffix: "",
        detail: "Four reels is ₹10,000, five is ₹12,000, and so on.",
      },
      {
        id: "monthly",
        name: "Monthly management",
        amount: 24000,
        prefix: "",
        suffix: "/ month",
        detail:
          "Strategy, scripting, shooting, editing and posting. Adjustable to what you actually require.",
      },
    ],
    counterLabel: "Estimate your pack",
    counterMin: 3,
    counterMax: 12,
  },

  contact: {
    title: { caps: "Let’s make something people", script: "watch" } satisfies HeadingParts,
    lead: "Launching a product, scaling a brand or after monthly content? Choose a format and drop a note. It opens in your email app, ready to send.",
    namePlaceholder: "Riya, Brand Lead",
    emailPlaceholder: "riya@brand.com",
    notePlaceholder: "Tell me what you’re launching and what you have in mind.",
  },

  footer: {
    copyright: "© 2026 Siya Pawar. All rights reserved.",
    credit: "Designed & developed by",
  },
} as const;

export type SiteContent = typeof CONTENT;

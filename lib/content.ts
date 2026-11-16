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
  /** Crawlable category for figcaption / VideoObject schema. */
  seoCaption: string;
  kind: string;
  posted: string;
  duration: string;
  video: string;
  poster: string;
  blur: string;
  instagramUrl: string;
  brand?: string;
  caseStudySlug?: string;
  deliverableType?: string;
  hookSummary?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
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
  ally21salon: "https://ally21salon.com/",
  "whatsup wellness": "https://www.whatsupwellness.in/",
  "flash.co": "https://flash.co/home",
  "jersey junction": "https://www.jerseyjunction.com/",
  nailholic: "https://www.instagram.com/nailholic.studio/",
  "california burrito": "https://www.californiaburrito.in/",
} as const;

export const INQUIRY_OPTIONS: InquiryOption[] = [
  {
    value: "single-reel",
    label: "3-reel starter",
    fullLabel: "3-reel starter pack",
    subjectPrefix: "inquiry: 3-reel starter",
  },
  {
    value: "multi-reel-campaign",
    label: "multi-reel pack",
    fullLabel: "multi-reel brand campaign",
    subjectPrefix: "inquiry: multi-reel pack",
  },
  {
    value: "account-management",
    label: "monthly management",
    fullLabel: "monthly account management & content creation",
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
    src: "/siya/photos/siya-hero-cutout-5.png",
    width: 1536,
    height: 2372,
    alt: "Siya Pawar (@heartsfromsiya) editorial fashion portrait in a teal floral kurti — Pune lifestyle & UGC creator",
    blur: BLUR.hero,
  },
  about: {
    src: "/siya/photos/siya-pawar-cafe-lifestyle-ugc-pune.jpg",
    width: 1800,
    height: 2400,
    alt: "Siya Pawar (@heartsfromsiya) in glasses and a leopard-print top, smiling over her shoulder in a warmly lit Pune café",
    blur: BLUR.about,
  },
  inset: {
    src: "/siya/photos/siya-pawar-beauty-afternoon-light-pune.jpg",
    width: 2400,
    height: 1350,
    alt: "Lifestyle and beauty UGC photography by Pune content creator Siya Pawar in soft afternoon light",
    blur: BLUR.inset,
  },
  /** Primary portrait for Person JSON-LD / media kit. */
  profilePhoto: {
    src: "/siya/photos/siya-pawar-editorial-portrait-pune.jpg",
    width: 1800,
    height: 2400,
    alt: "Siya Pawar (@heartsfromsiya) editorial portrait for brand collaborations and UGC media kit",
    blur: BLUR.gallery7510,
  },
} satisfies Record<string, Photo>;

export const CONTENT = {
  meta: {
    siteTitle:
      "Siya Pawar (@heartsfromsiya) — Pune UGC & Lifestyle Creator",
    siteDescription:
      "Siya Pawar is a Pune-based UGC creator and lifestyle influencer partnering with brands like PharmEasy and Mokobara on high-converting short-form video ads.",
    ogTitle: "Siya Pawar (@heartsfromsiya) — Lifestyle & UGC Creator, Pune",
    collaborateTitle:
      "Hire Siya Pawar — UGC Packages, Rates & Brand Collaborations",
    collaborateDescription:
      "Book Pune UGC creator Siya Pawar (@heartsfromsiya) for organic Reels, paid ad hooks, product demos, and lifestyle campaigns. View deliverables and FAQs.",
  },

  profile: {
    name: "siya",
    fullName: "Siya Pawar",
    handle: "@heartsfromsiya",
    secondaryHandle: "@siyasideup",
    location: "pune, india",
    locationFull: "Pune, Maharashtra, India",
    timezone: "Asia/Kolkata",
    status: "open for collaborations",
    jobTitle: "Lifestyle, Fashion & UGC Content Creator",
    email: "siyapawar@gmail.com",
    ccEmail: "daniaryan212@gmail.com",
    instagramUrl: "https://www.instagram.com/heartsfromsiya/",
    instagramReelsUrl: "https://www.instagram.com/heartsfromsiya/reels/",
    instagramDumpUrl: "https://www.instagram.com/siyasideup/",
    youtubeUrl: "https://www.youtube.com/@heartsfromsiya",
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
        seoCaption: "Pune lifestyle mini vlog & café skit reel by Siya Pawar (@heartsfromsiya)",
        kind: "skit",
        posted: "oct 2026",
        duration: "0:17",
        video: "/siya/reels/featured-01.mp4",
        poster: "/siya/reels/featured-01-poster.jpg",
        blur: BLUR.reel01,
        instagramUrl: "https://www.instagram.com/reel/Dewiv69IuFY/",
        brand: "california burrito",
        caseStudySlug: "california-burrito-pune",
        deliverableType: "Dining Skit & Mini Vlog",
        hookSummary: "Humorous café skit & cravings for California Burrito in Pune",
      },
      {
        id: "02",
        title: "back in the frame",
        caption: "i’m back after so long",
        seoCaption: "Campus & Gen-Z lifestyle story reel — Siya Pawar, Pune content creator",
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
        seoCaption: "Fashion & styling mood reel by Pune influencer Siya Pawar (@heartsfromsiya)",
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
        seoCaption: "D2C brand collab UGC — Mokobara Sundae backpack product reel by Siya Pawar",
        kind: "collab",
        posted: "sep 2026",
        duration: "0:52",
        video: "/siya/reels/featured-04.mp4",
        poster: "/siya/reels/featured-04-poster.jpg",
        blur: BLUR.reel04,
        instagramUrl: "https://www.instagram.com/reel/DdYjCahxxti/",
        brand: "mokobara",
        caseStudySlug: "mokobara-sundae-backpack",
        deliverableType: "D2C Product Demo & Unboxing",
        hookSummary: "Aesthetic fit-check & functional pocket walkthrough",
      },
      {
        id: "05",
        title: "memo crossbody",
        caption: "the effortlessly put together memo crossbody by @mokobara",
        seoCaption: "Aesthetic product photography & UGC reel — Mokobara Memo crossbody with Siya Pawar",
        kind: "collab",
        posted: "sep 2026",
        duration: "0:48",
        video: "/siya/reels/featured-05.mp4",
        poster: "/siya/reels/featured-05-poster.jpg",
        blur: BLUR.reel05,
        instagramUrl: "https://www.instagram.com/reel/DdOjhsUNG8a/",
        brand: "mokobara",
        caseStudySlug: "mokobara-memo-crossbody",
        deliverableType: "Accessories Styling & What's In My Bag",
        hookSummary: "Tactical day-to-night styling transition & essentials layout",
      },
      {
        id: "06",
        title: "traditional transitions",
        caption: "transitions, traditional, reels",
        seoCaption: "Fashion & styling traditional transition reel by Siya Pawar (@heartsfromsiya)",
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
        seoCaption: "Warm lifestyle storytelling reel — Siya Pawar, Gen-Z influencer in Pune",
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
      { name: "ally21salon", href: BRAND_LINKS.ally21salon },
      { name: "whatsup wellness", href: BRAND_LINKS["whatsup wellness"] },
      { name: "flash.co", href: BRAND_LINKS["flash.co"] },
      { name: "jersey junction", href: BRAND_LINKS["jersey junction"] },
      { name: "nailholic", href: BRAND_LINKS.nailholic },
      { name: "california burrito", href: BRAND_LINKS["california burrito"] },
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
        src: "/siya/photos/siya-pawar-editorial-portrait-pune.jpg",
        width: 1800,
        height: 2400,
        alt: "Siya Pawar (@heartsfromsiya) editorial fashion portrait in soft light — Pune lifestyle influencer",
        blur: BLUR.gallery7510,
      },
      {
        src: "/siya/photos/siya-pawar-cafe-lifestyle-ugc-pune.jpg",
        width: 1800,
        height: 2400,
        alt: "Siya Pawar in glasses and leopard-print top, café lifestyle UGC photography in Pune",
        blur: BLUR.about,
      },
      {
        src: "/siya/photos/siya-pawar-fashion-kurti-fairy-lights-pune.jpg",
        width: 768,
        height: 1024,
        alt: "Siya Pawar under warm fairy lights in a teal printed kurti — fashion & beauty creator Pune",
        blur: BLUR.gallery8445,
      },
      {
        src: "/siya/photos/siya-pawar-outdoor-night-patio-pune.jpg",
        width: 1800,
        height: 3201,
        alt: "Siya Pawar posing outdoors at night in warm patio light — Gen-Z influencer Pune editorial",
        blur: BLUR.gallery8447,
      },
      {
        src: "/siya/photos/siya-pawar-beauty-afternoon-light-pune.jpg",
        width: 2400,
        height: 1350,
        alt: "Close-up lifestyle and beauty UGC photography by Pune content creator Siya Pawar",
        blur: BLUR.inset,
      },
    ] satisfies Photo[],
  },

  /** Collaboration niches — crawlable authority copy. */
  niches: [
    "Fashion & styling",
    "Beauty & skincare",
    "Campus & Gen-Z lifestyle",
    "Cafés & dining",
    "Tech & everyday carry",
  ] as const,

  /** Deliverables brands can book. */
  deliverables: [
    {
      name: "Dedicated Instagram Reels",
      detail: "Concept, script, shoot and edit — high-retention short-form for brand feeds and ads.",
    },
    {
      name: "UGC ad creatives",
      detail: "Hook / body / CTA variants for paid social and D2C performance campaigns.",
    },
    {
      name: "Story sets",
      detail: "Multi-frame Instagram Stories for launches, drops, and always-on brand presence.",
    },
    {
      name: "Product & lookbook photography",
      detail: "Aesthetic stills and editorial product photography for site and social.",
    },
    {
      name: "Event & store launch coverage",
      detail: "On-ground coverage for offline events, store openings, and shoots in Pune and Mumbai.",
    },
    {
      name: "YouTube Shorts / vlog cuts",
      detail: "Longer lifestyle cuts and Shorts for YouTube @heartsfromsiya and brand channels.",
    },
  ] as const,

  faqs: [
    {
      question: "How can brands collaborate with Siya Pawar (@heartsfromsiya) in Pune?",
      answer:
        "Email siyapawar@gmail.com or use the inquiry form on heartsfromsiya.com. Choose a 3-reel starter, multi-reel pack, monthly account management, or a custom brief. Siya works creator-direct with D2C and lifestyle brands across Pune, Mumbai, and India.",
    },
    {
      question: "What UGC and influencer deliverables does Siya offer?",
      answer:
        "Dedicated Instagram Reels, UGC ad creatives (hook/body/CTA), Story sets, product and lookbook photography, event and store launch coverage in Pune/Mumbai, and YouTube Shorts or vlog cuts. Collaboration packages are tailored directly to each brand brief.",
    },
    {
      question: "Does Siya shoot D2C product UGC remotely across India?",
      answer:
        "Yes. Siya delivers remote UGC for D2C brands across India, plus on-location shoots and events in Pune and Mumbai. Product seeding and briefs are handled directly — no agency markup.",
    },
    {
      question: "What niches does @heartsfromsiya specialize in?",
      answer:
        "Lifestyle, fashion & styling, beauty & skincare, campus and Gen-Z culture, cafés & dining, and tech / everyday carry. Past brand partners include PharmEasy and Mokobara.",
    },
    {
      question: "What is the typical turnaround time for UGC reels and brand campaigns?",
      answer:
        "A standard three-reel pack is delivered in about 5–7 days after briefing and product receipt. Monthly account management covers strategy, scripting, shooting, editing, and posting on an agreed calendar.",
    },
    {
      question: "Is Siya available for offline events, store launches, and shoots in Pune and Mumbai?",
      answer:
        "Yes. Siya is based in Pune, Maharashtra and is available for offline events, store launches, and editorial shoots across Pune and Mumbai, with remote UGC available nationally.",
    },
  ] satisfies FaqItem[],

  rates: {
    title: { caps: "collaboration", script: "formats" } satisfies HeadingParts,
    lead: "creator-direct partnerships tailored to your brand’s campaign requirements. custom deliverables and scopes available upon inquiry.",
    list: [
      {
        id: "starter",
        name: "three reels",
        format: "Dedicated Short-Form Content",
        detail: "concept, script, shoot and edit. hook-tested and delivered ready to post in 5–7 days.",
      },
      {
        id: "campaign",
        name: "multi-reel campaign",
        format: "Brand Narrative & Product Series",
        detail: "cohesive multi-part storyline, episodic skits, or repeated product integrations across multiple reels.",
      },
      {
        id: "monthly",
        name: "monthly management",
        format: "End-to-End Creator Retainer",
        detail:
          "strategy, scripting, shooting, editing and posting. adjustable to what you actually require.",
      },
      {
        id: "ugc",
        name: "ugc ad creatives",
        format: "Paid Social Performance",
        detail:
          "high-converting hooks, direct-response angles, and organic-feel product demos for Meta and YouTube ads.",
      },
    ],
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

  collabFaq: {
    eyebrow: "collaborations",
    title: { caps: "deliverables &", script: "faq" } satisfies HeadingParts,
    lead: "ugc, reels, photography and brand collabs for teams hiring a lifestyle creator in pune — or remotely across india.",
    mediaKitLabel: "full media kit",
    mediaKitHref: "/collaborate",
  },
} as const;

export type SiteContent = typeof CONTENT;

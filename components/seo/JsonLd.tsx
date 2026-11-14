import { CONTENT } from "@/lib/content";
import { CREATOR_NAME, HANDLE, LOCATION } from "@/lib/site";

/**
 * Builds the sitewide JSON-LD @graph for ProfilePage / Person /
 * ProfessionalService / VideoObject ItemList / FAQPage.
 * Returns a string safe for embedding in <script type="application/ld+json">.
 */
export function buildSiteJsonLd(siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const { profile, photos, work, rates, faqs, deliverables, niches, numbers } =
    CONTENT;

  const personId = `${base}/#person`;
  const profilePageId = `${base}/#profilepage`;
  const serviceId = `${base}/#service`;
  const reelListId = `${base}/#reels`;
  const faqId = `${base}/#faq`;

  const place = {
    "@type": "Place",
    name: LOCATION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "MH",
      addressCountry: "IN",
    },
  };

  const offers = [
    ...rates.list.map((pkg) => ({
      "@type": "Offer",
      name: pkg.name,
      description: pkg.detail,
      category: pkg.format,
      url: `${base}/collaborate`,
    })),
    ...deliverables.map((d) => ({
      "@type": "Offer",
      name: d.name,
      description: d.detail,
      url: `${base}/collaborate`,
    })),
  ];

  const videoItems = work.reels.map((reel, i) => {
    const videoId = `${base}/#reel-${reel.id}`;
    return {
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        "@id": videoId,
        name: `${reel.title} — ${CREATOR_NAME} (${HANDLE})`,
        description: reel.seoCaption,
        thumbnailUrl: `${base}${reel.poster}`,
        contentUrl: `${base}${reel.video}`,
        uploadDate: approxUploadDate(reel.posted),
        duration: isoDuration(reel.duration),
        url: reel.instagramUrl,
        creator: { "@id": personId },
      },
    };
  });

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        url: base,
        name: CONTENT.meta.siteTitle,
        description: CONTENT.meta.siteDescription,
        dateCreated: "2025-01-01",
        dateModified: "2026-11-13",
        mainEntity: { "@id": personId },
        about: { "@id": personId },
        isPartOf: {
          "@type": "WebSite",
          "@id": `${base}/#website`,
          name: CREATOR_NAME,
          url: base,
        },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: CREATOR_NAME,
        alternateName: [
          "heartsfromsiya",
          HANDLE,
          "Hearts From Siya",
          profile.secondaryHandle,
        ],
        jobTitle: profile.jobTitle,
        description: CONTENT.meta.siteDescription,
        url: base,
        email: profile.email,
        image: `${base}${photos.profilePhoto.src}`,
        homeLocation: place,
        workLocation: place,
        sameAs: [
          profile.instagramUrl,
          profile.instagramDumpUrl,
          profile.youtubeUrl,
        ],
        knowsAbout: [
          "User-Generated Content (UGC)",
          "Instagram Reels Production",
          "Fashion Styling",
          "Beauty & Skincare Content",
          "Lifestyle Vlogging",
          "D2C Brand Storytelling",
          "Editorial Modelling",
          ...niches,
        ],
        interactionStatistic: numbers.stats.map((s) => ({
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/WatchAction",
          userInteractionCount: `${s.value}${s.suffix} ${s.label}`,
        })),
      },
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: "Siya Pawar — UGC & Influencer Brand Collaborations",
        description: CONTENT.meta.collaborateDescription,
        url: `${base}/collaborate`,
        provider: { "@id": personId },
        areaServed: [
          { "@type": "City", name: "Pune" },
          { "@type": "City", name: "Mumbai" },
          { "@type": "State", name: "Maharashtra" },
          { "@type": "Country", name: "India" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Brand collaboration packages",
          itemListElement: offers,
        },
      },
      {
        "@type": "ItemList",
        "@id": reelListId,
        name: "Featured Instagram Reels — Siya Pawar (@heartsfromsiya)",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: work.reels.length,
        itemListElement: videoItems,
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: `${base}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

/** "oct 2026" → ISO date approximation for VideoObject.uploadDate. */
function approxUploadDate(posted: string): string {
  const months: Record<string, string> = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };
  const m = posted.trim().toLowerCase().match(/^([a-z]{3})\s+(\d{4})$/);
  if (!m) return "2025-01-01";
  const month = months[m[1]] ?? "01";
  return `${m[2]}-${month}-15`;
}

/** "0:17" → ISO 8601 duration PT17S */
function isoDuration(duration: string): string {
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) {
    const [min, sec] = parts;
    return `PT${min ? `${min}M` : ""}${sec}S`;
  }
  if (parts.length === 3) {
    const [h, min, sec] = parts;
    return `PT${h ? `${h}H` : ""}${min ? `${min}M` : ""}${sec}S`;
  }
  return "PT0S";
}

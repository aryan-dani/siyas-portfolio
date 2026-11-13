import type { Metadata, Viewport } from "next";
import {
  Jost,
  Monsieur_La_Doulaise,
  Noto_Serif_Display,
} from "next/font/google";
import { CONTENT } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import { BootInject } from "@/components/chrome/BootInject";
import { SiteShell } from "@/components/chrome/SiteShell";
import "./globals.css";
import "./sections.css";

/* Typefaces:
   - Noto Serif Display, narrowest width  -> condensed section display
   - Monsieur La Doulaise                 -> copperplate script accent
   - Jost                                 -> quiet geometric sans for text */
const display = Noto_Serif_Display({
  variable: "--font-noto-display",
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
});

const script = Monsieur_La_Doulaise({
  variable: "--font-monsieur",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sans = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#FFF1B5",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: CONTENT.meta.siteTitle,
    template: `%s · ${CONTENT.profile.fullName}`,
  },
  description: CONTENT.meta.siteDescription,
  applicationName: CONTENT.profile.fullName,
  keywords: [
    "Siya Pawar",
    "heartsfromsiya",
    "UGC creator India",
    "Instagram reels creator Pune",
    "startup content creator",
    "brand collaborations",
    "reel editor for startups",
  ],
  authors: [
    { name: `${CONTENT.profile.fullName} (${CONTENT.profile.handle})`, url: CONTENT.profile.instagramUrl },
    { name: CONTENT.profile.developerName, url: CONTENT.profile.developerUrl },
  ],
  creator: CONTENT.profile.developerName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: CONTENT.profile.fullName,
    locale: "en_IN",
    title: CONTENT.meta.siteTitle,
    description: CONTENT.meta.siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: CONTENT.meta.siteTitle,
    description: CONTENT.meta.siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: CONTENT.profile.fullName,
    alternateName: [CONTENT.profile.handle, CONTENT.profile.secondaryHandle],
    jobTitle: "Content creator, storyteller and brand collaborator",
    email: CONTENT.profile.email,
    url: siteUrl,
    image: `${siteUrl}${CONTENT.photos.hero.src}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressCountry: "IN",
    },
    sameAs: [
      CONTENT.profile.instagramUrl,
      CONTENT.profile.instagramDumpUrl,
      CONTENT.profile.youtubeUrl,
    ],
  }).replace(/</g, "\\u003c");

  return (
    <html
      lang="en"
      className={`${display.variable} ${script.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <noscript>
          <style>{`.intro{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <BootInject jsonLd={personJsonLd} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import {
  Jost,
  Monsieur_La_Doulaise,
  Noto_Serif_Display,
} from "next/font/google";
import { CONTENT } from "@/lib/content";
import {
  CREATOR_NAME,
  GEO,
  HANDLE,
  PRIMARY_KEYWORDS,
  SITE_NAME,
  getSiteUrl,
} from "@/lib/site";
import { buildSiteJsonLd } from "@/components/seo/JsonLd";
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
  metadataBase: new URL("https://www.heartsfromsiya.com"),
  title: {
    default: CONTENT.meta.siteTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: CONTENT.meta.siteDescription,
  applicationName: SITE_NAME,
  keywords: [...PRIMARY_KEYWORDS],
  authors: [
    {
      name: `${CREATOR_NAME} (${HANDLE})`,
      url: CONTENT.profile.instagramUrl,
    },
    { name: CONTENT.profile.developerName, url: CONTENT.profile.developerUrl },
  ],
  creator: CREATOR_NAME,
  publisher: CREATOR_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: CONTENT.meta.ogTitle,
    description: CONTENT.meta.siteDescription,
    firstName: "Siya",
    lastName: "Pawar",
    username: "heartsfromsiya",
  },
  twitter: {
    card: "summary_large_image",
    title: CONTENT.meta.ogTitle,
    description: CONTENT.meta.siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": GEO.region,
    "geo.placename": GEO.placename,
    "geo.position": `${GEO.latitude};${GEO.longitude}`,
    ICBM: `${GEO.latitude}, ${GEO.longitude}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = buildSiteJsonLd(siteUrl);

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
        <BootInject jsonLd={jsonLd} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}

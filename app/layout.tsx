import type { Metadata, Viewport } from "next";
import {
  Jost,
  Monsieur_La_Doulaise,
  Noto_Serif_Display,
} from "next/font/google";
import { CONTENT } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import { SiteShell } from "@/components/chrome/SiteShell";
import "./globals.css";
import "./sections.css";

/* Free, permanently-licensed stand-ins for the reference typefaces:
   - Noto Serif Display, narrowest width  -> Perandory (condensed Didone caps)
   - Monsieur La Doulaise                 -> the "Branding" copperplate script
   - Jost                                 -> quiet geometric sans for text */
const display = Noto_Serif_Display({
  variable: "--font-noto-display",
  subsets: ["latin"],
  axes: ["wdth"],
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

/* Runs before first paint. Decides, with no flash:
   - whether reveal animations are allowed (js-motion)
   - whether the intro plays (once per session, home page only, never with
     reduced motion)
   - a failsafe: if the app hasn't started after 6s, show everything. */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var rm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!rm){d.classList.add("js-motion");}var seen=false;try{seen=sessionStorage.getItem("siya:intro")==="1";}catch(e){}var home=location.pathname==="/";d.setAttribute("data-intro",(rm||seen||!home)?"done":"pending");setTimeout(function(){if(!window.__siyaReady){d.classList.add("motion-failsafe");d.setAttribute("data-intro","done");}},6000);}catch(e){d.setAttribute("data-intro","done");}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
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
  };

  return (
    <html
      lang="en"
      className={`${display.variable} ${script.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <noscript>
          <style>{`.intro{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
        <div className="grain" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}

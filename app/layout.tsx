import type { Metadata, Viewport } from "next";
import {
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
} from "next/font/google";
import { CONTENT } from "@/lib/content";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#080708",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(CONTENT.meta.siteUrl),
  title: CONTENT.meta.siteTitle,
  description: CONTENT.meta.siteDescription,
  keywords: [
    "Siya",
    "heartsfromsiya",
    "UGC creator India",
    "startup content creator",
    "Instagram reels creator",
    "PharmEasy creator collab",
    "Mokobara creator collab",
    "reel editor for startups",
  ],
  authors: [
    { name: "Siya Pawar (@heartsfromsiya)", url: CONTENT.profile.instagramUrl },
    { name: CONTENT.profile.developerName, url: CONTENT.profile.developerUrl },
  ],
  creator: CONTENT.profile.developerName,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/siya/siya-icon.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: ["/favicon.svg", "/siya/siya-icon.png"],
    apple: [
      {
        url: "/siya/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: CONTENT.meta.siteTitle,
    description: CONTENT.meta.siteDescription,
    url: CONTENT.meta.siteUrl,
    siteName: "Siya Pawar · @heartsfromsiya",
    images: [
      {
        url: CONTENT.meta.ogImage,
        width: 1024,
        height: 1024,
        alt: "Siya Pawar (@heartsfromsiya) — Creator, Storyteller & Brand Collaborations",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: CONTENT.meta.siteTitle,
    description: CONTENT.meta.siteDescription,
    images: [CONTENT.meta.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const portraitPath = CONTENT.meta?.ogImage || "/siya/siya-portrait.jpg";

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Siya Pawar",
    alternateName: ["@heartsfromsiya", "@siyas_dumpyard"],
    jobTitle: "Content Creator, Storyteller & Brand Collaborator",
    email: CONTENT.profile.email,
    url: CONTENT.profile.instagramUrl,
    image: portraitPath,
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
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href={portraitPath}
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full bg-[#080708] font-sans text-[#FAF5F0] selection:bg-[#e11d48] selection:text-white">
        {children}
      </body>
    </html>
  );
}

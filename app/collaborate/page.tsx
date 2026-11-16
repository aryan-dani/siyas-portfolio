import type { Metadata } from "next";
import { ViewTransition } from "react";
import { CONTENT } from "@/lib/content";
import { CollaboratePage } from "@/components/pages/CollaboratePage";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: {
    absolute: CONTENT.meta.collaborateTitle,
  },
  description: CONTENT.meta.collaborateDescription,
  alternates: { canonical: "/collaborate" },
  keywords: [
    "Hire UGC Creator in Pune",
    "Siya Pawar Media Kit",
    "Influencer Media Kit & Brand Collaborations India",
    "UGC Creator India",
    "Brand Collaborations Pune",
    "@heartsfromsiya",
  ],
  openGraph: {
    title: CONTENT.meta.collaborateTitle,
    description: CONTENT.meta.collaborateDescription,
    url: "/collaborate",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: CONTENT.meta.collaborateTitle,
    description: CONTENT.meta.collaborateDescription,
  },
};

export default function CollaborateRoute() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "page-in", "nav-back": "page-in", default: "none" }}
      exit={{ "nav-forward": "page-out", "nav-back": "page-out", default: "none" }}
      default="none"
    >
      <CollaboratePage />
      <Footer />
    </ViewTransition>
  );
}

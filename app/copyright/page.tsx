import type { Metadata } from "next";
import { ViewTransition } from "react";
import { CONTENT } from "@/lib/content";
import { CopyrightPage } from "@/components/pages/CopyrightPage";

export const metadata: Metadata = {
  title: "Copyright & licensing",
  description: `Copyright notice for the ${CONTENT.profile.fullName} (${CONTENT.profile.handle}) portfolio: ownership of content, design and brand materials.`,
  alternates: { canonical: "/copyright" },
  openGraph: {
    title: `Copyright & licensing · ${CONTENT.profile.fullName}`,
    description: `Copyright notice for the ${CONTENT.profile.fullName} portfolio site.`,
    url: "/copyright",
    type: "website",
  },
};

export default function CopyrightRoute() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "page-in", "nav-back": "page-in", default: "none" }}
      exit={{ "nav-forward": "page-out", "nav-back": "page-out", default: "none" }}
      default="none"
    >
      <CopyrightPage />
    </ViewTransition>
  );
}

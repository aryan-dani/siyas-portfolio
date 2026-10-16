import type { Metadata } from "next";
import { CONTENT } from "@/lib/content";
import { CopyrightPage } from "@/components/pages/CopyrightPage";

export const metadata: Metadata = {
  title: `Copyright · ${CONTENT.profile.fullName}`,
  description: `Copyright notice for the ${CONTENT.profile.fullName} (${CONTENT.profile.handle}) portfolio — ownership of content, design, and brand materials.`,
  openGraph: {
    title: `Copyright · ${CONTENT.profile.fullName}`,
    description: `Copyright notice for the ${CONTENT.profile.fullName} portfolio site.`,
    url: "/copyright",
    type: "website",
  },
};

export default function CopyrightRoute() {
  return <CopyrightPage />;
}

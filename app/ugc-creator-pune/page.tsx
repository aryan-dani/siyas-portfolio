import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { CONTENT } from "@/lib/content";
import { CASE_STUDIES } from "@/lib/case-studies";
import { getSiteUrl } from "@/lib/site";
import { buildFaqJsonLd, buildBreadcrumbJsonLd, JsonLdEmbed } from "@/components/seo/JsonLd";
import { Footer } from "@/components/sections/Footer";
import { DrawLine, Reveal } from "@/components/motion/Reveal";
import { Eyebrow, Heading } from "@/components/ui/Heading";

export const metadata: Metadata = {
  title: {
    absolute: "UGC Content Creator in Pune — Siya Pawar (@heartsfromsiya)",
  },
  description:
    "Looking for a UGC creator in Pune? Siya Pawar creates relatable short-form Reels, product demos, and paid Meta ad creatives for D2C and lifestyle brands.",
  alternates: {
    canonical: "/ugc-creator-pune",
  },
  keywords: [
    "UGC content creator Pune",
    "UGC creator India",
    "hire UGC creator in Pune",
    "Pune influencer brand collaborations",
    "lifestyle content creator Pune",
    "D2C brand video ads creator",
    "Instagram Reels creator Pune",
    "Siya Pawar UGC",
  ],
  openGraph: {
    title: "UGC Content Creator in Pune — Siya Pawar (@heartsfromsiya)",
    description:
      "Looking for a UGC creator in Pune? Siya Pawar creates relatable short-form Reels, product demos, and paid Meta ad creatives for D2C and lifestyle brands.",
    url: "/ugc-creator-pune",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "UGC Content Creator in Pune — Siya Pawar (@heartsfromsiya)",
    description:
      "Looking for a UGC creator in Pune? Siya Pawar creates relatable short-form Reels, product demos, and paid Meta ad creatives for D2C and lifestyle brands.",
  },
};

const PUNE_UGC_FAQS = [
  {
    question: "Why should brands hire a local UGC creator in Pune like Siya Pawar?",
    answer:
      "Siya Pawar provides authentic on-ground context, beautiful natural lighting across Pune's aesthetic cafés and urban backdrops, and relatable Gen-Z Hindi and English communication. Partnering directly with Siya eliminates middleman agency commissions and delivers genuine, trust-building short-form videos.",
  },
  {
    question: "What types of UGC content does Siya deliver for D2C brands?",
    answer:
      "Siya creates dedicated organic Instagram Reels, direct-response paid social ads (with 3-second hook variations, demo bodies, and clear calls-to-action), unboxing videos, everyday carry walkthroughs, aesthetic product photography, and YouTube Shorts.",
  },
  {
    question: "Can brands outside Pune or internationally send products for remote UGC shoots?",
    answer:
      "Yes. A significant portion of Siya's brand work is remote product seeding. Brands based anywhere across India ship products directly to Pune; Siya handles concept development, scripting, shooting, and editing, delivering high-resolution vertical video files via cloud transfer.",
  },
  {
    question: "What is the typical turnaround time for a Pune UGC reel?",
    answer:
      "Standard turnaround is 5 to 7 business days following brief approval and product receipt. Fast-turnaround options are also available for timely festive drops and product launch windows.",
  },
  {
    question: "How do we get started or request UGC rates?",
    answer:
      "You can visit the dedicated collaborate page (heartsfromsiya.com/collaborate) or email siyapawar@gmail.com with your product details and campaign objectives to receive custom scope options without agency markup.",
  },
] as const;

export default function UgcCreatorPunePage() {
  const siteUrl = getSiteUrl();
  const breadcrumbJson = buildBreadcrumbJsonLd([
    { name: "Home", url: `${siteUrl}/` },
    { name: "UGC Content Creator Pune", url: `${siteUrl}/ugc-creator-pune` },
  ]);
  const faqJson = buildFaqJsonLd(PUNE_UGC_FAQS);

  return (
    <ViewTransition
      enter={{ "nav-forward": "page-in", "nav-back": "page-in", default: "none" }}
      exit={{ "nav-forward": "page-out", "nav-back": "page-out", default: "none" }}
      default="none"
    >
      <main id="main" className="ugc-pune-page">
        <JsonLdEmbed id="ugc-pune-breadcrumb-jsonld" json={breadcrumbJson} />
        <JsonLdEmbed id="ugc-pune-faq-jsonld" json={faqJson} />

        {/* Hero Section */}
        <section className="section pt-32 pb-16" aria-labelledby="pune-ugc-title">
          <div className="wrap max-w-5xl">
            <Reveal>
              <Eyebrow index="pune, india">creator-direct ugc</Eyebrow>
            </Reveal>

            <Heading
              id="pune-ugc-title"
              caps="ugc content creator"
              script="in pune"
              className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.96]"
            />

            <Reveal delay={0.12}>
              <p className="type-body text-[1.25rem] leading-relaxed mt-8 max-w-3xl opacity-90">
                Partner with <strong>Siya Pawar (@heartsfromsiya)</strong> — Pune-based UGC creator and lifestyle influencer known for warm, high-retention short-form video ads, organic Instagram Reels, and aesthetic product storytelling for India’s fastest-growing D2C brands.
              </p>
            </Reveal>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/collaborate" className="btn btn--solid">
                view deliverables &amp; hire siya →
              </Link>
              <Link href="/#work" className="type-label link-u text-sm">
                watch featured reels
              </Link>
            </div>
          </div>
        </section>

        {/* Why Brands Hire Siya */}
        <section className="section py-16" aria-labelledby="why-hire-title">
          <div className="wrap">
            <DrawLine />
            <div className="pt-12 pb-6">
              <Reveal>
                <Eyebrow index="01">differentiators</Eyebrow>
              </Reveal>
              <h2 id="why-hire-title" className="type-display text-3xl mt-4 lowercase">
                why d2c brands choose siya pawar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="p-6 rounded-2xl border border-[color-mix(in_srgb,var(--charcoal)_12%,transparent)] bg-[color-mix(in_srgb,var(--charcoal)_2%,transparent)]">
                <span className="type-nav text-xs font-mono opacity-60">01 / retention</span>
                <h3 className="type-label text-lg font-medium mt-3 lowercase">
                  organic voice-note hooks
                </h3>
                <p className="type-body text-sm opacity-80 mt-2 leading-relaxed">
                  No artificial scripts or forced sales pitches. Content begins like an authentic conversation with a close friend, dramatically reducing drop-off in the first 3 seconds.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[color-mix(in_srgb,var(--charcoal)_12%,transparent)] bg-[color-mix(in_srgb,var(--charcoal)_2%,transparent)]">
                <span className="type-nav text-xs font-mono opacity-60">02 / quality</span>
                <h3 className="type-label text-lg font-medium mt-3 lowercase">
                  natural daylight &amp; aesthetic pune backdrops
                </h3>
                <p className="type-body text-sm opacity-80 mt-2 leading-relaxed">
                  Shot on location in Pune’s aesthetic cafés, urban spaces, and sunlit home environments to deliver tactile, premium visual texture.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[color-mix(in_srgb,var(--charcoal)_12%,transparent)] bg-[color-mix(in_srgb,var(--charcoal)_2%,transparent)]">
                <span className="type-nav text-xs font-mono opacity-60">03 / speed</span>
                <h3 className="type-label text-lg font-medium mt-3 lowercase">
                  5–7 day turnaround
                </h3>
                <p className="type-body text-sm opacity-80 mt-2 leading-relaxed">
                  Creator-direct communication with no agency bureaucracy. From product delivery to final approved cuts ready to post.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[color-mix(in_srgb,var(--charcoal)_12%,transparent)] bg-[color-mix(in_srgb,var(--charcoal)_2%,transparent)]">
                <span className="type-nav text-xs font-mono opacity-60">04 / conversion</span>
                <h3 className="type-label text-lg font-medium mt-3 lowercase">
                  paid ad &amp; organic versatility
                </h3>
                <p className="type-body text-sm opacity-80 mt-2 leading-relaxed">
                  Deliverables optimized for both organic Instagram engagement and high-ROAS Meta/Instagram ad creative variations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Verticals */}
        <section className="section py-16" aria-labelledby="verticals-title">
          <div className="wrap">
            <DrawLine />
            <div className="pt-12 pb-6">
              <Reveal>
                <Eyebrow index="02">categories</Eyebrow>
              </Reveal>
              <h2 id="verticals-title" className="type-display text-3xl mt-4 lowercase">
                core ugc &amp; brand niches
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {CONTENT.niches.map((niche, idx) => (
                <div
                  key={niche}
                  className="p-6 rounded-xl border border-[color-mix(in_srgb,var(--charcoal)_10%,transparent)]"
                >
                  <span className="type-nav text-xs font-mono opacity-50">0{idx + 1}</span>
                  <h3 className="type-label text-base font-medium mt-2 lowercase">{niche}</h3>
                  <p className="type-body text-xs opacity-75 mt-2 leading-relaxed">
                    Tailored visual hooks, product integration, and genuine testimonials designed for {niche.toLowerCase()} audiences.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Collaborations */}
        <section className="section py-16" aria-labelledby="featured-work-title">
          <div className="wrap">
            <DrawLine />
            <div className="pt-12 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <Reveal>
                  <Eyebrow index="03">portfolio</Eyebrow>
                </Reveal>
                <h2 id="featured-work-title" className="type-display text-3xl mt-4 lowercase">
                  featured brand case studies
                </h2>
              </div>
              <Link href="/collaborate" className="type-label link-u text-sm font-medium">
                view all collaboration packages →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {CASE_STUDIES.map((study) => (
                <article
                  key={study.slug}
                  className="p-8 rounded-2xl border border-[color-mix(in_srgb,var(--charcoal)_12%,transparent)] bg-[color-mix(in_srgb,var(--charcoal)_2%,transparent)] flex flex-col justify-between"
                >
                  <div>
                    <span className="type-nav text-xs uppercase tracking-wider opacity-60">
                      {study.brand} · {study.category}
                    </span>
                    <h3 className="type-label text-xl font-medium mt-2 lowercase">
                      {study.title}
                    </h3>
                    <p className="type-body text-sm opacity-80 mt-3 leading-relaxed">
                      {study.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {study.results.map((r) => (
                        <span
                          key={r.label}
                          className="type-nav text-[0.7rem] px-2.5 py-1 rounded bg-[color-mix(in_srgb,var(--charcoal)_6%,transparent)]"
                        >
                          {r.label}: {r.value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[color-mix(in_srgb,var(--charcoal)_8%,transparent)]">
                    <Link
                      href={`/work/${study.slug}`}
                      className="type-label text-sm font-medium link-u inline-flex items-center gap-1"
                    >
                      Read full case study &amp; hook breakdown →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="section py-16" aria-labelledby="faq-title">
          <div className="wrap max-w-4xl">
            <DrawLine />
            <div className="pt-12 pb-6">
              <Reveal>
                <Eyebrow index="04">questions</Eyebrow>
              </Reveal>
              <h2 id="faq-title" className="type-display text-3xl mt-4 lowercase">
                frequently asked questions
              </h2>
            </div>

            <div className="collaborate__faq mt-6">
              {PUNE_UGC_FAQS.map((faq) => (
                <details key={faq.question} className="faq-item">
                  <summary className="faq-item__q">
                    <span className="faq-item__q-text">{faq.question}</span>
                    <span className="faq-item__marker" aria-hidden="true" />
                  </summary>
                  <p className="type-body faq-item__a">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section py-20 bg-[color-mix(in_srgb,var(--charcoal)_3%,transparent)]" aria-labelledby="cta-bottom">
          <div className="wrap max-w-2xl text-center mx-auto flex flex-col items-center gap-6">
            <h2 id="cta-bottom" className="type-display text-[clamp(2.2rem,5vw,3.6rem)] leading-tight lowercase">
              ready to scale your brand’s content?
            </h2>
            <p className="type-body text-base">
              Book Siya Pawar for dedicated Reels, UGC video ad packs, and lifestyle brand campaigns in Pune and nationwide.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <Link href="/collaborate" className="btn btn--solid">
                view media kit &amp; hire for ugc →
              </Link>
              <a
                href={`mailto:${CONTENT.profile.email}`}
                className="type-label link-u text-sm font-medium"
              >
                email siyapawar@gmail.com
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ViewTransition>
  );
}

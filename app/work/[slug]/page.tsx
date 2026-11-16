import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ViewTransition } from "react";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";
import { CONTENT } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import { buildCaseStudyJsonLd, JsonLdEmbed } from "@/components/seo/JsonLd";
import { Footer } from "@/components/sections/Footer";
import { DrawLine, Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Heading";

export async function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  const title = `${study.title} | Siya Pawar (@heartsfromsiya)`;
  const description = study.summary;

  return {
    title,
    description,
    alternates: {
      canonical: `/work/${study.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/work/${study.slug}`,
      type: "article",
      locale: "en_IN",
      images: [
        {
          url: study.posterUrl,
          alt: study.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [study.posterUrl],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const siteUrl = getSiteUrl();
  const jsonLd = buildCaseStudyJsonLd(study, siteUrl);
  const otherStudies = CASE_STUDIES.filter((s) => s.slug !== study.slug);

  return (
    <ViewTransition
      enter={{ "nav-forward": "page-in", "nav-back": "page-in", default: "none" }}
      exit={{ "nav-forward": "page-out", "nav-back": "page-out", default: "none" }}
      default="none"
    >
      <main id="main" className="case-study-page">
        <JsonLdEmbed id={`jsonld-${study.slug}`} json={jsonLd} />

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="wrap pt-28 pb-4">
          <ol className="flex items-center gap-2 type-label text-sm opacity-80 flex-wrap">
            <li>
              <Link href="/" className="link-u">
                home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#work" className="link-u">
                work
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="opacity-100 font-medium" aria-current="page">
              {study.brand.toLowerCase()}
            </li>
          </ol>
        </nav>

        {/* Hero & Overview */}
        <section className="section pt-6 pb-12" aria-labelledby="study-title">
          <div className="wrap">
            <Reveal>
              <Eyebrow index="case study">{study.category.toLowerCase()}</Eyebrow>
            </Reveal>

            <h1
              id="study-title"
              className="type-display text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.98] tracking-tight mt-6 max-w-4xl lowercase"
            >
              {study.title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 type-label text-sm opacity-85">
              <span>
                Brand:{" "}
                <a
                  href={study.brandUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-u font-medium"
                >
                  {study.brand} ↗
                </a>
              </span>
              <span aria-hidden="true"> · </span>
              <span>Creator: {CONTENT.profile.fullName} ({CONTENT.profile.handle})</span>
              <span aria-hidden="true"> · </span>
              <span>Location: Pune, India</span>
            </div>

            <div className="my-10">
              <DrawLine />
            </div>

            {/* Two Column Grid: Content Breakdown & Media Asset */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Strategy & Breakdown */}
              <div className="lg:col-span-7 flex flex-col gap-10">
                <div>
                  <h2 className="type-label text-xs uppercase tracking-widest opacity-60 mb-3">
                    Campaign Objective
                  </h2>
                  <p className="type-body text-[1.18rem] leading-relaxed">
                    {study.objective}
                  </p>
                </div>

                <div>
                  <h2 className="type-label text-xs uppercase tracking-widest opacity-60 mb-4">
                    High-Retention Hook &amp; Narrative Architecture
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-[color-mix(in_srgb,var(--charcoal)_4%,transparent)] border border-[color-mix(in_srgb,var(--charcoal)_8%,transparent)]">
                      <span className="type-nav text-[0.75rem] opacity-70 block mb-2 font-mono">01 · hook</span>
                      <p className="type-body text-sm leading-snug">{study.hookStructure.hook}</p>
                    </div>
                    <div className="p-5 rounded-xl bg-[color-mix(in_srgb,var(--charcoal)_4%,transparent)] border border-[color-mix(in_srgb,var(--charcoal)_8%,transparent)]">
                      <span className="type-nav text-[0.75rem] opacity-70 block mb-2 font-mono">02 · body</span>
                      <p className="type-body text-sm leading-snug">{study.hookStructure.body}</p>
                    </div>
                    <div className="p-5 rounded-xl bg-[color-mix(in_srgb,var(--charcoal)_4%,transparent)] border border-[color-mix(in_srgb,var(--charcoal)_8%,transparent)]">
                      <span className="type-nav text-[0.75rem] opacity-70 block mb-2 font-mono">03 · cta</span>
                      <p className="type-body text-sm leading-snug">{study.hookStructure.cta}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="type-label text-xs uppercase tracking-widest opacity-60 mb-3">
                    Deliverable Scope
                  </h2>
                  <p className="type-body text-base leading-relaxed">
                    {study.deliverable}
                  </p>
                </div>

                <div>
                  <h2 className="type-label text-xs uppercase tracking-widest opacity-60 mb-4">
                    Key Performance Highlights
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {study.results.map((res) => (
                      <div
                        key={res.label}
                        className="py-3 px-4 rounded-lg border border-[color-mix(in_srgb,var(--charcoal)_12%,transparent)]"
                      >
                        <dt className="type-nav text-[0.7rem] uppercase tracking-wider opacity-60">
                          {res.label}
                        </dt>
                        <dd className="type-label text-sm font-semibold mt-1">
                          {res.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="pt-2">
                  <a
                    href={study.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-label link-u inline-flex items-center gap-1.5 text-sm font-medium"
                  >
                    View Reel on Instagram @heartsfromsiya ↗
                  </a>
                </div>
              </div>

              {/* Right Column: Media Preview */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-[340px] aspect-[9/16] relative rounded-2xl overflow-hidden shadow-2xl border border-[color-mix(in_srgb,var(--charcoal)_15%,transparent)] bg-black">
                  {study.videoUrl ? (
                    <video
                      src={study.videoUrl}
                      poster={study.posterUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                      title={study.title}
                    />
                  ) : (
                    <Image
                      src={study.posterUrl}
                      alt={study.title}
                      fill
                      sizes="(min-width: 1024px) 340px, 90vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="type-nav text-[0.75rem] opacity-60 mt-3 text-center">
                  Shot on-location in Pune · Natural light production
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* More Brand Collaborations */}
        <section className="section py-16" aria-labelledby="other-studies-title">
          <div className="wrap">
            <div className="mb-8">
              <DrawLine />
            </div>
            <h2 id="other-studies-title" className="type-display text-2xl mb-8 lowercase">
              more brand collaborations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherStudies.map((s) => (
                <Link
                  key={s.slug}
                  href={`/work/${s.slug}`}
                  className="group p-6 rounded-2xl border border-[color-mix(in_srgb,var(--charcoal)_10%,transparent)] bg-[color-mix(in_srgb,var(--charcoal)_2%,transparent)] hover:border-[var(--burgundy)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="type-nav text-[0.7rem] uppercase tracking-wider opacity-60">
                      {s.brand}
                    </span>
                    <h3 className="type-label text-base font-medium mt-2 group-hover:text-[var(--burgundy)] transition-colors lowercase">
                      {s.title}
                    </h3>
                    <p className="type-body text-xs opacity-75 mt-2 line-clamp-2">
                      {s.summary}
                    </p>
                  </div>
                  <span className="type-label text-xs mt-4 inline-block font-medium">
                    explore case study →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Call to Action */}
        <section className="section py-16 bg-[color-mix(in_srgb,var(--charcoal)_3%,transparent)]" aria-labelledby="case-study-cta">
          <div className="wrap text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 id="case-study-cta" className="type-display text-[clamp(2rem,4vw,3.2rem)] leading-tight lowercase">
              want content like this for your brand?
            </h2>
            <p className="type-body text-base">
              Siya Pawar collaborates creator-direct with D2C, beauty, fashion, and lifestyle brands across Pune, Mumbai, and India.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <Link href="/collaborate" className="btn btn--solid">
                hire siya for ugc →
              </Link>
              <Link href="/#contact" className="type-label link-u text-sm">
                send a direct campaign brief
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ViewTransition>
  );
}

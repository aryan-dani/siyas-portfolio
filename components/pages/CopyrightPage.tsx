import type { ReactNode } from "react";
import Link from "next/link";
import { CONTENT } from "@/lib/content";
import { DrawLine, Reveal, RevealText, ScriptWipe } from "@/components/motion/Reveal";

const PERMITTED_USES = [
  "Sharing direct links to this portfolio or official @heartsfromsiya Instagram Reels",
  "Internal review by brand, agency, or founder teams evaluating creator collaborations",
  "Editorial press features or creator spotlights with clear credit to Siya Pawar (@heartsfromsiya)",
];

const PROHIBITED_USES = [
  "Downloading, re-editing, or running paid ad whitelisting on reels without an active usage license",
  "Scraping or ingesting creator photography, video (.mp4), voice, or likeness into AI / ML training sets",
  "Cloning or redistributing this site's design system, motion code, or source code",
];

type Clause = { id: string; tag: string; title: string; body: ReactNode };

const linkClass = "link-u !bg-[length:100%_1px]";

function buildClauses(): Clause[] {
  const { profile } = CONTENT;
  return [
    {
      id: "01",
      tag: "Creator likeness & media",
      title: "Ownership of reels, photography and likeness",
      body: (
        <>
          All original creative works displayed on this website, including vertical video reels
          (<code>.mp4</code>), portraits, audio voiceovers, hooks, captions and storytelling
          frameworks featuring <strong>{profile.fullName}</strong> (
          <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {profile.handle}
          </a>{" "}
          &amp;{" "}
          <a href={profile.instagramDumpUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {profile.secondaryHandle}
          </a>
          ), are the exclusive intellectual property of {profile.fullName}.
        </>
      ),
    },
    {
      id: "02",
      tag: "Design & engineering",
      title: "The site, its design system and its code",
      body: (
        <>
          The editorial design system, typography, motion choreography and source code were designed and
          engineered by{" "}
          <a href={profile.developerUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {profile.developerName} (www.aryandani.com)
          </a>
          . Commercial reproduction, template resale or unauthorized copying of the site architecture is
          strictly prohibited. Typefaces (Noto Serif Display, Monsieur La Doulaise and Jost) are used under
          the SIL Open Font License.
        </>
      ),
    },
    {
      id: "03",
      tag: "Commercial usage & whitelisting",
      title: "Brand collaborations and paid amplification rights",
      body: (
        <>
          Standard creator deliverables grant organic posting rights as specified in each campaign scope.
          Paid amplification, Spark Ads, Meta whitelisting, dark posting or perpetual commercial buyouts
          require an explicit written addendum with {profile.fullName} before campaign launch.
        </>
      ),
    },
    {
      id: "04",
      tag: "AI & dataset protection",
      title: "Generative AI, voice cloning and scraping",
      body: (
        <>
          No photograph, video frame, vocal track or biometric likeness of {profile.fullName} may be
          harvested, scraped, synthesized, or used to train, fine-tune or evaluate machine learning,
          deepfake or generative AI models without express written consent.
        </>
      ),
    },
    {
      id: "05",
      tag: "Trademarks & licensing desk",
      title: "Partner marks, jurisdiction and clearances",
      body: (
        <>
          Partner trademarks (including PharmEasy, Mokobara and featured consumer brands) remain the
          property of their respective owners. For commercial usage clearances, whitelisting extensions or
          new campaign bookings, reach out directly. Governed by the Indian Copyright Act, 1957 and the
          Berne Convention.
        </>
      ),
    },
  ];
}

export function CopyrightPage() {
  const { profile } = CONTENT;
  const clauses = buildClauses();
  const permissionMailto = `mailto:${profile.email}?cc=${profile.ccEmail}&subject=${encodeURIComponent(
    "Media Licensing & Commercial Usage Inquiry — Siya Pawar (@heartsfromsiya)"
  )}`;

  return (
    <main id="main" className="legal">
      <div className="wrap">
        <Reveal trigger="intro" delay={0.1} y={14}>
          <Link href="/" transitionTypes={["nav-back"]} className="type-label link-u legal__back">
            ← Back to portfolio
          </Link>
        </Reveal>

        <div className="legal__hero">
          <h1 className="legal__title type-display">
            <RevealText as="span" by="words" trigger="intro" className="legal__caps">
              Copyright
            </RevealText>
            <span className="legal__pair">
              <span className="legal__amp">&amp;</span>
              <ScriptWipe
                as="span"
                trigger="intro"
                delay={0.45}
                className="legal__script type-script halo"
              >
                licensing
              </ScriptWipe>
            </span>
          </h1>
          <Reveal delay={0.2} className="legal__lead">
            <p className="type-body">
              What is hers to enjoy and what is hers to protect: a plain-language charter covering creator
              likeness, brand reels, commercial whitelisting and the site itself.
            </p>
            <dl className="legal__registry type-label">
              <div>
                <dt>Rights holder</dt>
                <dd>
                  {profile.fullName} · {profile.handle}
                </dd>
              </div>
              <div>
                <dt>Media &amp; likeness</dt>
                <dd>© 2026 {profile.fullName}</dd>
              </div>
              <div>
                <dt>Architecture &amp; code</dt>
                <dd>
                  <a href={profile.developerUrl} target="_blank" rel="noopener noreferrer" className="link-u">
                    {profile.developerName} ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt>AI training</dt>
                <dd>Opt-out · prohibited</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <div className="legal__cols">
          <Reveal className="legal__col">
            <p className="type-label">Permitted without a license</p>
            <ul>
              {PERMITTED_USES.map((item) => (
                <li key={item}>
                  <span aria-hidden="true" className="legal__mark">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="legal__col" delay={0.12}>
            <p className="type-label">Restricted without written consent</p>
            <ul>
              {PROHIBITED_USES.map((item) => (
                <li key={item}>
                  <span aria-hidden="true" className="legal__mark">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <ol className="legal__clauses">
          {clauses.map((clause) => (
            <li key={clause.id} className="clause">
              <DrawLine />
              <div className="clause__grid">
                <Reveal className="clause__num type-display" y={20}>
                  {clause.id}
                </Reveal>
                <div className="clause__main">
                  <Reveal y={20}>
                    <p className="type-label">{clause.tag}</p>
                    <h2 className="type-display clause__title">{clause.title}</h2>
                  </Reveal>
                  <Reveal y={20} delay={0.1}>
                    <p className="type-body clause__body">{clause.body}</p>
                  </Reveal>
                </div>
              </div>
            </li>
          ))}
          <li aria-hidden="true">
            <DrawLine />
          </li>
        </ol>

        <Reveal className="legal__cta" y={24}>
          <div>
            <h2 className="type-display legal__cta-title">Need usage rights or paid ad clearance?</h2>
            <p className="type-body">
              Commercial usage, whitelisting extensions and brand licensing are handled directly.
            </p>
          </div>
          <div className="legal__cta-actions">
            <a href={permissionMailto} className="btn btn--solid has-roll">
              <span className="roll" aria-hidden="true">
                <span className="roll__inner">
                  <span>Request a usage license</span>
                  <span>Request a usage license</span>
                </span>
              </span>
              <span className="sr-only">Request a usage license</span>
              <span className="btn__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <Link href="/#rates" transitionTypes={["nav-back"]} className="type-label link-u">
              View rates →
            </Link>
          </div>
        </Reveal>

        <p className="type-label legal__foot">
          <span>© 2026 {profile.fullName} ({profile.handle}). All rights reserved.</span>
          <span>
            Designed &amp; developed by{" "}
            <a href={profile.developerUrl} target="_blank" rel="noopener noreferrer" className="link-u">
              {profile.developerName} ↗
            </a>
          </span>
        </p>
      </div>
    </main>
  );
}

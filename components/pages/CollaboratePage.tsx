import Link from "next/link";
import { CONTENT } from "@/lib/content";
import { SERVICE_AREAS } from "@/lib/site";
import { DrawLine, Reveal } from "@/components/motion/Reveal";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { CopyEmail } from "@/components/sections/CopyEmail";

export function CollaboratePage() {
  const { profile, rates, deliverables, niches, faqs, numbers, collabFaq } =
    CONTENT;

  return (
    <main id="main" className="collaborate">
      <section className="section collaborate__hero" aria-labelledby="collab-title">
        <div className="wrap">
          <Reveal>
            <Eyebrow index="01">media kit</Eyebrow>
          </Reveal>
          <Heading
            id="collab-title"
            caps="hire ugc creator"
            script="in pune"
            className="collaborate__title"
          />
          <Reveal delay={0.12}>
            <p className="type-body collaborate__lead">
              {CONTENT.meta.collaborateDescription}
            </p>
          </Reveal>
          <Reveal delay={0.18} className="collaborate__meta type-label">
            <span>
              {profile.fullName} ({profile.handle})
            </span>
            <span aria-hidden="true"> · </span>
            <span>{profile.locationFull}</span>
            <span aria-hidden="true"> · </span>
            <span>{profile.status}</span>
          </Reveal>
        </div>
      </section>

      <section className="section collaborate__stats" aria-label="Reach metrics">
        <div className="wrap">
          <DrawLine />
          <ul className="collaborate__stat-grid">
            {numbers.stats.map((stat) => (
              <li key={stat.label}>
                <p className="type-display collaborate__stat-value">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="type-label">{stat.label}</p>
              </li>
            ))}
          </ul>
          <DrawLine />
        </div>
      </section>

      <section className="section" aria-labelledby="packages-title">
        <div className="wrap collaborate__two">
          <div>
            <Reveal>
              <Eyebrow index="02">packages</Eyebrow>
            </Reveal>
            <Heading
              id="packages-title"
              caps={rates.title.caps}
              script={rates.title.script}
              className="collaborate__h"
            />
            <Reveal delay={0.1}>
              <p className="type-body">{rates.lead}</p>
            </Reveal>
            <ul className="collaborate__packages">
              {rates.list.map((pkg) => (
                <li key={pkg.id}>
                  <Reveal>
                    <h3 className="type-display collaborate__pkg-name">{pkg.name}</h3>
                    <p className="type-label collaborate__pkg-format">{pkg.format}</p>
                    <p className="type-body">{pkg.detail}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Reveal>
              <Eyebrow index="03">{collabFaq.eyebrow}</Eyebrow>
            </Reveal>
            <h2 className="type-display collaborate__h2">deliverables</h2>
            <ul className="collab-faq__ul">
              {deliverables.map((d) => (
                <li key={d.name}>
                  <span className="collab-faq__item-name">{d.name}</span>
                  <span className="type-body collab-faq__item-detail">{d.detail}</span>
                </li>
              ))}
            </ul>
            <h3 className="type-label collab-faq__subhead">niches</h3>
            <ul className="collab-faq__niches">
              {niches.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <h3 className="type-label collab-faq__subhead">service areas</h3>
            <ul className="collab-faq__niches">
              {SERVICE_AREAS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="collab-faq-title">
        <div className="wrap">
          <Reveal>
            <Eyebrow index="04">faq</Eyebrow>
          </Reveal>
          <h2 id="collab-faq-title" className="type-display collaborate__h2">
            brand collaboration faq
          </h2>
          <div className="collaborate__faq">
            {faqs.map((faq) => (
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

      <section className="section collaborate__cta" aria-labelledby="collab-cta">
        <div className="wrap">
          <DrawLine />
          <h2 id="collab-cta" className="type-display collaborate__h2">
            start a collaboration
          </h2>
          <Reveal>
            <p className="type-body">
              Direct inbox for brand briefs, PR seeding, and media kit requests.
            </p>
            <CopyEmail email={profile.email} />
            <p className="type-label collaborate__cta-links">
              <Link href="/#contact" className="link-u">
                inquiry form on portfolio
              </Link>
              <span aria-hidden="true"> · </span>
              <Link href="/" transitionTypes={["nav-back"]} className="link-u">
                back to portfolio
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

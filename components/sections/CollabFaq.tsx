import Link from "next/link";
import { CONTENT } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, Heading } from "@/components/ui/Heading";

/**
 * Crawlable collaborations / deliverables / FAQ block.
 * Uses native <details> so answers ship in SSR HTML without JS.
 */
export function CollabFaq() {
  const { collabFaq, deliverables, niches, faqs } = CONTENT;

  return (
    <section id="faq" aria-labelledby="faq-title" className="section collab-faq">
      <div className="wrap collab-faq__shell">
        <div className="collab-faq__top">
          <Reveal>
            <Eyebrow index="05">collaborations</Eyebrow>
          </Reveal>
          <Heading
            id="faq-title"
            caps={collabFaq.title.caps}
            script={collabFaq.title.script}
            className="collab-faq__title"
          />
          <Reveal delay={0.12}>
            <p className="type-body collab-faq__lead">{collabFaq.lead}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <Link
              href={collabFaq.mediaKitHref}
              transitionTypes={["nav-forward"]}
              className="type-label link-u collab-faq__kit"
            >
              {collabFaq.mediaKitLabel} →
            </Link>
          </Reveal>
        </div>

        <div className="collab-faq__grid">
          <div className="collab-faq__lists">
            <Reveal delay={0.1}>
              <h3 className="type-label collab-faq__subhead">deliverables</h3>
              <ul className="collab-faq__ul">
                {deliverables.map((d) => (
                  <li key={d.name}>
                    <span className="collab-faq__item-name">{d.name}</span>
                    <span className="type-body collab-faq__item-detail">{d.detail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.16}>
              <h3 className="type-label collab-faq__subhead">niches</h3>
              <ul className="collab-faq__niches">
                {niches.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="collab-faq__accordion">
            <Reveal delay={0.12}>
              <h3 className="type-label collab-faq__subhead">brand faq</h3>
            </Reveal>
            {faqs.map((faq, i) => (
              <Reveal key={faq.question} delay={0.08 + i * 0.04}>
                <details className="faq-item">
                  <summary className="faq-item__q">{faq.question}</summary>
                  <p className="type-body faq-item__a">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

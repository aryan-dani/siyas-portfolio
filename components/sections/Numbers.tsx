import { CONTENT } from "@/lib/content";
import { DrawLine, Reveal } from "@/components/motion/Reveal";
import { Odometer } from "@/components/motion/Odometer";
import { InView } from "@/components/motion/InView";
import { Eyebrow } from "@/components/ui/Heading";

export function Numbers() {
  const { numbers } = CONTENT;

  return (
    <section aria-labelledby="numbers-title" className="section numbers">
      <div className="wrap">
        <Reveal>
          <Eyebrow index="03">by the numbers</Eyebrow>
        </Reveal>
        <h2 id="numbers-title" className="sr-only">
          Reach metrics — Siya Pawar (@heartsfromsiya)
        </h2>
        <div className="mt-8">
          <DrawLine />
        </div>

        <InView as="ul" className="numbers__grid">
          {numbers.stats.map((stat, i) => (
            <li
              key={stat.label}
              className="numbers__item"
              style={{ ["--i" as string]: i }}
            >
              <span className="numbers__rule" aria-hidden="true" />
              <Odometer
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={i * 0.12}
                className="numbers__value type-display"
              />
              <Reveal delay={0.25 + i * 0.1} y={18}>
                <p className="type-label numbers__label" aria-hidden="true">
                  {stat.label}
                </p>
              </Reveal>
            </li>
          ))}
        </InView>

        <DrawLine />
        <InView className="numbers__clients">
          <span className="type-label" style={{ ["--i" as string]: 0 }}>
            {numbers.clientsLead}
          </span>
          {numbers.clients.map((client, i) => (
            <span
              key={client.name}
              className="numbers__client-wrap numbers__client-rise"
              style={{ ["--i" as string]: i + 1 }}
            >
              {i > 0 ? <span aria-hidden="true" className="numbers__dot" /> : null}
              <a
                href={client.href}
                target="_blank"
                rel="noopener noreferrer"
                className="numbers__client type-display brand-link"
              >
                {client.name}
              </a>
            </span>
          ))}
        </InView>
      </div>
    </section>
  );
}

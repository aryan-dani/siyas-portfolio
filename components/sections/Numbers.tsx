import { CONTENT } from "@/lib/content";
import { DrawLine, Reveal } from "@/components/motion/Reveal";
import { Odometer } from "@/components/motion/Odometer";
import { Eyebrow } from "@/components/ui/Heading";

export function Numbers() {
  const { numbers } = CONTENT;

  return (
    <section aria-label="By the numbers" className="section numbers">
      <div className="wrap">
        <Reveal>
          <Eyebrow index="03">by the numbers</Eyebrow>
        </Reveal>
        <div className="mt-8">
          <DrawLine />
        </div>

        <ul className="numbers__grid">
          {numbers.stats.map((stat, i) => (
            <li key={stat.label} className="numbers__item">
              <Odometer
                value={stat.value}
                suffix={stat.suffix}
                className="numbers__value type-display"
              />
              <Reveal delay={0.25 + i * 0.1} y={18}>
                <p className="type-label numbers__label">{stat.label}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <DrawLine />
        <Reveal className="numbers__clients" y={18}>
          <span className="type-label">{numbers.clientsLead}</span>
          {numbers.clients.map((client, i) => (
            <span key={client.name} className="numbers__client-wrap">
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
        </Reveal>
      </div>
    </section>
  );
}

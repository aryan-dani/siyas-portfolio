import { CONTENT } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { RatesList } from "@/components/sections/RatesList";

export function Rates() {
  const { rates } = CONTENT;

  return (
    <section
      id="rates"
      aria-labelledby="rates-title"
      data-theme-section="burgundy"
      className="rates"
    >
      <div className="wrap">
        <Reveal>
          <Eyebrow index="04">Rates</Eyebrow>
        </Reveal>

        <div className="rates__head">
          <Heading id="rates-title" caps={rates.title.caps} script={rates.title.script} />
          <Reveal delay={0.25} className="rates__lead">
            <p className="type-body">{rates.lead}</p>
          </Reveal>
        </div>

        <RatesList />
      </div>
    </section>
  );
}

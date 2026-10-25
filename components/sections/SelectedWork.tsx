import { CONTENT } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { ReelGallery } from "@/components/sections/ReelGallery";

export function SelectedWork() {
  const { work, profile } = CONTENT;

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      data-theme-section="blue"
      className="work"
    >
      <div className="wrap">
        <div className="work__head">
          <div>
            <Reveal>
              <Eyebrow index="01">{work.eyebrow}</Eyebrow>
            </Reveal>
            <Heading id="work-title" caps={work.title.caps} script={work.title.script} className="mt-7" />
          </div>
          <Reveal className="work__all" delay={0.2}>
            <a
              href={profile.instagramReelsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-label link-u"
            >
              {work.allReelsLabel} ↗
            </a>
          </Reveal>
        </div>

        <ReelGallery reels={work.reels} />
      </div>
    </section>
  );
}

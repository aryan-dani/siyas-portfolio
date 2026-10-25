import { CONTENT } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { ContactForm } from "@/components/sections/ContactForm";
import { CopyEmail } from "@/components/sections/CopyEmail";

export function Contact() {
  const { contact, profile } = CONTENT;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      data-theme-section="burgundy"
      className="contact"
    >
      <div className="wrap contact__grid">
        <div className="contact__intro">
          <Reveal>
            <Eyebrow index="05">Contact</Eyebrow>
          </Reveal>
          <Heading
            id="contact-title"
            caps={contact.title.caps}
            script={contact.title.script}
            className="contact__title"
          />
          <Reveal delay={0.2}>
            <p className="type-body contact__lead">{contact.lead}</p>
          </Reveal>

          <Reveal delay={0.3} className="contact__direct">
            <p className="type-label">Direct inbox</p>
            <CopyEmail email={profile.email} />
            <p className="type-label contact__social">
              <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-u">
                Instagram
              </a>
              <a href={profile.instagramDumpUrl} target="_blank" rel="noopener noreferrer" className="link-u">
                {profile.secondaryHandle}
              </a>
              <a href={profile.youtubeUrl} target="_blank" rel="noopener noreferrer" className="link-u">
                YouTube
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal className="contact__form" delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

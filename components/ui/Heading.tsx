import type { ElementType } from "react";
import { RevealText, ScriptWipe } from "@/components/motion/Reveal";

/**
 * Condensed capitals with one script word written across their lower edge,
 * the pairing from the PERANDORY reference. The script is real text, so the
 * heading reads naturally to screen readers ("Selected work").
 */
export function Heading({
  id,
  caps,
  script,
  as = "h2",
  className = "",
  scriptDelay = 0.5,
}: {
  id?: string;
  caps: string;
  script: string;
  as?: ElementType;
  className?: string;
  scriptDelay?: number;
}) {
  const Tag = as;
  return (
    <Tag id={id} className={`heading type-display ${className}`}>
      <RevealText as="span" by="words" className="heading-caps">
        {caps}
      </RevealText>{" "}
      <ScriptWipe className="heading-script type-script halo" delay={scriptDelay}>
        {script}
      </ScriptWipe>
    </Tag>
  );
}

/** Small numbered eyebrow, e.g. "(01) Selected reels". */
export function Eyebrow({ index, children }: { index: string; children: string }) {
  return (
    <p className="type-label flex items-center gap-4">
      <span>({index})</span>
      <span aria-hidden="true" className="h-px w-10 bg-[var(--fg-line)]" />
      <span>{children}</span>
    </p>
  );
}

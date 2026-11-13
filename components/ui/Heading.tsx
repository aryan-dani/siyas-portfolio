import type { ElementType } from "react";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Display heading. Default stacks two lines; `inline` keeps them on one row
 * (e.g. “selected work”).
 */
export function Heading({
  id,
  caps,
  script,
  as = "h2",
  className = "",
  mark = "script",
  inline = false,
}: {
  id?: string;
  caps: string;
  script: string;
  as?: ElementType;
  className?: string;
  /** Which part gets the full-word pastel mark. */
  mark?: "script" | "caps" | "none";
  /** Put caps + script on a single horizontal line. */
  inline?: boolean;
  scriptDelay?: number;
}) {
  const Tag = as;

  if (inline) {
    return (
      <Tag id={id} className={`heading heading--inline type-display ${className}`}>
        <Reveal className="heading-line" y={18}>
          <span className={mark === "caps" ? "heading-text hl" : "heading-text"}>
            {caps.toLowerCase()}
          </span>{" "}
          <span className={mark === "script" ? "heading-text hl" : "heading-text"}>
            {script.toLowerCase()}
          </span>
        </Reveal>
      </Tag>
    );
  }

  const lines = [
    { text: caps.toLowerCase(), marked: mark === "caps" },
    { text: script.toLowerCase(), marked: mark === "script" },
  ];

  return (
    <Tag id={id} className={`heading type-display ${className}`}>
      {lines.map((line, i) => (
        <Reveal key={`${line.text}-${i}`} delay={i * 0.12} className="heading-line" y={18}>
          <span className={line.marked ? "heading-text hl" : "heading-text"}>{line.text}</span>
        </Reveal>
      ))}
    </Tag>
  );
}

/** Small numbered eyebrow, e.g. "(01) selected reels". */
export function Eyebrow({ index, children }: { index: string; children: string }) {
  return (
    <p className="type-label flex items-center gap-4">
      <span>({index})</span>
      <span aria-hidden="true" className="h-px w-10 bg-[var(--fg-line)]" />
      <span>{typeof children === "string" ? children.toLowerCase() : children}</span>
    </p>
  );
}

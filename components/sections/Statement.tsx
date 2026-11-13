"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { CONTENT } from "@/lib/content";
import { fontsReady } from "@/lib/intro";
import { prefersReducedMotionNow } from "@/lib/hooks";

/**
 * One sentence, large. Each word brightens as the reader scrolls through it,
 * so the page is "read aloud" at the reader's own pace.
 */
export function Statement() {
  const { statement } = CONTENT;
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el || prefersReducedMotionNow()) return;

      let disposed = false;
      let split: SplitText | undefined;

      fontsReady().then(() => {
        if (disposed) return;
        split = SplitText.create(el, {
          type: "words",
          ignore: "[data-hl-word]",
          autoSplit: true,
          onSplit(self) {
            const marked = el.querySelector("[data-hl-word]");
            const ordered = [...self.words, ...(marked ? [marked] : [])].sort((a, b) =>
              a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
            );
            const tween = gsap.fromTo(
              ordered,
              { opacity: 0.14 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.11,
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  end: "bottom 46%",
                  scrub: true,
                },
              }
            );
            gsap.set(el, { opacity: 1 });
            return tween;
          },
        });
      });

      return () => {
        disposed = true;
        split?.revert();
      };
    },
    { scope: textRef }
  );

  return (
    <section aria-label="Statement" className="statement">
      <div className="wrap">
        <p ref={textRef} data-reveal="scrub" className="statement__text type-display">
          {statement.before}{" "}
          <span data-hl-word className="statement__mark hl">
            {statement.script}
          </span>{" "}
          {statement.after}
        </p>
      </div>
    </section>
  );
}

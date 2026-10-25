/**
 * Intro state lives on <html data-intro="pending | revealing | done">.
 *  - pending:   intro overlay is up; page is locked
 *  - revealing: overlay is lifting; hero lettering should start animating now
 *  - done:      overlay gone (also used when the intro is skipped entirely:
 *               repeat visits in the same session, reduced motion, other routes)
 */
export const INTRO_REVEAL_EVENT = "siya:intro-reveal";
export const INTRO_STORAGE_KEY = "siya:intro";

type IntroState = "pending" | "revealing" | "done";

function getState(): IntroState {
  const v = document.documentElement.dataset.intro;
  return v === "pending" || v === "revealing" ? v : "done";
}

/** Run `cb` as soon as the page is allowed to start revealing. */
export function whenIntroRevealing(cb: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  if (getState() !== "pending") {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(INTRO_REVEAL_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_REVEAL_EVENT, handler);
}

export function setIntroState(state: IntroState) {
  document.documentElement.dataset.intro = state;
  if (state === "revealing") {
    window.dispatchEvent(new Event(INTRO_REVEAL_EVENT));
  }
  if (state === "done") {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* storage can be unavailable (private mode); the intro just replays */
    }
  }
}

/** Wait for web fonts (so SplitText measures real glyphs) but never hang. */
export function fontsReady(timeoutMs = 2500): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) {
    return Promise.resolve();
  }
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
}

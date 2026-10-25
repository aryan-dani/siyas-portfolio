import Link from "next/link";
import { CONTENT } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { Heading } from "@/components/ui/Heading";

export default function NotFound() {
  const { profile } = CONTENT;

  return (
    <main id="main" className="notfound">
      <div className="wrap">
        <Reveal trigger="intro" y={14}>
          <p className="type-label">404 · Page not found</p>
        </Reveal>
        <Heading
          as="h1"
          caps="Wrong cut, let’s"
          script="rewind"
          className="notfound__title"
          scriptDelay={0.5}
        />
        <Reveal delay={0.25} className="notfound__copy">
          <p className="type-body">
            This page doesn’t exist in {profile.fullName}’s portfolio. Head back to the reels, or
            take a look at the rates.
          </p>
        </Reveal>
        <Reveal delay={0.35} className="notfound__actions">
          <Link href="/" className="btn btn--solid has-roll">
            <span className="roll" aria-hidden="true">
              <span className="roll__inner">
                <span>Back to portfolio</span>
                <span>Back to portfolio</span>
              </span>
            </span>
            <span className="sr-only">Back to portfolio</span>
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/#rates" className="type-label link-u">
            View rates →
          </Link>
        </Reveal>
      </div>
    </main>
  );
}

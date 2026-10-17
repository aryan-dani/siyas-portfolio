import Link from "next/link";
import { CONTENT } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#070608] px-6 py-16 text-center text-[#FAF6F2]">
      <div
        aria-hidden="true"
        style={{
          width: "480px",
          height: "480px",
          background:
            "radial-gradient(circle, rgba(245, 184, 143, 0.18) 0%, rgba(212, 72, 108, 0.15) 45%, transparent 72%)",
          filter: "blur(80px)",
        }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      />

      <div className="glass-card relative z-10 max-w-xl px-8 py-12 sm:px-12 sm:py-16">
        <span className="glass-pill inline-block rounded-full px-3.5 py-1 font-mono text-[10px] tracking-[0.22em] text-[#f5b88f] uppercase">
          404 · Frame Not Found
        </span>

        <h1 className="mt-5 font-display text-4xl leading-[1.04] font-bold tracking-[-0.04em] text-white sm:text-5xl">
          Wrong cut,{" "}
          <em className="font-serif font-normal italic text-[#f5b88f] pr-1">
            let&apos;s rewind.
          </em>
        </h1>

        <p className="mt-4 font-sans text-sm leading-relaxed text-white/70">
          This page doesn&apos;t exist in {CONTENT.profile.fullName}&apos;s (
          {CONTENT.profile.handle}) studio portfolio. Head back to the main reel
          showcase or view creator collaboration rates.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 font-sans text-xs font-semibold text-[#080708] shadow-xl transition-transform hover:scale-105 hover:bg-[#f5b88f]"
          >
            ← Back to Portfolio
          </Link>
          <Link
            href="/#services"
            className="glass-pill rounded-full px-5 py-3 font-sans text-xs font-medium text-white/90 hover:text-white"
          >
            View Creator Rates →
          </Link>
        </div>
      </div>
    </main>
  );
}

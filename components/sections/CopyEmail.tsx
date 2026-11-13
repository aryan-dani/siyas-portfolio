"use client";

import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      ok = false;
    }
    setState(ok ? "copied" : "failed");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2600);
  };

  const label =
    state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy" : "Copy email";

  return (
    <div className="copy-email">
      <a href={`mailto:${email}`} className="copy-email__link">
        {email}
      </a>
      <button
        type="button"
        className="type-label link-u copy-email__btn has-roll"
        onClick={copy}
        aria-label={
          state === "copied"
            ? `Copied ${email}`
            : state === "failed"
              ? `Couldn't copy ${email}`
              : `Copy ${email} to clipboard`
        }
        data-state={state}
      >
        <span className="roll" aria-hidden="true">
          <span className="roll__inner">
            <span>{label}</span>
            <span>{label}</span>
          </span>
        </span>
        <span className="sr-only" aria-live="polite">
          {label}
        </span>
        {state === "copied" ? (
          <svg
            className="copy-email__check"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            aria-hidden="true"
          >
            <path
              d="M3 8.5 6.2 12 13 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
            />
          </svg>
        ) : null}
      </button>
    </div>
  );
}

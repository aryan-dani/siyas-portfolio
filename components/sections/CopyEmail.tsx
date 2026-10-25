"use client";

import { useEffect, useRef, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2600);
  };

  return (
    <div className="copy-email">
      <a href={`mailto:${email}`} className="copy-email__link">
        {email}
      </a>
      <button type="button" className="type-label link-u copy-email__btn" onClick={copy}>
        <span aria-live="polite">{copied ? "Copied ✓" : "Copy email"}</span>
      </button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { CONTENT, INQUIRY_OPTIONS } from "@/lib/content";
import { useInquiry } from "@/lib/inquiry";

/**
 * The inquiry form never posts anywhere: it builds a mailto: link (subject and
 * cc included) and opens the sender's email app, exactly like the old site.
 * Picking a format anywhere on the page (the hero, the reel player)
 * updates the chips, the subject line and an optional prefilled note.
 */
export function ContactForm() {
  const { contact, profile } = CONTENT;
  const { option, note, selectionId, setOption, setNote } = useInquiry();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const active = INQUIRY_OPTIONS.find((o) => o.value === option) ?? INQUIRY_OPTIONS[0];

  /* Someone chose a format elsewhere: once the page has scrolled here, put the
     cursor in the first field. */
  useEffect(() => {
    if (selectionId === 0) return;
    const id = window.setTimeout(() => {
      setSubmitted(false);
      nameRef.current?.focus({ preventScroll: true });
    }, 1700);
    return () => window.clearTimeout(id);
  }, [selectionId]);

  const subject = name.trim()
    ? `${active.subjectPrefix} — ${name.trim()}`
    : `${active.subjectPrefix} — ${profile.fullName} (${profile.handle})`;

  const body = `Hi Siya,\n\nName / Brand: ${name.trim() || "Brand Partner"}\nWork Email: ${
    email.trim() || "—"
  }\nSelected Collaboration: ${active.label}\n\nProject Brief & Timeline:\n${
    note.trim() || "Looking forward to discussing this collaboration!"
  }\n`;

  const mailto = `mailto:${profile.email}?cc=${profile.ccEmail}&subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.location.href = mailto;
  };

  if (submitted) {
    return (
      <div className="form form--done" role="status">
        <p className="type-script form__thanks">thank you</p>
        <p className="type-body">
          your email draft is ready, with the subject filled in. if it didn’t open, use the button below.
        </p>
        <dl className="form__summary type-label">
          <div>
            <dt>to</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt>subject</dt>
            <dd>{subject}</dd>
          </div>
        </dl>
        <div className="form__actions">
          <a href={mailto} className="btn btn--solid has-roll">
            <span className="roll" aria-hidden="true">
              <span className="roll__inner">
                <span>open in email app</span>
                <span>open in email app</span>
              </span>
            </span>
            <span className="sr-only">open in email app</span>
            <span className="btn__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <button type="button" className="type-label link-u" onClick={() => setSubmitted(false)}>
            edit inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__pair">
        <div className="field">
          <label htmlFor="c-name" className="type-label">
            your name &amp; brand
          </label>
          <input
            ref={nameRef}
            id="c-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={contact.namePlaceholder}
          />
        </div>
        <div className="field">
          <label htmlFor="c-email" className="type-label">
            work email
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={contact.emailPlaceholder}
          />
        </div>
      </div>

      <div className="field field--chips" role="radiogroup" aria-labelledby="c-format">
        <p id="c-format" className="type-label">
          collaboration format
        </p>
        <div className="chips">
          {INQUIRY_OPTIONS.map((o) => (
            <label key={o.value} className="chip">
              <input
                type="radio"
                name="format"
                value={o.value}
                checked={o.value === option}
                onChange={() => setOption(o.value)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="c-note" className="type-label">
          project note &amp; timeline
        </label>
        <textarea
          id="c-note"
          name="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={contact.notePlaceholder}
        />
      </div>

      <p className="form__subject type-label">
        <span>subject</span>
        <span className="form__subject-text">{subject}</span>
      </p>

      <div className="form__actions">
        <button type="submit" className="btn btn--solid has-roll">
          <span className="roll" aria-hidden="true">
            <span className="roll__inner">
              <span>send inquiry</span>
              <span>send inquiry</span>
            </span>
          </span>
          <span className="sr-only">send inquiry</span>
          <span className="btn__arrow" aria-hidden="true">
            →
          </span>
        </button>
        <span className="type-label form__to">opens your email app · to {profile.email}</span>
      </div>
    </form>
  );
}

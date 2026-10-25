"use client";

import { useEffect, useRef, useState } from "react";
import { CONTENT, INQUIRY_OPTIONS } from "@/lib/content";
import { useInquiry } from "@/lib/inquiry";

/**
 * The inquiry form never posts anywhere: it builds a mailto: link (subject and
 * cc included) and opens the sender's email app, exactly like the old site.
 * Picking a format anywhere on the page (Rates, the hero, the reel player)
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
  }\nSelected Collaboration: ${active.fullLabel}\n\nProject Brief & Timeline:\n${
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
        <p className="type-script form__thanks">Thank you</p>
        <p className="type-body">
          Your email draft is ready, with the subject filled in. If it didn’t open, use the button below.
        </p>
        <dl className="form__summary type-label">
          <div>
            <dt>To</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt>Subject</dt>
            <dd>{subject}</dd>
          </div>
        </dl>
        <div className="form__actions">
          <a href={mailto} className="btn btn--solid has-roll">
            <span className="roll" aria-hidden="true">
              <span className="roll__inner">
                <span>Open in email app</span>
                <span>Open in email app</span>
              </span>
            </span>
            <span className="sr-only">Open in email app</span>
            <span className="btn__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <button type="button" className="type-label link-u" onClick={() => setSubmitted(false)}>
            Edit inquiry
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
            Your name &amp; brand
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
            Work email
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
          Collaboration format
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
          Project note &amp; timeline
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
        <span>Subject</span>
        <span className="form__subject-text">{subject}</span>
      </p>

      <div className="form__actions">
        <button type="submit" className="btn btn--solid has-roll">
          <span className="roll" aria-hidden="true">
            <span className="roll__inner">
              <span>Send inquiry</span>
              <span>Send inquiry</span>
            </span>
          </span>
          <span className="sr-only">Send inquiry</span>
          <span className="btn__arrow" aria-hidden="true">
            →
          </span>
        </button>
        <span className="type-label form__to">Opens your email app · to {profile.email}</span>
      </div>
    </form>
  );
}

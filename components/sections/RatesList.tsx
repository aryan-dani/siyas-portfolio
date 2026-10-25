"use client";

import { useState, type CSSProperties } from "react";
import { CONTENT } from "@/lib/content";
import { formatInr, reelPackPrice, REEL_PACK_BASE_COUNT, REEL_PACK_BASE_PRICE, REEL_PACK_EXTRA_PRICE } from "@/lib/pricing";
import { useInquiry } from "@/lib/inquiry";
import { DrawLine, Reveal } from "@/components/motion/Reveal";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

/** A price whose digits roll to their new value (pure CSS transition). */
function RollingNumber({ value }: { value: number }) {
  const chars = formatInr(value).split("");
  return (
    <span className="rolling" aria-label={`₹${formatInr(value)}`} role="img">
      <span className="rupee" aria-hidden="true">₹</span>
      <span className="rolling__digits" aria-hidden="true">
        {chars.map((ch, i) => {
          // Keyed from the right so existing digit columns persist when a
          // digit is added or removed (8,000 -> 10,000).
          const key = chars.length - i;
          if (ch === ",") {
            return (
              <span key={key} className="rolling__comma">
                ,
              </span>
            );
          }
          const d = Number(ch);
          return (
            <span key={key} className="rolling__col">
              <span className="rolling__strip" style={{ "--d": d } as CSSProperties}>
                {Array.from({ length: 10 }, (_, n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export function RatesList() {
  const { rates } = CONTENT;
  const { select } = useInquiry();
  const { scrollTo } = useSmoothScroll();
  const [count, setCount] = useState<number>(rates.counterMin);

  const total = reelPackPrice(count);
  const extras = count - REEL_PACK_BASE_COUNT;

  const inquire = (
    option: "single-reel" | "multi-reel-campaign" | "account-management",
    note?: string
  ) => {
    select(option, note);
    scrollTo("#contact");
  };

  const inquirePack = () => {
    if (count === REEL_PACK_BASE_COUNT) {
      inquire("single-reel", `Interested in the 3-Reel Starter pack at ₹${formatInr(REEL_PACK_BASE_PRICE)}.`);
    } else {
      inquire(
        "multi-reel-campaign",
        `Interested in a ${count}-reel pack (₹${formatInr(REEL_PACK_BASE_PRICE)} for 3 + ₹${formatInr(REEL_PACK_EXTRA_PRICE)} × ${extras} extra = ₹${formatInr(total)}).`
      );
    }
  };

  const rowAction = (id: string) => {
    if (id === "monthly") {
      inquire(
        "account-management",
        "Interested in the ₹24,000 / month account management retainer (adjustable to what we actually require)."
      );
    } else if (id === "extra") {
      inquire(
        "multi-reel-campaign",
        "Interested in a multi-reel pack (₹8,000 for 3 reels + ₹2,000 per extra reel)."
      );
    } else {
      inquire("single-reel", "Interested in the 3-Reel Starter pack at ₹8,000.");
    }
  };

  return (
    <>
      <ul className="rates__list">
        {rates.list.map((item, i) => (
          <li key={item.id} className="rate">
            <DrawLine delay={i * 0.08} />
            <div className="rate__body">
              <div className="rate__line">
                <Reveal as="h3" className="rate__name type-display" delay={i * 0.08}>
                  {item.name}
                </Reveal>
                <span className="rate__leader" aria-hidden="true" />
                <Reveal as="p" className="rate__price type-display" delay={0.1 + i * 0.08}>
                  <span className="rate__prefix">{item.prefix}</span>
                  <span className="rupee">₹</span>
                  {formatInr(item.amount)}
                  {item.suffix ? <span className="rate__suffix type-label">{item.suffix}</span> : null}
                </Reveal>
              </div>
              <Reveal className="rate__foot" delay={0.2 + i * 0.08} y={16}>
                <p className="type-body rate__detail">{item.detail}</p>
                <button type="button" className="type-label link-u rate__cta" onClick={() => rowAction(item.id)}>
                  Inquire →
                </button>
              </Reveal>
            </div>
          </li>
        ))}
        <li aria-hidden="true">
          <DrawLine />
        </li>
      </ul>

      <Reveal className="counter" y={26}>
        <p className="type-label">{rates.counterLabel}</p>
        <div className="counter__row">
          <div className="counter__stepper" role="group" aria-label="Number of reels">
            <button
              type="button"
              className="counter__btn"
              aria-label="Fewer reels"
              disabled={count <= rates.counterMin}
              onClick={() => setCount((c) => Math.max(rates.counterMin, c - 1))}
            >
              <span aria-hidden="true">−</span>
            </button>
            <output className="counter__count" aria-live="polite">
              <span className="type-display counter__num">{count}</span>
              <span className="type-label">reels</span>
            </output>
            <button
              type="button"
              className="counter__btn"
              aria-label="More reels"
              disabled={count >= rates.counterMax}
              onClick={() => setCount((c) => Math.min(rates.counterMax, c + 1))}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>

          <div className="counter__total">
            <p className="type-display counter__price" aria-live="polite">
              <RollingNumber value={total} />
            </p>
            <p className="type-label counter__note">
              {extras === 0
                ? "3-reel starter"
                : `₹${formatInr(REEL_PACK_BASE_PRICE)} + ${extras} × ₹${formatInr(REEL_PACK_EXTRA_PRICE)}`}
            </p>
          </div>

          <button type="button" className="btn btn--solid has-roll" onClick={inquirePack}>
            <span className="roll" aria-hidden="true">
              <span className="roll__inner">
                <span>Inquire about this pack</span>
                <span>Inquire about this pack</span>
              </span>
            </span>
            <span className="sr-only">Inquire about this pack</span>
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </Reveal>
    </>
  );
}

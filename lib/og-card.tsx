import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The social share card: the hero lockup ("SI [portrait] YA" with "hearts from"
 * written across it) on buttermilk. Fonts are tiny subsets of the exact site
 * fonts, read once at module scope; the card is prerendered at build time.
 *
 * Satori (the renderer behind next/og) can't use variable fonts or font-stretch,
 * so the condensed Noto Serif Display here is a pinned static instance.
 */
const display = await readFile(
  join(process.cwd(), "assets/og/NotoSerifDisplay-XC-500.ttf")
);
const script = await readFile(
  join(process.cwd(), "assets/og/MonsieurLaDoulaise.ttf")
);
const sans = await readFile(join(process.cwd(), "assets/og/Jost-400.ttf"));
const portrait = await readFile(join(process.cwd(), "assets/og/portrait.jpg"), "base64");

const INK = "#43302E";
const CREAM = "#FFF1B5";

export function renderOgCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: CREAM,
          color: INK,
        }}
      >
        {/* hairline frame */}
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 26,
            border: "1.5px solid rgba(67,48,46,0.35)",
            display: "flex",
          }}
        />

        {/* small caps rows */}
        <div
          style={{
            position: "absolute",
            top: 58,
            left: 64,
            right: 64,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Jost",
            fontSize: 20,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          <span>Creator · Storyteller</span>
          <span>@heartsfromsiya</span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 58,
            left: 64,
            right: 64,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Jost",
            fontSize: 20,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          <span>Pune, India</span>
          <span>Brand collaborations</span>
        </div>

        {/* Paint order = DOM order (no z-index in Satori): the lettering, then
            the script written across it, then the portrait covering the
            script's tail, exactly like the hero on the site. */}
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 0,
            right: 0,
            height: 430,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Noto Serif Display",
              fontWeight: 500,
              fontSize: 430,
              lineHeight: 1,
              letterSpacing: -6,
              display: "flex",
              marginRight: 18,
              marginTop: 18,
            }}
          >
            SI
          </div>
          {/* The script is absolutely positioned (no layout effect) but sits
              between SI and the portrait so the portrait paints over its tail. */}
          <div
            style={{
              position: "absolute",
              left: 66,
              top: 293,
              fontFamily: "Monsieur La Doulaise",
              fontSize: 100,
              lineHeight: 1,
              transform: "rotate(-6deg)",
              display: "flex",
              textShadow: `3px 3px 0 ${CREAM}, -3px -3px 0 ${CREAM}, 3px -3px 0 ${CREAM}, -3px 3px 0 ${CREAM}`,
            }}
          >
            hearts from
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${portrait}`}
            width={252}
            height={336}
            alt=""
            style={{ objectFit: "cover", border: `1.5px solid ${INK}` }}
          />
          <div
            style={{
              fontFamily: "Noto Serif Display",
              fontWeight: 500,
              fontSize: 430,
              lineHeight: 1,
              letterSpacing: -6,
              display: "flex",
              marginLeft: 18,
              marginTop: 18,
            }}
          >
            YA
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Noto Serif Display", data: display, weight: 500, style: "normal" },
        { name: "Monsieur La Doulaise", data: script, weight: 400, style: "normal" },
        { name: "Jost", data: sans, weight: 400, style: "normal" },
      ],
    }
  );
}

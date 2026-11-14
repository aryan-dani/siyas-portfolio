import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Social share card (1200×630): script “Siya”, brand mark, cutout on buttermilk.
 * Satori needs static font files — Jost + Monsieur La Doulaise.
 */
const sans = await readFile(join(process.cwd(), "assets/og/Jost-400.ttf"));
const script = await readFile(join(process.cwd(), "assets/og/MonsieurLaDoulaise.ttf"));
const portrait = await readFile(join(process.cwd(), "assets/og/siya-cutout.png"), "base64");

const INK = "#43302E";
const CREAM = "#FFF1B5";
const PASTEL = "#C1DBE8";

export function renderOgCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: CREAM,
          color: INK,
        }}
      >
        {/* Soft pastel wash behind portrait */}
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -120,
            width: 720,
            height: 720,
            borderRadius: 999,
            background: PASTEL,
            opacity: 0.42,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 44,
            left: 56,
            fontFamily: "Jost",
            fontSize: 24,
            letterSpacing: 3,
            display: "flex",
            alignItems: "baseline",
            gap: 6,
          }}
        >
          <span style={{ opacity: 0.72 }}>heartsfrom</span>
          <span style={{ fontFamily: "Script", fontSize: 36, letterSpacing: 0 }}>Siya</span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 56,
            top: 0,
            bottom: 0,
            width: 560,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Script",
              fontSize: 168,
              lineHeight: 0.88,
              letterSpacing: 0,
              display: "flex",
            }}
          >
            Siya
          </div>
          <div
            style={{
              marginTop: 18,
              alignSelf: "flex-start",
              background: PASTEL,
              padding: "14px 26px",
              borderRadius: 999,
              fontFamily: "Jost",
              fontSize: 28,
              letterSpacing: 1,
              display: "flex",
            }}
          >
            content creator
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: "Jost",
              fontSize: 24,
              letterSpacing: 1,
              opacity: 0.78,
              display: "flex",
            }}
          >
            Pune, India · 2M+ peak monthly reach
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: "Jost",
              fontSize: 15,
              letterSpacing: 1.5,
              opacity: 0.62,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>PharmEasy</span>
            <span>·</span>
            <span>Mokobara</span>
            <span>·</span>
            <span>Lifestyle &amp; UGC</span>
          </div>
        </div>

        {/* Portfolio year tag */}
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 56,
            fontFamily: "Jost",
            fontSize: 14,
            letterSpacing: 3,
            opacity: 0.55,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Portfolio · 2026
        </div>

        {/* Editorial inset hairline frame */}
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "1px solid rgba(67, 48, 46, 0.14)",
            borderRadius: 20,
            display: "flex",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${portrait}`}
          width={520}
          height={770}
          alt=""
          style={{
            position: "absolute",
            right: 8,
            bottom: 0,
            objectFit: "contain",
            objectPosition: "bottom center",
          }}
        />

        {/* Baseline hairline like the site */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            background: INK,
            opacity: 0.18,
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Jost", data: sans, weight: 400, style: "normal" },
        { name: "Script", data: script, weight: 400, style: "normal" },
      ],
    },
  );
}

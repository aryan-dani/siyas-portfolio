import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Social share card: Regan-style lockup — lowercase "siya", "content creator"
 * highlight, and the cutout portrait on a buttermilk → pastel wash.
 * Satori can't use variable fonts or font-stretch, so Jost is a static file.
 */
const sans = await readFile(join(process.cwd(), "assets/og/Jost-400.ttf"));
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
          background: CREAM,
          color: INK,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 64,
            fontFamily: "Jost",
            fontSize: 26,
            letterSpacing: 4,
            display: "flex",
          }}
        >
          heartsfromsiya
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            top: 170,
            bottom: 64,
            width: 520,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Jost",
              fontSize: 200,
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 0.9,
              letterSpacing: -6,
              display: "flex",
            }}
          >
            siya
          </div>
          <div
            style={{
              marginTop: 28,
              alignSelf: "flex-start",
              background: "rgba(193,219,232,0.88)",
              padding: "12px 22px",
              borderRadius: 999,
              fontFamily: "Jost",
              fontSize: 32,
              display: "flex",
            }}
          >
            content creator
          </div>
          <div
            style={{
              marginTop: 36,
              fontFamily: "Jost",
              fontSize: 22,
              letterSpacing: 2,
              opacity: 0.78,
              display: "flex",
            }}
          >
            pune, india · 2M+ monthly reach
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${portrait}`}
          width={460}
          height={680}
          alt=""
          style={{
            position: "absolute",
            right: 40,
            bottom: 0,
            objectFit: "contain",
            objectPosition: "bottom center",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Jost", data: sans, weight: 400, style: "normal" }],
    }
  );
}

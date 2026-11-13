"""
Unmatte white fringe (from white-BG cutout), rematte onto buttermilk so
hair/cheeks blend into the page. Refreshes hero + OG assets.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
# Start from rembg cutout (still white-matted), not an already-rematted file
SRC = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout-2.png"
OUT = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout-3.png"
OG = ROOT / "assets" / "og" / "siya-cutout.png"
PREVIEW = ROOT / "screenshots" / "hero-cutout-blend-preview.png"

BM = np.array([255.0, 241.0, 181.0], dtype=np.float32)  # #FFF1B5
WHITE = np.array([255.0, 255.0, 255.0], dtype=np.float32)


def main() -> None:
  print("src", SRC)
  im = Image.open(SRC).convert("RGBA")
  arr = np.array(im).astype(np.float32)
  rgb, a = arr[:, :, :3], arr[:, :, 3]
  alpha = np.clip(a / 255.0, 0, 1)
  eps = 1e-4

  # Unmatte assuming prior white backdrop (classic despill)
  unmatted = (rgb - WHITE * (1.0 - alpha[:, :, None])) / np.maximum(alpha[:, :, None], eps)
  unmatted = np.clip(unmatted, 0, 255)

  # Only apply unmatte where fringe is likely (edge + bright); keep dress/core
  opaque = a >= 20
  dist_in = ndimage.distance_transform_edt(opaque)
  lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
  fringe = (a > 0) & (dist_in <= 10) & (lum > 140)
  core = ~fringe

  fixed = rgb.copy()
  fixed[fringe] = unmatted[fringe]
  # Protect saturated dress teal from unmatte blowouts
  teal = (rgb[:, :, 1] > rgb[:, :, 0] * 0.85) & (rgb[:, :, 2] > 50) & (rgb[:, :, 1] > 70) & (lum < 200)
  fixed[teal] = rgb[teal]

  # Rematte onto buttermilk for storage (what you see on the page)
  rematted = fixed * alpha[:, :, None] + BM * (1.0 - alpha[:, :, None])

  # Soft plush: outer rim RGB = buttermilk, gentle alpha
  out_rgb = rematted.copy()
  out_a = a.copy()
  for radius, a_cap, mix in ((3.5, 210, 0.4), (2.2, 160, 0.7), (1.2, 110, 0.9)):
    band = (out_a > 0) & (dist_in <= radius)
    out_rgb[band] = out_rgb[band] * (1 - mix) + BM * mix
    out_a[band] = np.minimum(out_a[band], a_cap)

  # Drop dust
  out_a[out_a < 10] = 0

  out = Image.fromarray(np.clip(np.dstack([out_rgb, out_a]), 0, 255).astype(np.uint8), "RGBA")
  out = out.crop(out.getbbox())
  px = out.load()
  W, H = out.size
  for x in range(W):
    for dy in range(min(5, H)):
      y = H - 1 - dy
      r, g, b, aa = px[x, y]
      if aa > 18:
        px[x, y] = (r, g, b, 255)

  out.save(OUT, "PNG", optimize=True)
  print("saved", OUT, out.size)

  bg = Image.new("RGBA", out.size, (255, 241, 181, 255))
  comp = Image.alpha_composite(bg, out)
  comp.save(PREVIEW, "PNG")
  w, h = out.size
  comp.crop((0, int(h * 0.06), int(w * 0.52), int(h * 0.4))).save(
    ROOT / "screenshots" / "hero-hair-blend-closeup.png"
  )
  comp.crop((int(w * 0.38), int(h * 0.04), w, int(h * 0.36))).save(
    ROOT / "screenshots" / "hero-cheek-blend-closeup.png"
  )

  og_h = 665
  og_w = min(560, int(og_h * out.width / out.height))
  og = out.resize((og_w, og_h), Image.Resampling.LANCZOS)
  canvas = Image.new("RGBA", (560, 665), (0, 0, 0, 0))
  canvas.paste(og, ((560 - og_w) // 2, 0), og)
  # bottom align
  canvas = Image.new("RGBA", (560, 665), (0, 0, 0, 0))
  canvas.paste(og, ((560 - og_w) // 2, 665 - og_h), og)
  canvas.save(OG, "PNG", optimize=True)
  print("og", OG)


if __name__ == "__main__":
  main()

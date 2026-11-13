"""
Despill white fringe on hair/cheeks into buttermilk, soft plush rim.
Also refreshes assets/og/siya-cutout.png for link previews.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout-2.png"
OUT = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout-3.png"
OG = ROOT / "assets" / "og" / "siya-cutout.png"
PREVIEW = ROOT / "screenshots" / "hero-cutout-blend-preview.png"
HAIR = ROOT / "screenshots" / "hero-hair-blend-closeup.png"

BM = np.array([255.0, 241.0, 181.0], dtype=np.float32)
WHITE = np.array([255.0, 255.0, 255.0], dtype=np.float32)


def main() -> None:
  im = Image.open(SRC).convert("RGBA")
  arr = np.array(im).astype(np.float32)
  rgb, a = arr[:, :, :3], arr[:, :, 3]

  lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
  d_white = np.linalg.norm(rgb - WHITE, axis=2)
  d_bm = np.linalg.norm(rgb - BM, axis=2)

  opaque = a >= 24
  dist_in = ndimage.distance_transform_edt(opaque)

  # --- 1) Despill: pull white-contaminated rim toward buttermilk / interior ---
  seed = (a >= 200) & (dist_in >= 8) & (d_white > 55) & (lum < 195)
  color = np.zeros_like(rgb)
  weight = np.zeros(a.shape, dtype=np.float32)
  color[seed] = rgb[seed]
  weight[seed] = 1.0
  for _ in range(28):
    c = Image.fromarray(np.clip(color, 0, 255).astype(np.uint8), "RGB").filter(ImageFilter.BoxBlur(2))
    w = Image.fromarray(np.clip(weight * 255, 0, 255).astype(np.uint8), "L").filter(ImageFilter.BoxBlur(2))
    color = np.array(c).astype(np.float32)
    weight = np.array(w).astype(np.float32) / 255.0
    color[seed] = rgb[seed]
    weight[seed] = 1.0
  prop = color / np.maximum(weight[:, :, None], 1e-3)

  out_rgb = rgb.copy()
  out_a = a.copy()

  rim = (a > 0) & (dist_in <= 7)
  # How "white/cool" vs warm subject
  whiteish = (d_white < 70) | ((lum > 195) & (rgb[:, :, 2] > 185) & (rgb[:, :, 0] > 200) & (d_bm > 18))
  contam = rim & whiteish
  print("contam rim", int(contam.sum()))

  has = contam & (weight > 0.1)
  # Mix propagated subject color with buttermilk (plush, not harsh)
  out_rgb[has] = prop[has] * 0.55 + BM * 0.45
  weak = contam & ~has
  out_rgb[weak] = BM

  # Extra pass: any soft pixel that's closer to white than buttermilk → BM blend
  soft = (out_a > 0) & (out_a < 245)
  closer_white = soft & (d_white + 8 < d_bm) & (lum > 200)
  t = np.clip((70 - d_white) / 70.0, 0.35, 0.95)
  tw = t[:, :, None]
  out_rgb[closer_white] = out_rgb[closer_white] * (1 - tw[closer_white]) + BM * tw[closer_white]
  print("closer_white soft", int(closer_white.sum()))

  # --- 2) Outer plush feather: buttermilk RGB + soft alpha ---
  for radius, alpha_cap, bm_mix in (
    (3.2, 200, 0.55),
    (2.0, 150, 0.75),
    (1.1, 100, 0.92),
  ):
    band = (out_a > 0) & (dist_in <= radius)
    out_rgb[band] = out_rgb[band] * (1 - bm_mix) + BM * bm_mix
    out_a[band] = np.minimum(out_a[band], alpha_cap)

  # --- 3) Kill tiny white crumbs / webbing between hair ---
  crumbs = (out_a > 0) & (out_a < 140) & (d_white < 40) & (lum > 230)
  out_a[crumbs] = 0
  # Replace remaining mid-alpha white webbing with buttermilk (keeps strand shape)
  web = (out_a >= 40) & (out_a < 200) & (d_white < 55) & (lum > 215) & (dist_in <= 10)
  out_rgb[web] = BM
  print("crumbs", int(crumbs.sum()), "web", int(web.sum()))

  out_a[out_a < 12] = 0
  out_a[out_a >= 230] = 255

  out = Image.fromarray(np.clip(np.dstack([out_rgb, out_a]), 0, 255).astype(np.uint8), "RGBA")
  out = out.crop(out.getbbox())

  # Opaque dress hem
  px = out.load()
  W, H = out.size
  for x in range(W):
    for dy in range(min(5, H)):
      y = H - 1 - dy
      r, g, b, aa = px[x, y]
      if aa > 18:
        # Don't buttermilk the dress — only force opaque
        px[x, y] = (r, g, b, 255)

  out.save(OUT, "PNG", optimize=True)
  print("saved", OUT, out.size)

  # Previews
  bg = Image.new("RGBA", out.size, (255, 241, 181, 255))
  comp = Image.alpha_composite(bg, out)
  comp.save(PREVIEW, "PNG")
  w, h = out.size
  # Left hair + right cheek closeups
  comp.crop((0, int(h * 0.08), int(w * 0.55), int(h * 0.42))).save(HAIR)
  comp.crop((int(w * 0.35), int(h * 0.05), int(w * 0.95), int(h * 0.38))).save(
    ROOT / "screenshots" / "hero-cheek-blend-closeup.png"
  )

  # OG portrait: sit on bottom, similar footprint to old 560×665
  og_h = 665
  og_w = int(og_h * out.width / out.height)
  og = out.resize((og_w, og_h), Image.Resampling.LANCZOS)
  # Pad to 560 wide, bottom-aligned, transparent
  canvas = Image.new("RGBA", (560, 665), (0, 0, 0, 0))
  canvas.paste(og, ((560 - og_w) // 2, 665 - og_h), og)
  canvas.save(OG, "PNG", optimize=True)
  print("og", OG, canvas.size)


if __name__ == "__main__":
  main()

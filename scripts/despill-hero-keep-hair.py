"""
Despill white fringe into buttermilk WITHOUT eroding hair.
Starts from the fuller original cutout (not the rembg-eroded -2).
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout.png"
OUT = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout-4.png"
OG = ROOT / "assets" / "og" / "siya-cutout.png"
PREVIEW = ROOT / "screenshots" / "hero-cutout-blend-preview.png"

BM = np.array([255.0, 241.0, 181.0], dtype=np.float32)
WHITE = np.array([255.0, 255.0, 255.0], dtype=np.float32)


def main() -> None:
  im = Image.open(SRC).convert("RGBA")
  arr = np.array(im).astype(np.float32)
  rgb, a = arr[:, :, :3], arr[:, :, 3]
  alpha = np.clip(a / 255.0, 0, 1)
  eps = 1e-4

  # Unmatte white (only for fringe color — keep full alpha silhouette)
  unmatted = (rgb - WHITE * (1.0 - alpha[:, :, None])) / np.maximum(alpha[:, :, None], eps)
  unmatted = np.clip(unmatted, 0, 255)

  opaque = a >= 18
  dist_in = ndimage.distance_transform_edt(opaque)
  lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
  d_white = np.linalg.norm(rgb - WHITE, axis=2)

  # Fringe = near edge + bright/cool — do NOT erode mask
  fringe = (a > 0) & (dist_in <= 6) & ((d_white < 65) | ((lum > 185) & (rgb[:, :, 2] > 175)))
  # Protect dress teal
  teal = (rgb[:, :, 1] > rgb[:, :, 0] * 0.88) & (rgb[:, :, 1] > 75) & (rgb[:, :, 2] > 55) & (lum < 210)

  # Propagate dark hair/skin inward for fringe fill
  seed = (a >= 200) & (dist_in >= 7) & (d_white > 50) & (lum < 190) & ~teal
  color = np.zeros_like(rgb)
  weight = np.zeros(a.shape, dtype=np.float32)
  color[seed] = rgb[seed]
  weight[seed] = 1.0
  for _ in range(20):
    c = Image.fromarray(np.clip(color, 0, 255).astype(np.uint8), "RGB").filter(ImageFilter.BoxBlur(2))
    w = Image.fromarray(np.clip(weight * 255, 0, 255).astype(np.uint8), "L").filter(ImageFilter.BoxBlur(2))
    color = np.array(c).astype(np.float32)
    weight = np.array(w).astype(np.float32) / 255.0
    color[seed] = rgb[seed]
    weight[seed] = 1.0
  prop = color / np.maximum(weight[:, :, None], 1e-3)

  out_rgb = rgb.copy()
  out_a = a.copy()  # keep hair silhouette intact

  use = fringe & ~teal & (weight > 0.12)
  # Mix unmatte + propagated + buttermilk (soft blend, no hard cut)
  out_rgb[use] = unmatted[use] * 0.25 + prop[use] * 0.45 + BM * 0.30
  weak = fringe & ~teal & ~use
  out_rgb[weak] = out_rgb[weak] * 0.35 + BM * 0.65

  # Soft outer plush only (1–2px) — no silhouette shrink
  band = (out_a > 0) & (dist_in <= 1.6)
  out_rgb[band] = out_rgb[band] * 0.35 + BM * 0.65
  out_a[band] = np.minimum(out_a[band], 170)

  out = Image.fromarray(np.clip(np.dstack([out_rgb, out_a]), 0, 255).astype(np.uint8), "RGBA")
  out = out.crop(out.getbbox())
  px = out.load()
  W, H = out.size
  for x in range(W):
    for dy in range(min(4, H)):
      y = H - 1 - dy
      r, g, b, aa = px[x, y]
      if aa > 20:
        px[x, y] = (r, g, b, 255)

  out.save(OUT, "PNG", optimize=True)
  print("saved", OUT, out.size)

  bg = Image.new("RGBA", out.size, (255, 241, 181, 255))
  comp = Image.alpha_composite(bg, out)
  comp.save(PREVIEW, "PNG")
  w, h = out.size
  comp.crop((0, int(h * 0.42), int(w * 0.48), int(h * 0.92))).save(
    ROOT / "screenshots" / "hair-left-restored.png"
  )
  comp.crop((int(w * 0.4), int(h * 0.05), w, int(h * 0.38))).save(
    ROOT / "screenshots" / "hero-cheek-blend-closeup.png"
  )

  # OG: transparent cutout, bottom-aligned on cream card later via og-card bg
  og_h = 665
  og_w = min(560, int(og_h * out.width / out.height))
  og = out.resize((og_w, og_h), Image.Resampling.LANCZOS)
  canvas = Image.new("RGBA", (560, 665), (0, 0, 0, 0))
  canvas.paste(og, ((560 - og_w) // 2, 665 - og_h), og)
  canvas.save(OG, "PNG", optimize=True)
  print("og", OG)

  # left extent check
  aa = np.array(out.split()[-1])
  hh, ww = aa.shape
  lefts = []
  for y in range(int(hh * 0.55), int(hh * 0.85), 8):
    xs = np.where(aa[y] > 40)[0]
    if len(xs):
      lefts.append(xs[0] / ww)
  print("mean left frac", round(float(np.mean(lefts)), 4), "min", round(float(np.min(lefts)), 4))


if __name__ == "__main__":
  main()

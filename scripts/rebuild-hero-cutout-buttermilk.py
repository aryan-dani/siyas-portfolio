"""Rebuild hero cutout from white-BG source: rembg, eat white fringe, buttermilk rim."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "siya" / "photos" / "siya-hero-white-source.jpg"
OUT = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout-2.png"
PREVIEW = ROOT / "screenshots" / "hero-cutout-defringe-preview.png"

BM = np.array([255.0, 241.0, 181.0], dtype=np.float32)
WHITE = np.array([255.0, 255.0, 255.0], dtype=np.float32)


def main() -> None:
  src = Image.open(SRC).convert("RGB")
  # Upscale for cleaner mask edges
  tw = 1800
  th = int(tw * src.height / src.width)
  src = src.resize((tw, th), Image.Resampling.LANCZOS)
  print("source", src.size)

  print("rembg…")
  raw = remove(src, session=new_session("u2net"), post_process_mask=True).convert("RGBA")
  arr = np.array(raw)
  rgb = arr[:, :, :3].astype(np.float32)
  a = arr[:, :, 3].astype(np.float32)

  # Largest connected subject
  mask = a >= 80
  labeled, n = ndimage.label(mask)
  if n:
    sizes = ndimage.sum(mask, labeled, range(1, n + 1))
    mask = labeled == (int(np.argmax(sizes)) + 1)

  # Eat white / studio fringe
  mask = ndimage.binary_erosion(mask, iterations=4)
  dist_in = ndimage.distance_transform_edt(mask)
  alpha = np.clip(dist_in / 1.5, 0, 1) * 255.0

  lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
  d_white = np.linalg.norm(rgb - WHITE, axis=2)

  # Seed interior (not white)
  seeds = (dist_in >= 6) & (d_white > 45) & (lum < 215)
  color = np.zeros_like(rgb)
  weight = np.zeros(alpha.shape, dtype=np.float32)
  color[seeds] = rgb[seeds]
  weight[seeds] = 1.0
  for _ in range(22):
    c = Image.fromarray(np.clip(color, 0, 255).astype(np.uint8), "RGB").filter(ImageFilter.BoxBlur(2))
    w = Image.fromarray(np.clip(weight * 255, 0, 255).astype(np.uint8), "L").filter(ImageFilter.BoxBlur(2))
    color = np.array(c).astype(np.float32)
    weight = np.array(w).astype(np.float32) / 255.0
    color[seeds] = rgb[seeds]
    weight[seeds] = 1.0
  prop = color / np.maximum(weight[:, :, None], 1e-3)

  out_rgb = rgb.copy()
  out_rgb[dist_in >= 5] = rgb[dist_in >= 5]
  rim = (alpha > 0) & (dist_in < 5)
  use = rim & (weight > 0.12)
  out_rgb[use] = prop[use]
  # Contaminated white on rim → buttermilk
  contam = rim & ((d_white < 50) | ((lum > 205) & (rgb[:, :, 2] > 200)))
  out_rgb[contam] = BM
  # Outer 2px: soft buttermilk plush
  outer = (alpha > 0) & (dist_in <= 2.0)
  out_rgb[outer] = BM
  alpha[outer] = np.minimum(alpha[outer], 140)

  # Kill any leftover bright crumbs outside mask
  crumbs = (a > 0) & ~mask & (lum > 200)
  alpha[crumbs] = 0

  alpha[alpha >= 170] = 255
  alpha[alpha < 20] = 0

  out = Image.fromarray(np.clip(np.dstack([out_rgb, alpha]), 0, 255).astype(np.uint8), "RGBA")
  out = out.crop(out.getbbox())

  # Opaque hem flush with bottom of file
  px = out.load()
  W, H = out.size
  for x in range(W):
    for dy in range(min(4, H)):
      y = H - 1 - dy
      r, g, b, aa = px[x, y]
      if aa > 15:
        px[x, y] = (r, g, b, 255)

  # Final width ~1500
  fw = 1500
  fh = int(fw * out.height / out.width)
  out = out.resize((fw, fh), Image.Resampling.LANCZOS)
  px = out.load()
  W, H = out.size
  for x in range(W):
    for dy in range(min(3, H)):
      y = H - 1 - dy
      r, g, b, aa = px[x, y]
      if aa > 15:
        px[x, y] = (r, g, b, 255)

  out.save(OUT, "PNG", optimize=True)
  print("saved", OUT, out.size, "bbox", out.getbbox())

  bg = Image.new("RGBA", out.size, (255, 241, 181, 255))
  Image.alpha_composite(bg, out).save(PREVIEW, "PNG")
  print("preview", PREVIEW)


if __name__ == "__main__":
  main()

"""Rebuild hero cutout: rembg + erode fringe + opaque hem flush."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "siya" / "photos" / "siya-8443-source.jpg"
OUT = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout.png"
PREVIEW = ROOT / "public" / "siya" / "photos" / "siya-cutout-preview.png"

BG = np.array([248.0, 188.0, 100.0], dtype=np.float32)


def main() -> None:
  img = Image.open(SRC).convert("RGB")
  img = img.resize((1800, int(1800 * img.height / img.width)), Image.Resampling.LANCZOS)

  print("rembg u2net…")
  raw = remove(img, session=new_session("u2net"), post_process_mask=True).convert("RGBA")
  arr = np.array(raw)
  rgb = arr[:, :, :3].astype(np.float32)
  a = arr[:, :, 3].astype(np.float32)

  mask = a >= 90
  labeled, n = ndimage.label(mask)
  if n:
    sizes = ndimage.sum(mask, labeled, range(1, n + 1))
    mask = labeled == (int(np.argmax(sizes)) + 1)

  # Eat warm studio fringe on the silhouette
  mask = ndimage.binary_erosion(mask, iterations=3)
  dist_in = ndimage.distance_transform_edt(mask)
  alpha = np.clip(dist_in / 1.25, 0, 1) * 255.0

  dist_bg = np.linalg.norm(rgb - BG, axis=2)
  studio = (dist_bg < 80) & ((rgb[:, :, 1] - rgb[:, :, 2]) > 50) & (rgb[:, :, 0] > 195)
  seeds = (dist_in >= 6) & ~studio

  color = np.zeros_like(rgb)
  weight = np.zeros(alpha.shape, dtype=np.float32)
  color[seeds] = rgb[seeds]
  weight[seeds] = 1.0
  for _ in range(20):
    c = Image.fromarray(np.clip(color, 0, 255).astype(np.uint8), "RGB").filter(ImageFilter.BoxBlur(2))
    w = Image.fromarray(np.clip(weight * 255, 0, 255).astype(np.uint8), "L").filter(ImageFilter.BoxBlur(2))
    color = np.array(c).astype(np.float32)
    weight = np.array(w).astype(np.float32) / 255.0
    color[seeds] = rgb[seeds]
    weight[seeds] = 1.0
  prop = color / np.maximum(weight[:, :, None], 1e-3)

  out_rgb = rgb.copy()
  rim = (alpha > 0) & (dist_in < 5) & (weight > 0.15)
  out_rgb[rim] = prop[rim]
  out_rgb[dist_in >= 5] = rgb[dist_in >= 5]

  # Bottom-left chair / debris (non-teal warm wedge)
  h, w = alpha.shape
  tealish = (out_rgb[:, :, 1] > out_rgb[:, :, 0] * 0.9) & (out_rgb[:, :, 1] > 80) & (out_rgb[:, :, 2] > 60)
  bottom = np.zeros((h, w), dtype=bool)
  bottom[int(h * 0.82) :, : int(w * 0.35)] = True
  debris = bottom & (out_rgb[:, :, 0] > 120) & ((out_rgb[:, :, 0] - out_rgb[:, :, 2]) > 30) & ~tealish
  alpha[debris] = 0

  outer = (alpha > 0) & (dist_in <= 2.2)
  lum = 0.2126 * out_rgb[:, :, 0] + 0.7152 * out_rgb[:, :, 1] + 0.0722 * out_rgb[:, :, 2]
  fringe = outer & (
    ((dist_bg < 95) & ((out_rgb[:, :, 1] - out_rgb[:, :, 2]) > 40) & (out_rgb[:, :, 0] > 170))
    | ((lum > 150) & ((out_rgb[:, :, 0] - out_rgb[:, :, 2]) > 28) & (out_rgb[:, :, 0] > 160))
  )
  alpha[fringe] = 0
  alpha[alpha >= 160] = 255
  alpha[alpha < 25] = 0

  out_im = Image.fromarray(np.clip(np.dstack([out_rgb, alpha]), 0, 255).astype(np.uint8), "RGBA")
  out_im = out_im.crop(out_im.getbbox())
  px = out_im.load()
  W, H = out_im.size
  for x in range(W):
    for dy in range(min(3, H)):
      y = H - 1 - dy
      r, g, b, aa = px[x, y]
      if aa > 20:
        px[x, y] = (r, g, b, 255)

  tw = 1400
  th = int(tw * out_im.height / out_im.width)
  out_im = out_im.resize((tw, th), Image.Resampling.LANCZOS)
  px = out_im.load()
  W, H = out_im.size
  for x in range(W):
    for dy in range(min(2, H)):
      y = H - 1 - dy
      r, g, b, aa = px[x, y]
      if aa > 20:
        px[x, y] = (r, g, b, 255)

  out_im.save(OUT, "PNG", optimize=True)
  print("saved", OUT, out_im.size)
  bg = Image.new("RGBA", out_im.size, (255, 241, 181, 255))
  Image.alpha_composite(bg, out_im).save(PREVIEW, "PNG")


if __name__ == "__main__":
  main()

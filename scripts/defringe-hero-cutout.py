"""Kill cool/white fringe on the hero cutout; keep buttermilk soft edges."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout.png"
OUT = SRC
PREVIEW = ROOT / "screenshots" / "hero-cutout-defringe-preview.png"

BM = np.array([255.0, 241.0, 181.0], dtype=np.float32)
WHITE = np.array([255.0, 255.0, 255.0], dtype=np.float32)


def main() -> None:
  im = Image.open(SRC).convert("RGBA")
  arr = np.array(im).astype(np.float32)
  rgb, a = arr[:, :, :3], arr[:, :, 3]

  lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
  d_white = np.linalg.norm(rgb - WHITE, axis=2)

  soft = (a > 0) & (a < 250)
  # Cool / paper-white halo (not warm buttermilk)
  cool_white = soft & (lum > 215) & (rgb[:, :, 2] > 195) & (d_white < 60)
  # Near-pure white soft → drop
  kill = soft & (d_white < 28) & (lum > 242)

  opaque = a >= 200
  dil_t = ndimage.binary_dilation(a < 10, iterations=2)
  rim = opaque & dil_t
  rim_bright = rim & (lum > 210) & (d_white < 75)

  print("cool_white", int(cool_white.sum()), "kill", int(kill.sum()), "rim_bright", int(rim_bright.sum()))

  out_rgb = rgb.copy()
  out_a = a.copy()
  out_a[kill] = 0
  out_rgb[cool_white] = BM

  # Propagate interior color onto bright rim
  core = opaque & (lum < 195)
  color = np.zeros_like(rgb)
  weight = np.zeros(a.shape, dtype=np.float32)
  color[core] = rgb[core]
  weight[core] = 1.0
  for _ in range(14):
    c = Image.fromarray(np.clip(color, 0, 255).astype(np.uint8), "RGB").filter(ImageFilter.BoxBlur(2))
    w = Image.fromarray(np.clip(weight * 255, 0, 255).astype(np.uint8), "L").filter(ImageFilter.BoxBlur(2))
    color = np.array(c).astype(np.float32)
    weight = np.array(w).astype(np.float32) / 255.0
    color[core] = rgb[core]
    weight[core] = 1.0
  prop = color / np.maximum(weight[:, :, None], 1e-3)

  use = rim_bright & (weight > 0.08)
  out_rgb[use] = prop[use]
  left = rim_bright & ~use
  out_rgb[left] = BM

  # Any remaining soft edge that's cooler than buttermilk → pull toward BM
  soft2 = (out_a > 0) & (out_a < 230)
  cool2 = soft2 & (out_rgb[:, :, 2] > 190) & (
    (0.2126 * out_rgb[:, :, 0] + 0.7152 * out_rgb[:, :, 1] + 0.0722 * out_rgb[:, :, 2]) > 205
  )
  out_rgb[cool2] = out_rgb[cool2] * 0.25 + BM * 0.75

  out = Image.fromarray(np.clip(np.dstack([out_rgb, out_a]), 0, 255).astype(np.uint8), "RGBA")
  out = out.crop(out.getbbox())
  px = out.load()
  W, H = out.size
  for x in range(W):
    for dy in range(min(3, H)):
      y = H - 1 - dy
      r, g, b, aa = px[x, y]
      if aa > 15:
        px[x, y] = (r, g, b, 255)

  out.save(OUT, "PNG", optimize=True)
  print("saved", OUT, out.size)

  bg = Image.new("RGBA", out.size, (255, 241, 181, 255))
  Image.alpha_composite(bg, out).save(PREVIEW, "PNG")
  print("preview", PREVIEW)


if __name__ == "__main__":
  main()

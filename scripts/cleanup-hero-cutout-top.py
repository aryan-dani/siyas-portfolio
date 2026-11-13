"""
Remove top rectangular patch / junk pixels and soft white fringe.
Does NOT erode the hair silhouette — only recolors or drops non-hair debris.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout-4.png"
OUT = ROOT / "public" / "siya" / "photos" / "siya-hero-cutout-5.png"
OG = ROOT / "assets" / "og" / "siya-cutout.png"
PREVIEW = ROOT / "screenshots" / "hero-cutout-blend-preview.png"

BM = np.array([255.0, 241.0, 181.0], dtype=np.float32)
WHITE = np.array([255.0, 255.0, 255.0], dtype=np.float32)


def main() -> None:
  im = Image.open(SRC).convert("RGBA")
  arr = np.array(im).astype(np.float32)
  rgb, a = arr[:, :, :3], arr[:, :, 3]
  h, w = a.shape
  lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
  d_white = np.linalg.norm(rgb - WHITE, axis=2)

  out_rgb = rgb.copy()
  out_a = a.copy()

  # 1) Drop pure junk (black / magenta / pure yellow keys)
  junk = (a > 0) & (
    ((rgb[:, :, 0] < 25) & (rgb[:, :, 1] < 25) & (rgb[:, :, 2] < 25))
    | ((rgb[:, :, 0] > 250) & (rgb[:, :, 2] > 250) & (rgb[:, :, 1] < 40))
    | ((rgb[:, :, 0] > 250) & (rgb[:, :, 1] > 250) & (rgb[:, :, 2] < 40))
  )
  out_a[junk] = 0
  print("junk cleared", int(junk.sum()))

  # 2) Top "rectangular patch": bright/warm pixels that aren't hair brown,
  #    mostly in the crown band. Keep dark hair.
  top = np.zeros((h, w), dtype=bool)
  top[: max(48, h // 28), :] = True
  # hair-like: darker, not near-white
  hairish = (lum < 175) & (d_white > 45) & (a > 40)
  # patch-like: bright cream/white/warm, often mid-alpha halo plate
  patch = top & (a > 0) & ~hairish & (
    (lum > 190) | (d_white < 55) | ((rgb[:, :, 0] > 220) & (rgb[:, :, 1] > 200))
  )
  out_a[patch] = 0
  print("top patch cleared", int(patch.sum()))

  # 3) Edge white fringe → buttermilk tint (keep alpha / silhouette)
  opaque = out_a >= 20
  dist_in = ndimage.distance_transform_edt(opaque)
  rim = (out_a > 0) & (dist_in <= 3.5)
  white_rim = rim & ((d_white < 55) | ((lum > 200) & (rgb[:, :, 2] > 185)))
  # don't paint dress teal
  teal = (out_rgb[:, :, 1] > out_rgb[:, :, 0] * 0.88) & (out_rgb[:, :, 1] > 75) & (lum < 210)
  white_rim = white_rim & ~teal
  out_rgb[white_rim] = out_rgb[white_rim] * 0.35 + BM * 0.65
  print("white rim tinted", int(white_rim.sum()))

  # 4) Tiny outer plush (1px) — buttermilk only, no silhouette shrink
  outer = (out_a > 0) & (dist_in <= 1.0)
  out_rgb[outer] = out_rgb[outer] * 0.4 + BM * 0.6

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
  print("saved", OUT, out.size, "bbox", out.getbbox())

  bg = Image.new("RGBA", out.size, (255, 241, 181, 255))
  Image.alpha_composite(bg, out).save(PREVIEW, "PNG")
  Image.alpha_composite(bg, out).crop((0, 0, out.size[0], int(out.size[1] * 0.22))).save(
    ROOT / "screenshots" / "hero-top-clean.png"
  )

  og_h = 665
  og_w = min(560, int(og_h * out.width / out.height))
  og = out.resize((og_w, og_h), Image.Resampling.LANCZOS)
  canvas = Image.new("RGBA", (560, 665), (0, 0, 0, 0))
  canvas.paste(og, ((560 - og_w) // 2, 665 - og_h), og)
  canvas.save(OG, "PNG", optimize=True)
  print("og", OG)


if __name__ == "__main__":
  main()

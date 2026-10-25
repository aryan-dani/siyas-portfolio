# Siya Pawar: creator portfolio

A minimal, editorial portfolio for **Siya Pawar** ([@heartsfromsiya](https://www.instagram.com/heartsfromsiya/) · [@siyasideup](https://www.instagram.com/siyasideup/) · [YouTube](https://m.youtube.com/@heartsfromsiya)): Pune-based creator, storyteller and brand collaborator.

Designed and developed by [Aryan Dani](https://www.aryandani.com).

---

## The design

The site reads like a fashion-magazine page: huge condensed capitals, one script word written across them, a lot of buttermilk space, and three flat colours.

| Colour | Hex | Role |
| --- | --- | --- |
| Buttermilk | `#FFF1B5` | The page |
| Pastel Blue | `#C1DBE8` | Selected Work chapter, text selection, hover fills |
| Old Burgundy | `#43302E` | Ink, and the dark Rates / Contact / footer chapter |

Every other tone is one of these three mixed with transparency (body text, hairlines, tints). The whole page cross-fades between chapters (buttermilk, then blue, then burgundy) as you scroll; it is a pure CSS transition on two registered custom properties (`--bg`, `--fg`) driven by `components/motion/SectionTheme.tsx`.

### Typefaces

| Role | Font | Notes |
| --- | --- | --- |
| Headings (stand-in for **Perandory**) | Noto Serif Display, narrowest width (`wdth` 62.5), capitals | High-contrast condensed Didone, the closest free match |
| Script (stand-in for the **"Branding"** script) | Monsieur La Doulaise | Same designer as Burgues Script, same copperplate flourishes |
| Text and labels | Jost | Quiet geometric sans |

All three are SIL Open Font License, free for commercial use, and loaded through `next/font/google` (self-hosted at build time). The real Perandory and Burgues Script need paid web licences; see "Switching to the licensed fonts" below.

### Motion

One easing (`expo.out`) is used everywhere. Animations are GSAP (ScrollTrigger, SplitText, Flip, DrawSVG) with Lenis smooth scrolling:

- a once-per-session intro where "Siya" writes itself, then the panel lifts away with a curved edge (click or any key skips it)
- headlines revealed line by line from behind masks; script words "written" with a feathered clip wipe
- the hero lettering parts and the portrait opens as you scroll
- reel cards preview silently on hover (or when mostly in view on phones) and grow into a full-screen player with GSAP Flip
- odometer numbers, a rolling price counter, a rising footer wordmark
- page-to-page crossfade (`/` and `/copyright`) with React `<ViewTransition>`

`prefers-reduced-motion` turns all of it off: no intro, no smooth scroll, no hidden-until-revealed content, instant states.

---

## Editing the site

| What | Where |
| --- | --- |
| All copy, reels, stats, rates, inquiry options | `lib/content.ts` |
| Reel-pack pricing maths (3 for ₹8,000, +₹2,000 each) | `lib/pricing.ts` |
| Colours and type roles | `app/globals.css` |
| Section layouts | `app/sections.css` |
| Legal text | `components/pages/CopyrightPage.tsx` |

The contact form never posts anywhere. It builds a `mailto:` link (subject and cc included) and opens the sender's email app. Choosing a format anywhere on the page (Rates, the hero button, the reel player) updates the form's chips, subject line and a prefilled note.

### Photos and reels

- **Photos** live in `public/siya/photos/` (`siya-7510.jpg` hero, `siya-7512.jpg` About, `siya-7514.jpg` About inset). They were converted from the original HEIC files and all metadata (including GPS) was stripped.
- **Reels** live in `public/siya/reels/` as `featured-01.mp4`, `featured-02.mp4`, `featured-03.mp4` plus a `-poster.jpg` for each (720x1280 H.264, fast-start). To swap one, replace the MP4 and poster under the same name and update its caption in `lib/content.ts`.
- `lib/blur-data.ts` holds the tiny blur placeholders. If you replace a photo, regenerate its entry (12px-wide JPEG, base64).
- Older files in `public/siya/` (`polaroids/`, `hero-*.png`, `siya-portrait.jpg`, the original reels) are no longer used by the site and can be deleted whenever you like.

### Share card, icons, signature

- `lib/og-card.tsx` draws the link-preview card (`/opengraph-image`, `/twitter-image`) from tiny font subsets in `assets/og/`. It stays under 300 KB so WhatsApp shows it.
- `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico` are a burgundy script "S" on buttermilk.
- `lib/signature-paths.ts` is the word "Siya" as outline path data (generated once from Monsieur La Doulaise with `opentype.js`); GSAP DrawSVG animates it.

---

## Switching to the licensed fonts

If you later buy Perandory (web licence from Kulturë Type) and Burgues Script (Sudtipos):

1. Put the `.woff2` files in `app/fonts/` and replace the three `next/font/google` loaders in `app/layout.tsx` with `next/font/local`, keeping the CSS variable names `--font-noto-display` and `--font-monsieur`. Nothing else in the CSS changes.
2. Regenerate `lib/signature-paths.ts` and `app/icon.svg` from the new script font (outline the text with `opentype.js`).
3. Replace the three font files in `assets/og/` with small subsets of the new fonts (they only need "SIYA", "hearts from" and basic Latin for the labels).
4. Perandory is capitals-only, which is already how the site uses the display face.

---

## Development

```bash
npm install
npm run dev      # Next.js 16 (Turbopack) at http://localhost:3000
npm run lint
npm run build    # production build, every route is prerendered static
npm start
```

Requires Node 20+.

Desktop (1440×900) and phone (390×844) captures of the finished pages live in `screenshots/`.

### Deploying on Vercel

Import the repository; the framework is auto-detected. The site's public origin (used for link previews and structured data) comes from, in order: `NEXT_PUBLIC_SITE_URL`, then Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:3000`. If you attach a custom domain, set `NEXT_PUBLIC_SITE_URL` to it (for example `https://www.example.com`).

---

## Project structure

```text
app/
  layout.tsx            fonts, metadata, structured data, boot script, shell
  page.tsx              home: intro, hero, statement, work, numbers, about, rates, contact, footer
  copyright/page.tsx    /copyright
  not-found.tsx         404
  opengraph-image.tsx   link-preview card (twitter-image.tsx reuses it)
  icon.svg, apple-icon.png, favicon.ico
  globals.css           tokens, type roles, base, reveal states, intro
  sections.css          section layouts
components/
  chrome/               SiteShell, SiteHeader, MobileMenu, MediaCursor
  motion/               SmoothScroll, Reveal (text/image/script/fade/line), Intro, Signature,
                        Odometer, SectionTheme
  sections/             Hero, Statement, SelectedWork + ReelGallery + ReelPlayer, Numbers, About,
                        Rates + RatesList, Contact + ContactForm + CopyEmail, Footer
  ui/Heading.tsx        caps + one script word
  pages/CopyrightPage.tsx
lib/
  content.ts            single source of truth for copy and data
  pricing.ts, inquiry.tsx, hooks.ts, gsap.ts, intro.ts, site.ts
  signature-paths.ts, blur-data.ts, og-card.tsx
assets/og/              font subsets and portrait for the share card
public/siya/            photos/, reels/
```

## Accessibility notes

Content waiting to be revealed is only transparent (never `display:none` or `visibility:hidden`), so screen readers can read every section without scrolling. Menus and the reel player trap focus, set the page behind them `inert`, close on Esc, and return focus to where they were opened. Muted text colours are tuned per chapter to keep at least 4.5:1 contrast on all three backgrounds. There is a skip link, visible focus rings, and the form uses native inputs and radio buttons.

## Credits

- Creator: Siya Pawar, `siyapawar@gmail.com`
- Design and development: [Aryan Dani](https://www.aryandani.com)
- Typefaces: Noto Serif Display, Monsieur La Doulaise, Jost (SIL Open Font License)

© 2026 Siya Pawar. All photographs, reels and likeness are the creator's. See [`/copyright`](./components/pages/CopyrightPage.tsx) for usage terms.

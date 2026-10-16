# Siya Pawar (`@heartsfromsiya`) — Creator & Brand Collaborations Portfolio

> **Warm stories people *actually* finish watching.**  
> Official creator portfolio, viral reel showcase, and transparent booking console for **Siya Pawar** ([@heartsfromsiya](https://www.instagram.com/heartsfromsiya/) · [@siyas_dumpyard](https://www.instagram.com/siyas_dumpyard/) · [YouTube](https://www.youtube.com/@heartsfromsiya)).

**Designed & Developed by [Aryan Dani](https://www.aryandani.com)** (`www.aryandani.com`)

---

## ✨ Key Highlights

### 1. Transparent 2026 Creator Rates & Instant Scope Estimator
- **Per Video / Reel**: **`₹3,000`** per video or `/reel` (includes concept, script, shoot, edit, and high-retention ad/brand cut).
- **Monthly Account Management**: **`₹24,000 / month` (`24k`)** — full monthly content strategy, scripting, shooting, editing, and account management (**adjustable according to what you actually require**).
- **Interactive Rate & Scope Configurator**: Brands can toggle between per-reel bundles (`1–8 reels × ₹3,000`) and the `₹24,000/mo` adjustable retainer, then click **Lock Scope & Auto-fill Inquiry** to pre-populate the contact console.

### 2. Smart Inquiry Console (`siyapawar@gmail.com` + Auto-CC & Dynamic Subject)
- **Primary Creator Inbox**: `siyapawar@gmail.com`
- **Automatic CC Routing**: Every inquiry submission and `mailto:` action automatically includes `daniaryan212@gmail.com` in `cc`.
- **Dynamic Subject Autofill**: Selecting any collaboration format (`Single Video / Reel — ₹3,000`, `Monthly Account Management — ₹24,000/mo (Adjustable)`, `Multi-Reel Campaign Bundle`, or `2026 Media Kit`) dynamically updates the email subject line in real time alongside the sender's name/brand.

### 3. Subtle 3D Floating Glass Prism Stage & Luxury Studio Glassmorphism
- **Igloo-Inspired 3D WebGL Stage (`components/motion/IglooWebGLStage.tsx`)**: A custom Three.js scene featuring a sculpted refractive crystal prism and 5 orbiting satellite glass shards illuminated by warm crimson, rose-gold, and champagne lights. Choreographed to scroll progress and pointer parallax while pausing automatically when the tab is hidden.
- **Refractive Glassmorphism System (`app/globals.css`)**: Multi-layered frosted glass cards (`.glass-card`, `.glass-portrait-bezel`, `.glass-pill`, `.glass-dock`, `.glass-input`, `.glass-Popover`) with `backdrop-filter: blur(28px) saturate(165%)`, top/left specular inner rims, and cursor-tracked radial glare (`RefractivePlate`).
- **Kinetic Typography & Custom Cursor**: Zero-layout-shift `ScrambleText` hover decoding and a crisp, blur-free magnetic corner-bracket cursor (`CustomCursor.tsx`).

---

## 🗂️ Project Structure

```text
├── app/
│   ├── globals.css                  # Luxury Studio Glassmorphism CSS tokens & utilities
│   ├── layout.tsx                   # Next.js 16 RootLayout, SEO metadata & Person JSON-LD
│   └── page.tsx                     # Root entry mounting SiyaPortfolioApp
├── components/
│   ├── SiyaPortfolioApp.tsx         # Master shell orchestrating WebGL stage, nav & sections
│   ├── chrome/
│   │   ├── CustomCursor.tsx         # Blur-free magnetic corner-bracket cursor
│   │   └── FloatingNavAndMenu.tsx   # Top glass studio dock & fullscreen smoked-glass menu
│   ├── motion/
│   │   ├── IglooMotionPrimitives.tsx# ScrambleText, RefractivePlate, AmbientGlassBacklight
│   │   ├── IglooWebGLStage.tsx      # Three.js floating crystal prism & satellite shards
│   │   └── SmoothScrollProvider.tsx # Lenis smooth scroll synced with GSAP ScrollTrigger
│   └── sections/
│       ├── HeroSection.tsx          # Asymmetric editorial hero + transparent rate cards
│       ├── WorkSection.tsx          # Interactive 9:16 vertical reel showcase & lightbox
│       ├── ProofSection.tsx         # Verified analytics (10M+ views, 319K likes, PharmEasy, Mokobara)
│       ├── AboutRoomSection.tsx     # Behind-the-scenes portrait & creative philosophy
│       ├── ServicesSection.tsx      # ₹3,000/reel & ₹24,000/mo cards + Instant Rate Estimator
│       └── ContactSection.tsx       # Auto-filled subject console, CC routing & monumental footer
├── lib/
│   ├── content.ts                   # Single source of truth for rates, reels, links & metadata
│   └── hooks.ts                     # Reduced-motion & responsive hooks
└── public/
    └── siya/                        # High-res portraits, favicons & 9:16 reel video/poster assets
```

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the Next.js 16 (Turbopack) development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying on Vercel (Zero-Configuration Ready)

This repository is pre-configured for immediate first deployment on **Vercel**:

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. **Framework Preset**: `Next.js` (auto-detected).
4. **Build Command**: `npm run build` (default).
5. **Output Directory**: `.next` (default).
6. Click **Deploy**.

> **Optional Custom Domain**: Once deployed, add your custom domain in **Vercel → Project Settings → Domains** and update `CONTENT.meta.siteUrl` in `lib/content.ts` if desired.

---

## 📬 Contact & Credits

- **Creator**: Siya Pawar — [siyapawar@gmail.com](mailto:siyapawar@gmail.com?cc=daniaryan212@gmail.com) · [@heartsfromsiya](https://www.instagram.com/heartsfromsiya/)
- **Designed & Developed by**: **[Aryan Dani](https://www.aryandani.com)** (`daniaryan212@gmail.com`)

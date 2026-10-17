# Siya Pawar (`@heartsfromsiya`) — Creator & Brand Collaborations Portfolio

> **Warm stories people *actually* finish watching.**  
> Official creator portfolio, playable vertical reel showcase, and transparent booking console for **Siya Pawar** ([@heartsfromsiya](https://www.instagram.com/heartsfromsiya/) · [@siyasideup](https://www.instagram.com/siyasideup/) · [YouTube](https://m.youtube.com/@heartsfromsiya)).

**Designed & Developed by [Aryan Dani](https://www.aryandani.com)** (`www.aryandani.com`)

---

## ✨ Key Highlights

### 1. Transparent 2026 Creator Rates & Instant Scope Estimator
- **3-Reel Starter**: **`₹8,000`** for 3 custom reels (includes concept, script, shoot, edit, and high-retention ad/brand cut).
- **Multi-Reel Campaign**: **`+₹2,000` per extra reel** beyond the 3-reel starter (`4 reels = ₹10,000`, `5 reels = ₹12,000`, etc.).
- **Monthly Account Management**: **`₹24,000 / month` (`24k`)** — full monthly content strategy, scripting, shooting, editing, and account management (**adjustable according to what you actually require**).
- **Interactive Rate & Scope Configurator**: Brands can toggle between multi-reel packs (`3–8 reels`) and the `₹24,000/mo` adjustable retainer, then click **Lock Scope & Auto-fill Inquiry** to pre-populate the contact console.

### 2. Smart Inquiry Console (`siyapawar@gmail.com` + Dynamic Subject Autofill)
- **Primary Creator Inbox**: `siyapawar@gmail.com`
- **Dynamic Subject & Note Autofill**: Selecting any collaboration format (`3-Reel Starter — ₹8,000`, `Monthly Account Management — ₹24,000/mo (Adjustable)`, `Multi-Reel Pack`, or `2026 Media Kit`) dynamically updates the email subject line and scope brief in real time alongside the sender's name/brand.

### 3. VisionOS-Grade Optical Glassmorphism & Choreographed Motion
- **Obsidian, Champagne-Pearl & Velvet Rose Caustic WebGL Stage (`components/motion/IglooWebGLStage.tsx`)**: A custom Three.js GLSL shader scene sculpting silk-light caustic ribbons that refract through `.glass-card`, `.glass-nav-capsule`, and `.glass-reel-pill` surfaces while maintaining 100% typographic contrast.
- **4-Sided Inset Menu with Live Section Previews (`components/chrome/FloatingNavAndMenu.tsx`)**: Frosted top capsule (`Menu | View Pricing`) and a 4-sided inset menu overlay featuring real section preview cards (`public/siya/previews/preview-*.png`) and `[↗] [GO]` shoulder pills.
- **Disappearing Magnetic Cursor (`components/chrome/CustomCursor.tsx`)**: Smooth GSAP `quickTo` pointer that vanishes into interactive pills, buttons, and menu items while magnetically pulling the target toward the cursor.
- **Dedicated Legal & IP Dossier (`app/copyright/page.tsx`)**: Architectural glassmorphism copyright & licensing dossier covering creator likeness, brand whitelisting, and AI dataset opt-out rules.

---

## 🗂️ Project Structure

```text
├── app/
│   ├── copyright/page.tsx           # Dedicated /copyright legal & licensing route
│   ├── globals.css                  # Optical Studio Glassmorphism CSS tokens & utilities
│   ├── layout.tsx                   # Next.js 16 RootLayout, SEO metadata & Person JSON-LD
│   ├── not-found.tsx                # Custom frosted-glass 404 page
│   ├── page.tsx                     # Root entry mounting SiyaPortfolioApp
│   └── robots.ts                    # Crawler & AI dataset protection rules
├── components/
│   ├── SiyaPortfolioApp.tsx         # Master shell orchestrating WebGL stage, nav & sections
│   ├── chrome/
│   │   ├── CustomCursor.tsx         # Disappearing magnetic cursor
│   │   └── FloatingNavAndMenu.tsx   # Top frosted capsule & 4-sided inset menu with live previews
│   ├── motion/
│   │   ├── IglooMotionPrimitives.tsx# RefractivePlate, AnimatedHairline, AmbientGlassBacklight
│   │   ├── IglooWebGLStage.tsx      # Three.js GLSL caustic ribbon stage
│   │   ├── SmoothScrollProvider.tsx # Lenis smooth scroll synced with GSAP ScrollTrigger
│   │   └── StudioIntroAndTransitions.tsx # Monumental @HEARTSFROMSIYA typing intro & section curtains
│   ├── pages/
│   │   └── CopyrightPage.tsx        # Architectural glassmorphism legal & IP dossier
│   └── sections/
│       ├── HeroSection.tsx          # Editorial hero + double-bezel portrait frame
│       ├── WorkSection.tsx          # Playable 9:16 vertical reel showcase, scrub bar & modal
│       ├── ProofSection.tsx         # Animated analytics (10M+ views, 319K likes, PharmEasy, Mokobara)
│       ├── AboutRoomSection.tsx     # Behind-the-scenes Pune golden-hour gallery
│       ├── ServicesSection.tsx      # ₹8,000/3 reels & ₹24,000/mo cards + Instant Rate Estimator
│       └── ContactSection.tsx       # Auto-filled subject console & kinetic typing footer
├── lib/
│   ├── content.ts                   # Single source of truth for rates, reels, links & metadata
│   ├── hooks.ts                     # Reduced-motion & responsive hooks
│   └── pricing.ts                   # Reel pack pricing calculator (₹8,000 base + ₹2,000/extra)
└── public/
    └── siya/                        # High-res portraits, section previews & 9:16 MP4/poster assets
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

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. **Framework Preset**: `Next.js` (auto-detected).
4. **Build Command**: `npm run build` (default).
5. **Output Directory**: `.next` (default).
6. Click **Deploy**.

---

## 📬 Contact & Credits

- **Creator**: Siya Pawar — `siyapawar@gmail.com` · [@heartsfromsiya](https://www.instagram.com/heartsfromsiya/) · [@siyasideup](https://www.instagram.com/siyasideup/)
- **Designed & Developed by**: **[Aryan Dani](https://www.aryandani.com)** (`www.aryandani.com`)

# BulkBlitz — AI Building Log
> **Last Updated**: 2026-06-14 by Antigravity (Gemini)
> **Next AI**: Read this file fully before making any changes.

---

## 🏗 Project Overview

**BulkBlitz** is India's first crowd-powered manufacturing marketplace.
- Buyers pool together in "batches" to unlock bulk pricing tiers
- Manufacturers list products with tiered pricing (more buyers = lower price)
- Platform takes 4% fee only on successful batches

**Stack**: Next.js 14 (App Router), React, Vanilla CSS (styled-jsx), No Tailwind  
**Location**: `e:/BulkBlitz/apps/web`  
**Dev server**: `npm run dev` inside `e:/BulkBlitz/apps/web` → http://localhost:3000

---

## 📁 Key File Map

```
apps/web/
├── app/
│   ├── layout.js          ← Root layout, Kanit+Inter fonts from Google Fonts
│   ├── page.js            ← Home page (Hero + Batches + Categories + CTA)
│   ├── globals.css        ← Design system (CSS variables, utilities, reset)
│   ├── animations.css     ← Keyframe animations (float, pulseSoft, fadeInUp, shimmer, etc.)
│   ├── batch/[id]/page.js ← Batch detail page
│   ├── orders/page.js     ← Orders page
│   ├── wallet/page.js     ← Wallet page
│   ├── profile/page.js    ← Profile page
│   └── auth/              ← Auth pages
├── components/
│   ├── layout/
│   │   ├── Header.js      ← Top navigation + mobile sidebar drawer
│   │   └── Footer.js      ← 4-column footer
│   ├── home/
│   │   └── HeroSection.js ← Landing hero with stats + steps
│   ├── batch/
│   │   └── BatchCard.js   ← Product batch card with progress bar
│   └── ui/
│       ├── Magnet.js      ← Magnetic hover wrapper (fixed: handleMouseLeave included)
│       ├── ScrollRevealText.js ← Text animation component
│       └── CustomCursor.js    ← Custom cursor
└── lib/
    ├── mock-data.js       ← CATEGORIES, STATS, USER, sample batch data
    └── utils.js           ← formatPrice, getCurrentTier, getSavingsPercent, etc.
```

---

## 🎨 Design System

### Theme
- **Dark mode**: `data-theme="dark"` on `<html>`. Auto-applied based on OS preference in `layout.js`
- **Fonts**: `--font-heading` = Plus Jakarta Sans (Kanit vibes, display), `--font-body` = Inter
- **Primary color**: `#FF6B00` (Orange)
- **Background dark**: `#050505` (Pitch Black)

### Key CSS Variables (all defined in globals.css :root)
```css
--radius-sm through --radius-full  ✅ added in session
--transition-fast through --transition-spring  ✅ added in session
--space-1 through --space-24       ✅
--accent-primary/success/premium/warning/danger  ✅
--bg-primary/surface/elevated/glass  ✅
--text-primary/secondary/tertiary/inverse  ✅
--shadow-sm/md/lg/xl + glow variants  ✅
```

### Chip Active State
Both `.chip--active` and `.chip.active` work (aliased in globals.css).

---

## 🔧 Navigation / Header

**File**: `components/layout/Header.js`

The header was redesigned as a GitHub-style left-sidebar mobile drawer in a previous session. Key implementation details:

- Desktop: horizontal navbar with logo + links + auth buttons
- Mobile: hamburger button → left-sliding drawer (width: 280px)
- The mobile drawer and backdrop are rendered **outside** the `<header>` tag (React Fragment wraps everything) to avoid z-index stacking context issues
- Backdrop: `z-index: 1100`, Drawer: `z-index: 1200`, Header: `z-index: 1000`
- Body scroll is locked (`overflow: hidden`) when mobile menu is open

**Known Working**: Menu opens/closes correctly. Body scroll is locked. Close button, backdrop click, and Escape key all close the menu.

---

## 🏠 Home Page Sessions

### Session 1: Initial Build
- Created `HeroSection.js` with gradient orbs, `ScrollRevealText`, `Magnet` components
- Created `BatchCard.js` with 3D tilt effect, progress bar, tier markers
- Created `page.js` with batch grid, category filter chips, CTA section

### Session 2: Header Redesign
- Fixed `handleMouseLeave` reference error in `Magnet.js`
- Redesigned mobile menu from top-dropdown to GitHub-style left sidebar drawer
- Fixed z-index layering (backdrop was blocking clicks)
- Extracted sidebars/backdrops outside `<header>` tag using React Fragment

### Session 3 (COMPLETED): Premium UI Overhaul
**Goal**: Make the entire UI world-class, polished, award-winning.

**Completed**:
- [x] Rebuilt `globals.css` — restored design variables and added custom radius & transition tokens, `.chip--active` alias
- [x] Redesigned `HeroSection.js` — premium mesh bg, electric gradient headline, icon stats, connected step cards (removed blurry 3D visual orbit scene, simplified character animations, centered all layout elements, resolved horizontal spacing/separator wrapping layout bugs, and implemented premium black-orange styling)
- [x] Redesigned `BatchCard.js` — category-colored image areas, glassmorphic badges, larger tabular price, thick progress bar with markers & pulsing tip, Join button
- [x] Redesigned `page.js` — segmented tab control, category icon tiles, split CTA card (integrated custom orange illustrations for Crowd Mechanics steps extending edge-to-edge in card frames, added orange telemetry gradient backgrounds to all sections, and corrected manufacturer CTA button colors to fit black-orange branding)
- [x] Expanded `Footer.js` — 4-column layout with trust badges and newsletter strip
- [x] Redesigned global navigation layout to look like the Gmail app:
  - Added a top header bar with centered functional Search Bar
  - Added left App Rail (Buyer, Mfg, Help modes) and collapsible wide Navigation Pane
  - Added collapsible labels category lists with colored dot indicators
  - Fixed transparent text bleed-through via solid background backing overlays
- [x] Integrated Suspense boundaries in `Header.js` and `page.js` to avoid static prerender bails
- [x] Enabled global search and category URL query parameter filters on the HomePage
- [x] Verified build compiles successfully using next build (`npm run build`)
- [x] Verified local Next dev server runs active page without errors

### Session 4 (NEXT UP): Interactive Details & Polishing
**Goal**: Implement premium redesign of detail pages and interactive features.

**Pending**:
- [ ] Redesign the Batch Detail Page (`/batch/[id]`) to match the premium homepage aesthetic
- [ ] Set up interactive animations / transitions between pages
- [ ] Connect/simulate real-time WebSocket updates for active slot counts

---

## 📋 If You're Continuing This Session

1. **Verify git status**: Run `git status` to see all premium UI and navigation changes.
2. **Commit changes**: Stage and commit the changes: `git add -A && git commit -m "feat: Gmail-style sidebar navigation overhaul and functional search"`
3. **Check dev server**: Verify that local development server runs correctly on http://localhost:3000 (currently running in background as task-1094).
4. **Redesign `/batch/[id]/page.js`**: Begin Session 4 by upgrading the product batch details layout with the same design system tokens and glassmorphism.

---

## 🐛 Known Issues / Watch Points

1. **styled-jsx scoping**: All component CSS uses `<style jsx>{\`...\`}</style>`. Classes defined here are COMPONENT-SCOPED. Don't define global classes inside styled-jsx unless using `<style jsx global>`.

2. **animations.css keyframes**: The file `app/animations.css` defines these keyframes (used throughout):
   - `float` — slow up-down for orbs
   - `pulseSoft` — subtle scale + opacity pulse (used on live dots)
   - `fadeIn`, `fadeInUp` — entry animations
   - `shimmer` — skeleton loading sweep
   - `urgencyPulse` — red warning pulse
   - `avatarPop` — avatar entry pop
   - `priceDropFlash` — green flash for price drops
   
   The animation CLASSES (`.animate-fade-in`, `.animate-fade-in-up`, etc.) are defined in `animations.css`.

3. **Magnet.js**: Was fixed in Session 2. The `handleMouseLeave` function must remain defined in the component before the `onMouseLeave` JSX prop. Do NOT remove it.

4. **lib/mock-data.js**: CATEGORIES array has `{ id, name, icon, color, count }`. The `color` field is a hex color for each category. STATS has `{ totalBuyers, totalManufacturers, totalSaved, activeBatches }`.

5. **next.config.mjs**: Has `images.domains` configured. Don't break image config.

---

## 🔑 Design Decisions Made (Don't Revert)

- **Dark mode first**: The primary design target is dark mode. Light mode exists but isn't the focus.
- **No Tailwind**: User explicitly chose styled-jsx + CSS variables. Never add Tailwind.
- **Kanit vibes via Plus Jakarta Sans**: User initially requested Kanit but it was already using Plus Jakarta Sans which has a similar feel. The `--font-heading` CSS variable points to this.
- **Glassmorphism elements**: `background: var(--bg-glass)` + `backdrop-filter: blur(20px)` is used for overlaying panels.
- **3D tilt on BatchCard**: The `perspective(1000px) rotateX rotateY` transform on mousemove must be preserved.
- **Magnet effect on hero CTAs**: `<Magnet padding={20}>` wraps both CTA buttons.

---

## 💬 Git Status (as of Session 3 start)

Files modified in this project (from upstream):
- `apps/web/app/globals.css` — rebuilt from scratch
- `apps/web/app/animations.css` — added keyframes  
- `apps/web/app/layout.js` — font imports
- `apps/web/app/page.js` — home page
- `apps/web/components/layout/Header.js` — nav redesign
- `apps/web/components/layout/Footer.js` — footer
- `apps/web/components/home/HeroSection.js` — hero
- `apps/web/components/batch/BatchCard.js` — batch card
- `apps/web/components/ui/Magnet.js` — bugfix
- `apps/web/components/ui/ScrollRevealText.js` — created
- `apps/web/components/ui/CustomCursor.js` — created

**To commit**: `git add -A && git commit -m "feat: premium UI overhaul — world-class design with glassmorphism, animated hero, premium batch cards"`

---

## 🎯 Future Enhancements (not started)

1. **Batch Detail Page** (`/batch/[id]`): Needs premium redesign matching home page aesthetic
2. **Orders Page**: Needs timeline/status visualization
3. **Wallet Page**: Dashboard with transaction history
4. **Manufacturer Dashboard** (`/manufacturer`): Analytics, batch management
5. **Dark/Light Toggle**: Toggle button in header to switch themes
6. **Smooth Page Transitions**: Next.js app-level page transition animations
7. **Real-time Price Updates**: WebSocket connection for live batch slot updates

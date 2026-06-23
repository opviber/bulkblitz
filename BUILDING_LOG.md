# BulkBlitz — AI Building Log
> **Last Updated**: 2026-06-23 by Antigravity (Gemini)
> **Next AI**: Read this file fully before making any changes.

---

## 🏗 Project Overview

**BulkBlitz** is India's first crowd-powered manufacturing marketplace.
- Buyers pool together in "batches" to unlock bulk pricing tiers
- Manufacturers list products with tiered pricing (more buyers = lower price)
- Platform takes 4% fee only on successful batches

**Stack**: Next.js 16 (App Router), React, Tailwind CSS v4, Lucide React, GSAP, Lenis, Supabase, Prisma ORM (PostgreSQL)  
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

### Session 9: Homepage UX & Design Overhaul (COMPLETED)
- Added GST/Escrow Trust Bar below stats bar.
- Replaced emojis with scrollable category glass chips and Lucide icons.
- Implemented live simulated order join ticker and heartbeat progress glows.
- Overhauled manufacturer section (two-tone header, custom top-border cards, brand logo ticker).
- Polished circular footer buttons and newsletter.
- Fixed syntax error in Header.js by removing duplicated trailing code blocks.

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

### Session 4 (Completed)
- Built interactive secondary mock-ups (Orders, Wallet, Auth, Manufacturer Dashboard) and verified Successful Next.js compilation.

### Session 5 (Completed): Foundation & Navigation Overhaul
- Migrated default styling variables to Tailwind CSS v4 `@theme` properties inside `globals.css`.
- Standardized navigation elements (Gmail-style App Rail, collapsible side navigation drawers, custom brand convergent Logo).
- Added global search filters and category-query selectors on the Homepage.
- Wired up Razorpay wallet checkout API routes and notification stubs.

### Session 6 (Completed): Profile & Dashboard Enhancements
- Rebuilt user profile dashboard into a premium Tailwind v4 grid bento layout, adding profile avatars uploads and default address persistence.
- Refactored buyer orders and wallet dashboards with flex-wrap timelines, transparent opacity fixes, and dynamic IFSC bank checks.

### Session 7 (Completed): Manufacturer Dashboard Overhaul
- Developed a dynamic, responsive 5-tab dashboard for manufacturers.
- Linked profile edit forms and client reservation summaries directly to PostgreSQL database.
- Implemented status updates (CONFIRMED -> SHIPPED -> DELIVERED) and dispatch carrier tracking number registration.

### Session 8 (Completed): Marketplace Pages Overhaul
- Migrated remaining marketplace routes from legacy styled-jsx to Tailwind CSS v4 in `/auth`, `/batch/[id]`, `/manufacturer/analytics`, and `/manufacturer/batch/new`.
- Connected the new batch launching wizard directly to the `/api/batches` creation POST handler to store active listings and price schedules in PostgreSQL.

### Merged Backend Branches (Completed)
We merged the core functional backend integration branches:
1. **Phase 1 — E2E Transactional Backend (`feat/phase1-e2e-backend`)**:
   - Integrated real session auth with Supabase Auth (OTP and sessions saved as httpOnly cookie).
   - Added atomic, row-locked slot reservation (`SELECT ... FOR UPDATE`) in `/api/batches/[id]/join` with Razorpay authorization holds.
   - Built the cron closure endpoint `/api/cron/close-batches` and transactional BulkCash wallet backend.
   - Set up Supabase Realtime broadcast channels for live updates (`PRICE_UPDATED`, `SLOT_FILLED`).
2. **Phase 2 — Operator Layer & Dashboard Backend (`feat/phase2-marketplace`)**:
   - Added file uploads to Supabase Storage.
   - Added KYC onboarding backend (GST + Bank verification) for manufacturers.
   - Implemented operator endpoints for admin/manufacturer tracking updates, payouts, and disputes resolution.
3. **Phase 3 & 4 — Growth Features & Mobile Optimization (`feat/phase3-4-design-growth`)**:
   - Wired up real notification adapters for MSG91 WhatsApp and Resend emails.
   - Implemented referral rewards (₹10 BulkCash credited to referrer on referred user's first order).
   - Built the Drop-Alert cron job to notify wishlist watchers when a batch crosses a pricing tier.
   - Implemented mobile bottom navigation tabs and a sticky mobile "Join Batch" CTA bar.
   - Applied WCAG AA contrast adjustments and prefers-color-scheme light-mode fallback.
4. **Phase 5 — Payment Integration & Polish (`feat/phase5-polish`)**:
   - Wired the full Razorpay payment checkout widget client-side flow.
   - Configured global Router error/loading/not-found boundaries.
   - Added dynamic SEO tags on product detail pages and drafted comprehensive deployment documents.
   - Decoupled runtime database dependencies in `middleware.js` to prevent Edge environment runtime compilation crashes.

### Session 11 (Completed): Vercel Production Deployment & Bug Fixing
- **Vercel Hobby Cron Fix**: Resolved Vercel deployment validator crash by adjusting cron schedules in [vercel.json](file:///e:/BulkBlitz/apps/web/vercel.json) to once-per-day (`0 0 * * *` and `0 1 * * *`) as required by Vercel Hobby accounts. Suggested setting up an external trigger (like `cron-job.org` or GitHub Actions) to run at the original minute/5-minute intervals.
- **Vercel Prisma Client Generation Fix**: Configured a `postinstall` script in [package.json](file:///e:/BulkBlitz/apps/web/package.json) to run `prisma generate` upon dependency installation, and moved `@prisma/client` to production dependencies. This ensures the Prisma engines are generated inside the build container before static page generation compiles, preventing the `Cannot find module '.prisma/client/default'` crash.
- **Vercel Root Directory & Preset Resolution**: Staged, committed, and pushed configurations to `main` branch. Informed user to use `apps/web` as the root directory and ensure the Next.js framework preset is active on Vercel to avoid the 404 static page serving issue.

---

## 🐛 Known Issues / Watch Points

1. **Supabase connection**: Real-time Postgres channel updates require valid Supabase project credentials in `.env` variables to receive realtime listener triggers.

2. **IFSC routing check**: Manufacturer bank account settings verify IFSC syntax using `/^[A-Z]{4}0[A-Z0-9]{6}$/` format before letting configurations be saved.

3. **Prisma concurrency**: Parallel transaction bookings utilize a pessimistic row-level lock (`FOR UPDATE`) inside `api/orders/route.js` to prevent double-reservation.

---

## 🔑 Design Decisions Made (Don't Revert)

- **Dark mode first**: The primary design target is dark mode. Pitch black base (`#000000` / `#050505`) with amber-orange highlights.
- **Tailwind CSS v4 Migration**: Migrated all pages and subpages to Tailwind CSS v4 for clean, high-performance styling, completely removing obsolete styled-jsx scoping.
- **Dynamic stepper timeline**: Buyer order page and batch detail page progress indicators scale linearly based on current reservations.
- **Gmail-style collapsible Rail**: Standardized layout drawers to collapse cleanly while triggering auto-resizing transitions across all interior grids and ThreeJS canvas components.

---

## 💬 Git Status (Homepage Overhaul Completed)

All development phases, homepage UX overhauls, and styling migrations are fully implemented and verified. Next.js production build completed with 0 errors. Awaiting user's manual command before committing changes to Git.

---

## 🎯 Future Enhancements (Next Steps)

1. **Production Deployment**: Deploy to production environment via Vercel with database binds.
2. **Real-time Price Engine**: Enhance Redis Pub/Sub backend to broadcast instant reservation tickers.
3. **SMS Alert Service**: Replace WhatsApp/Email log print stubs with live Twilio/SendGrid configurations.

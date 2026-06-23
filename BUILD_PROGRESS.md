# BulkBlitz — Build Progress Log

> **Last Updated**: 2026-06-24T04:05:00+05:30
> **Status**: Steps 1–5 of UX/Design Overhaul Complete. All branches pushed to GitHub.
> **Blueprint**: See `BulkBlitz_Product_Blueprint.docx` / `BulkBlitz_Product_Blueprint.md`

---

## 🏗️ What Is BulkBlitz?

India's first crowd-powered manufacturing marketplace. Buyers pool together in time-limited "batches" to unlock manufacturer bulk pricing in real time. As more buyers join, the price drops through pre-set tiers. Core mechanic: **Dynamic Batch Pricing** with card authorization hold → capture at final price.

**Stack**: Next.js 16 (App Router) · Prisma 7 + Supabase Postgres · Razorpay · Supabase Auth/Realtime/Storage · Tailwind v4 · Framer Motion · GSAP · Three.js · Vitest

**Deployed**: Vercel production (bulkblitz.in)

---

## ✅ Build Phases & Status

### Phase 1: Project Scaffolding & Design System *(Completed before this session)*
| Task | Status | Notes |
|------|--------|-------|
| Initialize Next.js project | ✅ Done | App Router |
| Design system CSS (globals.css + tokens.css) | ✅ Done | Custom properties, reset, base |
| Animation library (animations.css) | ✅ Done | Keyframe animations |
| UI primitives + Layout components | ✅ Done | Header, Footer, BottomTabNav |
| SEO (JsonLd) | ✅ Done | Org + Website schemas, OG tags |

### Phase 2: Core Buyer Pages *(Completed before this session)*
| Task | Status | Notes |
|------|--------|-------|
| Home page — batch discovery feed | ✅ Done | Bento grid + tabs |
| Batch detail — live pricing UI | ✅ Done | Tier progress, countdown, join CTA |
| Auth page — OTP login | ✅ **Rewritten** | Role-aware 3-stage flow (Step 1) |
| Orders/Wallet/Profile pages | ✅ Done | Existing |
| Wishlist, Refer, Help | ✅ Done | Existing stubs |

### Phase 3: Manufacturer Dashboard *(Completed before this session)*
| Task | Status | Notes |
|------|--------|-------|
| Dashboard home | ✅ Done | Existing |
| Create batch wizard | ✅ Done | Existing |
| Analytics page | ✅ Done | Existing |

### Phase 4: Backend Foundation *(Completed before this session)*
| Task | Status | Notes |
|------|--------|-------|
| Prisma schema | ✅ Done | 344 lines, 20 models |
| API routes (37 routes) | ✅ Done | All core CRUD + payments |
| Mock data / seed | ✅ Done | Prisma seed on Supabase |

### Phase 5: Real-Time + Payments *(Completed before this session)*
| Task | Status | Notes |
|------|--------|-------|
| Supabase Realtime | ✅ Done | postgres_changes channels |
| Razorpay integration | ✅ Done | Authorize → capture webhook |
| Notification stubs | ✅ Done | MSG91, Resend, FCM env vars defined |

### Phase 6: Polish & Deploy *(Completed before this session)*
| Task | Status | Notes |
|------|--------|-------|
| Vercel deploy | ✅ Done | Production live, hobby crons adjusted |
| Legal pages | ✅ Done | Privacy, Terms, Refund |

---

## 🆕 THIS SESSION — Steps 1–5 (June 23–24, 2026)

### ✅ Step 1: Role-Based Auth & Seller Hub Dashboard

**Branch**: `feat/role-based-auth-and-dashboards`  
**PR**: https://github.com/opviber/bulkblitz/pull/new/feat/role-based-auth-and-dashboards  
**Files changed**: 16 files, +1421/-416

**What was built**:
| Task | Status | Details |
|------|--------|---------|
| 3-stage auth flow (role → phone → OTP) | ✅ Done | `/auth` with `?intent=seller` and `?next=` params |
| POST /api/auth/upgrade-to-seller | ✅ Done | Existing BUYER can opt in to become seller |
| OTP verify creates Manufacturer shell | ✅ Done | intent="seller" + businessName/city/state on first sign-up |
| Session endpoint returns manufacturer data | ✅ Done | `/api/auth/session` returns `manufacturer` + `isSeller`/`isAdmin` |
| SellerHub sidebar layout | ✅ Done | `SellerShell.js` — full menu (12 sections), collapse-to-icons, mobile drawer |
| Seller layout gates by role | ✅ Done | `/manufacturer/layout.js` redirects non-sellers to `/become-a-seller` |
| `/become-a-seller` page | ✅ Done | Pitch + upgrade form with state selector |
| Header reads real session (no mock data) | ✅ Done | Uses `useSession()` hook, not `USER` constant |
| Mfg rail is role-aware | ✅ Done | Sellers see deep nav; non-sellers see "Become a Seller" upsell |
| Role switcher | ✅ Done | Seller sidebar has "Switch to buyer" pill; buyer header shows "Seller Hub" for sellers |
| Middleware protects `/become-a-seller` | ✅ Done | Added to PROTECTED routes |
| Dual-role (one account, both roles) | ✅ Done | Buyer can opt to sell later; keeps buyer access |
| Utility: `slugifyBusinessName()` | ✅ Done | `/lib/utils.js` |

**Design decisions**:
- One phone = one account. `role` is MANUFACTURER or BUYER. A buyer can "become a seller" which flips role and creates a Manufacturer row.
- `useSession()` is the single source of truth for client-side auth state.
- `SellerShell` is the full chrome for `/manufacturer/*`. The global Header is hidden in that subtree.

---

### ✅ Step 2: Cinematic Hero + Hyperframe Explainer

**Branch**: `feat/hero-and-hyperframe-explainer`  
**PR**: https://github.com/opviber/bulkblitz/pull/new/feat/hero-and-hyperframe-explainer  
**Files changed**: 4 files, +952/-506

**What was built**:
| Task | Status | Details |
|------|--------|---------|
| Kinetic typography headline | ✅ Done | "Bulk up. Price down." slides up word-by-word. "Price down" gets brand gradient. |
| Live demo batch card in hero | ✅ Done | Loops 5 tiers (₹500→₹260) every 2.6s — shimmer edge, fill bar, savings %, tier ticks |
| Session-aware CTAs | ✅ Done | Guest → "Get started" · Buyer → "Browse live batches" · Seller → "Create a batch" |
| Secondary CTA upsell | ✅ Done | Buyer sees "Become a seller"; others see "See how it works" |
| Trust strip under hero | ✅ Done | 3 items: card hold, pay final tier, no fill = no charge |
| 5-scene hyperframe explainer | ✅ Done | Scroll-pinned, 5-viewport-tall. Each scene fills 20% of scroll. |
| Scene illustrations (hand-authored SVG) | ✅ Done | No AI imagery, no stock. Brand-geometric. Scenes: Alone→Crowd→Tier ladder→Cards captured→Boxes ship |
| Scene dots + quick-jump | ✅ Done | Right-side navigation dots with 01/02/03 labels |
| reduced-motion fallback | ✅ Done | Static 2-column grid of all 5 scenes |
| Background replaced | ✅ Done | No 3D cube. Soft asymmetric brand glow + industrial grid pattern |
| `prefers-reduced-motion` | ✅ Done | Hero animations resolve to final state |

**Key files**:
- `components/home/HeroSection.js` — New hero with LiveDemoCard
- `components/home/HyperframeExplainer.js` — Full scroll-pinned explainer
- `components/home/scenes/SceneIllustrations.js` — 5 SVG scenes with 0..1 progress prop

---

### ✅ Step 3: Light Mode (White-Orange Theme)

**Branch**: `feat/ui-polish-and-transitions`  
**Files changed**: Part of 34-file polish commit. See Step 5 for stats.

| Task | Status | Details |
|------|--------|---------|
| Unified theme system | ✅ Done | `data-theme='light'` overrides in globals.css. Removed dead tokens.css import. |
| Light tokens | ✅ Done | `--bg-primary: #F5F5F5`, `--bg-surface: #FFFFFF`, `--text-primary: #121212`, etc. |
| Body cross-fade | ✅ Done | `body { transition: background var(--transition-slow), color var(--transition-slow); }` |
| Header sun/moon toggle writes to `<html>` | ✅ Done | localStorage + `data-theme="dark"` / `data-theme="light"` |
| All hardcoded black backgrounds replaced | ✅ Done | `bg-[#09090b]`, `bg-black`, `text-neutral-400`, `bg-white/5` → theme-aware CSS vars |

---

### ✅ Step 4: Polish & Remove AI-Generic Elements

**Branch**: `feat/ui-polish-and-transitions`  

| Task | Status | Details |
|------|--------|---------|
| Deleted HeroCubeScene.js | ✅ Done | 185 lines — replaced by kinetic hero |
| Deleted ManufacturingOrbitScene.js | ✅ Done | 295 lines — unused |
| Deleted CustomCursor.js | ✅ Done | 138 lines — unnecessary decor |
| Deleted Magnet.js | ✅ Done | 67 lines — replaced by MagneticButton |
| Deleted ScrollRevealText.js | ✅ Done | 89 lines — replaced by StaggerReveal |
| Replaced loading.js | ✅ Done | Logo pulse on brand bg |
| Replaced error.js | ✅ Done | Recovery UI with retry + home |
| Replaced not-found.js | ✅ Done | 404 with gradient brand treatment |
| New MagneticButton | ✅ Done | Pointer-tracking spring, `whileTap` scale-down |
| New StaggerReveal | ✅ Done | Drop-in scroll-trigger stagger |

---

### ✅ Step 5: Page Transitions & Microinteractions

**Branch**: `feat/ui-polish-and-transitions`  

| Task | Status | Details |
|------|--------|---------|
| app/template.js | ✅ Done | Wraps every route in PageTransition |
| PageTransition component | ✅ Done | 420ms slide-up + blur-in. reduced-motion = instant cross-fade |
| TierDropBurst | ✅ Done | Particle burst + banner when batch crosses tier. Wired into batch/[id]/page.js |
| Consistent easing curve | ✅ Done | `cubic-bezier(0.16, 1, 0.3, 1)` used everywhere |
| 15/15 vitest pass | ✅ Done | No regressions |
| Next.js build green | ✅ Done | All 50+ routes compile |

---

## 📊 Net Session Stats (Steps 1–5)

```
34 files changed, 2804 insertions(+), 1723 deletions(-)
```

**6 new files**: SellerShell.js, layout.js, upgrade-to-seller route, become-a-seller page, HyperframeExplainer.js, SceneIllustrations.js, template.js, MagneticButton.js, PageTransition.js, StaggerReveal.js, TierDropBurst.js

**5 deleted files**: HeroCubeScene.js, ManufacturingOrbitScene.js, CustomCursor.js, Magnet.js, ScrollRevealText.js

**17 modified files**: Header.js, auth page.js, session route, OTP send route, OTP verify route, page.js (home), HeroSection.js, validation.js, useSession.js, utils.js, middleware.js, analytics/page.js, batch/new/page.js, manufacturer page.js, batch/[id]/page.js, loading.js, error.js, not-found.js

---

## 🔗 GitHub Branches Summary

| Branch | Content | PR Link |
|--------|---------|---------|
| `feat/role-based-auth-and-dashboards` | Step 1: Role auth + SellerHub | [Create PR](https://github.com/opviber/bulkblitz/pull/new/feat/role-based-auth-and-dashboards) |
| `feat/hero-and-hyperframe-explainer` | Step 2: Hero + hyperframe | [Create PR](https://github.com/opviber/bulkblitz/pull/new/feat/hero-and-hyperframe-explainer) |
| `feat/ui-polish-and-transitions` | Steps 3-5: Light mode, polish, transitions | [Create PR](https://github.com/opviber/bulkblitz/pull/new/feat/ui-polish-and-transitions) |

**Workflow preference**: Feature branches → user reviews and merges each PR. Direct-to-main was considered but branches chosen for reviewability.

---

## 🔴 Remaining Features (Phase 7: Production Features — NOT started)

From the blueprint's gap analysis, here's everything still missing, organized by priority:

### 🔴 Wave 1: Core Trust Gaps (CRITICAL)
| # | Feature | Why |
|---|---------|-----|
| 1 | **Authorize → Capture verification** | Payment core. Verify batch-close → bulk-capture-all-reservations and partial-fill price adjustment end-to-end. |
| 2 | **Real-time price broadcast engine** | Supabase Realtime is wired but no discrete PRICE_UPDATED events. Tier transitions aren't broadcasted. |
| 3 | **BullMQ / per-batch scheduled close** | Currently Vercel cron (daily). Need exact endTime close + retry queue. |
| 4 | **Search — Meilisearch** | `/api/batches/search` exists but no Meilisearch integration (DB LIKE query). |
| 5 | **Pickup point QR auth** | `PickupPoint` model exists, no buyer-side selector, no QR flow. |

### 🟠 Wave 2: Buyer-Side Growth
| # | Feature | Blueprint Reference |
|---|---------|-------------------|
| 6 | **Shareable batch OG card** | Dynamic OG image per batch for WhatsApp share previews |
| 7 | **"Slots left to next drop" live indicator** | Server-pushed delta calc (currently static) |
| 8 | **Avatar stack of recent joiners** | On batch detail page |
| 9 | **EMI option** | Razorpay supports it, not wired |
| 10 | **Multiple quantity per slot** | Schema supports `quantity`, UI defaults to 1 |
| 11 | **Pin-code delivery estimate** | On saved addresses |
| 12 | **Wishlist → notify** | Wishlist exists, no trigger to notify on go-live / tier drop |
| 13 | **Buyer trust score UI** | `trustScore` in schema, no display |
| 14 | **Payment Auth → "refund on cancel" flow** | Auto-cancel needs real refund pipeline |
| 15 | **Partial fill customer communication** | No email/SMS when batch partially fills |

### 🟠 Wave 3: Manufacturer-Side Trust
| # | Feature | Blueprint Reference |
|---|---------|-------------------|
| 16 | **GST API auto-verification** | GSTN API integration (currently manual review) |
| 17 | **Bank penny-drop KYC** | Penny-drop verification (currently stub) |
| 18 | **Tier pricing calculator tool** | "Enter cost → suggest optimal tiers" helper |
| 19 | **Live slot-fill chart** | Analytics page: live chart of joiners over time |
| 20 | **Velocity prediction** | Projected fill at close |
| 21 | **City/pin cluster anonymized buyer list** | For manufacturer dashboard |
| 22 | **Edit window logic** | Allow edits only before 50% fill |
| 23 | **GST-compliant invoice PDF** | Per batch |
| 24 | **Monthly earnings PDF/Excel export** | For manufacturer |

### 🟠 Wave 4: Platform Operations
| # | Feature | Blueprint Reference |
|---|---------|-------------------|
| 25 | **Pickup point partner onboarding** | Kirana store partner flow |
| 26 | **B2B — BulkBlitz for Business** | Corporate accounts, bulk seat purchase, invoice billing |
| 27 | **WhatsApp Business API** | Real integration (currently stub) |
| 28 | **FCM push notifications** | Service worker + token registration exist in env, not wired |
| 29 | **Featured placement bidding** | `featured` boolean on Batch, no bidding system |
| 30 | **Refund guarantee + 5% BulkCash bonus** | On manufacturer ship-failure |
| 31 | **3-strike manufacturer blacklist** | Auto-suspension (field exists, no automation) |
| 32 | **7-day claim window** | Disputes exist, no time-window enforcement |
| 33 | **Audit log writes** | `AuditLog` model exists; verify all admin/payment actions write to it |

### 🟡 Wave 5: Quality / Infra
| # | Feature | Blueprint Reference |
|---|---------|-------------------|
| 34 | **Mobile app (Expo React Native)** | Phase 2, not started |
| 35 | **More tests** | Only 2 test files (15 tests). Need API route + integration tests |
| 36 | **Edge caching** | Vercel Edge Cache / Redis for batch listings |
| 37 | **Rate limiting** | `/lib/ratelimit.js` exists, not wired everywhere |
| 38 | **Sentry / error monitoring** | Not configured |
| 39 | **Sitemap + robots.txt** | Not configured |
| 40 | **Cypress / Playwright E2E** | Not configured |

---

## 📁 Component Tree (After This Session — Source of Truth for Next AI)

```
apps/web/
├── app/
│   ├── layout.js                  # Root: fonts, Toaster, BottomTabNav
│   ├── template.js                # NEW — PageTransition wrapper
│   ├── page.js                    # Home: Hero → Hyperframe → Live batches
│   ├── loading.js                 # REWRITTEN — Logo pulse on brand bg
│   ├── error.js                   # REWRITTEN — Recovery UI with retry
│   ├── not-found.js               # REWRITTEN — 404 with gradient
│   ├── globals.css                # MODIFIED — Unified theme system, light mode
│   ├── animations.css             # Unchanged
│   ├── tokens.css                 # Still exists (legacy refs) — no longer imported
│   ├── auth/page.js               # REWRITTEN — 3-stage role-aware flow
│   ├── become-a-seller/page.js    # NEW — Seller upgrade form
│   ├── batch/[id]/page.js         # MODIFIED — Wired TierDropBurst
│   ├── manufacturer/
│   │   ├── layout.js              # NEW — Role gate + SellerShell
│   │   ├── page.js                # Dashboard (Header/Footer stripped)
│   │   ├── analytics/page.js      # (Header/Footer stripped)
│   │   ├── batch/new/page.js      # Create batch wizard
│   │   └── onboarding/page.js     # KYC form
│   ├── orders/page.js             # Existing
│   ├── wallet/page.js             # Existing
│   ├── profile/page.js            # Existing
│   ├── refer/page.js              # Existing stub
│   ├── wishlist/page.js           # Existing stub
│   ├── help/page.js               # Existing
│   ├── how-it-works/page.js       # Existing
│   └── api/                       # 37 API routes unchanged
├── components/
│   ├── home/
│   │   ├── HeroSection.js         # REWRITTEN — Kinetic + live demo card
│   │   ├── HyperframeExplainer.js # NEW — 5-scene scroll explainer
│   │   └── scenes/
│   │       └── SceneIllustrations.js  # NEW — 5 SVG scenes
│   ├── batch/
│   │   ├── BatchCard.js           # Existing (unchanged)
│   │   └── LiveTimer.js           # Existing
│   ├── layout/
│   │   ├── Header.js              # MODIFIED — Session-aware, mfg gate
│   │   ├── Footer.js              # Unchanged
│   │   └── BottomTabNav.js        # Unchanged
│   ├── manufacturer/
│   │   └── SellerShell.js         # NEW — Full seller sidebar
│   ├── ui/
│   │   ├── Logo.js                # Kept
│   │   ├── MagneticButton.js      # NEW — Pointer-track spring CTA
│   │   ├── PageTransition.js      # NEW — Route animation wrapper
│   │   ├── StaggerReveal.js       # NEW — Scroll stagger
│   │   └── TierDropBurst.js       # NEW — Confetti on tier drop
│   ├── admin/AdminGuard.js        # Existing
│   └── seo/JsonLd.js              # Existing
├── lib/
│   ├── auth.js                    # MODIFIED — getSessionManufacturer
│   ├── useSession.js              # REWRITTEN — isSeller, isAdmin, refresh, logout
│   ├── utils.js                   # MODIFIED — slugifyBusinessName added
│   ├── validation.js              # MODIFIED — intent, upgradeToSeller schemas
│   ├── prisma.js / pricing.js / wallet.js / ... # Unchanged
│   └── mock-data.js               # Unchanged
└── middleware.js                   # MODIFIED — protects /become-a-seller
```

---

## 🧠 Key Context for Next AI

### The `useSession()` hook (client)
```js
const { user, manufacturer, loading, isAuthed, isSeller, isAdmin, refresh, logout } = useSession();
```
- `user` — `{ id, name, phone, role, walletBalance, referralCode, trustScore, isSeller, isAdmin }`
- `manufacturer` — `{ id, slug, businessName, city, state }` or null

### The auth API
- `POST /api/auth/otp/send` — body: `{ phone, intent?: "buyer"|"seller" }`
- `POST /api/auth/otp/verify` — body: `{ phone, token, name?, referralCode?, intent?, businessName?, city?, state? }`
- `POST /api/auth/upgrade-to-seller` — body: `{ businessName, city, state }`
- `GET /api/auth/session` — returns `{ user, manufacturer }`

### Auth middleware
- PROTECTED routes: `/orders`, `/wallet`, `/profile`, `/manufacturer`, `/admin`, `/refer`, `/wishlist`, `/become-a-seller`
- In dev (NODE_ENV !== "production"), middleware is bypassed. Session is resolved from sandbox token or first BUYER user in DB.
- OTP 123456 in sandbox mode.
- DEV_FALLBACK_USER env var can point to a specific seeded user.

### Theme system
- `<html data-theme="dark">` is default. `data-theme="light"` flips all --bg-* and --text-* tokens.
- Toggle: Header sun/moon writes to localStorage + sets attribute.
- Dark: `--bg-primary: #080808`, `--text-primary: #FAFAFA`
- Light: `--bg-primary: #F5F5F5`, `--text-primary: #121212`
- NEVER use hardcoded colors for surface/text/background — always use `var(--bg-surface)`, `var(--text-primary)`, etc.

### Transition system
- `app/template.js` wraps every route in PageTransition (420ms slide-up + blur-in).
- All custom transitions use `cubic-bezier(0.16, 1, 0.3, 1)` easing.
- StaggerReveal is the drop-in replacement for manual IntersectionObserver.

### Key files NOT to touch unless directly improving them
- `lib/pricing.js`, `lib/razorpay.js`, `lib/prisma.js`, `lib/supabase.js`, `lib/ratelimit.js`
- `lib/mock-data.js` — still provides `STATS` and `CATEGORIES` to home page
- All API routes in `app/api/` — stable

### Tests
- 2 test files: `lib/pricing.test.js` (6 tests), `lib/utils.test.js` (9 tests) — 15 total
- Run: `npm test`
- Vitest is configured. No CI integration.

---

## 💡 Suggested Build Order for Next AI

Focus on **Wave 1: Core Trust** before anything else:

1. **Authorize→Capture E2E verification** — batch-close route already exists at `/api/batches/[id]/close/route.js`. Write an E2E test or manual checklist:
   - Create batch with tiers → buyers join (Razorpay Auth) → batch closes → all authorisations captured at final tier
   - Partial fill: verify price adjusts correctly
   - Batch cancel: verify all authorisations voided
   - This is the MONEY MECHANIC. Everything depends on it.

2. **Real-time price broadcast** — Supabase Realtime is wired for postgres_changes but blueprint specifies discrete `PRICE_UPDATED` events from join route. Verify `lib/realtime.js` broadcasts on tier crossing.

3. **Per-batch scheduled close** — Replace Vercel daily cron with BullMQ or at least a per-batch timer. Currently `/api/cron/close-batches/route.js` runs daily only.

4. **Meilisearch** — Search route exists; wire Meilisearch for fast fuzzy search.

Then move to Wave 2 (share cards, avatar stacks, notifications) and Wave 3 (GST verify, penny drop, tier calculator).

---

## 🐛 Known Issues / Tech Debt

1. **Old tokens.css still exists** but no longer imported in layout.js. Safe to delete once all components migrate to `var(--bg-*)` tokens (most already do).
2. **`three.js`, `@react-three/fiber`, `@react-three/drei`** are still in package.json deps. The scenes are deleted; these deps are unused but harmless. Can `npm uninstall` them.
3. **Dev-only middleware bypass** — in dev mode, auth is not enforced by middleware. The DEV_FALLBACK_USER path picks the first BUYER in the DB. This means local dev without Supabase works but no auth enforcement. Prod is fine.
4. **No Sentry / error monitoring** — errors silently fail in production.
5. **No robots.txt / sitemap** — not configured for SEO.
6. **Mock data still powers home page** — `STATS` and `CATEGORIES` come from `lib/mock-data.js`. Should eventually come from the DB.
7. **Pin `react` and `react-dom` versions** — currently on `19.2.4` (canary/experimental). Works fine but worth noting for stability.

---

## 📝 Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-23–24 | **BulkBlitz Builder (Gumloop AI)** | Steps 1–5 complete: Role-based auth + Seller Hub (Step 1) · Kinetic hero + hyperframe explainer (Step 2) · Light mode theme (Step 3) · Polish & remove AI-generic elements (Step 4) · Page transitions & microinteractions (Step 5). 34 files changed, +2804/-1723. Branches pushed to GitHub as `feat/role-based-auth-and-dashboards`, `feat/hero-and-hyperframe-explainer`, `feat/ui-polish-and-transitions`. |
| 2026-06-23 | Antigravity (Gemini) | Vercel Deployment & Bug Fixing |
| 2026-06-23 | Antigravity (Gemini) | Phase 5 Polish: Razorpay, legal pages, error boundaries, SEO |
| 2026-06-23 | Antigravity (Gemini) | Phase 3 & 4 Growth: notifications, referral, crons, mobile nav |
| 2026-06-23 | Antigravity (Gemini) | Phase 2 Marketplace: admin, manufacturer KYC, onboarding, disputes |
| 2026-06-23 | Antigravity (Gemini) | Phase 1: real auth, batch joins, payments, cron, realtime |
| 2026-06-13 | Antigravity (Gemini) | Initial project setup with core pages, premium design system, social logins |
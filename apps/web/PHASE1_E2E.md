# Phase 1 — "Make it real" (end-to-end backend)

This change set replaces the mocked core with a real, transactional backend while
keeping local development working without external accounts.

## What's new

### Security / Auth
- **Real session auth** (`lib/auth.js`) using Supabase Auth (phone OTP + social).
  Session is an httpOnly cookie (`bb-access-token`), verified on every request.
- **Removed the spoofable `x-user-id` trust** from `lib/prisma.js`
  (`getScopedUser`/`getScopedManufacturer` now delegate to the verified session).
- **`middleware.js`** protects `/orders`, `/wallet`, `/profile`, `/manufacturer/*`,
  `/admin/*`, `/refer`, `/wishlist` (enforced in production).
- Auth routes: `POST /api/auth/otp/send`, `POST /api/auth/otp/verify`,
  `GET/DELETE /api/auth/session`, `POST /api/auth/callback` (+ `/auth/callback` page).
- The login page now calls the real endpoints (6-digit OTP) instead of `setTimeout`.

### Pricing & batch lifecycle
- **`lib/pricing.js`** — single source of truth for tier resolution + close outcome.
- **`POST /api/batches/[id]/join`** — atomic, **row-locked** slot reservation
  (`SELECT … FOR UPDATE`), tier-accurate pricing, idempotency key, creates a
  Razorpay authorization hold, broadcasts live updates.
- **`POST /api/batches/[id]/cancel-reservation`** — releases slots while LIVE.
- **`POST /api/batches/[id]/close`** — locks final tier; captures payments and
  creates orders if MOQ met, otherwise cancels + refunds. Bearer-protected (`CRON_SECRET`).
- **`GET /api/cron/close-batches`** + `vercel.json` cron (every minute) closes due batches.

### Payments (Razorpay authorize → capture → refund)
- **`lib/razorpay.js`** — real SDK integration with a sandbox stub when keys are absent.
- **`POST /api/payments/webhook`** — signature-verified, idempotent reconciliation.
- **`POST /api/payments/refund`** — admin-only.

### Realtime
- **`lib/realtime.js`** broadcasts `PRICE_UPDATED` / `SLOT_FILLED` / `BATCH_CLOSED`
  on per-batch Supabase channels (best-effort; never blocks the transaction).

### Marketplace endpoints (Phase 2 head-start)
- `GET /api/batches/search` (query/category/city/sort, paginated)
- `GET/POST /api/reviews` (delivered-order-gated, recomputes manufacturer rating)
- `GET/POST /api/wishlist` (toggle watch)
- `GET /api/referrals` (code, share URL, stats); referral rows created on signup

### Infra / hardening
- **Zod validation** on all new routes (`lib/validation.js`).
- **Rate limiting** (`lib/ratelimit.js`) — Upstash when configured, in-memory fallback.
- **Transactional BulkCash wallet** (`lib/wallet.js`, idempotent credit/debit).
- **Unified notifications** `dispatchNotification()` persists + routes to provider stubs.
- **sonner** toasts mounted globally; reduced-motion + light-mode tokens in `globals.css`.
- New schema models + migration: `Referral`, `Dispute`, `Notification`, `Wishlist`,
  `PickupPoint`, `Payout`, `ManufacturerKyc`, `AuditLog`, plus `slug`, `finalPrice`,
  `closedAt`, `pricePerUnit`, `holdAmount`, idempotency keys, `PENDING_APPROVAL`.

## Configure to go live
Copy `.env.example` → `.env` and fill: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_*`, `CRON_SECRET`.
Then:

```bash
npx prisma migrate deploy   # apply prisma/migrations
npm run db:seed             # optional sample data
npm run dev
```

Without Supabase/Razorpay keys, dev mode uses sandbox shortcuts (OTP `123456`,
fake payment holds) so flows remain testable.

## Still mocked / pending (next phases)
GST/penny-drop KYC, real WhatsApp/FCM/email providers, Shiprocket tracking,
image uploads, admin UI pages, disputes UI, B2B, full light-mode + a11y pass,
and dropping/lazy-loading the Three.js hero for low-end devices.

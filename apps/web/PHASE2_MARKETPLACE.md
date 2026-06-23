# Phase 2 — Marketplace completeness

Builds on Phase 1. Adds the operator layer, manufacturer onboarding, order
fulfilment, disputes, uploads, and public discovery surfaces.

## New API routes
- `POST /api/uploads` — signed Supabase Storage upload URL (sandbox stub fallback)
- `GET/PUT /api/orders/[id]` — order detail (owner/manufacturer/admin scoped) +
  manufacturer/admin tracking update (sets SHIPPED, notifies buyer)
- `GET/POST /api/manufacturer/onboarding` — GST + bank KYC submission/status
- `GET /api/manufacturer/payouts` — payout history + summary
- `GET/POST /api/disputes`, `PUT /api/disputes/[id]` — claims + admin mediation
  (RESOLVED + refund triggers Razorpay refund and 5% BulkCash goodwill bonus)
- `GET /api/manufacturers/[slug]` — public profile (GSTIN withheld), batches, reviews
- Admin: `GET /api/admin/stats`, `GET/PUT /api/admin/batches`,
  `GET/PUT /api/admin/manufacturers`, `GET /api/admin/disputes`
  (all ADMIN-gated; mutations write `AuditLog` rows)

## New pages
- `/admin`, `/admin/batches`, `/admin/manufacturers`, `/admin/disputes`
  (client `AdminGuard` + role check; middleware also gates `/admin/*` in prod)
- `/manufacturer/onboarding` — KYC wizard
- `/manufacturer/[slug]` — public profile (verified badge, ratings, batches)
- `/orders/[id]` — status timeline, tracking, raise-dispute flow
- `/refer` — referral code, share link, BulkCash stats
- `/wishlist` — watched batches

## Workflow now wired end-to-end
1. Manufacturer submits KYC → admin verifies → batch created (PENDING_APPROVAL)
2. Admin approves batch → goes LIVE → buyers join (atomic, Phase 1)
3. Cron closes batch → orders created → manufacturer adds tracking → buyer sees it
4. Buyer can dispute → admin mediates → refund + goodwill bonus

## Still pending (Phase 3/4)
Real GST/penny-drop verification, WhatsApp/FCM/email providers, Shiprocket live
tracking, drop-alert cron for wishlist, full light-mode + a11y pass, and
dropping/lazy-loading the Three.js hero. Manufacturer batch-create wizard should
post status PENDING_APPROVAL and use `/api/uploads` for images.

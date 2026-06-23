# BulkBlitz — Deployment Guide

## Prerequisites
- Node.js 20+ (22 preferred for Prisma 7)
- A Supabase project (free tier works for MVP)
- A Razorpay account (test mode to start)
- A Vercel account for hosting

---

## Step 1 — Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. In **Storage → Buckets** create a bucket named `batch-images` (public)
3. In **Authentication → Providers** enable **Phone** (Twilio or built-in OTP)
4. Enable **Realtime** for broadcasts (no table-level setup needed for broadcast channels)

Copy from Project Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

---

## Step 2 — Razorpay setup

1. Create an account at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys → Generate test key
3. In Settings → Webhooks, add `https://yourdomain.com/api/payments/webhook`
   - Events to subscribe: `payment.authorized`, `payment.captured`, `refund.processed`
4. Copy the webhook secret

```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

---

## Step 3 — Environment variables

Copy `.env.example` → `.env` and fill all values:

```bash
cp apps/web/.env.example apps/web/.env
```

Minimum required to go live:
```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
CRON_SECRET              # random string, min 32 chars
NEXT_PUBLIC_BASE_URL     # https://yourdomain.com
```

Optional (features degrade to console stubs without them):
```
MSG91_AUTH_KEY           # WhatsApp notifications
MSG91_TEMPLATE_ID
RESEND_API_KEY           # Email notifications
RESEND_FROM
FCM_SERVER_KEY           # Push notifications
UPSTASH_REDIS_REST_URL   # Rate limiting
UPSTASH_REDIS_REST_TOKEN
SUPABASE_STORAGE_BUCKET  # defaults to "batch-images"
```

---

## Step 4 — Database

```bash
cd apps/web

# Apply migrations (creates all tables + enums)
npx prisma migrate deploy

# Seed sample data (creates admin@bulkblitz.in + demo buyer + manufacturer)
npm run db:seed
```

> **Admin account from seed:** phone `9000000000`, email `admin@bulkblitz.in`
> Set this user's role to ADMIN in the DB (it's already ADMIN in the seed).

---

## Step 5 — Deploy to Vercel

```bash
# From repo root
npx vercel --prod
```

Vercel auto-detects Next.js. Set all env vars in the Vercel dashboard (Settings → Environment Variables).

The `vercel.json` crons activate automatically on Vercel:
- `GET /api/cron/close-batches` — every minute (closes expired batches)
- `GET /api/cron/drop-alerts` — every 5 minutes (wishlist notifications)

Both require the `Authorization: Bearer $CRON_SECRET` header, which Vercel sends automatically.

---

## Step 6 — First-time admin tasks

1. Log in with the admin phone `9000000000` (OTP `123456` in dev, real SMS in prod)
2. Go to `/admin` to see the dashboard
3. The demo manufacturer's KYC shows as PENDING → go to `/admin/manufacturers` → Verify KYC
4. The demo batch is in `PENDING_APPROVAL` → go to `/admin/batches` → Approve

---

## Local development

```bash
cd apps/web
npm install
cp .env.example .env   # fill at minimum DATABASE_URL + Supabase keys
npx prisma migrate deploy
npm run db:seed
npm run dev
# → http://localhost:3000
```

Without Supabase/Razorpay keys, the app runs in sandbox mode:
- OTP verification uses code `123456`
- Payment flow skips Razorpay checkout and immediately confirms
- Image uploads return stub data URLs
- Notifications log to the server console

---

## Architecture at a glance

```
Browser → Next.js (Vercel)
           ├── App Router pages (SSR + static)
           ├── API routes (/api/*)
           │    ├── Auth: Supabase Auth (session cookie)
           │    ├── Payments: Razorpay authorize→capture
           │    └── Crons: batch-close + drop-alerts
           ├── Supabase Postgres (via Prisma 7 + pg adapter)
           ├── Supabase Realtime (broadcast channels per batch)
           └── Supabase Storage (batch images)
```

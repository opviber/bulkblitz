





BULKBLITZ
bulk up. price down.
India's First Dynamic Group-Buy Manufacturing Platform


Full Product Blueprint & Feature Specification
June 2026  ·  Confidential









01. THE BIG IDEA
BulkBlitz is India's first crowd-powered manufacturing marketplace. It connects everyday buyers directly to manufacturers, letting them pool together to unlock bulk pricing — in real time — without any single person needing to commit to a full order.

The core mechanic is simple and powerful:
A manufacturer lists a product with a tiered price schedule: ₹20 for 1 unit, ₹15 for 50 units, ₹12 for 100 units, ₹10 for 200 units.
Buyers join the batch. As more people join, the price displayed to everyone drops dynamically in real time.
When the batch window closes, every buyer pays the final price tier reached — not what they agreed to at entry.
If the batch only partially fills, the price adjusts to the tier that was actually reached. Nobody is stuck. Manufacturer ships the quantity bought. Platform takes a flat fee. Zero liability for anyone.

Why This Is Structurally Different From Groupon
Groupon forced merchants to discount from their own thin retail margins — and then took 50% of the discounted revenue. Every deal destroyed value for the merchant.
BulkBlitz unlocks discounts that already exist in every manufacturer's cost structure. Volume pricing is real. We just make it publicly accessible.
The manufacturer wins at every fill level. The buyer pays less as the crowd grows. The platform charges a clean fee with zero exposure.


02. THE NAME: BULKBLITZ
BulkBlitz was chosen deliberately across three dimensions:

BULK
The core mechanic — crowd-powered volume buying. Immediately communicates what the platform does. Also has resonance with the Indian concept of wholesale culture (mandi, thok bazar).
BLITZ
Speed and urgency. Batches are time-limited. Price is falling. Act now. The word has energy, aggression, and a gaming connotation that resonates with India's young digital consumer.

Tagline: "bulk up. price down."
Clean, rhythmic, reversible — it tells the whole story in four words. Works in English across all metros and Tier 2 cities.

Alternative taglines considered:
"The more we buy, the less we pay."
"Manufacturing prices. For everyone."
"Squad up. Save big."


03. THE CORE MECHANIC
3.1 Dynamic Batch Pricing
Every product listing on BulkBlitz is a Batch — a time-limited, crowd-filled order window. Each batch has a Tier Schedule set by the manufacturer:

Slots Filled
Price Per Unit
Savings vs MRP
Status
1 – 49
₹20
0%
Open
50 – 99
₹15
25%
Price drops live
100 – 149
₹12
40%
Price drops live
150 – 199
₹11
45%
Price drops live
200+
₹10
50%
Final tier

When a new buyer joins and the batch crosses a tier threshold, every buyer in the batch sees their price drop. No one pays more than the final closing price.

3.2 Batch Lifecycle
Manufacturer creates a batch listing with tier schedule, min order qty (MOQ), batch window duration, and shipping policy.
Platform approves and publishes the batch. Timer starts.
Buyers join and reserve slots. Card authorized, not charged.
As slots fill, price tiers update in real time for all participants.
Batch closes at deadline. Final tier price is locked.
Cards charged at final price. Manufacturer receives order with full slot count.
Manufacturer ships. Tracking pushed to all buyers.

3.3 Partial Fill Handling
This is the key structural protection that Groupon never had:

Partial Fill Rule
If a batch closes without reaching a higher tier, buyers simply pay the tier that was reached.
Example: Batch target was 200 units (₹10). Only 87 joined. Closing price = ₹15 (50–99 tier).
Manufacturer agreed to ship at any qty above their MOQ. They ship 87 units at ₹15. Everyone wins.
If the batch closes below the minimum tier (MOQ not met), the batch cancels. Zero charges. No liability.

3.4 The Viral Loop
▶  Buyer joins at ₹20 → sees that 40 more people will drop the price to ₹15
▶  Buyer shares the batch link to WhatsApp/Instagram to pull the price down for themselves
▶  Every sharer is incentivized — they are literally marketing to save their own money
▶  Batch fills faster → price drops → more organic shares → platform grows for free


04. FULL FEATURE SPECIFICATION
4.1 Buyer-Side Features
Batch Discovery & Browsing
Home feed: Live batches sorted by price-drop momentum (fastest filling = top)
Category filters: FMCG, Electronics, Apparel, Home, Agri, Personal Care
City/pin-code filter: Show batches with delivery to my location
Tier progress bar: Visual fill meter showing how many slots until next price drop
Countdown timer: Real-time clock showing hours/minutes until batch closes
'Slots left to next drop' indicator: e.g., '12 more buyers = ₹2 cheaper per unit'
Trending Batches: Batches with highest slot-fill velocity in last 1 hour
Ending Soon: Batches closing within 6 hours
New Batches: Just launched in last 24 hours

Batch Detail Page
Full tier price ladder displayed visually (like a progress bar + table)
Live buyer count with avatar stack of recent joiners
Manufacturer profile: verified badge, city, years in business, past batch ratings
Product images, specs, material/quality certifications
Estimated delivery window by pin code
Shipping method: direct-to-buyer or pickup point
Review section from previous batches of the same manufacturer
'How this works' explainer accordion for new users

Joining & Payment
One-tap slot reservation (UPI, card, or BulkBlitz wallet)
Card hold (authorization, not charge) until batch closes
Choose quantity: buy 1 slot, or multiple slots (e.g., buy 5 units for family)
'Lock my price' confirmation screen showing current tier and best-case tier
Auto-refund if batch cancels (MOQ not met) — within 24 hours
EMI option for high-value batches (integrated with Razorpay/Cashfree)

Sharing & Referral
One-tap WhatsApp share of batch link with dynamic price preview image
Shareable batch card auto-generates: product image + current price + countdown
Referral tracker: 'You brought 3 friends. Price dropped ₹2 because of you.'
Referral reward: If referred person joins, referrer gets ₹10 BulkCash (platform wallet)
Copy batch link / Instagram story template

Order Tracking
Real-time order status: Batch open → Batch closed → Order confirmed → Shipped → Delivered
Delhivery/Shiprocket AWB number with live tracking embedded in app
SMS + WhatsApp notifications at each stage
Pickup point QR code if buyer chose pickup option

Buyer Profile & Wallet
Order history with all past batches
BulkCash wallet: earned from referrals, can be used on future batches
Saved addresses with pin-code-level delivery estimate
Wishlist: 'Watch this batch' — notified when it goes live or drops a tier
Buyer trust score: built from on-time payments, no-cancellation history

4.2 Manufacturer-Side Features
Onboarding & Verification
GST registration verification (auto-validated against GST API)
Bank account KYC via penny drop
Business category selection and product catalog setup
Tier pricing calculator tool: enter cost structure, platform suggests optimal tiers
First batch free (no listing fee) to reduce onboarding friction

Batch Creation
Batch creation wizard: step-by-step with inline help text
Product title, description, images (up to 10 photos)
Tier schedule builder: drag-and-drop qty breakpoints and prices
MOQ setting: minimum quantity below which batch auto-cancels
Batch duration: 24h, 48h, 72h, or custom
Fulfillment type: direct shipping, bulk handover to 3PL, or pickup points
Geographic targeting: restrict batch to specific states or pin codes
Preview mode: see how the batch looks to buyers before going live

Batch Management Dashboard
Real-time slot fill tracker: live chart of joiners over time
Price tier progress: how close to next tier, velocity prediction
Buyer list: anonymized count by city / pin cluster
Revenue calculator: shows projected payout at current fill vs best-case fill
Edit window: minor edits allowed before batch hits 50% fill
Pause/cancel batch with reason (refunds auto-triggered to all buyers)

Payouts & Financials
Payout 3 business days after batch confirms (not 60 days like Groupon)
Platform fee auto-deducted: 4% of total batch revenue
Tax-ready invoices auto-generated per batch (GST-compliant)
Monthly earnings summary exportable as PDF/Excel
Dispute resolution portal: raise and track issues with specific orders

Analytics & Growth
Batch performance history: fill rate, avg buyer price, city breakdown
Repeat buyer rate: how many buyers joined a second batch from this manufacturer
Category benchmarking: how this batch performed vs category average
Recommended tier structures based on past batch data

4.3 Platform-Level Features
Trust & Safety
Manufacturer verification: GST, FSSAI (food), BIS (electronics) badge system
Product quality guarantee: buyer can raise a 'Not as described' claim within 7 days of delivery
Dispute mediation: platform reviews evidence from both sides, decision within 5 business days
Refund guarantee: if manufacturer fails to ship, full refund + 5% BulkCash bonus
Buyer rating of manufacturer after delivery (1–5 stars + written review)
Manufacturer blacklist: 3 unresolved disputes = account suspension pending review

Pickup Point Network
Partner with local kirana stores, courier franchises, and co-working spaces as pickup points
Pickup point owner gets ₹2/parcel handled (incentivized network)
Buyer selects nearest pickup point at checkout
QR-code-based pickup authentication (no signature needed)
Unclaimed parcels held for 5 days then returned to manufacturer

BulkBlitz for Business (B2B Layer)
Corporate accounts: HR managers can share batch links as employee perks
Bulk seat purchase: company buys 50 slots of a batch for employee distribution
Invoice billing for corporates (not UPI — proper B2B payment terms)
Dedicated account manager for companies with >100 employees

Notifications Engine
WhatsApp Business API: batch updates, price drops, order status
Push notifications: slot fill milestones, 'Only 20 slots to next price drop'
Email digest: weekly 'Best Batches Near You' for opted-in users
SMS fallback for users without smartphones (Tier 2/3 coverage)


05. REVENUE MODEL
BulkBlitz has four clean revenue streams, none of which depend on taking a cut from merchant margins:

Revenue Stream
Rate / Fee
Charged To
When
Transaction Fee
4% of batch GMV
Manufacturer
On batch close
Batch Listing Fee
₹999 per batch (after 1st free)
Manufacturer
On batch creation
Featured Placement
₹2,000–10,000
Manufacturer
Bid-based / weekly
BulkCash Wallet Top-Up
Platform earns float
Buyers
Ongoing

Unit Economics Example
Sample Batch — Premium Pulses Manufacturer, Nagpur
Product: Chana Dal 1kg pack  |  Tiers: ₹80 (1–49) → ₹65 (50–99) → ₹55 (100–199) → ₹48 (200+)
Batch closes at 140 slots. Final price = ₹55. Total GMV = 140 × ₹55 = ₹7,700
Platform fee (4%) = ₹308. Listing fee = ₹999. Total platform revenue = ₹1,307
Manufacturer receives: ₹7,700 – ₹308 = ₹7,392 — for an order they'd have never gotten otherwise.
Buyer paid ₹55 vs ₹80 retail. Saved 31%. Never had to commit to 140 units alone.


06. TECHNOLOGY STACK
6.1 Architecture Overview
BulkBlitz is built as a real-time, event-driven platform. The core requirement is that price changes propagate instantly to all active batch viewers simultaneously — this demands WebSocket infrastructure, not traditional REST polling.

Layer
Technology
Why
Frontend Web
Next.js 14 (App Router)
SSR for SEO, fast hydration
Mobile App
Expo React Native
Single codebase, Android-first for India
Backend API
Node.js + Fastify
High throughput, WebSocket-native
Real-time Engine
Socket.io + Redis Pub/Sub
Batch price broadcasts to all viewers
Database
PostgreSQL + Prisma ORM
Relational integrity for orders/batches
Cache Layer
Redis
Live slot counts, session, rate limiting
Payments
Razorpay
UPI, cards, EMI, all Indian methods
File Storage
AWS S3 + CloudFront CDN
Product images, batch assets
Notifications
WhatsApp Business API + FCM
Primary comms channel
Search
Meilisearch
Fast fuzzy product/batch search
Background Jobs
BullMQ
Batch close jobs, payout triggers
Hosting
Railway.app / Render
Cost-effective for MVP phase

6.2 The Real-Time Pricing Engine
The most technically critical component. When slot N is filled and crosses a tier threshold:
BullMQ job checks new slot count against tier schedule.
If threshold crossed: emit 'PRICE_UPDATED' event via Redis Pub/Sub.
All connected WebSocket clients receive live price update.
Frontend batch progress bar and price display update without page reload.
Push notification dispatched: 'Price just dropped! Now ₹15 per unit.'

6.3 Payment Hold Architecture
BulkBlitz uses Razorpay's 'Authorize & Capture' flow:
At slot reservation: card authorized for current tier price (hold placed)
At batch close: capture triggered for final tier price (always ≤ authorized amount)
If final price < authorized amount: difference automatically released
If batch cancels: authorization voided, no charge ever appears


07. GO-TO-MARKET STRATEGY
Phase 0 — Validate Before Building (Week 1–3)
Do not write a line of code until this is done:
Lock in 5 manufacturers across 3 categories (FMCG, apparel, electronics accessories)
Run the first batch manually: WhatsApp group + Google Form + UPI collection
Prove the viral share mechanic works in the real world
Target: 1 successful batch with 80+ buyers, 20%+ share rate

Phase 1 — MVP Web Platform (Week 4–10)
Next.js web app with core batch listing, join, and real-time price display
Razorpay payment integration with hold-and-capture
Manufacturer dashboard: basic batch creation and payout tracking
WhatsApp notifications via Twilio / official API
Launch city: one Tier 1 city (Pune or Hyderabad recommended — strong manufacturing base nearby)

Phase 2 — Mobile + Supply Expansion (Week 11–20)
Expo React Native app (Android-first)
Pickup point network: sign 20 kirana partners in launch city
Expand to 3 cities
Referral program and BulkCash wallet live
Target: 50 active batches per month, 5,000 registered buyers

Phase 3 — Scale & Defensibility (Month 6–12)
B2B corporate perks layer
Manufacturer analytics dashboard
Category expansion: Agri inputs (seeds, fertiliser) — huge India opportunity
Franchise model for pickup point operators
Target: ₹1 Cr GMV/month


08. COMPETITIVE MOAT
Platform
Model
Merchant Gets
BulkBlitz Advantage
Groupon
Retail discount, 50% rev share
Often loses money
Manufacturer volume pricing is real, not forced
Meesho
Reseller margin layer
Retail price
No middleman — direct manufacturer to buyer
Amazon
Marketplace, 15–30% fee
Retail minus high fee
4% fee, faster payout, no fulfillment mandate
MagicPin
Loyalty + discovery
Nothing upfront
Buyer financially committed = real demand signal
Indiamart
B2B leads only
No consumer reach
B2C + B2B in one model

The deepest moat is the network effect: the more buyers on the platform, the faster batches fill, the better the price drops, the more manufacturers want to list. Buyers and manufacturers are mutually reinforcing.


09. RISKS & MITIGATIONS
Risk
Severity
Mitigation
Manufacturer fails to ship after batch closes
High
Escrow holds payment until shipping confirmed. Refund + bonus guarantee.
Product quality doesn't match listing
High
7-day claim window. Photo evidence. 3-strike blacklist.
Batch never fills (MOQ not met)
Medium
Auto-cancel + instant refund. Batch fee non-refundable to manufacturer.
Price manipulation by manufacturer
Medium
Tier schedules locked on publish. No edits after 50% fill.
Payment fraud / chargebacks
Medium
Razorpay fraud detection + buyer KYC via OTP.
Competitor copies model
Low-Medium
Network effect moat. Manufacturer loyalty from fair payouts.
Regulatory (DPDP Act 2023)
Low
Data minimization, consent flows, privacy policy from day one.


10. MVP BUILD PLAN
What to build first, in order, to get to a live batch in 6 weeks:

Week
What Gets Built
Done When...
1–2
DB schema, auth (Firebase OTP), manufacturer onboarding form
Manufacturer can log in and create a batch
2–3
Batch listing page + real-time slot counter (Socket.io)
Buyers can see a live batch with price tier progress
3–4
Razorpay hold-and-capture integration + slot reservation flow
Buyer can join and card is held correctly
4–5
Batch close job (BullMQ) + charge trigger + payout calculation
Batch auto-closes, charges correct price, manufacturer sees payout
5–6
WhatsApp notifications + order tracking page + basic manufacturer dashboard
End-to-end flow works for all 3 parties
6
QA, edge cases (batch cancel, partial fill, refunds), soft launch with 5 manufacturers
First real batch runs successfully






BULKBLITZ
bulk up. price down.
The crowd is the product. The price is the proof.
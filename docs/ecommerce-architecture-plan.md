# SareesForHer — Practical Launch Architecture (Version 2)

This plan is tailored to your latest requirements:
- Benchmark style from: Ramachandra Handlooms, India Handmade, Fabric Forever, PR3, SCM Silk, Pothys
- Launch language: **English first**
- Next languages: **Malayalam, Hindi, Tamil**
- Currency display: **INR primary**, optional **USD/EUR**
- Payment: **Razorpay first**, WhatsApp-assisted payment/manual follow-up as fallback
- Shipping: **manual shipping workflow initially**
- Expected volume: **~100 orders/month** to start
- Mobile app: **Phase 2** (Android first, iOS next)

---

## 1) What is good and bad in your current approach (GitHub-first)

## Good
- Very cost-effective start for the storefront and static pages.
- Public URL quickly (good for first sales and customer validation).
- Fast iteration and change tracking with Git.

## Risks if GitHub Pages is used alone
- It is static hosting, so secure payment verification and admin/inventory workflows cannot safely run only there.
- Product stock, orders, and customer details need a protected backend/database.
- Multi-role operations (owner, warehouse, shipping) need authentication and role permissions.

## Recommended interpretation of “GitHub start”
Use GitHub for:
- Source code + collaboration + CI/CD.
- Static/public content.

Use managed backend for:
- Authentication
- Product/inventory/order database
- Payment webhooks
- Admin and operations APIs

---

## 2) Competitor-style wireframe blueprint (based on the sample sites)

> Note: direct automated scraping/technology fingerprinting may be blocked by anti-bot protections. So below is a practical UX/wireframe synthesis from common textile-commerce patterns in those brands.

## A) Home page wireframe
1. **Top strip**: language switch, currency switch, WhatsApp contact, support number.
2. **Header**: logo, search, wishlist, cart, account.
3. **Primary nav**:
   - Sarees
   - Dress Materials
   - Fabrics
   - Collections
   - New Arrivals
   - Offers
4. **Hero banners** (festival/seasonal).
5. **Shop by category cards**.
6. **Shop by fabric** (silk, cotton, linen, tissue, organza, etc.).
7. **Featured collections** + “View all”.
8. **Social proof**: ratings/testimonials/Instagram feed.
9. **Footer**: about, policies, shipping/returns, contact, social.

## B) Category listing page (PLP)
- Left filters (or mobile drawer): price, fabric, color, occasion, weave, availability.
- Sort: latest, price low-high, high-low, popularity.
- Product cards: image, name, short tags, price, strike price, quick add/wishlist.

## C) Product detail page (PDP)
- Image gallery + zoom.
- Product title, SKU, price, stock status.
- Variant selectors (color, length, blouse type if relevant).
- Delivery estimator (pincode input).
- Buttons: Add to Cart, Buy Now, WhatsApp inquiry.
- Tabs: description, fabric/care, shipping, returns.

## D) Checkout flow
- Cart → Address → Payment → Confirmation.
- Razorpay online payment.
- Fallback option: “Pay via WhatsApp confirmation” (manual handling).

## E) Owner/Ops panel (web)
- Product/category management
- Stock updates
- Order status updates
- Basic shipping entry (courier + tracking number)
- Sales/inventory dashboard

---

## 3) Suggested technology stack for your current stage

## Frontend
- **Next.js** (best for SEO + future scale) with Tailwind or Chakra UI.
- Deploy on **Vercel** (simpler than pure GitHub Pages for dynamic workflows).

## Backend + DB
Choose one:
1. **Supabase** (Postgres + auth + storage + edge functions) — recommended for speed.
2. Firebase (if your team prefers Google ecosystem).

## Payments
- **Razorpay** for online payments.
- Webhook verification endpoint required on backend.

## Messaging
- **WhatsApp Business** click-to-chat initially.
- Later upgrade to API/template messages for order updates.

## Shipping
- Start with manual shipping status entry in admin.
- Later integrate Shiprocket/Delhivery APIs.

## Why this stack fits 100 orders/month
- Low operational overhead.
- Handles growth to 1k+ orders/month with modest refactoring.
- Supports easy extension to Android/iOS apps.

---

## 4) Central data architecture (single source of truth)

All channels connect to one backend:
- Storefront web
- Admin dashboard
- Warehouse/packing users
- Shipping user
- Future mobile app

## Core entities
- `users`
- `roles`
- `permissions`
- `products`
- `product_variants`
- `categories`
- `inventory`
- `orders`
- `order_items`
- `payments`
- `shipments`
- `addresses`
- `audit_logs`

## Minimum status workflows
- `order_status`: `placed -> payment_verified -> packed -> dispatched -> delivered`
- `payment_status`: `pending -> success | failed | refunded`
- `shipment_status`: `pending -> assigned -> in_transit -> delivered`

## Inventory logic
- Keep: `available_qty`, `reserved_qty`, `damaged_qty`.
- Reserve stock at order placement; deduct from available only after payment verification.

---

## 5) Catalog structure recommendation (textile-focused)

## Top categories
- Sarees
- Dress Materials
- Unstitched Fabrics
- Ready-to-Wear (optional later)
- Accessories (optional later)

## Saree subcategories (example)
- Kanjivaram
- Banarasi
- Soft Silk
- Cotton Sarees
- Linen Sarees
- Tissue/Organza
- Party Wear
- Bridal
- Daily Wear

## Product attributes to store
- Fabric type
- Weave/technique
- Occasion
- Primary color
- Border style
- Pattern/print
- Length/width
- Blouse piece included (Y/N)
- Wash care
- Country/region of origin

## SKU convention
`SAR-{CAT}-{FABRIC}-{COLOR}-{SEQ}`
Example: `SAR-KANJ-SILK-MRN-0102`

---

## 6) Multilingual + currency design

## Languages
Phase 1:
- English only content and UI labels

Phase 1.1:
- Add Hindi, Malayalam, Tamil via i18n files
- Translate:
  - Navigation
  - Product attributes
  - Checkout text
  - Notifications

## Currency
- Base currency in DB: **INR**.
- Display currency toggle: INR/USD/EUR.
- Convert using scheduled exchange-rate table (cache daily).
- Final charge for Razorpay in INR (for domestic flow), with clear display note.

---

## 7) Role-based pages you asked for

## Roles and screens
1. **Owner/Admin**
   - manage categories/products
   - stock correction
   - order overview
   - payment reconciliation
2. **Warehouse user**
   - picklist
   - packing confirmation
   - stock adjustment request
3. **Shipping user**
   - assign courier manually
   - enter AWB/tracking
   - mark dispatched/delivered
4. **Customer**
   - order tracking
   - profile/address
   - reorder

---

## 8) India Government design guideline alignment

From a practical implementation perspective, align to:
- Accessibility-first UI (contrast, keyboard support, semantic HTML).
- Clear language switch visibility.
- Performance optimization for mobile networks.
- Structured information architecture and predictable navigation.

Implementation checklist:
- Lighthouse accessibility score target: >= 90
- Core Web Vitals pass on mobile
- Alt text on product images
- Legible typography and touch-friendly controls

---

## 9) 8-week execution plan

## Week 1
- finalize sitemap + wireframes
- approve category tree + attributes

## Week 2
- project setup (Next.js + Supabase)
- auth + role model

## Week 3
- catalog management (admin)
- product listing/pdp frontend

## Week 4
- cart + address + checkout
- Razorpay integration + webhook verification

## Week 5
- manual shipping module
- order tracking page

## Week 6
- English production content upload
- SEO metadata + schema

## Week 7
- QA (functional, payment, inventory race conditions)
- UAT with pilot users

## Week 8
- production launch
- analytics + monitoring + post-launch fixes

---

## 10) What I can do next once you share reference screenshots

I can produce immediately:
1. Page-by-page **low-fidelity wireframe map**
2. UI component inventory (header, filters, cards, PDP blocks, checkout steps)
3. DB schema SQL draft (v1)
4. API contract (products, cart, order, inventory, shipping)
5. Sprint backlog in priority order

If you share screenshots/links for exact sections you like, I’ll convert them into a concrete wireframe spec.

# Apna Kirana Store

Single-store quick-commerce storefront + owner console (orders, counter POS, inventory, coupons, support) built with
**Next.js 15 (App Router)**, React 19, TypeScript and Tailwind CSS. Installable as a PWA.

## Getting started

```bash
cp .env.example .env.local   # set ADMIN_PASSCODE at minimum
npm install
npm run dev                  # http://localhost:3000
```

- Storefront: `/`
- Owner console: `/admin` (passcode = `ADMIN_PASSCODE`; defaults to `admin123` in development only)

```bash
npm run check   # eslint + tsc
npm run build   # production build
```

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSCODE` | **yes (prod)** | Owner console passcode. Verified on the server; never sent to the browser. Owner login is disabled in production when unset. |
| `ADMIN_SESSION_SECRET` | recommended | Signs the owner session cookie (`openssl rand -hex 32`). |
| `NEXT_PUBLIC_SITE_URL` | recommended | Absolute site URL for social previews. |
| `NEXT_PUBLIC_STORE_NAME` | optional | Store name used in page titles. |
| `NEXT_PUBLIC_DEMO_DATA` | optional | `true` loads sample orders/customers/tickets for demos. Leave unset in production. |

Store name, address, hours, delivery fee, free-delivery threshold, minimum order, delivery ETA and deliverable pincodes
are edited by the owner in **Admin → Store settings**.

## How it works

- **Data layer:** `src/context/StoreContext.tsx` (catalogue, orders, settings, coupons, tickets), `AuthContext.tsx`
  (customer accounts keyed by phone), `CartContext.tsx`. State persists in the browser (`localStorage`) and syncs
  live between tabs.
- **Owner auth:** `src/middleware.ts` guards every `/admin` route with a signed, expiring httpOnly cookie issued by
  `POST /api/admin/login` (rate-limited).
- **PWA:** `public/sw.js` — network-first for pages (new deploys show up immediately), cache-first for hashed assets.

## Known limitations before a multi-device launch

1. **No shared backend yet.** Orders, stock and customers live in each browser's storage, so an order placed on a
   customer's phone is not visible on the owner's device. The Supabase schema in `supabase/migrations` (tables, RLS,
   `place_kirana_order` RPC) is the intended backend; the contexts above need to be switched to it.
2. **OTP is in test mode.** Codes are generated with expiry/attempt limits but shown on screen instead of sent by SMS.
   Connect an SMS provider (e.g. Supabase Auth phone login with MSG91/Twilio) before launch.
3. **Payments are pay-on-delivery only** (cash / UPI QR at the door). Online prepaid (Razorpay) is not integrated.
4. Seed catalogue images are stock photos — replace them with real packshots from **Admin → Products**.

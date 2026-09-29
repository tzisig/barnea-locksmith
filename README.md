# Locksmith website template (demo: Barnea Locksmiths, Jerusalem area)

Static Astro site, Hebrew RTL, built so the same code can be offered to another locksmith (or a similar on-call trade) by editing one file.

This is a **portfolio demo**: the business, the owner, prices, reviews and contact details are fictional, and photos are Pexels stock (see `CREDITS.md`). Demo mode shows a striped "demo site" banner at the top of every page, adds `noindex` to every page, `public/_headers` sends `X-Robots-Tag: noindex`, and the footer says so.

## New client in 4 steps

1. **Edit `src/config/site.config.ts`**: identity, owner and technician card, phone and WhatsApp, hours, arrival times per area (`ETA`), theme colors, services (one page each, with daytime price ranges), surcharges for night and Shabbat, areas (one page each, with content written for that area), reviews, FAQ, the anti-scam guide, the lockout page, form destinations and legal details. Nothing client-specific is typed into pages or components.
2. **Replace the photos** in `src/assets/img/` and update the imports at the top of the config.
3. **Set `site.url`** and **`site.isDemo: false`**, and remove the `X-Robots-Tag` line from `public/_headers`.
4. **Regenerate icons** after a color change: `npm run icons`, then `npm run build`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Build to `dist/` (photos become AVIF and WebP with srcset) |
| `npm run preview` | Serve the built site |
| `npm run check` | Type-check |
| `npm run audit` | Check the build: broken links, orphans, titles, descriptions, one H1, canonical, JSON-LD, alt text, em dashes |
| `npm run icons` | Rebuild favicon and app icons from the theme colors |
| `npm run checklist` | Write the progress file for the Website Build Checklist |

## What is on the site

- **Pin-tumbler hero**: a cylinder cross-section that unlocks once on load (static with reduced motion or no JavaScript).
- **Transparent price estimator**: service x time of day x area gives a price range and arrival time, and a prefilled WhatsApp message. Same numbers as the price table, from the same config.
- **Technician ID card**: who will knock on the door, shown on the home, lockout, guide and about pages.
- **Anti-scam guide** (`/guide/`): red flags, what to ask on the phone, and the business's commitments.
- **Lockout page** (`/emergency/`): the first five steps when locked out.
- **Arrival-time bars** per area on one time scale, with the same data as text.
- 8 service pages, 5 area pages, prices, reviews, FAQ, contact, privacy (Amendment 13) and an accessibility statement (IS 5568).
- Schema: `Locksmith` (LocalBusiness) with areas, hours, rating and offer catalog; `Service`, `FAQPage`, `BreadcrumbList`, `Article`, `Person`, `ContactPage`.

## Contact form

`form.destinations` in the config. Every lead goes to every destination in parallel; use two (email via Web3Forms + a webhook to a Google Sheet) so no lead is lost. Empty list = demo mode. GA4 loads only after cookie consent; set `analytics.ga4`.

## Design

ui-ux-pro-max design system in `design-system/barnea-locksmith/MASTER.md`. Every source and deviation is listed in `design-system/barnea-locksmith/DECISIONS.md`.

## Hosting

Built for Cloudflare Pages (any static host works). `public/_headers` holds security and cache headers.

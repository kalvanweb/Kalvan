# KALVAN — Website (Phase 1 MVP)

Premium menswear D2C storefront built with Next.js 14 (App Router), React 18,
TypeScript and Tailwind CSS, per the KALVAN Product Blueprint (PRD/TRD).

## What's included

- **Home** — hero, shop-by-category, new arrivals, best sellers, why-KALVAN,
  brand story, reviews, newsletter
- **Shop** — full catalogue with category, color, size filters, search and sort
- **Product Detail** — gallery, color/size variant selectors, size guide modal,
  stock status, delivery info, add to cart / buy now, related products
- **Cart** — quantity controls, coupon codes (`KALVAN10`, `WELCOME150`), order summary
- **Checkout** — address form with validation, online/COD payment selection,
  order placement
- **Order Confirmation**
- **Account** — sign in / sign up (demo only), profile, orders, addresses, wishlist stub
- **Support** — FAQ, shipping, returns, privacy, terms, contact form

SEO: metadata per page, `sitemap.ts`, `robots.ts`, semantic HTML, accessible
focus states, alt text on all images.

## Architecture notes (per TRD)

This is the **frontend only**. It currently uses local mock data
(`lib/products.ts`) and browser `localStorage` for the cart, so it runs
standalone with no backend required — good for design review and demoing
flows end to end.

To wire it to a real backend:

1. Replace `lib/products.ts` calls with fetches to your `/products`,
   `/categories` API routes.
2. Move cart state to `/cart` API-backed session instead of `localStorage`
   (keep the same `CartContext` interface so components don't change).
3. Point `/checkout` submit at your `/checkout` and `/orders` endpoints;
   verify payment server-side before creating the order record.
4. Add real auth (`/auth`) behind the `/account` page.
5. Swap the placeholder Unsplash product photography for real product images.

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000.

## Brand

- Palette: Charcoal `#1C1B19`, Warm Ivory `#F3EEE5`, Stone `#A79E8F`, Muted Olive `#6B6B4D`
- Display type: Bebas Neue · Body type: Inter
- Logo assets in `/public` (mark + full lockup, in both gold-on-dark and charcoal-on-light versions)

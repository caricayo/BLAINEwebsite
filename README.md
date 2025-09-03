## Overview

Modern, high‑performance website for a tattoo studio built with:

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui components
- Hosted on Vercel (auto‑deploy on push to `main`)

Fast, mobile‑first pages with an easy content workflow for portfolio media, testimonials, and contact info.

## Getting Started

Prerequisites:

- Node.js 18+ (LTS recommended)
- npm 9+ (bundled with Node LTS)

Setup:

```bash
git clone <your-repo-url>
cd blaine-site
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Content Updates

### Portfolio media

- Replace or add files under `public/portfolio/`
  - Use lowercase, ASCII, no spaces. Prefer kebab‑case, e.g. `forearm-fine-line-01.mp4`
  - Keep video size reasonable (< 20 MB each). H.264 mp4 recommended.

### Portfolio data

Edit `data/portfolio.json`. Items are read by the Portfolio page. Fields used:

```jsonc
[
  {
    "id": "20-mp4",          // internal id (file-based is fine)
    "alt": "20",              // short label or number
    "videoSrc": "/portfolio/20.mp4", // for videos (or use "src" for images)
    "styles": ["black-gray", "color"], // categories/filters
    "placements": ["forearm"],         // optional
    "date": "2025-09-02",             // ISO date (YYYY-MM-DD)
    "state": "fresh"                   // optional: "fresh" | "healed"
  }
]
```

Supported style tags include:

`black-gray`, `color`, `fine-line`, `realism`, `script`, `geometric`, `tribal`, `anime`.

### Testimonials

Edit `data/testimonials.json`:

```json
[
  { "quote": "…", "author": "Name · City, ST" }
]
```

### Contact info

- Update quick contact details and hours in `src/app/contact/page.tsx`.
- Update footer contact line and social links in `src/components/site-footer.tsx`.

## Environment Variables

Create `.env.local` (not committed) in the project root for secrets. Common entries (use what applies to you):

```bash
# Stripe (optional: deposits, payments)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email sending (optional: Resend or Postmark)
RESEND_API_KEY=re_...
POSTMARK_SERVER_TOKEN=...

# Instagram Graph API (optional: if enabling API-based feed)
IG_USER_ID=...
IG_ACCESS_TOKEN=...
```

Notes:

- Do not commit `.env.local`.
- This project currently uses mailto for booking emails; switching to Resend/Postmark is optional and requires wiring an API route.

## Deploying

Vercel recommended:

1) Connect the GitHub repo to Vercel.
2) Push to `main` → Vercel builds and deploys automatically.

Media guidelines:

- Use lowercase filenames (ASCII), e.g. `22.mp4`.
- Prefer < 20 MB per video. Use H.264 mp4 for broad compatibility.
- Images: optimize before upload; prefer WebP/AVIF where supported.

## Security / Anti‑spam

- Turnstile (Cloudflare) can be enabled for contact forms; add site/secret keys to `.env.local` and wire the check in the contact API route (currently a placeholder).
- Email: Use Resend or Postmark from a server API route to avoid exposing keys client‑side.
- Payments: If collecting deposits, set up Stripe, secure webhooks on Vercel (Serverless / Edge), and test in test mode first.

## Maintaining

- Logs & metrics: Vercel dashboard → Projects → Deployments → View Function Logs.
- Update dependencies: `npm update` (or specific packages with `npm i <pkg>@latest`).
- Test locally: `npm run dev` and spot‑check pages before pushing.
- UTF‑8 guard: Run `npm run lint:mojibake` to catch encoding/mojibake issues.

## Git Hooks

This repo includes a pre‑commit check to block non‑UTF‑8 or mojibake in `src/app/**/*.tsx` and `data/**/*.json`.

Enable local hooks once per clone:

```bash
git config core.hooksPath .githooks
```

Run manually:

```bash
npm run lint:mojibake
```

## Contact

For site updates or help, email: `reum808@gmail.com`.

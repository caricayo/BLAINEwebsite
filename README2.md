# Blaine Site — Client Handoff Guide (Media + Deploy)

This short guide covers how to: add portfolio media (videos and photos), push changes to GitHub, and confirm the site works on Vercel.

---

## 1) Add Portfolio Videos and Photos

Where media lives:

- Put files in `public/portfolio/`
- Supported by the site and helper scripts:
  - Images: `.jpg .jpeg .png .webp .avif`
  - Video: `.mp4 .mov` (prefer `.mp4` H.264 for best compatibility)
- Keep filenames simple, lowercase, ASCII (avoid spaces). Example: `forearm-fine-line-01.mp4`
- Try to keep videos under ~20 MB for fast loads (Vercel static asset limit is 100 MB per file).

You have two ways to update the grid: Manual (surgical) or Auto (regenerate from the folder).

### Option A — Manual update (recommended for small changes)

1) Copy your new media into `public/portfolio/`.
2) Open `data/portfolio.json` and add an item:

```jsonc
{
  "id": "forearm-flower-01-mp4",      // unique id (any string; file-based is fine)
  "alt": "Forearm flower 01",         // short label for accessibility
  "videoSrc": "/portfolio/forearm-flower-01.mp4", // use "src" instead if it’s an image
  "styles": ["fine-line", "color"],   // see allowed tags below
  "placements": ["forearm"],           // optional
  "date": "2025-09-02",               // YYYY-MM-DD (when created/shot)
  "state": "healed"                    // optional: "fresh" | "healed"
}
```

- For images, use `"src": "/portfolio/your-file.jpg"` and omit `videoSrc`.
- Allowed style tags (from `src/types/index.ts`):
  - `black-gray`, `color`, `fine-line`, `realism`, `script`, `geometric`, `tribal`, `anime`
- Allowed placement tags (optional):
  - `arm`, `forearm`, `wrist`, `chest`, `back`, `shoulder`, `calf`, `thigh`

3) Optional: Add a poster image for a video preview.
   - Place a poster image beside the video using one of these names:
     - `BASE-cover.jpg|jpeg|png` or `BASE.jpg|jpeg|png` where `BASE` is the video filename without extension.
     - Example for `20.mp4`: `20-cover.jpg` or `20.jpg`.
   - Then run the helper (locally) to sync posters into `data/portfolio.json`:

```bash
node scripts/sync-portfolio-posters.mjs
```

4) Validate references (ensures every `src`/`videoSrc` exists on disk):

```bash
node scripts/validate-portfolio-media.mjs
```

### Option B — Auto-generate from the folder (bulk refresh)

This rebuilds `data/portfolio.json` from files in `public/portfolio/` and overwrites the file. Useful after large drops or renames.

1) Ensure `public/portfolio/` contains exactly the media you want.
2) Run:

```bash
node scripts/sync-portfolio-from-media.mjs
```

3) If you added posters like `BASE-cover.jpg`, you can then run:

```bash
node scripts/sync-portfolio-posters.mjs
```

4) Edit `data/portfolio.json` to set the desired `styles`, `placements`, and `state` for newly generated items.
5) Validate:

```bash
node scripts/validate-portfolio-media.mjs
```

### Local preview

- Start the dev server and check the grid at `/portfolio`:

```bash
npm install
npm run dev
```

Open http://localhost:3000/portfolio

Tip: There’s also a debug page at `/debug/media` that can help during development.

---

## 2) Push to GitHub

From the `blaine-site` folder:

```bash
# First time only (if not already a repo)
git init
git branch -M main
git remote add origin https://github.com/<your-org>/<your-repo>.git

# Commit your changes
git add -A
git commit -m "Update portfolio media and data"

# Push to GitHub
git push -u origin main
```

Note: Pushing large binaries will grow your repo. Keep videos reasonably sized. If you ever outgrow that, consider separate object storage; for now, checked-in media is simplest and works well on Vercel.

---

## 3) Vercel Deploy + Checks

Vercel deploys automatically on push to `main` once the repo is connected.

### One-time project setup (in Vercel dashboard)

- Framework Preset: Next.js
- Build Command: `next build` (default)
- Install Command: `npm install` (default)
- Output Directory: `.next` (default)
- Node.js: 18+ (Vercel manages this automatically for Next.js 15)

### Environment variables (only if you use these features)

Add in Vercel → Project → Settings → Environment Variables:

- Email booking (server API):
  - `RESEND_API_KEY` — required to send booking emails via Resend
  - `BOOKING_TO_EMAIL` — where booking requests should be delivered
  - Optional: `RESEND_FROM` or `BOOKING_FROM_EMAIL` — a verified sender, e.g. `"Tattoos by Blaine <bookings@yourdomain.com>"`
- Instagram feed (optional; API-based):
  - `IG_USER_ID`
  - `IG_ACCESS_TOKEN`

If these are not set, related features gracefully fall back (e.g., Instagram uses local data; booking API route returns a clear error, and the UI can still show a mailto option).

### Post-deploy checklist

- Visit the deployed site `/portfolio` — confirm new tiles appear and videos preview.
- Check `/contact` booking submission if email sending is configured (you can verify via Vercel → Deployments → Functions Logs).
- Open `/` and other pages to confirm no layout shifts or slow loads on mobile.

### Common gotchas

- Very large videos: compress to < 20–30 MB and prefer H.264 `.mp4`.
- Non-ASCII filenames: use lowercase ASCII to avoid encoding issues.
- Bulk refresh overwrote tags: after running the auto sync, re-add `styles`/`placements` as desired in `data/portfolio.json`.

---

## 60‑Second Recap for Adding Media

1) Drop files into `public/portfolio/` (use simple lowercase names).
2) Add entries to `data/portfolio.json` (or run the auto sync, then tweak tags).
3) Optionally add `BASE-cover.jpg` posters and run `node scripts/sync-portfolio-posters.mjs`.
4) `node scripts/validate-portfolio-media.mjs`
5) `git add -A && git commit -m "media" && git push`
6) Vercel auto-deploys; check `/portfolio` on the live site.

---

## Need help?

If anything feels off during handoff, reach out to your developer contact and include a link to the failing page and (if applicable) the filename you added.


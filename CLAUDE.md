# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run export` — static export to `out/` (build + `.nojekyll`); this is what CI runs

There are no tests.

## Architecture

Single-page portfolio site built with Next.js 16 App Router (JSX, no TypeScript), statically exported (`output: 'export'`) and deployed to GitHub Pages.

Runtime dependencies are only `next`, `react` and `react-dom` — **keep it that way**. Animation and effects are deliberately hand-rolled in CSS rather than pulled from libraries; the site previously shipped Three.js and GSAP (~176KB gzip) for effects that CSS does natively.

- `src/app/page.jsx` stacks the section components from `src/components/`: Navbar, Hero, About, Experience, Projects, Contact.
- `src/lib/site.js` is the single source of truth for personal details (name, email, phone, GitHub/LinkedIn, résumé path, canonical URL). Change contact info there, not in components. It also exports `asset()`, which prefixes `/public` paths with the basePath — plain `<a>`/`<img>` tags need this since Next only rewrites basePath for `next/link` and `next/image`.
- `src/lib/useReveal.js` is the scroll-reveal hook (IntersectionObserver). Attach its ref to a section; the section gets an `.in` class on first intersection and CSS animates every `[data-reveal]` descendant. Stagger children with `style={{ '--d': '120ms' }}`. The observer disconnects after firing once.
- CV content lives in module-level constants at the top of each section component (`ROLES`, `PROJECTS`, `SKILLS`, `STATS`, …).

### The Hero reveal

`Hero.jsx` renders the portrait twice: a desaturated `.hero-base` plate and a full-colour `.hero-reveal` plate punched through by a soft radial `mask-image` that follows the cursor.

The mask centre and radius are the registered custom properties `--mx` / `--my` / `--mr` (see `@property` in `globals.css`), so the browser interpolates them as ordinary CSS transitions. JavaScript only writes `--mx`/`--my` on actual pointer movement — there is no per-frame render loop.

Rules to preserve when editing:
- Measure `getBoundingClientRect()` fresh inside the pointer handler. Caching width/height in the effect closure is what previously broke cursor tracking after a window resize.
- The custom properties live on the **portrait card** (`.hero-stage`), not the section, so coordinates are measured against the box actually being masked.
- Pointer tracking is skipped entirely unless `(pointer: fine)` matches and reduced motion is off. Under `(pointer: coarse)` CSS hides the base plate and unmasks the colour plate, so phones just show the finished portrait with no per-frame mask work.
- The portrait is a **contained card**, not a full-bleed panel, because the source photo is only 410x530 — stretching it across a viewport-sized column upscales it past the point where it looks sharp. The card is 260px on phones, 380px on desktop, and its `aspect-41/53` matches the file exactly so nothing is cropped. If a higher-resolution photo ever replaces it, a full-bleed treatment becomes viable again.
- The desktop grid track for the card is an explicit `380px`, not `auto`. An `auto` track sizes to min-content, which collapses the card's `w-full` to near-zero.

### Styling

- Tailwind CSS 4 via PostCSS (`@tailwindcss/postcss`); everything global is in `src/app/globals.css`.
- Theme tokens are defined in `@theme`: surfaces `--color-ink` / `-ink-2` / `-ink-3`, hairlines `--color-line`, and a single accent `--color-accent` / `-accent-soft` (teal). Use the accent sparingly.
- Fonts are self-hosted at build time via `next/font/google` (Inter, plus Instrument Serif **italic only** — the roman cut is unused, don't add it back). They are wired to `--font-inter` / `--font-serif-display`, which `@theme` maps onto `font-sans` / `font-serif`.
- The no-JS fallback for `[data-reveal]` is a `<noscript><style>` block in `layout.jsx`. Do **not** replace it with a script that adds a class to `<html>` — mutating the DOM before React hydrates makes the server and client markup disagree and throws a hydration error.
- `<body>` carries `suppressHydrationWarning` because browser extensions (ColorZilla, Grammarly, password managers) stamp attributes on it before hydration. It only covers that element's own attributes.

### Responsive

Verified clean (no horizontal scroll, no overflow, no clipped text) from 320px to 1440px. Two conventions to keep:

- **Tap targets are 44px minimum.** Text links sit on a ~19px line box, which is fine with a mouse and awkward with a thumb. Rather than padding them and reflowing the design, add the `.tap` utility from `globals.css` — it lays an invisible full-width `::after` over the link with `min-height: 44px`. Use it on links already wider than 44px; size genuinely small controls (logo, hamburger) explicitly instead.
- **Don't put a `shrink-0` pill beside a heading in a narrow card.** The project card's status pill plus title needed ~295px of header width, which the two-column grid doesn't give a card until `lg`. The fix was to pair the pill with the small file number on its own row, so the heading always gets the full card width — prefer that shape over `flex-col` breakpoint juggling.

To re-verify after layout changes, the scratchpad scripts hit-test with `elementFromPoint` (so `.tap` overlays are counted) and sweep widths for overflow. Measuring `getBoundingClientRect()` alone reports false failures for anything using `.tap`.

### Images

- The only image is `src/assets/portrait.webp` (410x530, ~24KB), imported as a module; components handle both string and `{ src }` import shapes. `public/og.jpg` is the social card — a composed 1200x630 layout (dark canvas, portrait right, type left), not a crop of the photo.
- When swapping the portrait: scan the source for a printed border first. The current photo arrived as a 420x540 ID scan with a ~4px black frame on every edge, which had to be cropped off or it showed as a dark ring inside the rounded card. Never upscale to fake resolution — set the card size to suit the file instead, and update `aspect-41/53` if the new ratio differs.
- `images.unoptimized: true` is required in `next.config.mjs` for static export — keep it. Because of that, `next/image` optimizes nothing and only adds JS, so plain `<img>` with a pre-sized WebP is the correct choice here (the `no-img-element` lint rule is suppressed with a reason at each use).
- Pre-optimize new images before committing them — resize to their real display size and convert to WebP. `sharp` is available transitively via Next. The repo previously carried 8.5MB of PNGs, including a 5.7MB file that was never imported.

## Deployment (GitHub Pages)

- `next.config.mjs` sets `basePath: '/solankijd007'` **only in production** — dev runs at `/`. It also re-exports it as `NEXT_PUBLIC_BASE_PATH` for `asset()`.
- Next does **not** apply the basePath everywhere. `openGraph`/`twitter` images resolve against `metadataBase`, but `metadata.icons` paths are emitted verbatim and 404 in production — wrap them in `asset()`. Same for any hand-written `<a href>` / `<img src>` pointing at `/public`. After changing metadata or adding public assets, check that nothing slipped through:
  ```sh
  grep -oE '(href|src)="/[^"]*"' out/index.html | sort -u | grep -v '/solankijd007'
  ```
- Pushing to `main` triggers `.github/workflows/deploy.yml`: `npm ci` → `npm run export` → publish `out/` to the `gh-pages` branch (peaceiris/actions-gh-pages). See `DEPLOY_TO_GITHUB_PAGES.md` for the Pages setup details.
- To check the production build locally, serve `out/` under a matching path (the basePath means serving it at the web root 404s on every asset):
  ```sh
  npm run build
  mkdir -p /tmp/wwwroot && ln -sfn "$PWD/out" /tmp/wwwroot/solankijd007
  npx serve /tmp/wwwroot -l 4321   # → http://localhost:4321/solankijd007/
  ```

## Contact form

The site is a static export with no backend, so `Contact.jsx` composes a `mailto:` draft in the visitor's own client. There is nothing to POST to — if a real endpoint is ever added, it has to be an external service.

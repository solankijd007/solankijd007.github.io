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
- `src/lib/site.js` is the single source of truth for personal details (name, email, phone, GitHub/LinkedIn, resume path, canonical URL). Change contact info there, not in components. It also exports `asset()`, which prefixes `/public` paths with the basePath — plain `<a>`/`<img>` tags need this since Next only rewrites basePath for `next/link` and `next/image`.
- `src/lib/useReveal.js` is the scroll-reveal hook (IntersectionObserver). Attach its ref to a section; the section gets an `.in` class on first intersection and CSS animates every `[data-reveal]` descendant. Stagger children with `style={{ '--d': '120ms' }}`. The observer disconnects after firing once.
- CV content lives in module-level constants at the top of each section component (`ROLES`, `SKILLS`, `STATS`, …). The one exception is `src/lib/projects.js` (`PROJECTS`, `ALSO_DELIVERED`), which is shared because `layout.jsx` also feeds it into the JSON-LD graph — structured data that disagrees with the visible page is worse than no structured data at all.

### The Hero reveal

`Hero.jsx` renders the portrait twice: a desaturated `.hero-base` plate and a full-colour `.hero-reveal` plate punched through by a soft radial `mask-image` that follows the cursor.

The mask centre and radius are the registered custom properties `--mx` / `--my` / `--mr` (see `@property` in `globals.css`), so the browser interpolates them as ordinary CSS transitions. JavaScript only writes `--mx`/`--my` on actual pointer movement — there is no per-frame render loop.

Rules to preserve when editing:

- Measure `getBoundingClientRect()` fresh inside the pointer handler. Caching width/height in the effect closure is what previously broke cursor tracking after a window resize.
- The custom properties live on the **portrait card** (`.hero-stage`), not the section, so coordinates are measured against the box actually being masked.
- Pointer tracking is skipped entirely unless `(pointer: fine)` matches and reduced motion is off. Under `(pointer: coarse)` CSS hides the base plate and unmasks the colour plate, so phones just show the finished portrait with no per-frame mask work.
- The portrait is a **contained card**, not a full-bleed panel, because the source photo is only 410x530 — stretching it across a viewport-sized column upscales it past the point where it looks sharp. The card is 260px on phones, 380px on desktop, and its `aspect-41/53` matches the file exactly so nothing is cropped. If a higher-resolution photo ever replaces it, a full-bleed treatment becomes viable again.
- The desktop grid track for the card is an explicit `380px`, not `auto`. An `auto` track sizes to min-content, which collapses the card's `w-full` to near-zero.

### The portrait swap

The portrait shows in two places (Hero and About) and both are clickable — a click crossfades to the next photo in `PORTRAITS` (`src/lib/portraits.js`). The card is bare on purpose: no badge, no dots, no caption. The only affordance is the pointer cursor and the swap itself.

- `usePortrait()` is backed by a **module-level store**, not per-component state, so the Hero and About portraits can never disagree. It stores only a monotonic swap count and derives the active index from it: `useSyncExternalStore` compares snapshots by identity, so returning a fresh object from `getSnapshot` would loop. The count doubles as the key that replays the sweep animation.
- Every photo is mounted up front as its own `.portrait-plate`, and the swap is an opacity/blur crossfade between plates. Swapping an `<img src>` instead would flash while the new file decodes, and gives nothing to crossfade.
- A plate is a **wrapper around** the images, never the images themselves. That keeps the swap's `opacity`/`filter` off the same elements as `.hero-base`'s grayscale and `.hero-reveal`'s mask — `transition` is not additive, so two rules on one element means one silently wins.
- The sweep is guarded twice, because a stranded one paints a bright band down the middle of a face. `.portrait-sweep` is `opacity: 0` **at rest**, not just at its keyframe edges — a CSS animation with no `fill-mode` reverts to the element's own style when it ends. And `PortraitSweep` unmounts on `animationend`, so there is nothing left to style. Keep both; they fail independently.
- The sweep is neutral white on purpose. It crosses a face, so the teal accent read as a colour cast on the photo rather than as light.
- Only the portrait that renders on load gets `fetchPriority="high"`; the rest are `low` so they don't compete with LCP.

Adding a third photo is just another entry in `PORTRAITS` — the plates, the swap arithmetic and the crossfade are all length-driven.

### Mobile navigation

Below `md`, navigation is a floating bottom dock in `Navbar.jsx`, not a hamburger with a fullscreen overlay. The top bar on a phone keeps only the logo and the Resume button — the four section links live in the dock.

- The dock is `position: fixed` and its wrapper carries the scrim gradient. Putting the scrim on a sibling *above* the dock leaves the inset strip under it transparent, and page content scrolls through that gap.
- `Footer.jsx` pads its bottom by the dock's height on phones. Without it the dock parks on the copyright line, which is the last thing on the page and has nothing left to scroll past it.
- The active tab comes from a scroll spy in the same rAF-throttled handler that drives the scrolled header: a probe line at 45% of the viewport, sections measured fresh each pass. Keep the bottom clamp — `#contact` is short enough that the page can run out of scroll before its top ever crosses the probe, so the last tab would otherwise never light up. Desktop reads the same `activeId` for its underline.
- One indicator slides across the tabs rather than each tab drawing its own background, so the tabs have to stay equal-width (`flex-1`) — the transform is a plain multiple of the tab width. Its width must subtract the dock's own padding first (`calc((100% - 0.75rem) / n)`): the indicator is absolutely positioned, so a bare percentage resolves against the nav's *padding* box while a `flex-1` tab is a share of the *content* box. A plain `100 / n` makes it 3px too wide and drifts it a further 3px per tab, until the last tab's indicator hangs past the tab and gets sliced by `overflow-hidden`. Keep the `0.75rem` in step with `p-1.5`.
- Labels are 10px with no letter-spacing and `whitespace-nowrap`. At 320px a tab is 71px wide and "Experience" is the longest label on the site; tracking is what pushes it onto a second line.
- The dock's About tab renders the live portrait from `usePortrait()`, so it swaps along with the Hero and About cards.

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

- The portraits are `src/assets/portrait.webp` and `portrait-alt.webp` (both 410x530, ~20-24KB), imported as modules and normalised in `src/lib/portraits.js`, which handles both string and `{ src }` import shapes. Keep any new portrait at 410x530 so it drops into the same `aspect-41/53` card without cropping. `public/og.jpg` is the social card — a composed 1200x630 layout (dark canvas, portrait right, type left), not a crop of the photo.
- When swapping the portrait: scan the source for a printed border first. The current photo arrived as a 420x540 ID scan with a ~4px black frame on every edge, which had to be cropped off or it showed as a dark ring inside the rounded card. Never upscale to fake resolution — set the card size to suit the file instead, and update `aspect-41/53` if the new ratio differs.
- `images.unoptimized: true` is required in `next.config.mjs` for static export — keep it. Because of that, `next/image` optimizes nothing and only adds JS, so plain `<img>` with a pre-sized WebP is the correct choice here (the `no-img-element` lint rule is suppressed with a reason at each use).
- Pre-optimize new images before committing them — resize to their real display size and convert to WebP. `sharp` is available transitively via Next. The repo previously carried 8.5MB of PNGs, including a 5.7MB file that was never imported.

## SEO

Everything is emitted at build time — there is no runtime SEO layer to debug.

- `src/app/robots.js`, `sitemap.js` and `manifest.js` are Next metadata routes. They need `export const dynamic = 'force-static'` to survive `output: 'export'`; without it the build fails rather than silently skipping them.
- The sitemap lists exactly one URL. In-page anchors (`#about`, `#work`, …) are **not** separate documents — listing them gets the sitemap flagged for duplicate URLs.
- `metadata.alternates.canonical` is set, so `?utm_…` and `#anchor` arrivals collapse onto one indexable URL.
- Structured data is a single `@graph` in `layout.jsx` — `WebSite` → `ProfilePage` → `Person`, cross-referenced by `@id`, plus an `ItemList` of the shipped products. One graph rather than several `<script>` blocks: the `@id` links are what make a search engine treat this as one entity instead of several unrelated mentions. Validate changes at https://validator.schema.org and Google's Rich Results Test.
- The meta description is deliberately under ~160 characters (Google truncates past that); social cards use the longer `socialDescription`.
- The visible `<h1>` is the name alone. The role and location ride along in an `sr-only` span — legitimate because every word of it is visible elsewhere on the page. Don't put anything in there that isn't.
- Only the first portrait in each section carries `alt` text; the rest are `alt=""` + `aria-hidden`. Four copies of the same sentence reads as keyword stuffing, and the button's `aria-label` is what screen readers announce regardless.
- `apple-touch-icon.png` / `icon-192.png` / `icon-512.png` are generated from `public/favicon.svg` with `sharp`. iOS ignores an SVG apple-touch-icon. Regenerate them if the favicon changes.
- Still outstanding: no Search Console verification token (there's a commented `verification` key in `layout.jsx` for it), and the site has no inbound links — which is the actual ranking bottleneck, not the markup.

## Deployment (GitHub Pages)

- The site is deployed as a **user site** (`solankijd007.github.io`), so it lives at the web root and `next.config.mjs` sets **no** `basePath`. `asset()` in `src/lib/site.js` is consequently an identity function — it is kept, and kept in use, only so that moving to a project repo (`/repo-name`) is a one-line change there instead of an audit of every hand-written `href`.
- Next does not apply a basePath everywhere even when one is set: `openGraph`/`twitter` images resolve against `metadataBase`, but `metadata.icons` paths are emitted verbatim. Wrap those, and any hand-written `<a href>` / `<img src>` pointing at `/public`, in `asset()`. If a basePath is ever reintroduced, check nothing slipped through:
  ```sh
  grep -oE '(href|src)="/[^"]*"' out/index.html | sort -u | grep -v '/<basePath>'
  ```
- Pushing to `main` triggers `.github/workflows/deploy.yml`: `npm ci` → `npm run export` → `actions/upload-pages-artifact` → `actions/deploy-pages`. This is the official Pages-artifact flow, so the repo's Pages source must stay set to **GitHub Actions**, not a branch. The `gh-pages` branch still on the remote is a leftover from the old peaceiris setup and is no longer deployed from — don't push to it. See `DEPLOY_TO_GITHUB_PAGES.md` for the Pages setup details.
- To check the production build locally:
  ```sh
  npm run export
  npx serve out -l 4321   # → http://localhost:4321/
  ```

## Contact form

The site is a static export with no backend, so `Contact.jsx` composes a `mailto:` draft in the visitor's own client. There is nothing to POST to — if a real endpoint is ever added, it has to be an external service.

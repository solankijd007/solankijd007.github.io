# solankijd007.github.io

Personal portfolio for **Jagdish Solanki** — full stack developer, Node.js &amp; TypeScript.

**Live → [solankijd007.github.io](https://solankijd007.github.io)**

[![Deploy to GitHub Pages](https://github.com/solankijd007/solankijd007.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/solankijd007/solankijd007.github.io/actions/workflows/deploy.yml)

![The site's social card — dark canvas, portrait right, type left](public/og.jpg)

---

## What this is

A single-page portfolio built with the Next.js App Router, statically exported and served from GitHub Pages. No server, no database, no runtime API — the whole thing is HTML, CSS and a small amount of JavaScript emitted at build time.

## The one constraint worth knowing

Runtime dependencies are **`next`, `react` and `react-dom`. That's it.**

The site used to ship Three.js and GSAP — roughly 176 KB gzipped — for a hero effect and some scroll reveals. Both were removed and rebuilt in plain CSS:

| Effect | Was | Now |
| --- | --- | --- |
| Cursor-following portrait reveal | Three.js shader | A radial `mask-image` driven by three registered `@property` custom properties, interpolated by the browser as ordinary CSS transitions |
| Scroll reveals | GSAP + ScrollTrigger | One `IntersectionObserver` hook that adds a class and disconnects |
| Card hover glow | per-card JS handlers | One delegated `pointermove` listener writing two CSS variables |

There is no per-frame render loop anywhere in the site. JavaScript only writes a CSS variable when the pointer actually moves, and every pointer effect is skipped entirely unless `(pointer: fine)` matches and the visitor has not asked for reduced motion.

Please keep it this way. If a change seems to need an animation library, it almost certainly does not.

## Stack

- **Next.js 16** (App Router, JSX — no TypeScript in this repo)
- **React 19**
- **Tailwind CSS 4** via PostCSS, all global styles in `src/app/globals.css`
- Self-hosted fonts through `next/font/google` — Inter, plus Instrument Serif *italic only*
- `output: 'export'` → static HTML in `out/`

## Commands

```sh
npm run dev      # dev server
npm run build    # production build
npm run lint     # ESLint
npm run export   # build + write out/.nojekyll  ← this is what CI runs
```

There are no tests.

To check the production build the way it actually ships:

```sh
npm run export
npx serve out -l 4321   # → http://localhost:4321/
```

## Project structure

```
src/
├── app/
│   ├── layout.jsx      # metadata, fonts, JSON-LD graph
│   ├── page.jsx        # stacks the sections
│   ├── globals.css     # theme tokens + every global style
│   ├── not-found.jsx   # 404 (noindex, own canonical)
│   ├── robots.js       # → /robots.txt
│   ├── sitemap.js      # → /sitemap.xml
│   └── manifest.js     # → /manifest.webmanifest
├── components/         # Navbar, Hero, About, Experience, Projects, Contact, Footer
├── lib/
│   ├── site.js         # single source of truth for personal details
│   ├── projects.js     # shared: feeds both the UI and the JSON-LD
│   ├── portraits.js    # module-level store so both portraits stay in sync
│   └── useReveal.js    # IntersectionObserver scroll-reveal hook
└── assets/             # portraits (WebP, 410×530)
```

Change contact details in **`src/lib/site.js`**, never in a component.

## A few implementation notes

- **The hero reveal** renders the portrait twice — a desaturated plate and a full-colour plate punched through by a cursor-following mask. Same file, one download.
- **The portrait swap** — clicking either portrait crossfades both to the next photo, because `usePortrait()` is backed by a module-level store rather than per-component state. Adding a third photo is one more entry in `PORTRAITS`; the plates and crossfade arithmetic are length-driven.
- **The contact form** composes a `mailto:` draft in the visitor's own mail client. A static export has nothing to POST to.
- **Images** are pre-sized WebP served through plain `<img>`. `images.unoptimized` is required for static export, so `next/image` would optimize nothing and only add JavaScript.

Every one of these has a longer explanation — including the failure it was written to avoid — in [`CLAUDE.md`](CLAUDE.md). Read that before changing the hero, the portrait swap or the responsive rules.

## SEO

Everything is emitted at build time; there is no runtime SEO layer.

- `robots.txt`, `sitemap.xml` and `manifest.webmanifest` are Next metadata routes, each pinned with `dynamic = 'force-static'` so they survive the static export
- Canonical URL, so `?utm_…` and `#anchor` arrivals collapse onto one indexable URL
- Structured data is a single JSON-LD `@graph` — `WebSite` → `ProfilePage` → `Person`, cross-referenced by `@id`, plus an `ItemList` of the shipped products. Google reports the profile markup as valid and the page is indexed
- Verified in both Google Search Console and Bing Webmaster Tools

## Accessibility

Verified clean from 320 px to 1440 px — no horizontal scroll, no clipped text.

- Skip link, labelled landmarks, one `<h1>` and a flat `<h2>` per section
- Tap targets are 44 px minimum; links that sit on a small line box get the `.tap` utility, which lays an invisible full-width overlay over them rather than reflowing the design
- Every pointer effect is disabled under `prefers-reduced-motion`
- `[data-reveal]` elements are un-hidden by a `<noscript>` style block, so the page is fully readable without JavaScript

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): `npm ci` → `npm run export` → `actions/upload-pages-artifact` → `actions/deploy-pages`.

This is the official Pages-artifact flow, so the repository's **Pages source must stay set to "GitHub Actions"**, not a branch. The `gh-pages` branch still on the remote is a leftover from an older setup and is no longer deployed from — don't push to it.

Because this is a *user* site (`solankijd007.github.io`), it lives at the web root and no `basePath` is set. `asset()` in `src/lib/site.js` is consequently an identity function; it is kept, and kept in use, so that moving to a project repo would be a one-line change there instead of an audit of every hand-written `href`.

## License

The code is free to learn from. The content — CV copy, portraits, project write-ups and the résumé PDF — is not; please don't redeploy this as your own portfolio.

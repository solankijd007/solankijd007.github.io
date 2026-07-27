'use client';

import { SITE } from '../lib/site';

/* Lives at page level rather than inside the Contact section on purpose: a
   <footer> nested in a <section> is a generic footer for that section, and only
   a top-level one maps to the `contentinfo` landmark that crawlers and screen
   readers look for. The padding here mirrors Contact's so the hairline still
   lines up with the section above it. */
export default function Footer() {
  return (
    <footer className="w-full bg-ink px-6 pb-10 md:px-10 lg:px-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-white/35 sm:flex-row">
        {/* Prerendered at build time, re-evaluated on the client — the year can
            legitimately differ across a New Year boundary. */}
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} {SITE.name}. Built with Next.js &amp; Tailwind CSS.
        </p>
        <a
          href="#top"
          className="tap inline-block transition-colors duration-300 hover:text-white"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

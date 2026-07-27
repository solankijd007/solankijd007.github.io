import Link from 'next/link'
import { SITE } from '../lib/site'

/* Both overrides are load-bearing, and neither is redundant with the `noindex`
   Next emits for this route on its own:

   - Without `robots`, the layout's `index, follow` is inherited and the page
     ships two contradictory robots tags.
   - Without clearing `canonical`, the layout's `/` is inherited, so every 404
     declares the homepage as its canonical — which is the textbook soft-404
     signal. */
export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
}

export default function NotFound() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-accent">
        <span className="h-px w-8 bg-accent/60" />
        404
      </p>

      <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
        That page doesn&apos;t{' '}
        <span className="font-serif italic text-accent-soft">exist</span>.
      </h1>

      <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-white/60">
        {SITE.name}&apos;s portfolio lives on a single page — everything is back at
        the top.
      </p>

      <Link
        href="/"
        className="mt-10 inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors duration-300 hover:bg-accent-soft"
      >
        Back to the portfolio
      </Link>
    </main>
  )
}

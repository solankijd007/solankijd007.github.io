'use client';

import { useEffect, useRef } from 'react';
import { PORTRAITS, usePortrait } from '../lib/portraits';
import { SITE } from '../lib/site';
import { PortraitSweep } from './PortraitSwap';

const FACTS = [
  '4 years shipping production web products',
  'Most recently Team Lead · AeonX Digital',
  'Node.js · TypeScript · React',
];

export default function Hero() {
  // The reveal lives on the portrait card, so mask coordinates are measured
  // against that box rather than the section.
  const mediaRef = useRef(null);
  const { index, swaps, next } = usePortrait();

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    // Only wire up cursor tracking where there is a real cursor. Coarse-pointer
    // devices get the finished portrait straight from CSS.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const onPointerMove = (event) => {
      // Coalesce to one write per animation frame — a pointermove can fire far
      // more often than the display refreshes.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // Measured fresh every time, so a window resize can never leave the
        // reveal tracking a stale box.
        const rect = media.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        media.style.setProperty('--mx', `${x}%`);
        media.style.setProperty('--my', `${y}%`);
      });
    };

    const onEnter = () => media.style.setProperty('--mr', '150px');
    const onLeave = () => media.style.setProperty('--mr', '0px');

    media.addEventListener('pointermove', onPointerMove, { passive: true });
    media.addEventListener('pointerenter', onEnter);
    media.addEventListener('pointerleave', onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      media.removeEventListener('pointermove', onPointerMove);
      media.removeEventListener('pointerenter', onEnter);
      media.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-ink pb-16 pt-28 md:pb-20"
    >
      {/* Ambient light behind the portrait so the hero isn't a flat black field. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-20 top-1/4 h-125 w-125 rounded-full bg-accent/6 blur-[130px]" />
        <div className="absolute inset-0 bg-grid opacity-2" />
      </div>

      {/* The portrait column is an explicit width, not `auto`: an auto track
          sizes to min-content, which collapses the card's `w-full` to nothing. */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20 lg:px-14">
        {/* Copy — second on phones so the portrait leads, first on desktop. */}
        <div className="order-2 lg:order-1">
          <p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-8 bg-accent/60" />
            {SITE.role} · {SITE.specialism}
          </p>

          {/* The visible H1 is the name alone — that is the design, and the name
              is the entity people search for. The appended span is off-screen
              only: it carries the role and location that a search engine wants
              inside the H1, and every word of it is already visible on the page
              (the eyebrow above, the Contact section's "Based in"). */}
          <h1
            id="hero-heading"
            className="text-balance text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {SITE.name}
            <span className="sr-only">
              {' '}
              — {SITE.role} ({SITE.specialism}) in {SITE.location}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-white/70 md:text-xl">
            I build and ship production SaaS{' '}
            <span className="font-serif italic text-white">end to end</span> — schema
            design through API, UI and release. Express and Next.js on the server,
            React on the client, MySQL and MongoDB behind Docker, Nginx and AWS.
          </p>

          <ul className="mt-10 max-w-xl space-y-2.5 border-t border-line pt-6 text-sm text-white/55">
            {FACTS.map((fact) => (
              // Aligned to the first line, not the block's centre — these facts
              // wrap to two lines on narrow screens.
              <li key={fact} className="flex gap-2.5">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {fact}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors duration-300 hover:bg-accent-soft"
            >
              View selected work
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </a>

            <a
              href="#contact"
              className="inline-flex items-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/5"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Portrait card.

            Deliberately a contained card rather than a full-bleed panel: the
            source photo is 410x530, so stretching it across a viewport-sized
            column would upscale it past the point where it still looks sharp.
            The aspect ratio matches the file exactly, so nothing is cropped.

            Each portrait renders twice — a desaturated base plate and a
            full-colour plate punched through by a cursor-following mask. Same
            file, one download.

            Clicking the card crossfades to the next portrait. The button
            carries the accessible name, so every image inside is decorative. */}
        {/* eslint-disable @next/next/no-img-element */}
        <div className="order-1 flex flex-col items-center lg:order-2">
          <button
            type="button"
            ref={mediaRef}
            onClick={next}
            aria-label={`Portrait of ${SITE.name}, ${SITE.role}. Click to switch photo.`}
            className="hero-stage portrait-card group relative aspect-41/53 w-full max-w-65 overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/60 transition-transform duration-300 active:scale-[0.98] sm:max-w-75 lg:max-w-95"
          >
            {PORTRAITS.map((photo, i) => (
              <span
                key={photo.label}
                data-active={i === index}
                className="portrait-plate absolute inset-0 block"
              >
                {/* Only the photo that renders on load carries alt text. The
                    button's aria-label is what screen readers announce either
                    way, but image search reads `alt` — and repeating the same
                    sentence on all four <img> tags on the page reads as
                    stuffing, so the rest stay empty and out of the a11y tree. */}
                <img
                  src={photo.src}
                  alt={i === 0 ? `${SITE.name}, ${SITE.role} based in ${SITE.location}` : ''}
                  aria-hidden={i === 0 ? undefined : 'true'}
                  // Only the portrait that renders on load competes for
                  // priority — the rest are 20KB of pre-warmed crossfade.
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                  className="hero-base absolute inset-0 h-full w-full object-cover"
                />
                <img
                  src={photo.src}
                  alt=""
                  aria-hidden="true"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                  className="hero-reveal absolute inset-0 h-full w-full object-cover"
                />
              </span>
            ))}

            <span className="hero-ring pointer-events-none absolute inset-0" />

            <PortraitSweep swaps={swaps} />
          </button>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import portrait from '../assets/portrait.webp';
import { SITE } from '../lib/site';

const portraitSrc = typeof portrait === 'string' ? portrait : portrait.src;

const FACTS = [
  '4 years shipping production web products',
  'Most recently Team Lead · AeonX Digital',
  'Node.js · TypeScript · React',
];

export default function Hero() {
  // The reveal lives on the portrait card, so mask coordinates are measured
  // against that box rather than the section.
  const mediaRef = useRef(null);

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

          <h1 className="text-balance text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {SITE.name}
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

            It renders twice — a desaturated base plate and a full-colour plate
            punched through by a cursor-following mask. Same file, one download. */}
        {/* eslint-disable @next/next/no-img-element */}
        <div className="order-1 flex flex-col items-center lg:order-2">
          <div
            ref={mediaRef}
            className="hero-stage relative aspect-41/53 w-full max-w-65 overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/60 sm:max-w-75 lg:max-w-95"
          >
            <img
              src={portraitSrc}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
              className="hero-base absolute inset-0 h-full w-full object-cover"
            />
            <img
              src={portraitSrc}
              alt={`${SITE.name} — ${SITE.role}`}
              fetchPriority="high"
              decoding="async"
              className="hero-reveal absolute inset-0 h-full w-full object-cover"
            />
            <div className="hero-ring pointer-events-none absolute inset-0" />
          </div>

          <p className="mt-5 hidden text-[11px] uppercase tracking-[0.3em] text-white/25 lg:block">
            Hover to reveal
          </p>
        </div>
      </div>
    </section>
  );
}

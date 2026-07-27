'use client';

import { useState, useEffect } from 'react';
import { SITE, asset } from '../lib/site';
import { PROJECTS } from '../lib/projects';
import { PORTRAITS, usePortrait } from '../lib/portraits';

/* Icons are inline rather than imported: four 24px glyphs is less markup than a
   dependency, and the whole site runs on next/react/react-dom alone. */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const IconBriefcase = (props) => (
  <svg viewBox="0 0 24 24" {...stroke} {...props}>
    <rect x="2.5" y="7" width="19" height="13" rx="2.5" />
    <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
    <path d="M2.5 12h19" />
  </svg>
);

const IconLayers = (props) => (
  <svg viewBox="0 0 24 24" {...stroke} {...props}>
    <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" />
    <path d="m3 13 9 4.5L21 13" />
  </svg>
);

const IconMail = (props) => (
  <svg viewBox="0 0 24 24" {...stroke} {...props}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="m3.5 7.5 7.3 5.1a2 2 0 0 0 2.4 0l7.3-5.1" />
  </svg>
);

const IconDownload = (props) => (
  <svg viewBox="0 0 24 24" {...stroke} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/* `id` is the section the tab points at — it is what the scroll spy matches.
   `avatar` swaps the glyph for the portrait, so the person is the first tab the
   way a messaging app puts the account last. `badge` mirrors a real count; it
   is derived, never a decorative number. */
const NAV_LINKS = [
  { name: 'About', href: '#about', id: 'about', avatar: true },
  { name: 'Experience', href: '#experience', id: 'experience', Icon: IconBriefcase },
  { name: 'Work', href: '#work', id: 'work', Icon: IconLayers, badge: PROJECTS.length },
  { name: 'Contact', href: '#contact', id: 'contact', Icon: IconMail },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  // '' while the hero fills the viewport — no tab is current on the way in.
  const [activeId, setActiveId] = useState('');
  const { index } = usePortrait();

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 40);

      /* Scroll spy. IntersectionObserver would need one entry per section plus
         a tie-break for the two that can be on screen at once; a probe line at
         45% of the viewport gives the same answer in one pass, and the sections
         are measured fresh so a resize or a reveal animation can't strand it.

         The bottom clamp is the standard last-section problem: #contact is
         short enough that the page can run out of scroll before its top ever
         crosses the probe. */
      const probe = window.innerHeight * 0.45;
      let current = '';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= probe) current = link.id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      setActiveId(atBottom ? NAV_LINKS[NAV_LINKS.length - 1].id : current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const activeIndex = NAV_LINKS.findIndex((link) => link.id === activeId);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-b border-line bg-ink/70 py-3 backdrop-blur-xl'
            : 'border-b border-transparent py-5'
        }`}
      >
        {/* Both navs are labelled — two unlabelled navigation landmarks on one
            page give assistive tech no way to tell them apart. */}
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 lg:px-14"
        >
          {/* -m-2/p-2 pushes the 36px badge out to a 52px tap area without
              changing where the logo sits. */}
          <a
            href="#top"
            className="group -m-2 flex items-center gap-3 p-2"
            aria-label={`${SITE.name} — back to top`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-[13px] font-bold tracking-tight text-white transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
              JS
            </span>
            <span className="hidden text-sm font-medium tracking-wide text-white/90 sm:block">
              {SITE.name}
            </span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                aria-current={activeId === link.id ? 'true' : undefined}
                className={`tap group relative text-sm font-medium transition-colors duration-300 hover:text-white ${
                  activeId === link.id ? 'text-white' : 'text-white/55'
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1.5 h-px bg-accent transition-all duration-300 group-hover:left-0 group-hover:w-full ${
                    activeId === link.id ? 'left-0 w-full' : 'left-1/2 w-0'
                  }`}
                />
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a
              href={asset(SITE.resume)}
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Resume
              <IconDownload width="13" height="13" strokeWidth="2.5" aria-hidden="true" />
            </a>
          </div>

          {/* Phones navigate from the dock at the bottom, so the only thing the
              top bar still has to carry is the CV — 44px tall, as the rest of
              the touch targets on the site. */}
          <a
            href={asset(SITE.resume)}
            download
            className="-mr-1 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-[13px] font-medium tracking-wide text-white transition-colors duration-300 active:border-accent active:text-accent md:hidden"
          >
            <IconDownload width="14" height="14" aria-hidden="true" />
            Resume
          </a>
        </nav>
      </header>

      {/* ------------------------------------------------------------------
          Mobile dock

          A fullscreen menu behind a hamburger costs two taps and hides the
          page to show four links. The dock keeps all four one thumb-stretch
          away and doubles as a position indicator, which the overlay could
          never be. Desktop is untouched — it has the room for a real nav.
          ------------------------------------------------------------------ */}
      {/* The scrim is on the wrapper, not a sibling above the dock: the dock is
          inset from the edges, and a scrim that stops where the dock starts
          leaves a strip of live page showing through the gap underneath it. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-linear-to-t from-ink from-40% via-ink/80 to-transparent pt-20 md:hidden">
        <div className="px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <nav
            aria-label="Sections"
            className="pointer-events-auto relative mx-auto flex max-w-md items-stretch overflow-hidden rounded-[26px] border border-white/10 bg-ink-2/85 p-1.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            {/* One indicator that slides, rather than a background per tab: the
                movement is what tells you the page moved under you. Equal-width
                tabs make the transform a plain multiple of the tab width. */}
            <span
              aria-hidden="true"
              style={{
                width: `${100 / NAV_LINKS.length}%`,
                transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
              }}
              className={`pointer-events-none absolute inset-y-1.5 left-1.5 -z-0 rounded-[20px] border border-white/8 bg-white/8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activeIndex < 0 ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative z-10 flex flex-1 flex-col items-center justify-center gap-1 rounded-[20px] px-1 py-2 transition-colors duration-300 ${
                    isActive ? 'text-accent' : 'text-white/45'
                  }`}
                >
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    {link.avatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element --
                         static export runs with images.unoptimized, so
                         next/image would ship JS and optimize nothing. */
                      <img
                        src={PORTRAITS[index].src}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className={`h-6 w-6 rounded-full object-cover object-top ring-1 transition-all duration-500 ${
                          isActive
                            ? 'ring-accent grayscale-0'
                            : 'ring-white/20 grayscale opacity-70'
                        }`}
                      />
                    ) : (
                      <link.Icon width="22" height="22" aria-hidden="true" />
                    )}

                    {link.badge ? (
                      <span
                        aria-hidden="true"
                        className={`absolute -right-2 -top-1.5 min-w-4 rounded-full px-1 text-[10px] font-semibold leading-4 transition-colors duration-300 ${
                          isActive ? 'bg-accent text-ink' : 'bg-white/15 text-white/70'
                        }`}
                      >
                        {link.badge}
                      </span>
                    ) : null}
                  </span>

                  {/* No tracking and no wrapping: at 320px a tab is ~71px wide
                      and "Experience" is the longest label on the site — letter
                      spacing is what would push it onto a second line. */}
                  <span className="whitespace-nowrap text-[10px] font-medium leading-none">
                    {link.name}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

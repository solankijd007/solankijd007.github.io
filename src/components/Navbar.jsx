'use client';

import { useState, useEffect } from 'react';
import { SITE, asset } from '../lib/site';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Work', href: '#work' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setIsScrolled(window.scrollY > 40);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Lock body scroll while the fullscreen menu is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Escape closes the menu.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-b border-line bg-ink/70 py-3 backdrop-blur-xl'
            : 'border-b border-transparent py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 lg:px-14">
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
                className="tap group relative text-sm font-medium text-white/55 transition-colors duration-300 hover:text-white"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-1/2 h-px w-0 bg-accent transition-all duration-300 group-hover:left-0 group-hover:w-full" />
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
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>

          {/* Explicit 44x44 — this is the only way into the nav on a phone. */}
          <button
            type="button"
            className="relative z-50 -mr-2.5 flex h-11 w-11 items-center justify-center text-white md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="flex h-5 w-6 flex-col justify-between">
              <span
                className={`h-px w-full bg-white transition-transform duration-300 ${
                  isMenuOpen ? 'translate-y-2.5 rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-full bg-white transition-opacity duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-px w-full bg-white transition-transform duration-300 ${
                  isMenuOpen ? '-translate-y-2.5 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile menu — smooth fade & scale transition without clip-path GPU repaint glitch on mobile */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink/95 backdrop-blur-2xl transition-all duration-300 ease-out md:hidden ${
          isMenuOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex flex-col items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              className="px-6 py-2 text-3xl font-light tracking-wide text-white/60 transition-colors duration-300 hover:text-white"
            >
              {link.name}
            </a>
          ))}

          <a
            href={asset(SITE.resume)}
            download
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={() => setIsMenuOpen(false)}
            className="mt-6 rounded-full border border-white/25 px-8 py-3 text-sm tracking-wide text-white transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Download Resume
          </a>
        </nav>
      </div>
    </>
  );
}

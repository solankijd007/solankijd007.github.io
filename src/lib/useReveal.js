'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll-reveal via IntersectionObserver — the zero-dependency replacement for
 * GSAP + ScrollTrigger (~70KB gzip saved).
 *
 * Attach the returned ref to a section. When that section scrolls into view the
 * section gets an `.in` class, and CSS animates every `[data-reveal]` descendant.
 * Stagger a child by giving it `style={{ '--d': '120ms' }}`.
 *
 * The observer disconnects after the first hit, so nothing keeps running once
 * the section has been seen.
 */
export function useReveal({ threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer support, or the visitor asked for reduced motion → show it now.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.add('in');
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('in');
        io.disconnect();
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

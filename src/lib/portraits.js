'use client';

import { useCallback, useSyncExternalStore } from 'react';
import portrait from '../assets/portrait.webp';
import portraitFormal from '../assets/portrait-alt.webp';

// Both import shapes, same as everywhere else in the app.
const url = (mod) => (typeof mod === 'string' ? mod : mod.src);

// Index 0 is the default — what the site renders on load and on the server.
export const PORTRAITS = [
  { src: url(portrait), label: 'Casual' },
  { src: url(portraitFormal), label: 'Formal' },
];

/* ---------------------------------------------------------------------------
   The portrait appears in both the Hero and the About section. A module-level
   store keeps them on the same photo, so clicking either one reads as a single
   site-wide toggle rather than two widgets that can disagree.

   Only the swap count is stored: the active index is derived from it, which
   keeps the snapshot a primitive (useSyncExternalStore compares by identity, so
   returning a fresh object here would loop) and still gives components a value
   that changes on every click — the sweep animation is keyed on it to replay.
   --------------------------------------------------------------------------- */

let swaps = 0;
const listeners = new Set();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => swaps;
// The server has no click history, and neither does the first client render.
const getServerSnapshot = () => 0;

export function usePortrait() {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const next = useCallback(() => {
    swaps += 1;
    emit();
  }, []);

  return { index: count % PORTRAITS.length, swaps: count, next };
}

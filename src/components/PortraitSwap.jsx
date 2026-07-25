'use client';

import { useState } from 'react';

/**
 * The light that crosses a portrait card on each swap.
 *
 * It unmounts itself the moment the animation ends rather than staying in the
 * DOM at zero opacity. A CSS animation with no fill-mode falls back to the
 * element's own style when it finishes, so anything that keeps the element
 * around is one stale stylesheet away from parking a bright band across the
 * photo. Nothing in the tree means nothing to leave behind.
 */
export function PortraitSweep({ swaps }) {
  const [settled, setSettled] = useState(0);

  if (swaps <= settled) return null;

  return (
    <span
      // Keyed on the swap count so a click mid-sweep restarts the animation
      // instead of being swallowed by the one already running.
      key={swaps}
      aria-hidden="true"
      onAnimationEnd={() => setSettled(swaps)}
      className="portrait-sweep pointer-events-none absolute inset-0"
    />
  );
}


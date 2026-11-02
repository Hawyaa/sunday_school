'use client';

/**
 * YouTubeBackground: a muted, looping, controls-free YouTube video that fills its
 * (positioned) parent like a CSS background. Works with Shorts (vertical 9:16):
 * full width, cropped top and bottom.
 *
 * - Renders nothing for visitors who prefer reduced motion (parent keeps its poster).
 * - Fades in after the video has had time to start, so the poster never flashes.
 * - Fully self-contained: no CSS file needed.
 */

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

interface Props {
  videoId: string;
  /** Wait this long after the iframe loads before fading it in. */
  fadeInDelayMs?: number;
}

export function YouTubeBackground({ videoId, fadeInDelayMs = 1200 }: Props) {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    const t = window.setTimeout(() => setVisible(true), fadeInDelayMs);
    return () => window.clearTimeout(t);
  }, [loaded, fadeInDelayMs]);

  if (reduced) return null;

  const src =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
    `&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <iframe
        src={src}
        title="Background video"
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        onLoad={() => setLoaded(true)}
        className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 border-0"
        style={{ aspectRatio: '9 / 16' }}
      />
    </div>
  );
}
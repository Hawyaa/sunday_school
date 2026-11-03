'use client';

/**
 * motion.tsx  (components/reports/motion.tsx)
 *
 * Tiny scroll-animation helpers for the Reports page (no extra libraries):
 *   useInView()  – true once the element has entered the viewport (observer is cleaned up)
 *   <RmGroup>    – a wrapper that flips data-shown when it scrolls into view; children marked
 *                  with data-rm="up|right|scale|line|zoom" + style={rmDelay(ms)} animate in
 *   <WordReveal> – word-by-word reveal (use inside an RmGroup)
 *   rmDelay()    – sets the stagger delay
 *
 * Animations play once per mount. Navigating away and back mounts the page again, so they replay;
 * ordinary re-renders do not. Styles live in ReportsMotion.css (skipped for reduced motion).
 */

import './ReportsMotion.css';
import React, { useEffect, useRef, useState } from 'react';

export const rmDelay = (ms: number) => ({ '--rm-d': `${ms}ms` }) as React.CSSProperties;

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -5% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, shown] as const;
}

interface RmGroupProps {
  children: React.ReactNode;
  className?: string;
  /** animate the group root itself: 'up' | 'right' | 'scale' | 'line' | 'zoom' */
  rm?: string;
  delay?: number;
  /** draw the gold corner ornaments (direct <img> children) outward from their corners */
  orn?: boolean;
  threshold?: number;
  as?: React.ElementType;
}

export function RmGroup({ children, className, rm, delay = 0, orn, threshold, as: Tag = 'div' }: RmGroupProps) {
  const [ref, shown] = useInView<HTMLElement>(threshold);
  return React.createElement(
    Tag,
    {
      ref,
      className,
      'data-rm-group': '',
      'data-rm': rm,
      'data-rm-orn': orn ? '' : undefined,
      'data-shown': shown,
      style: rmDelay(delay),
    },
    children,
  );
}

export function WordReveal({ text, delay = 0, step = 70 }: { text: string; delay?: number; step?: number }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      {text.split(' ').map((w, i) => (
        <React.Fragment key={i}>
          <span className="rm-word" aria-hidden="true">
            <span style={{ '--i': i, '--rm-d': `${delay}ms`, '--rm-step': `${step}ms` } as React.CSSProperties}>{w}</span>
          </span>{' '}
        </React.Fragment>
      ))}
    </>
  );
}
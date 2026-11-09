'use client';

/**
 * GalleryLightbox.tsx
 *
 * Fullscreen image viewer:
 * - scale + fade in, gradual backdrop, fade + scale-down out
 * - caption + counter, Previous / Next buttons
 * - keyboard: ← → to navigate, Esc to close, Tab is trapped inside
 * - touch: swipe left/right to navigate
 * - locks page scroll, restores focus on close, preloads neighbouring images
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface LightboxItem {
  src: string;
  alt: string;
  title: string;
}

interface Props {
  items: LightboxItem[];
  index: number;
  isAm: boolean;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'm14.5 6-6 6 6 6' : 'm9.5 6 6 6-6 6'} />
  </svg>
);

export function GalleryLightbox({ items, index, isAm, onIndexChange, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [dir, setDir] = useState<0 | 1 | -1>(0);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const total = items.length;
  const item = items[index];

  const requestClose = useCallback(() => {
    if (closing) return;
    if (prefersReduced()) {
      onClose();
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 280);
  }, [closing, onClose]);

  const go = useCallback(
    (d: 1 | -1) => {
      if (total < 2 || closing) return;
      setDir(d);
      onIndexChange((index + d + total) % total);
    },
    [total, closing, index, onIndexChange],
  );

  // lock scroll, move focus in, restore on unmount
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      window.clearTimeout(closeTimer.current);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])');
        if (!focusables || !focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (!dialogRef.current?.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, requestClose]);

  // preload neighbours so next/prev feels instant
  useEffect(() => {
    if (total < 2) return;
    [1, -1].forEach((d) => {
      const n = items[(index + d + total) % total];
      if (n) new Image().src = n.src;
    });
  }, [index, items, total]);

  // cached images can finish before React's onLoad fires
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoadedSrc(item?.src ?? null);
  }, [item?.src]);

  if (!item) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const btn =
    'gl-lb-btn gl-lb-ctrl absolute grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#C99A3B]/70 bg-black/45 text-white outline-hidden focus-visible:ring-2 focus-visible:ring-[#C99A3B]';

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      data-closing={closing}
      className="gl-lb fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="gl-lb-backdrop absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={requestClose} aria-hidden="true" />

      <div className="gl-lb-stage pointer-events-none relative flex max-h-full w-full max-w-5xl flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={item.src}
          ref={imgRef}
          src={item.src}
          alt={item.alt}
          draggable={false}
          data-loaded={loadedSrc === item.src}
          onLoad={() => setLoadedSrc(item.src)}
          className={`gl-lb-img pointer-events-auto max-h-[78vh] max-w-full select-none rounded-xl object-contain shadow-2xl ${
            dir === 1 ? 'gl-lb-next' : dir === -1 ? 'gl-lb-prev' : ''
          }`}
        />
        <div key={`cap-${index}`} className="gl-lb-caption pointer-events-auto mt-3 text-center" aria-live="polite">
          <p className="text-sm font-semibold text-white">{item.title}</p>
          {total > 1 && (
            <p className="mt-0.5 text-xs font-medium text-white/60">
              {index + 1} / {total}
            </p>
          )}
        </div>
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={requestClose}
        aria-label={isAm ? 'ዝጋ' : 'Close'}
        className={`${btn} right-3 top-3 sm:right-5 sm:top-5`}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>

      {total > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label={isAm ? 'ቀዳሚ' : 'Previous photo'} className={`${btn} left-2 top-1/2 -mt-[22px] sm:left-5`}>
            <Chevron dir="left" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={isAm ? 'ቀጣይ' : 'Next photo'} className={`${btn} right-2 top-1/2 -mt-[22px] sm:right-5`}>
            <Chevron dir="right" />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}

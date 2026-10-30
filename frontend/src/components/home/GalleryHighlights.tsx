'use client';

/**
 * GalleryHighlights.tsx
 *
 * Infinite, seamless, right-to-left auto-scrolling gallery.
 * - Continuous movement via rAF + translate3d (GPU, no layout work).
 * - Eases to a stop on hover/focus and eases back up (no abrupt stops).
 * - Drag with mouse or swipe on touch, with a little momentum on release.
 * - Wraps by exactly one set width, so there is never a jump or blank gap.
 * - Pauses its loop when off-screen; respects prefers-reduced-motion.
 */

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Reveal } from '@/components/motion/Reveal';

interface GalleryCardItem {
  id: string;
  title: string;
  titleAm?: string;
  subtitle: string;
  subtitleAm?: string;
  image: string;
}

const GALLERY_CARDS: GalleryCardItem[] = [
  {
    id: '1',
    title: 'Icon of the Last Supper',
    titleAm: 'የምስጢረ ቍርባን ቅዱስ ሥዕል',
    subtitle: 'Teaching from sacred art',
    subtitleAm: 'ከቅዱስ ጥበብ የተገኘ ትምህርት',
    image: 'https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
  },
  {
    id: '2',
    title: 'Feast Day Celebration',
    titleAm: 'የዓመቱ በዓል አከባበር',
    subtitle: 'Clergy, believers, and the holy mission',
    subtitleAm: 'የካህናትና የምእመናን መንፈሳዊ ጉባኤ',
    image: 'https://i.pinimg.com/474x/dd/8a/ac/dd8aacb498e705f0a0f5ed84adec2714.jpg',
  },
  {
    id: '3',
    title: 'Holy Saturday Service',
    titleAm: 'የቀዳም ስዑር አገልግሎት',
    subtitle: 'A moment of faith and devotion',
    subtitleAm: 'የእምነትና የተመስጦ ቅጽበት',
    image: 'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg',
  },
  {
    id: '4',
    title: 'The Life of Saint Mary',
    titleAm: 'የእመቤታችን ሕይወት',
    subtitle: 'Grace and humility',
    subtitleAm: 'ጸጋና ትህትና',
    image: 'https://i.pinimg.com/736x/d5/e8/67/d5e86784cc782e8616d91447b16109fb.jpg',
  },
  {
    id: '5',
    title: 'The Ethiopian Church',
    titleAm: 'የኢትዮጵያ ቤተክርስቲያን',
    subtitle: 'History and living tradition',
    subtitleAm: 'ታሪክና ሕያው ትውፊት',
    image: 'https://i.pinimg.com/474x/01/07/1a/01071ab849ad7fa0f5d7f99da080ef72.jpg',
  },
];

/** Auto-scroll speed in px per second (right → left) */
const SPEED = 45;
const MAX_FLING = 1400;

export function GalleryHighlights() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(3);

  // Mutable animation state (kept out of React state so it never re-renders)
  const st = useRef({
    offset: 0,
    speed: 0,
    setW: 0,
    hover: false,
    focus: false,
    pressed: false,
    dragging: false,
    moved: false,
    startX: 0,
    lastX: 0,
    lastT: 0,
    vel: 0,
    reduced: false,
    raf: 0,
    last: 0,
  });

  useEffect(() => {
    const s = st.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const first = firstSetRef.current;
    if (!viewport || !track || !first) return;

    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // One "set" = all cards + trailing gap, so wrapping by setW is pixel-perfect
    const measure = () => {
      s.setW = first.offsetWidth;
      if (s.setW > 0) {
        setCopies(Math.max(2, Math.ceil(viewport.offsetWidth / s.setW) + 1));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(first);
    ro.observe(viewport);

    const tick = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 0.05);
      s.last = now;

      const base = s.reduced ? 0 : SPEED;
      const target = s.hover || s.focus || s.dragging ? 0 : base;
      // Ease toward the target speed: smooth stop on hover, smooth resume after
      s.speed += (target - s.speed) * Math.min(1, dt * 5);

      if (!s.dragging) s.offset += s.speed * dt;
      if (s.setW > 0) s.offset = ((s.offset % s.setW) + s.setW) % s.setW;

      track.style.transform = `translate3d(${-s.offset}px,0,0)`;
      s.raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (s.raf) return;
      s.last = performance.now();
      s.raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };

    // Only animate while the gallery is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start();
      else stop();
    });
    io.observe(viewport);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  /* ---------- Pointer handlers (drag / swipe) ---------- */

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const s = st.current;
    s.pressed = true;
    s.moved = false;
    s.startX = s.lastX = e.clientX;
    s.lastT = performance.now();
    s.vel = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = st.current;
    if (!s.pressed) return;

    if (!s.dragging) {
      if (Math.abs(e.clientX - s.startX) < 6) return; // click, not a drag
      s.dragging = true;
      s.moved = true;
      viewportRef.current?.setPointerCapture(e.pointerId);
    }

    const now = performance.now();
    const dx = e.clientX - s.lastX;
    const dt = Math.max((now - s.lastT) / 1000, 0.001);
    s.offset -= dx;
    s.vel = s.vel * 0.7 + (-dx / dt) * 0.3;
    s.lastX = e.clientX;
    s.lastT = now;
  };

  const endPress = (e: React.PointerEvent) => {
    const s = st.current;
    if (!s.pressed) return;
    s.pressed = false;
    if (s.dragging) {
      s.dragging = false;
      viewportRef.current?.releasePointerCapture?.(e.pointerId);
      const stale = performance.now() - s.lastT > 80;
      const v = stale ? 0 : s.vel;
      // Hand the release velocity to the loop; it eases back to base speed
      s.speed = Math.max(-MAX_FLING, Math.min(MAX_FLING, v));
    }
    s.vel = 0;
  };

  return (
    <section aria-label="Gallery Highlights" className="w-full bg-[#0B1528] text-white py-14 sm:py-16 my-8 overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <Reveal className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C99A3B] block mb-1">
              {isAm ? 'ጋለሪ' : 'GALLERY'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {isAm ? 'የጋለሪ ድምቀቶች' : 'Gallery Highlights'}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-semibold text-[#C99A3B] hover:underline transition-all"
          >
            {isAm ? 'ሁሉንም ይመልከቱ' : 'View All'} →
          </Link>
        </Reveal>
      </div>

      {/* Full-bleed slider */}
      <Reveal variant="fade" delay={150}>
        <div
          ref={viewportRef}
          role="region"
          aria-label={isAm ? 'የጋለሪ ተንሸራታች' : 'Gallery slider'}
          className="relative cursor-grab active:cursor-grabbing select-none py-4"
          style={{
            touchAction: 'pan-y',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPress}
          onPointerCancel={endPress}
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') st.current.hover = true;
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') st.current.hover = false;
          }}
          onFocus={() => (st.current.focus = true)}
          onBlur={() => (st.current.focus = false)}
          // Swallow the click that ends a drag so links don't fire
          onClickCapture={(e) => {
            if (st.current.moved) {
              e.preventDefault();
              e.stopPropagation();
              st.current.moved = false;
            }
          }}
        >
          <div ref={trackRef} className="flex w-max will-change-transform">
            {Array.from({ length: copies }).map((_, copyIdx) => (
              <div
                key={copyIdx}
                ref={copyIdx === 0 ? firstSetRef : undefined}
                aria-hidden={copyIdx > 0}
                className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6"
              >
                {GALLERY_CARDS.map((card) => (
                  <Link
                    key={card.id}
                    href="/gallery"
                    draggable={false}
                    tabIndex={copyIdx > 0 ? -1 : 0}
                    className="group relative flex shrink-0 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#070D18] p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C99A3B] hover:shadow-2xl w-[250px] sm:w-[320px] lg:w-[380px] aspect-[4/3]"
                  >
                    <img
                      src={card.image}
                      alt={copyIdx === 0 ? card.title : ''}
                      draggable={false}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity group-hover:opacity-90"
                    />

                    <div className="relative z-10">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                        {isAm && card.titleAm ? card.titleAm : card.title}
                      </h3>
                      <p className="text-xs text-white/70 mt-1">
                        {isAm && card.subtitleAm ? card.subtitleAm : card.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
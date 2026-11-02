'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

/** Moves its child slightly slower than scroll. Parent should be overflow-hidden. */
export function Parallax({ children, speed = 0.1, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const s = window.innerWidth < 768 ? speed * 0.5 : speed;
      const offset = (vh / 2 - (r.top + r.height / 2)) * s;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
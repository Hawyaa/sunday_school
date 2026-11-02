'use client';

import React, { useEffect, useRef, useState } from 'react';

type Variant = 'up' | 'fade' | 'zoom' | 'left' | 'right';

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  /** ms, use index * 100 for staggering */
  delay?: number;
  className?: string;
}

export function Reveal({ children, variant = 'up', delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect(); // play once, never repeat
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={`reveal reveal-${variant} ${shown ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
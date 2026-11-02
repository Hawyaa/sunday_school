'use client';

/**
 * SiteLogo.tsx   →  src/components/layout/SiteLogo.tsx
 *
 * Round logo used in the Header and Footer. Reads the URL from useSiteLogo(),
 * so changing it once in the admin updates both places.
 */

import React from 'react';
import { useSiteLogo } from '@/lib/useSiteLogo';

interface Props {
  size?: number;
  className?: string;
}

export function SiteLogo({ size = 48, className = '' }: Props) {
  const src = useSiteLogo();

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="አቡነ ሚዲያ – Abune Media logo"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover border-2 border-[#C99A3B] bg-white shrink-0 ${className}`}
    />
  );
}
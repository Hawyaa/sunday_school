/**
 * PortalHero.tsx
 * Plain cream inner-page hero (no photo) shared by /login and /register.
 */

import React from 'react';
import Link from 'next/link';

export function PortalHero({ crumb, title, subtitle }: { crumb: string; title: string; subtitle: string }) {
  return (
    <section className="border-b-2 border-[#c8952f] bg-[#f5eee1]">
      <div className="relative mx-auto max-w-[1536px] px-4 py-8 sm:px-8 lg:px-[56px]">
        <img src="/images/cross.png" alt="" aria-hidden="true" className="pointer-events-none absolute left-4 top-6 hidden h-[84px] w-auto drop-shadow-[0_2px_3px_rgba(120,80,10,0.25)] md:block lg:left-[56px]" />
        <div className="md:ml-[84px]">
          <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-2.5 font-['Crimson_Text',Georgia,serif] text-[15px] font-medium text-[#0f2352]">
            <Link href="/">Home</Link>
            <span className="text-[#c8952f]">›</span>
            <span>{crumb}</span>
          </nav>
          <h1 className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold leading-[1.1] text-[#0f2352] sm:text-[48px]">{title}</h1>
          <p className="mt-2 max-w-[520px] font-['Crimson_Text',Georgia,serif] text-[16px] leading-snug text-[#1c3a63]">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
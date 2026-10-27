'use client';

/**
 * TeachingsQuoteBanner.tsx — "Let Your Heart Be Taught" card with gold corner ornaments.
 * Needs: public/images/corner-ornament.png (top-right ornament; it is mirrored for the other corners) and public/images/cross.png.
 */

import React from 'react';
import { Cross } from '@/components/home/Cross';

const corner = "absolute h-[46px] w-12 bg-[url('/images/corner-ornament.png')] bg-contain bg-center bg-no-repeat";

interface Props { title?: React.ReactNode; quote?: React.ReactNode; author?: string }

export function TeachingsQuoteBanner({
  title = <>Let Your Heart<br />Be Taught</>,
  quote = <>“The greatest teaching<br />is the life of the Church.”</>,
  author = '— St. Basil the Great',
}: Props) {
  return (
    <div className="relative rounded-xl border border-[#ecdcb8] bg-[#fffdf9] px-10 pb-5 pt-3.5 text-center shadow-[0_3px_14px_rgba(15,35,82,.05)]">
      <i aria-hidden className={`${corner} right-1.5 top-1.5`} />
      <i aria-hidden className={`${corner} left-1.5 top-1.5 -scale-x-100`} />
      <i aria-hidden className={`${corner} bottom-1.5 left-1.5 -scale-100`} />
      <i aria-hidden className={`${corner} bottom-1.5 right-1.5 -scale-y-100`} />

      <Cross className="mx-auto mb-1.5 h-14" />
      <h2 className="mb-3 text-[25px] font-bold leading-[1.25] text-[#0f2352]" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>{title}</h2>
      <q className="block font-['Crimson_Text',serif] text-lg italic leading-[1.4] text-[#26385a] [quotes:none]">{quote}</q>
      <small className="mt-4 block font-['Crimson_Text',serif] text-sm italic text-[#5a6b8c]">{author}</small>
    </div>
  );
}
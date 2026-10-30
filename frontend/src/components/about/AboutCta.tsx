'use client';

/**
 * AboutCta.tsx  (NEW)
 * "Be Part of Our Mission" strip. Add it last on the About page, before the site footer.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { PF, Icon } from './shared';

export function AboutCta() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section
      className="mt-[26px] border-t border-[#ece5d8] bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(90deg,rgba(251,248,243,.96),rgba(251,248,243,.7)),url('https://i.pinimg.com/474x/3b/9e/b5/3b9eb5a3ef7a8df03cf1fea3e666eb4f.jpg')" }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-5 px-4 py-6 sm:px-9">
        <img src="/images/cross.png" alt="" className="h-[68px] w-[42px] object-contain" />
        <div>
          <h3 className={`${PF} text-[19px] font-bold text-[#0f2352]`}>{am ? 'የተልዕኳችን አካል ይሁኑ' : 'Be Part of Our Mission'}</h3>
          <p className="text-xs text-[#39445d]">
            {am
              ? 'ሚዲያችንን፣ ትምህርታችንንና የማኅበረሰብ ፕሮግራሞቻችንን ይደግፉ። በአንድነት ትልቅ ተጽዕኖ መፍጠር እንችላለን።'
              : 'Support our media, education, and community programs. Together we can make a greater impact.'}
          </p>
        </div>
        <Link href="/contact" className="inline-flex items-center gap-2.5 rounded-full bg-[#0f2352] px-[26px] py-3 text-[12.5px] font-medium text-white sm:ml-auto">
          {am ? 'ይሳተፉ' : 'Get Involved'}
          <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
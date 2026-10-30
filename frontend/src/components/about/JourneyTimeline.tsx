'use client';

/**
 * JourneyTimeline.tsx
 * "A Path of Faith and Service": 5 milestones, 1998 to 2024.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { PF, Eyebrow, GoldButton, IconBadge, panel } from './shared';

const MILESTONES = [
  { year: '1998', icon: 'church', tEn: 'The Beginning', tAm: 'ጅማሬ',
    en: 'The initiative began with a vision to use technology for the Church’s teachings.',
    am: 'የቤተክርስቲያኗን መንፈሳዊ ትምህርቶች በዘመናዊ ቴክኖሎጂ ለማዳረስ የመጀመሪያው ራዕይ ተጠነሰሰ።' },
  { year: '2005', icon: 'laptop', tEn: 'Digital Platform', tAm: 'ዲጂታል መድረክ',
    en: 'Abune Media was officially established as a digital platform for the Ethiopian Orthodox Community.',
    am: 'አቡነ ሚዲያ ለኢትዮጵያ ኦርቶዶክስ ምዕመናን ማኅበረሰብ ይፋዊ ዲጂታል መድረክ ሆኖ ተመሠረተ።' },
  { year: '2012', icon: 'book', tEn: 'Content Expansion', tAm: 'የይዘት መስፋፋት',
    en: 'We expanded our content to include Mezmur, Teachings, and cultural heritage.',
    am: 'አገልግሎታችንን በማስፋት መዝሙራትን፣ የስብከት ትምህርቶችንና ቅርሶችን ማካተት ተጀመረ።' },
  { year: '2020', icon: 'mobile', tEn: 'Modern Platform', tAm: 'ዘመናዊ መድረክ',
    en: 'Launched our modern website and mobile platform to reach more people worldwide.',
    am: 'በዓለም ዙሪያ የሚገኙ ምዕመናንን በቀላሉ ለመድረስ ዘመናዊና ለተንቀሳቃሽ ስልክ ተስማሚ መድረክ ተዘረጋ።' },
  { year: '2024', icon: 'team', tEn: 'Growing Together', tAm: 'በአንድነት ማደግ',
    en: 'Today, we serve a global community with new programs, events, and resources.',
    am: 'ዛሬ በአዳዲስ ፕሮግራሞች፣ ዝግጅቶችና ግብዓቶች ዓለም አቀፍ ማኅበረሰብን እናገለግላለን።' },
];

export function JourneyTimeline() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section aria-label="Our Journey" className={`${panel} grid items-center gap-5 lg:grid-cols-[320px_1fr]`}>
      <div>
        <Eyebrow>{am ? 'ጉዟችን' : 'Our Journey'}</Eyebrow>
        <h2 className={`${PF} mb-2.5 text-[25px] font-bold leading-tight text-[#0f2352]`}>
          {am ? 'የእምነትና የአገልግሎት መንገድ' : 'A Path of Faith and Service'}
        </h2>
        <p className="mb-3.5 text-xs text-[#5a6479]">
          {am
            ? 'ከቀላል ጅማሬ ወደ ሚያድግ ማኅበረሰብ፤ ጉዟችን የክርስቶስን ብርሃን በሚዲያ፣ በትምህርትና በአገልግሎት ማስፋቱን ቀጥሏል።'
            : 'From a simple beginning to a growing community, our journey continues to spread the light of Christ through media, education, and service.'}
        </p>
        <GoldButton href="#">{am ? 'ታሪካችንን ይመልከቱ' : 'View Our Timeline'}</GoldButton>
      </div>

      <div className="relative grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-5">
        <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-6 hidden h-px bg-[#ecdab4] sm:block" />
        {[20, 40, 60, 80].map((x) => (
          <i key={x} aria-hidden="true" className="absolute top-[21px] hidden size-1.5 -translate-x-1/2 rounded-full bg-[#e09a2e] sm:block" style={{ left: `${x}%` }} />
        ))}
        {MILESTONES.map((m) => (
          <div key={m.year} className="relative text-center">
            <div className="mb-3.5 flex justify-center"><IconBadge name={m.icon} dark /></div>
            <b className="block text-[17px] text-[#0f2352]">{m.year}</b>
            <strong className="mb-1 mt-0.5 block text-[11.5px] text-[#0f2352]">{am ? m.tAm : m.tEn}</strong>
            <span className="block text-[10px] leading-[1.45] text-[#5a6479]">{am ? m.am : m.en}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
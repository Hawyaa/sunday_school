'use client';

/**
 * MissionVisionSection.tsx
 * Intro + Mission + Vision + Values card + Faith quote, all in one panel.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { PF, Eyebrow, IconBadge, card, panel } from './shared';
import { ValuesSection } from './ValuesSection';

export function MissionVisionSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section aria-label="Mission and Vision" className={`${panel} grid items-stretch gap-3.5 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr]`}>
      <div>
        <Eyebrow>{am ? 'ተልዕኮና ራዕይ' : 'Our Mission & Vision'}</Eyebrow>
        <h2 className={`${PF} mb-2.5 text-[25px] font-bold leading-tight text-[#0f2352]`}>
          {am ? 'በእምነት የሚመራ፣ በአገልግሎት የሚገፋ' : (<>Guided by Faith,<br />Driven by Service</>)}
        </h2>
        <p className="text-xs text-[#5a6479]">
          {am
            ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን መንፈሳዊ ቅርስ በዘመናዊ ሚዲያና ቴክኖሎጂ ለመጠበቅና ለማካፈል ቁርጠኞች ነን።'
            : 'We are committed to preserving and sharing the spiritual heritage of the Ethiopian Orthodox Tewahedo Church through modern media and technology.'}
        </p>
      </div>

      <div className={`${card} px-4 py-[18px]`}>
        <IconBadge name="book" />
        <h3 className={`${PF} mb-1.5 mt-3 text-sm font-semibold text-[#0f2352]`}>{am ? 'ተልዕኳችን' : 'Our Mission'}</h3>
        <p className="text-[10.5px] text-[#5a6479]">
          {am
            ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን ትምህርት፣ መንፈሳዊ እሴቶችና ባህላዊ ቅርስ ማዳረስ።'
            : 'To spread the teachings, spiritual values, and cultural heritage of the Ethiopian Orthodox Tewahedo Church.'}
        </p>
      </div>

      <div className={`${card} px-4 py-[18px]`}>
        <IconBadge name="eye" />
        <h3 className={`${PF} mb-1.5 mt-3 text-sm font-semibold text-[#0f2352]`}>{am ? 'ራዕያችን' : 'Our Vision'}</h3>
        <p className="text-[10.5px] text-[#5a6479]">
          {am
            ? 'በክርስቶስ ብርሃን የሚመራ፣ በእውቀት፣ በአገልግሎትና በፍቅር የተሳሰረ አንድ የምዕመናን ማኅበረሰብ።'
            : 'A united community of faithful, guided by the light of Christ, through knowledge, service, and love.'}
        </p>
      </div>

      <ValuesSection />

      {/* Faith quote card */}
      <div className={`${PF} relative flex min-h-[170px] flex-col items-center justify-center rounded-xl border border-[#ece5d8] bg-[#fbf7ee] px-[18px] pb-12 pt-[18px] text-center text-[14px] font-normal italic leading-[1.65] text-[#3b5278] shadow-[0_3px_14px_rgba(15,35,82,.05)]`}>
        <div>
          {am ? '“እምነት ሁሉን ነገር ያስችላል።”' : '“Faith makes everything possible.”'}
          <small className="mt-3.5 block font-sans text-[11px] font-normal not-italic text-[#5a6479]">— {am ? 'ማርቆስ 9፡23' : 'Mark 9:23'}</small>
        </div>

        {/* gold divider ornament (public/images/divider.png) */}
        <img src="/images/divider.png" alt="" aria-hidden="true" className="pointer-events-none absolute bottom-[22px] left-1/2 w-[84px] -translate-x-1/2 select-none" />
      </div>
    </section>
  );
}
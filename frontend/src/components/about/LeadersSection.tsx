'use client';

/**
 * LeadersSection.tsx
 * "The Legacy of Abune Diskoros": portrait, story, quote card.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';
import { PF, Eyebrow, GoldButton } from './shared';

export function LeadersSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <section aria-label="Legacy of Abune Diskoros" className="mt-[26px] grid items-center gap-8 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_1fr]">
      <div className="mx-auto w-[230px]">
        <img src="/images/abune-dioskoros.png" alt="Abune Diskoros" className="h-auto max-h-[260px] w-full object-contain mix-blend-multiply" />
      </div>

      <div>
        <Eyebrow>{am ? 'ታሪካችን' : 'Our Story'}</Eyebrow>
        <h2 className={`${PF} mb-3 text-[25px] font-bold leading-tight text-[#0f2352]`}>
          {am ? 'የአቡነ ዲዮስቆሮስ ቅርስ' : (<>The Legacy of<br />Abune Diskoros</>)}
        </h2>
        <p className="mb-3.5 text-[12.5px] text-[#39445d]">
          {am
            ? 'አቡነ ዲዮስቆሮስ (1935 – 2008) ራዕይ ያላቸው መሪ፣ ጥልቅ እምነት ያላቸውና የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ደከመኝ የማያውቁ አገልጋይ ነበሩ። ሕይወታቸውን ወንጌልን በማስፋፋት፣ ቤተክርስቲያንን በማጽናትና የምዕመናንን መንፈሳዊና ማኅበራዊ ሕይወት በማሳደግ ሰጥተዋል።'
            : 'Abune Diskoros (1935 – 2008) was a visionary leader, a man of deep faith, and a tireless servant of the Ethiopian Orthodox Tewahedo Church. He dedicated his life to spreading the Gospel, strengthening the Church, and uplifting the spiritual and social life of the faithful.'}
        </p>
        <GoldButton href="#">{am ? 'ተጨማሪ ያንብቡ' : 'Read More'}</GoldButton>
      </div>

      <div
        className={`${PF} relative overflow-hidden rounded-[14px] bg-[#eef3fa] bg-cover bg-[position:right_bottom] bg-no-repeat px-[30px] py-[26px] text-[17px] italic leading-[1.7] text-[#27406e] shadow-[0_4px_18px_rgba(15,35,82,.08)]`}
        style={{ backgroundImage: "linear-gradient(135deg,rgba(238,243,250,.94) 0%,rgba(228,237,248,.82) 50%,rgba(223,233,245,.1) 100%),url('https://i.pinimg.com/474x/af/2b/d5/af2bd5ef592a8983f5d51037e7e1bfe8.jpg')" }}
      >
        <img src="/images/cross.png" alt="" className="absolute right-4 top-3.5 h-[62px] w-[38px] object-contain" />
        <span className="block pr-10">
          {am ? '“እረኛ፣ መምህርና ለሁሉም አባት ነበሩ፤ በፍቅር፣ በጥበብና በትሕትና ይመሩን ነበር።”' : '“He was a shepherd, a teacher, and a father to all, guiding us with love, wisdom, and humility.”'}
        </span>
        <small className="mt-3.5 block font-sans text-[11.5px] text-[#5a6479]">— {am ? 'የኢትዮጵያ ኦርቶዶክስ ቤተክርስቲያን' : 'Ethiopian Orthodox Church'}</small>
      </div>
    </section>
  );
}
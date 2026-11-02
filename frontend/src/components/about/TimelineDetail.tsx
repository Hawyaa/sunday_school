'use client';

/**
 * TimelineDetail.tsx   →  src/components/about/TimelineDetail.tsx
 *
 * Full "Our Timeline" page: one section per year with a photo and the full story.
 * Photos live in public/images/timeline/<year>.jpg (see timelineData.ts).
 * If a photo is missing, a clean placeholder shows instead of a broken image.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { PF, Eyebrow, IconBadge } from './shared';
import { MILESTONES, type Milestone } from './timelineData';

function YearImage({ m, alt }: { m: Milestone; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl border border-[#ecdcb8] bg-[linear-gradient(135deg,#fdf7ea,#f1e3c3)]">
        <div className="text-center">
          <div className="mb-2 flex justify-center"><IconBadge name={m.icon} dark /></div>
          <span className={`${PF} text-4xl font-bold text-[#b9852a]`}>{m.year}</span>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={m.image}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="aspect-[4/3] w-full rounded-2xl border border-[#ecdcb8] object-cover shadow-[0_8px_24px_rgba(15,35,82,0.12)]"
    />
  );
}

export function TimelineDetail() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-16 pt-8 lg:px-8">
      {/* Back link */}
      <Link
        href="/about"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#35609a] hover:text-[#0f2352]"
      >
        <span aria-hidden="true">←</span>
        {am ? 'ወደ ስለ እኛ ተመለስ' : 'Back to About'}
      </Link>

      {/* Heading */}
      <header className="mb-8 max-w-[760px]">
        <Eyebrow>{am ? 'ጉዟችን' : 'Our Journey'}</Eyebrow>
        <h1 className={`${PF} mb-3 text-[38px] font-bold leading-[1.1] text-[#0f2352] lg:text-[52px]`}>
          {am ? 'የእምነትና የአገልግሎት መንገድ' : 'A Path of Faith and Service'}
        </h1>
        <p className="text-[16.5px] leading-[1.7] text-[#39445d]">
          {am
            ? 'ከጅማሬያችን እስከ ዛሬ ድረስ — እያንዳንዱ ዓመት ምን እንደተከናወነ ይመልከቱ።'
            : 'From our first steps to today — see what happened in each year of our story.'}
        </p>
      </header>

      {/* Year quick-jump */}
      <nav aria-label="Jump to year" className="sticky top-[76px] z-20 mb-10 flex flex-wrap gap-2 rounded-full border border-[#ecdcb8] bg-[#fffdf9]/90 px-3 py-2 backdrop-blur">
        {MILESTONES.map((m) => (
          <a
            key={m.year}
            href={`#y${m.year}`}
            className="rounded-full px-4 py-1.5 text-[13px] font-bold text-[#0f2352] transition hover:bg-[#0f2352] hover:text-white"
          >
            {m.year}
          </a>
        ))}
      </nav>

      {/* Years */}
      <div className="relative">
        {/* vertical gold line (desktop) */}
        <div aria-hidden="true" className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[#ecdab4] md:block" />

        <ol className="space-y-14 md:space-y-20">
          {MILESTONES.map((m, i) => {
            const flip = i % 2 === 1;
            const title = am ? m.tAm : m.tEn;
            const paragraphs = [am ? m.am : m.en, ...(am ? m.detailAm : m.detailEn)];

            return (
              <li
                key={m.year}
                id={`y${m.year}`}
                className="relative grid scroll-mt-32 items-center gap-6 md:grid-cols-2 md:gap-16"
              >
                {/* dot on the line */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 hidden size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#fffdf9] bg-[#e09a2e] shadow md:block"
                />

                <div className={flip ? 'md:order-2' : ''}>
                  <YearImage m={m} alt={`${m.year} – ${title}`} />
                </div>

                <div className={flip ? 'md:order-1 md:text-right' : ''}>
                  <div className={`mb-3 flex items-center gap-3 ${flip ? 'md:flex-row-reverse' : ''}`}>
                    <IconBadge name={m.icon} dark />
                    <span className={`${PF} text-[44px] font-bold leading-none text-[#b9852a]`}>{m.year}</span>
                  </div>
                  <h2 className={`${PF} mb-3 text-[26px] font-bold leading-tight text-[#0f2352]`}>{title}</h2>
                  <div className="space-y-3 text-[16px] leading-[1.75] text-[#39445d]">
                    {paragraphs.map((p, k) => (
                      <p key={k}>{p}</p>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
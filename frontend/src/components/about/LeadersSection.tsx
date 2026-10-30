'use client';

/**
 * LeadersSection.tsx — "The Legacy of Abune Diskoros"
 * Features gold arch portrait frame with badge, facts row, and expandable story.
 */

import React, { useId, useState } from 'react';
import { useAppStore } from '@/lib/store';

const MORE_EN: string[] = [
  'He served with tireless dedication, mentoring countless servants and teachers while nurturing the Sunday School movement across generations.',
  'His teachings and legacy continue to inspire our mission, grounding our digital outreach in the ancient traditions and living faith of the Ethiopian Orthodox Tewahedo Church.',
];

const MORE_AM: string[] = [
  'ስለ ቤተክርስቲያን ያከናወኑት ሥራ፣ ስላገለገሏቸው ማኅበረሰቦችና ስላነሳሷቸው ሰዎች ሁለተኛ አንቀጽ እዚህ ይጨምሩ።',
  'የፈለጉትን ያህል አንቀጾች ማከል ይችላሉ፤ እያንዳንዱ ጽሑፍ የራሱ አንቀጽ ይሆናል።',
];

export function LeadersSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';
  const [open, setOpen] = useState(false);
  const moreId = useId();

  const more = am ? MORE_AM : MORE_EN;

  return (
    <section className="about-legacy" aria-label="Legacy of Abune Diskoros">
      <div className="c">
        {/* Left: Golden Arch Portrait with Badge */}
        <div className="arch">
          <div className="ring" aria-hidden="true" />
          <div className="ph">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/abune-diskoros-portrait.png"
              alt="Abune Diskoros"
            />
          </div>
          <div className="badge">
            <b>1930 – 2008</b>
            <span>{am ? 'እረኛና መምህር' : 'Shepherd & teacher'}</span>
          </div>
        </div>

        {/* Right: Story & Facts */}
        <div>
          <div className="eyebrow">
            <i aria-hidden="true" />
            {am ? 'ታሪካችን' : 'Our story'}
          </div>
          <h2>
            {am ? (
              'የአቡነ ዲዮስቆሮስ ቅርስ'
            ) : (
              <>
                The Legacy of <em>Abune Diskoros</em>
              </>
            )}
          </h2>
          <p className="l">
            {am
              ? 'አቡነ ዲዮስቆሮስ (1930 – 2008) ራዕይ ያላቸው መሪ፣ ጥልቅ እምነት ያላቸውና የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ደከመኝ የማያውቁ አገልጋይ ነበሩ። ሕይወታቸውን ወንጌልን በማስፋፋት፣ ቤተክርስቲያንን በማጽናትና የምዕመናንን መንፈሳዊና ማኅበራዊ ሕይወት በማሳደግ ሰጥተዋል።'
              : 'Abune Diskoros was a visionary leader, a man of deep faith, and a tireless servant of the Ethiopian Orthodox Tewahedo Church. He dedicated his life to spreading the Gospel, strengthening the Church, and uplifting the spiritual and social life of the faithful.'}
          </p>

          {/* Expandable text */}
          <div
            id={moreId}
            className={`grid transition-all duration-500 ease-in-out ${
              open ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-3 pb-2 text-[17px] text-[#5b6479] leading-[1.7]">
                {more.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="facts">
            <div>
              <b>{am ? 'ወንጌል' : 'Gospel'}</b>
              <span>{am ? 'እምነትን ማስፋፋት' : 'Spread the faith'}</span>
            </div>
            <div>
              <b>{am ? 'ቤተክርስቲያን' : 'Church'}</b>
              <span>{am ? 'አካሉን ማጽናት' : 'Strengthened the body'}</span>
            </div>
            <div>
              <b>{am ? 'ምዕመናን' : 'Faithful'}</b>
              <span>{am ? 'ሕይወትን ማሳደግ' : 'Uplifted every life'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={moreId}
            className="btn dark"
          >
            {open
              ? am
                ? 'ጥቂት አሳይ ←'
                : 'Read Less ↑'
              : am
              ? 'ተጨማሪ ያንብቡ →'
              : 'Read More →'}
          </button>
        </div>
      </div>
    </section>
  );
}

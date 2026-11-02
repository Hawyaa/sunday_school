'use client';

/**
 * MissionVisionSection.tsx
 * "Guided by Faith, Driven by Service"
 * Matches the reference mockup:
 * - Header with eyebrow, Fraunces serif heading, and summary paragraph.
 * - 3 pillar cards: Mission, Vision (highlighted navy), Values (bulleted grid).
 * - Scripture banner with gold Orthodox cross and James 2:17.
 */

import React from 'react';
import { useAppStore } from '@/lib/store';

export function MissionVisionSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const values = [
    { en: 'Faith', am: 'እምነት' },
    { en: 'Community', am: 'ማኅበረሰብ' },
    { en: 'Knowledge', am: 'እውቀት' },
    { en: 'Compassion', am: 'ርኅራኄ' },
    { en: 'Integrity', am: 'ቅንነት' },
  ];

  return (
    <section className="about-guided" aria-label="Mission and Vision">
      <div className="c">
        {/* Header */}
        <div className="ghead">
          <div>
            <div className="eyebrow">
              <i />
              {am ? 'ተልዕኮና ራዕይ' : 'Our mission & vision'}
            </div>
            <h2>
              {am ? (
                'በእምነት የሚመራ፣ በአገልግሎት የሚገፋ'
              ) : (
                <>
                  Guided by Faith,
                  <br />
                  Driven by Service
                </>
              )}
            </h2>
          </div>
          <p>
            {am
              ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን መንፈሳዊ ቅርስ በዘመናዊ ሚዲያ፣ ትምህርትና እርስ በርስ በመተሳሰብ ለመጠበቅና ለማካፈል ቁርጠኞች ነን።'
              : 'We are committed to preserving and sharing the spiritual heritage of the Ethiopian Orthodox Tewahedo Church through worship, learning and care for one another.'}
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="pil">
          {/* Mission */}
          <div className="card">
            <div className="ic">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="12" cy="12" r="0.8" fill="currentColor" />
              </svg>
            </div>
            <h3>{am ? 'ተልዕኳችን' : 'Our Mission'}</h3>
            <p>
              {am
                ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን ትምህርት፣ መንፈሳዊ እሴቶችና ባህላዊ ቅርስ በፍቅር ማዳረስ።'
                : 'To proclaim the Gospel, nurture the faithful and serve the community with love.'}
            </p>
          </div>

          {/* Vision (Highlighted Navy) */}
          <div className="card hi">
            <div className="ic">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3>{am ? 'ራዕያችን' : 'Our Vision'}</h3>
            <p>
              {am
                ? 'በአበው እምነት የጸና፣ በእውቀትና በፍቅር የተሳሰረ አንድ የቤተክርስቲያን ማኅበረሰብ።'
                : 'A united, learned and compassionate church family, rooted in the faith of our fathers.'}
            </p>
          </div>

          {/* Values */}
          <div className="card">
            <div className="ic">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" />
              </svg>
            </div>
            <h3>{am ? 'እሴቶቻችን' : 'Our Values'}</h3>
            <ul>
              {values.map((v) => (
                <li key={v.en}>{am ? v.am : v.en}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verse Banner */}
        <div className="verse">
          <svg
            width="44"
            height="44"
            style={{ color: 'var(--gold)', flex: 'none' }}
            aria-hidden="true"
          >
            <use href="#x" />
          </svg>
          <q>
            {am
              ? 'ሥራ የሌለው እምነት ቢኖር በራሱ የሞተ ነው።'
              : 'Faith, if it hath not works, is dead, being alone.'}
          </q>
          <cite>{am ? 'ያዕቆብ 2፡17' : 'James 2:17'}</cite>
        </div>
      </div>
    </section>
  );
}

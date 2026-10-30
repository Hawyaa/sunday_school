'use client';

/**
 * ServicesContentSection.tsx
 * "More Ways to Serve"
 * 4 cards representing ministries/programs:
 * - Worship & Spiritual Music
 * - Community Service
 * - Cultural Heritage
 * - Events & Gatherings
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export function ServicesContentSection() {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const ways = [
    {
      href: '/mezmur',
      titleEn: 'Worship & Spiritual Music',
      titleAm: 'አምልኮና መንፈሳዊ መዝሙር',
      descEn: 'Join the choir and hymn ministry that leads our services.',
      descAm: 'አገልግሎታችንን የሚመሩትን የመዘምራንና የዜማ አገልግሎቶች ይቀላቀሉ።',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18V5l11-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
        </svg>
      ),
    },
    {
      href: '/announcements',
      titleEn: 'Community Service',
      titleAm: 'የማኅበረሰብ አገልግሎት',
      descEn: 'Support families in need through outreach and volunteer work.',
      descAm: 'በበጎ አድራጎትና ድጋፍ የተቸገሩ ቤተሰቦችን ይደግፉ።',
      icon: (
        <svg
          width="24"
          height="24"
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
      ),
    },
    {
      href: '/gallery',
      titleEn: 'Cultural Heritage',
      titleAm: 'ባህላዊና መንፈሳዊ ቅርስ',
      descEn: 'Preserve the language, art and traditions of the Church.',
      descAm: 'የቤተክርስቲያኗን ቋንቋ፣ ጥበብና ትውፊት እንጠብቃለን።',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 21h18M5 21V10l7-6 7 6v11M10 21v-6h4v6" />
        </svg>
      ),
    },
    {
      href: '/events',
      titleEn: 'Events & Gatherings',
      titleAm: 'በዓላትና ጉባኤዎች',
      descEn: 'Celebrate feasts, fasts and fellowship through the year.',
      descAm: 'በዓመቱ ሙሉ በዓላትን፣ ጾማትንና የኅብረት ጉባኤዎችን ያክብሩ።',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      ),
    },
  ];

  return (
    <section className="about-serve" aria-label="Our ministries">
      <div className="c">
        <div className="shead">
          <div>
            <div className="eyebrow">
              <i />
              {am ? 'አገልግሎቶቻችን' : 'Our ministries'}
            </div>
            <h2>{am ? 'ተጨማሪ የአገልግሎት መንገዶች' : 'More Ways to Serve'}</h2>
          </div>
          <p>
            {am
              ? 'በአገልግሎቶቻችን፣ በትምህርትና በማኅበረሰብ መርሐ ግብሮቻችን ለእያንዳንዱ አባል የሚሰጥበትና የሚያድግበት ስፍራ አለ።'
              : 'Through our ministries, education and community programs, there is a place for every member to give and to grow.'}
          </p>
        </div>

        <div className="ways">
          {ways.map((w) => (
            <Link key={w.titleEn} href={w.href} className="way">
              <span className="n">{w.icon}</span>
              <h3>{am ? w.titleAm : w.titleEn}</h3>
              <p>{am ? w.descAm : w.descEn}</p>
              <span className="m">
                {am ? 'ተጨማሪ ይመልከቱ →' : 'Learn more →'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

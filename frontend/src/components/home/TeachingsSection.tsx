'use client';

/**
 * TeachingsSection.tsx — "Featured Teachings" card with 4 teaching cards.
 * Now a card only (no outer section/width): the page puts it beside <GalleryHighlights />.
 * Props unchanged: items, isLoading.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import type { Teaching } from '@/types/teaching';
import { HomeIcon } from './HomeIcons';

const IMGS = [
  'https://i.pinimg.com/474x/3b/9e/b5/3b9eb5a3ef7a8df03cf1fea3e666eb4f.jpg',
  'https://i.pinimg.com/736x/d5/e8/67/d5e86784cc782e8616d91447b16109fb.jpg',
  'https://i.pinimg.com/236x/54/60/fa/5460fadba1fc15124905df442994a08a.jpg',
  'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg',
];
const PF = { fontFamily: '"Playfair Display", serif' };

interface Card { id: string; img: string; tag: string; title: string; desc: string; duration: string; link: string }

const FALLBACK: Card[] = [
  { id: 's1', img: IMGS[0]!, tag: 'Scripture', title: 'The Book of Psalms', desc: 'Discover wisdom, comfort, and strength found in the Psalms.', duration: '18 min', link: '/teachings' },
  { id: 's2', img: IMGS[1]!, tag: 'Faith & Life', title: 'The Life of Saint Mary', desc: 'A journey through the life, humility, and spiritual legacy of the Mother of God.', duration: '12 min', link: '/teachings' },
  { id: 's3', img: IMGS[2]!, tag: 'Church History', title: 'The Ethiopian Church', desc: 'Explore the history and enduring heritage of our holy church.', duration: '15 min', link: '/teachings' },
  { id: 's4', img: IMGS[3]!, tag: 'Faith & Life', title: 'The Meaning of the Cross', desc: 'Understanding the cross in our faith and daily life.', duration: '10 min', link: '/teachings' },
];

const toCard = (t: Teaching, i: number): Card => ({
  id: t.id, img: IMGS[i % IMGS.length]!, tag: t.category ?? 'Teaching', title: t.title,
  desc: t.content.slice(0, 90) + (t.content.length > 90 ? '…' : ''), duration: '—', link: `/teachings/${t.id}`,
});

interface Props { items: Teaching[]; isLoading?: boolean }

export function TeachingsSection({ items, isLoading = false }: Props) {
  const { locale } = useAppStore();
  const cards = (items.length > 0 ? items.map(toCard) : FALLBACK).slice(0, 4);

  return (
    <section aria-label="Featured Teachings" className="rounded-xl border border-[#ece5d8] bg-[#fffdf9] px-5 py-[18px] shadow-[0_3px_14px_rgba(15,35,82,.06)]">
      <div className="mb-3 flex items-center gap-2.5">
        <HomeIcon name="book" solid className="h-5 w-5 text-[#0f2352]" />
        <h3 className="text-[17px] font-semibold text-[#0f2352]" style={PF}>{locale === 'am' ? 'የተመረጡ ትምህርቶች' : 'Featured Teachings'}</h3>
        <Link href="/teachings" className="ml-auto flex items-center gap-1 text-[9.5px] font-medium text-[#2c5a8f]">
          {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'} <HomeIcon name="arrow" className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? [0, 1, 2, 3].map((i) => <div key={i} className="h-[240px] animate-pulse rounded-xl bg-[#f1ece0]" />)
          : cards.map((c) => (
              <article key={c.id} className="rounded-xl border border-[#ece5d8] bg-[#fffdf9] px-[7px] pb-2.5 pt-[7px] shadow-[0_3px_14px_rgba(15,35,82,.06)] transition hover:-translate-y-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.title} loading="lazy" referrerPolicy="no-referrer" className="h-20 w-full rounded-md object-cover" />
                <span className="mb-1.5 mt-2.5 inline-block rounded bg-[#f1ece0] px-[7px] py-0.5 text-[8px] text-[#5a6479]">{c.tag}</span>
                <h4 className="mb-1 text-[11px] font-semibold text-[#0f2352]" style={PF}>{c.title}</h4>
                <p className="min-h-[38px] text-[8.5px] leading-[1.5] text-[#5a6479]">{c.desc}</p>
                <div className="mt-2 flex items-center justify-between text-[9px] text-[#2c5a8f]">
                  <span className="flex items-center gap-[5px]"><HomeIcon name="clock" className="h-3 w-3" />{c.duration}</span>
                  <Link href={c.link} aria-label={`Open ${c.title}`}><HomeIcon name="arrow" className="h-3 w-3" /></Link>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
'use client';

/**
 * TeachingsSection.tsx
 *
 * "Wisdom for Your Journey" section:
 * 4 cards with category tags (Scripture, Saints, Heritage, Doctrine),
 * warm glowing imagery, serif titles, and clean descriptions.
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import type { Teaching } from '@/types/teaching';
import { Reveal } from '@/components/motion/Reveal';

interface TeachingCardData {
  id: string;
  category: string;
  title: string;
  titleAm?: string;
  description: string;
  descriptionAm?: string;
  image: string;
  link: string;
}

const FALLBACK_TEACHINGS: TeachingCardData[] = [
  {
    id: 'psalms',
    category: 'SCRIPTURE',
    title: 'The Book of Psalms',
    titleAm: 'መጽሐፈ መዝሙር',
    description: 'Discover wisdom, prayer, and faith through the Psalms.',
    descriptionAm: 'በመዝሙረ ዳዊት ውስጥ ጥበብንና ጸሎትን ይማሩ።',
    image: 'https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
    link: '/teachings',
  },
  {
    id: 'saint-mary',
    category: 'SAINTS',
    title: 'The Life of Saint Mary',
    titleAm: 'የእመቤታችን ሕይወት',
    description: 'A journey through the life, humility, and grace of Saint Mary.',
    descriptionAm: 'የእመቤታችን የቅድስት ድንግል ማርያም የቅድስናና የትህትና ሕይወት።',
    image: 'https://i.pinimg.com/736x/d5/e8/67/d5e86784cc782e8616d91447b16109fb.jpg',
    link: '/teachings',
  },
  {
    id: 'ethiopian-church',
    category: 'HERITAGE',
    title: 'The Ethiopian Church',
    titleAm: 'የኢትዮጵያ ቤተክርስቲያን',
    description: 'Explore the history, architecture, and traditions of the church.',
    descriptionAm: 'የጥንታዊቷ ቤተክርስቲያናችን ታሪክና ቅርሶች።',
    image: 'https://i.pinimg.com/474x/01/07/1a/01071ab849ad7fa0f5d7f99da080ef72.jpg',
    link: '/teachings',
  },
  {
    id: 'meaning-of-cross',
    category: 'DOCTRINE',
    title: 'The Meaning of the Cross',
    titleAm: 'የመስቀሉ ምስጢር',
    description: 'Understanding the cross in Orthodox faith and life.',
    descriptionAm: 'በኦርቶዶክሳዊ እምነት ውስጥ የመስቀሉ ምስጢርና ክብር።',
    image: 'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg',
    link: '/teachings',
  },
];

interface Props {
  items: Teaching[];
  isLoading?: boolean;
}

export function TeachingsSection({ items, isLoading = false }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  // Map real teachings if available, else use fallback
  const cards: TeachingCardData[] =
    items && items.length >= 4
      ? items.slice(0, 4).map((t, idx) => ({
          id: t.id,
          category: (t.category || ['SCRIPTURE', 'SAINTS', 'HERITAGE', 'DOCTRINE'][idx % 4]).toUpperCase(),
          title: t.title,
          titleAm: t.titleAm,
          description: t.content ? t.content.slice(0, 85) + '…' : 'Spiritual teachings for daily life.',
          descriptionAm: t.outline?.[0] || 'መንፈሳዊ ትምህርት ለእለት ተእለት ሕይወት።',
          image: t.imageUrl || FALLBACK_TEACHINGS[idx % 4]!.image,
          link: `/teachings/${t.id}`,
        }))
      : FALLBACK_TEACHINGS;

  return (
    <section aria-label="Featured Teachings" className="py-4">
      {/* Header */}
      <Reveal className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C99A3B] block mb-1">
            {isAm ? 'የተመረጡ ትምህርቶች' : 'FEATURED TEACHINGS'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F1B3E]">
            {isAm ? 'ለሕይወትዎ ጥበብ' : 'Wisdom for Your Journey'}
          </h2>
        </div>
        <Link
          href="/teachings"
          className="text-xs font-semibold text-[#505E7B] hover:text-[#C99A3B] transition-colors"
        >
          {isAm ? 'ሁሉንም ትምህርቶች ይመልከቱ' : 'View All Teachings'} →
        </Link>
      </Reveal>

      {/* 4 Cards Grid (staggered) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? [0, 1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-[#F5F2EB]" />
            ))
          : cards.map((c, i) => (
              <Reveal key={c.id} delay={i * 110} className="h-full">
                <Link
                  href={c.link}
                  className="group flex h-full flex-col bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_16px_rgba(15,27,62,0.04)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,27,62,0.1)] hover:border-[#C99A3B]"
                >
                  {/* Image Top Half with Category Tag */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#180A03]">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Category Pill */}
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-extrabold text-[#0F1B3E] uppercase tracking-wider shadow-sm">
                      {c.category}
                    </div>
                  </div>

                  {/* Content Bottom Half */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-serif text-base font-bold text-[#0F1B3E] group-hover:text-[#C99A3B] transition-colors leading-snug mb-1.5">
                      {isAm && c.titleAm ? c.titleAm : c.title}
                    </h3>
                    <p className="text-xs text-[#505E7B] leading-relaxed line-clamp-2">
                      {isAm && c.descriptionAm ? c.descriptionAm : c.description}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
      </div>
    </section>
  );
}
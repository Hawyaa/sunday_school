'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

interface GalleryItem {
  id: string;
  title: string;
  titleAm: string;
  subtitle: string;
  subtitleAm: string;
  image: string;
}

// Incorporating user-provided images and authentic Ethiopian Orthodox sacred art
const ROW_1_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Sacred Ethiopian Iconography',
    titleAm: 'የኢትዮጵያ ቅዱሳት ሥዕላት',
    subtitle: 'Ancient Manuscript Art',
    subtitleAm: 'የብራና ጥበብ',
    image: 'https://i.pinimg.com/474x/aa/b6/55/aab655bda9ce179c5c34b95c20816317.jpg',
  },
  {
    id: 'g-2',
    title: 'Liturgical Clergy & Golden Umbrella',
    titleAm: 'የካህናትና ዲያቆናት አገልግሎት',
    subtitle: 'Feast Day Liturgy',
    subtitleAm: 'የበዓላት ማዕርግ',
    image: 'https://i.pinimg.com/474x/56/af/4c/56af4cbb84cef34b0fb50b27bd176691.jpg',
  },
  {
    id: 'g-3',
    title: 'Icon of the Last Supper',
    titleAm: 'የምስጢረ ቍርባን ቅዱስ ሥዕል',
    subtitle: 'Sacred Art & Teaching',
    subtitleAm: 'ከቅዱስ ጥበብ የተገኘ ትምህርት',
    image: 'https://i.pinimg.com/474x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
  },
  {
    id: 'g-4',
    title: 'The Ethiopian Orthodox Cross',
    titleAm: 'የተዋሕዶ ቅዱስ መስቀል',
    subtitle: 'Symbol of Salvation',
    subtitleAm: 'የመዳናችን ምልክት',
    image: 'https://i.pinimg.com/474x/97/ab/5c/97ab5cea194f9cc2f4dc52294f585203.jpg',
  },
  {
    id: 'g-5',
    title: 'Feast Day Procession',
    titleAm: 'የበዓለ ንግሥ ታቦተ ሕጉ በረከት',
    subtitle: 'Fellowship & Joy',
    subtitleAm: 'የካህናትና የምእመናን ጉባኤ',
    image: 'https://i.pinimg.com/474x/dd/8a/ac/dd8aacb498e705f0a0f5ed84adec2714.jpg',
  },
  {
    id: 'g-6',
    title: 'The Life of Saint Mary',
    titleAm: 'የእመቤታችን ሕይወት',
    subtitle: 'Grace and Humility',
    subtitleAm: 'ጸጋና ትህትና',
    image: 'https://i.pinimg.com/736x/d5/e8/67/d5e86784cc782e8616d91447b16109fb.jpg',
  },
];

const ROW_2_ITEMS: GalleryItem[] = [
  {
    id: 'g-7',
    title: 'Holy Cross Demera Celebration',
    titleAm: 'የመስቀል ደመራ በዓል',
    subtitle: 'Living Heritage',
    subtitleAm: 'ሕያው ትውፊትና እምነት',
    image: 'https://i.pinimg.com/474x/90/a1/38/90a138c7f993d9fe23145ffb3d75151b.jpg',
  },
  {
    id: 'g-8',
    title: 'Sunday School Hymnody',
    titleAm: 'የሰንበት ት/ቤት ያሬዳዊ ዝማሬ',
    subtitle: 'Youth Devotion',
    subtitleAm: 'የወጣቶች መንፈሳዊ ተመስጦ',
    image: 'https://i.pinimg.com/474x/2b/a8/2f/2ba82f4f94b811c039d63c40c627a181.jpg',
  },
  {
    id: 'g-9',
    title: 'Apostolic Teaching & Blessing',
    titleAm: 'ሐዋርያዊ ትምህርትና ቡራኬ',
    subtitle: 'Patriarchal Tradition',
    subtitleAm: 'የአበው ቃል',
    image: '/images/abune-diskoros-portrait.png',
  },
  {
    id: 'g-10',
    title: 'Youth Orthodox Fellowship',
    titleAm: 'የወጣቶች መንፈሳዊ ሕብረት',
    subtitle: 'Growing in Truth',
    subtitleAm: 'በእውነትና በሕይወት ማደግ',
    image: 'https://i.pinimg.com/474x/12/35/bc/1235bcba17e0e7a2df26c518aa1fe911.jpg',
  },
  {
    id: 'g-11',
    title: 'Divine Liturgy Worship',
    titleAm: 'የቅዳሴ ጸሎትና ምስጋና',
    subtitle: 'Sacrament of Communion',
    subtitleAm: 'ምስጢረ ቍርባን',
    image: '/images/events/featured.jpg',
  },
  {
    id: 'g-12',
    title: 'Ancient Sanctuary Pilgrimage',
    titleAm: 'መንፈሳዊ ጉዞና በረከት',
    subtitle: 'Faithful Journey',
    subtitleAm: 'የቅዱሳን አደባባይ',
    image: '/images/hero/hero-2.jpg',
  },
];

function GalleryCard({ item, isAm }: { item: GalleryItem; isAm: boolean }) {
  return (
    <div className="group relative shrink-0 w-[240px] sm:w-[280px] md:w-[320px] h-[170px] sm:h-[195px] md:h-[220px] rounded-2xl overflow-hidden shadow-lg border border-[#C99A3B]/25 bg-[#0F2352] cursor-pointer">
      {/* Background Image with Zoom on Hover */}
      <img
        src={item.image}
        alt={isAm ? item.titleAm : item.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      {/* Dark gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A3D]/95 via-[#0B1A3D]/40 to-transparent transition-opacity duration-300 group-hover:from-[#0B1A3D]" />

      {/* Gold illuminated border on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#C99A3B] transition-colors duration-300 pointer-events-none" />

      {/* Caption Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end text-white">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#C99A3B] font-semibold drop-shadow-sm">
          {isAm ? item.subtitleAm : item.subtitle}
        </span>
        <h4 className="mt-1 text-sm sm:text-base font-bold text-white line-clamp-1 leading-snug drop-shadow-md">
          {isAm ? item.titleAm : item.title}
        </h4>
      </div>
    </div>
  );
}

export function GallerySection() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  // Duplicate items for continuous seamless infinite loop
  const row1Doubled = [...ROW_1_ITEMS, ...ROW_1_ITEMS];
  const row2Doubled = [...ROW_2_ITEMS, ...ROW_2_ITEMS];

  return (
    <section id="gallery" className="py-20 sm:py-24 bg-[#1E2A5E] text-white overflow-hidden border-y border-[#C99A3B]/30">
      {/* Section Header */}
      <div className="mx-auto w-full max-w-[1240px] px-6 mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C99A3B]" />
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#C99A3B] font-semibold">
                {isAm ? 'የሥዕላትና የበዓላት ማኅደር' : 'Visual Archives & Moments'}
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white font-serif">
              {isAm ? 'መንፈሳዊ የሕይወት ገጾች' : 'Gallery & Living Heritage'}
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#E3EEF8]/80 max-w-xl">
              {isAm
                ? 'በሰንበት ትምህርት ቤታችንና በቤተክርስቲያናችን የሚከናወኑ ልዩ ልዩ ቅዱሳት ሥዕላት፣ የበዓላት አከባበርና መንፈሳዊ ትውስታዎች።'
                : 'Sacred Ethiopian Orthodox iconography, clergy processions, youth fellowships, and parish memories.'}
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C99A3B] hover:text-white transition-colors shrink-0 group self-start md:self-end"
          >
            <span>{isAm ? 'ሁሉንም ሥዕላት ይመልከቱ' : 'View full gallery'}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* Marquee Tracks Container */}
      <div className="flex flex-col gap-5 sm:gap-6 w-full">
        {/* ROW 1: Moves Left-to-Right */}
        <div className="group relative w-full overflow-hidden" tabIndex={0} aria-label="Gallery Row 1 Left to Right">
          {/* Subtle edge fades matching deep navy */}
          <div className="pointer-events-none absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-[#1E2A5E] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-[#1E2A5E] to-transparent z-10" />

          <div className="gallery-track-ltr flex gap-5 sm:gap-6 w-max group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {row1Doubled.map((item, index) => (
              <GalleryCard key={`r1-${item.id}-${index}`} item={item} isAm={isAm} />
            ))}
          </div>
        </div>

        {/* ROW 2: Moves Right-to-Left */}
        <div className="group relative w-full overflow-hidden" tabIndex={0} aria-label="Gallery Row 2 Right to Left">
          <div className="pointer-events-none absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-[#1E2A5E] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-[#1E2A5E] to-transparent z-10" />

          <div className="gallery-track-rtl flex gap-5 sm:gap-6 w-max group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {row2Doubled.map((item, index) => (
              <GalleryCard key={`r2-${item.id}-${index}`} item={item} isAm={isAm} />
            ))}
          </div>
        </div>
      </div>

      {/* Scoped CSS for Keyframes & Hardware Acceleration */}
      <style jsx>{`
        @keyframes marqueeLtr {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }

        @keyframes marqueeRtl {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .gallery-track-ltr {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marqueeLtr 44s linear infinite;
        }

        .gallery-track-rtl {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marqueeRtl 52s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-track-ltr,
          .gallery-track-rtl {
            animation: none !important;
            transform: none !important;
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}

export default GallerySection;

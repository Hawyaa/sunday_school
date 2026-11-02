'use client';

/**
 * MosaicGalleryStage.tsx
 *
 * Exact implementation of the interactive mosaic gallery frame from user's design:
 * - Radial atmospheric background stage
 * - White card frame with gold corner ticks (.c1, .c2)
 * - Large background watermark typography ("Photos", "”")
 * - 6 dynamic mosaic tiles that rearrange across 3 curated pages
 * - Smooth transition swap, zoom effect on active slide, caption overlays
 * - Interactive pagination dots, numerical counter (1 / 3), and arrow controls (‹ ›)
 * - Auto-rotation with hover pause and keyboard arrow navigation
 * - Fullscreen Lightbox preview on tile click
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/lib/store';

// Image sets
const IMGS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1548625361-16a75f974274?auto=format&fit=crop&w=1200&q=80',
];

// Captions per page: [photoCount, titleEn, titleAm]
const CAPS: [string, string, string][][] = [
  [
    ['24', 'Church grounds', 'የቤተክርስቲያን ቅጥር ግቢ'],
    ['18', 'Timket feast', 'የጥምቀት በዓል'],
    ['32', 'Sunday school', 'የሰንበት ትምህርት ቤት'],
    ['27', 'Choir night', 'የመዘምራን ዝማሬ'],
    ['15', 'Evening prayer', 'የምሽት ጸሎት'],
    ['21', 'Youth fellowship', 'የወጣቶች ሕብረት'],
  ],
  [
    ['19', 'Feast procession', 'የበዓል አከባበር'],
    ['30', 'Annual gathering', 'ዓመታዊ ጉባኤ'],
    ['12', 'Church interior', 'የመቅደስ ውስጥ እይታ'],
    ['26', 'Teaching hour', 'የትምህርት ሰዓት'],
    ['14', 'Mezmur rehearsal', 'የዜማ ልምምድ'],
    ['22', 'Holy week', 'የሰሙነ ሕማማት ዝግጅት'],
  ],
  [
    ['16', 'Baptism day', 'የጥምቀት ቀን'],
    ['28', 'Community lunch', 'የአጋፔ ማዕድ'],
    ['20', 'Choir practice', 'የቅዱስ ያሬድ ዜማ'],
    ['11', 'Volunteers', 'በጎ ፈቃደኞች'],
    ['17', 'Bible study', 'የመጽሐፍ ቅዱስ ጥናት'],
    ['23', 'Pilgrimage', 'የገዳማት ጉዞ'],
  ],
];

// Tile shapes: [widthSpan, heightSpan]
const SHAPES: [number, number][] = [
  [1, 2], // Tile 0: tall
  [2, 1], // Tile 1: wide
  [1, 1], // Tile 2: small
  [1, 2], // Tile 3: tall
  [1, 1], // Tile 4: small
  [1, 1], // Tile 5: small
];

// Positions per page: [col, row, widthSpan, heightSpan]
const POS: [number, number, number, number][][] = [
  [
    [0, 0, 1, 2],
    [1, 0, 2, 1],
    [1, 1, 1, 1],
    [2, 1, 1, 2],
    [0, 2, 1, 1],
    [1, 2, 1, 1],
  ],
  [
    [2, 0, 1, 2],
    [0, 0, 2, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 2],
    [2, 2, 1, 1],
    [1, 2, 1, 1],
  ],
  [
    [0, 0, 1, 2],
    [0, 2, 2, 1],
    [1, 0, 1, 1],
    [2, 0, 1, 2],
    [2, 2, 1, 1],
    [1, 1, 1, 1],
  ],
];

export function MosaicGalleryStage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const [page, setPage] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [lightboxData, setLightboxData] = useState<{
    img: string;
    title: string;
    count: string;
  } | null>(null);

  const totalPages = CAPS.length;
  const isPausedRef = useRef(false);

  const switchPage = useCallback(
    (targetPage: number) => {
      if (isSwapping) return;
      const nextP = (targetPage + totalPages) % totalPages;
      if (nextP === page) return;

      setIsSwapping(true);
      setTimeout(() => {
        setPage(nextP);
        setTimeout(() => {
          setIsSwapping(false);
        }, 50);
      }, 350);
    },
    [isSwapping, page, totalPages]
  );

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current && !lightboxData) {
        switchPage(page + 1);
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [page, switchPage, lightboxData]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        switchPage(page - 1);
      } else if (e.key === 'ArrowRight') {
        switchPage(page + 1);
      } else if (e.key === 'Escape' && lightboxData) {
        setLightboxData(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, switchPage, lightboxData]);

  return (
    <section className="relative w-full py-12 sm:py-16 px-4 flex justify-center items-center overflow-hidden bg-[#141a3a] select-none">
      {/* Radial atmospheric gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 0%, #3a4270 0, transparent 55%), radial-gradient(ellipse at 90% 100%, #6b4a1f 0, transparent 55%), #141a3a',
        }}
      />

      {/* Main Stage */}
      <div className="relative w-full max-w-[1000px] z-10">
        {/* Stage Label */}
        <div className="text-white/60 font-serif italic text-lg sm:text-xl mb-3 tracking-wide pl-2">
          Abune Media | {isAm ? 'የፎቶ ማዕከል' : 'Photo Archives'}
        </div>

        {/* Card Frame */}
        <div
          onMouseEnter={() => (isPausedRef.current = true)}
          onMouseLeave={() => (isPausedRef.current = false)}
          className="relative bg-white shadow-[0_30px_60px_rgba(0,0,0,0.35)] overflow-hidden px-5 sm:px-12 md:px-20 pt-10 pb-8"
        >
          {/* Gold Corner Accents */}
          <span
            className="absolute -top-3.5 -right-3.5 w-7 h-7 border-t-2 border-r-2 border-[#C99A3B] pointer-events-none"
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-3.5 -left-3.5 w-7 h-7 border-b-2 border-l-2 border-[#C99A3B] pointer-events-none"
            aria-hidden="true"
          />

          {/* Header */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-[42px] font-normal font-serif text-[#1b1f33] leading-none">
                {isAm ? 'የፎቶ ማህደር' : 'Gallery'}
              </h1>
              <div className="font-serif italic text-[#9aa1b5] text-lg sm:text-xl mt-1.5">
                {isAm ? 'የአቡነ ሚዲያ ፎቶዎች' : 'Moments of Faith & Fellowship'}
              </div>
            </div>
          </div>

          {/* Background Watermarks */}
          <div
            className="absolute right-8 top-14 text-6xl sm:text-7xl md:text-[84px] font-serif italic font-semibold text-[#f1f1f4] leading-none pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            Photos
          </div>
          <div
            className="absolute right-12 -bottom-4 text-8xl sm:text-9xl md:text-[150px] font-serif font-bold text-[#f1f1f4] leading-none pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            ”
          </div>

          {/* Mosaic Grid Container */}
          <div
            className={`relative w-full transition-opacity duration-350 ${
              isSwapping ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              height: 'clamp(280px, 42vw, 420px)',
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((tileIdx) => {
              const [w, h] = SHAPES[tileIdx];
              const [c, y] = POS[page][tileIdx];
              const curCaption = CAPS[page][tileIdx];
              const imgSrc = IMGS[(tileIdx + page) % IMGS.length];

              // Fractional percentages for 3x3 layout with 10px gaps
              const gap = 10;
              const leftCalc = `calc((100% - ${2 * gap}px) / 3 * ${c} + ${gap * c}px)`;
              const widthCalc = `calc((100% - ${2 * gap}px) / 3 * ${w} + ${gap * (w - 1)}px)`;
              const topCalc = `calc((100% - ${2 * gap}px) / 3 * ${y} + ${gap * y}px)`;
              const heightCalc = `calc((100% - ${2 * gap}px) / 3 * ${h} + ${gap * (h - 1)}px)`;

              return (
                <figure
                  key={tileIdx}
                  onClick={() =>
                    setLightboxData({
                      img: imgSrc,
                      title: isAm ? curCaption[2] : curCaption[1],
                      count: curCaption[0],
                    })
                  }
                  className="absolute overflow-hidden bg-[#dfe4ee] cursor-pointer rounded-sm group transition-all duration-350"
                  style={{
                    left: leftCalc,
                    width: widthCalc,
                    top: topCalc,
                    height: heightCalc,
                  }}
                  title={isAm ? curCaption[2] : curCaption[1]}
                >
                  <img
                    src={imgSrc}
                    alt={curCaption[1]}
                    className="w-full h-full object-cover block transform scale-100 group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141a3a]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Caption */}
                  <figcaption className="absolute left-3 bottom-2.5 z-10 text-white pointer-events-none leading-tight drop-shadow-sm">
                    <b className="block text-sm sm:text-base md:text-lg font-medium font-serif leading-none mb-0.5">
                      {curCaption[0]} <span className="text-[10px] font-sans opacity-80 uppercase">photos</span>
                    </b>
                    <i className="not-italic text-[11px] sm:text-xs text-white/90 font-serif">
                      {isAm ? curCaption[2] : curCaption[1]}
                    </i>
                  </figcaption>

                  {/* Dots inside Tile 1 */}
                  {tileIdx === 1 && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-1.5 z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[0, 1, 2].map((pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => switchPage(pIdx)}
                          aria-label={`Page ${pIdx + 1}`}
                          className={`w-2 h-2 rounded-full border border-white cursor-pointer transition-all ${
                            page === pIdx
                              ? 'bg-[#C99A3B] border-[#C99A3B] scale-125'
                              : 'bg-transparent hover:bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </figure>
              );
            })}
          </div>

          {/* Pager Controls */}
          <div className="flex items-end gap-4 mt-5 min-h-[52px] select-none relative z-10">
            {/* Number Indicator */}
            <div className="relative text-3xl sm:text-4xl font-serif text-[#1b1f33] w-12 leading-none">
              <span>{page + 1}</span>
              <small className="absolute left-4 top-5 text-sm sm:text-base text-[#c3c8d6] font-normal">
                / {totalPages}
              </small>
            </div>

            {/* Previous Button */}
            <button
              type="button"
              onClick={() => switchPage(page - 1)}
              aria-label="Previous page"
              className="bg-transparent border-none text-[#C99A3B] text-2xl sm:text-3xl cursor-pointer px-2 py-0 transition-transform hover:scale-125 leading-none focus:outline-hidden"
            >
              ‹
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => switchPage(page + 1)}
              aria-label="Next page"
              className="bg-transparent border-none text-[#C99A3B] text-2xl sm:text-3xl cursor-pointer px-2 py-0 transition-transform hover:scale-125 leading-none focus:outline-hidden"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxData && (
        <div
          onClick={() => setLightboxData(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C99A3B] cursor-default"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxData(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
            >
              ✕
            </button>

            {/* Image */}
            <div className="relative aspect-16/10 bg-slate-900">
              <img
                src={lightboxData.img}
                alt={lightboxData.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Caption Footer */}
            <div className="p-5 sm:p-6 bg-[#FAF6EF] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#0F1B3E]">
                  {lightboxData.title}
                </h3>
                <span className="text-xs text-[#505E7B]">
                  📷 {lightboxData.count} {isAm ? 'ፎቶዎች በማህደሩ ውስጥ ይገኛሉ' : 'photos in this collection'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxData(null)}
                className="px-5 py-2 rounded-xl bg-[#0F1B3E] hover:bg-[#13224F] text-white text-xs font-bold transition"
              >
                {isAm ? 'ዝጋ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

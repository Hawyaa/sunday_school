// src/components/home/HeroSection.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { RevealWords } from '@/components/motion/RevealWords';
import { Parallax } from '@/components/motion/Parallax';
import { HERO_SLIDES, HERO_INTERVAL_MS, type HeroSlide } from '@/lib/heroSlides';

interface Props {
  slides?: HeroSlide[];
  intervalMs?: number;
}

export function HeroSection({ slides = HERO_SLIDES, intervalMs = HERO_INTERVAL_MS }: Props) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';
  const sectionRef = useRef<HTMLElement>(null);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const count = slides.length;
  const current = count ? active % count : 0;

  // kicks off the initial zoom-in after first paint
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), intervalMs);
    return () => window.clearInterval(id);
  }, [count, paused, intervalMs]);

  const scrollDown = () => {
    const next = sectionRef.current?.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: window.innerHeight * 0.75, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Hero banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative flex flex-col min-h-[580px] sm:min-h-[640px] md:min-h-[680px] justify-between overflow-hidden bg-black text-white"
    >
      {/* Header: add className="anim-nav-in" on its root element (see step 5) */}
      <Header transparent={true} />

      {/* Background slides: parallax + crossfade + slow zoom */}
      <div className="absolute inset-0 z-0">
        <Parallax speed={0.1} className="absolute inset-x-0 -top-[15%] h-[130%]">
          {slides.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={i === current ? s.alt : ''}
              aria-hidden={i !== current}
              loading={i === 0 ? 'eager' : 'lazy'}
              style={{ objectPosition: s.position ?? 'center 35%' }}
              className={`hero-slide absolute inset-0 h-full w-full object-cover saturate-[0.6] ${
                i === current ? 'is-active' : ''
              } ${ready ? 'is-ready' : ''}`}
            />
          ))}
        </Parallax>

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/75"
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[920px] flex-col items-center px-6 pt-32 sm:pt-36 md:pt-40 pb-24 sm:pb-28 text-center my-auto">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] sm:leading-[1.12]">
          {isAm ? (
            <>
              <RevealWords text="እምነት። ባህል።" />{' '}
              <RevealWords
                text="ሕብረት።"
                startIndex={2}
                className="text-[#D4AF37] italic font-serif block sm:inline"
              />
            </>
          ) : (
            <>
              <RevealWords text="Faith. Culture." />{' '}
              <RevealWords
                text="Community."
                startIndex={2}
                className="text-[#D4AF37] italic font-serif block sm:inline"
              />
            </>
          )}
        </h1>

        <p
          className="anim-fade-up mt-5 max-w-[620px] text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-normal"
          style={{ animationDelay: '650ms' }}
        >
          {isAm
            ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት፣ ሥርዓትና ትውፊት ማስተማሪያ ይፋዊ የሰንበት ትምህርት ቤት መድረክ።'
            : 'A digital platform dedicated to sharing the teachings, spirituality, and rich heritage of the Ethiopian Orthodox Tewahedo Church.'}
        </p>

        <div
          className="anim-fade-in mt-8 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
          style={{ animationDelay: '950ms' }}
        >
          <Link
            href="/teachings"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#C99A3B] hover:bg-[#d8a846] text-[#0F1B3E] font-bold text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-center"
          >
            {isAm ? 'ትምህርቶችን ይመልከቱ' : 'Explore Our Content'}
          </Link>
          <Link
            href="/schedule"
            className="w-full sm:w-auto px-8 py-3 rounded-full border border-white/40 hover:bg-white/10 text-white font-medium text-sm backdrop-blur-xs transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-center"
          >
            {isAm ? 'መርሐ ግብር ይመልከቱ' : 'View Schedule'}
          </Link>
        </div>
      </div>

      {/* Slide dots + scroll arrow */}
      <div
        className="anim-fade-in relative z-10 flex flex-col items-center gap-2 pb-6"
        style={{ animationDelay: '1250ms' }}
      >
        {count > 1 && (
          <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={scrollDown}
          aria-label="Scroll to ministries"
          className="text-white/50 hover:text-[#D4AF37] transition cursor-pointer"
        >
          <span className="text-xl inline-block animate-bounce">⌄</span>
        </button>
      </div>
    </section>
  );
}
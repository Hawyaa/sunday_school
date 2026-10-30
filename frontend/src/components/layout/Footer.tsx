'use client';

/**
 * Footer.tsx
 *
 * Footer with the same admin-controlled logo as the Header (<SiteLogo />).
 * Now a client component because the logo hook runs in the browser.
 */

import React from 'react';
import Link from 'next/link';
import { SiteLogo } from '@/components/layout/SiteLogo';

export function Footer() {
  return (
    <footer className="bg-[#0F1B3E] text-white pt-6 pb-4 px-6 sm:px-9 border-t-[3px] border-[#C99A3B] mt-16 select-none">
      {/* 1. Main Footer Row */}
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-white/10 text-xs">
        {/* Footer Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline text-white group shrink-0">
          <SiteLogo size={46} className="group-hover:scale-105 transition-transform" />
          <div>
            <strong className="text-sm text-white block leading-tight">አቡነ ሚዲያ</strong>
            <div className="text-[10px] text-[#A2B0D0] tracking-[1px] uppercase font-bold mt-0.5">
              ABUNE MEDIA PLATFORM
            </div>
          </div>
        </Link>

        {/* Footer Contacts */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-[#C2C9DB]">
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>Addis Ababa, Abune Wereda</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📞</span>
            <a href="tel:+251911123456" className="text-inherit hover:text-[#C99A3B] transition">
              +251 911 123 456
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <span>✈</span>
            <a
              href="https://t.me/abune_media"
              target="_blank"
              rel="noopener noreferrer"
              className="text-inherit hover:text-[#C99A3B] transition"
            >
              t.me/abune_media
            </a>
          </div>
        </div>

        {/* Footer Socials */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-8 h-8 rounded-full border border-[#C99A3B]/60 flex items-center justify-center text-white text-xs hover:bg-[#C99A3B] hover:text-[#0F1B3E] transition"
          >
            f
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-8 h-8 rounded-full border border-[#C99A3B]/60 flex items-center justify-center text-white text-xs hover:bg-[#C99A3B] hover:text-[#0F1B3E] transition"
          >
            ▶
          </a>
          <a
            href="https://t.me/abune_media"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="w-8 h-8 rounded-full border border-[#C99A3B]/60 flex items-center justify-center text-white text-xs hover:bg-[#C99A3B] hover:text-[#0F1B3E] transition"
          >
            ✈
          </a>
        </div>
      </div>

      {/* 2. Footer Bottom */}
      <div className="max-w-[1280px] mx-auto mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#94A3B8]">
        <div>© 2017 - 2025 Abune Media. All rights reserved.</div>
        <div className="flex items-center gap-2 text-[#94A3B8]">
          <span>አቡነ ሚዲያ</span>
          <span>|</span>
          <span>እምነት፣ ባህል፣ ማህበር</span>
        </div>
      </div>
    </footer>
  );
}
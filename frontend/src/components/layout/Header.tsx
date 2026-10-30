'use client';

/**
 * Header.tsx
 *
 * Top navigation bar. The logo now comes from <SiteLogo /> so it can be
 * changed from the admin panel (same logo is used in the Footer).
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { SiteLogo } from '@/components/layout/SiteLogo';

export function Header() {
  const pathname = usePathname();
  const { locale, toggleLocale } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/announcements', label: 'Announcements' },
    { href: '/reports', label: 'Reports' },
    { href: '/mezmur', label: 'Mezmur' },
    { href: '/teachings', label: 'Teachings' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white border-b-2 border-[#C99A3B] sticky top-0 z-50 shadow-[0_3px_12px_rgba(15,27,62,0.04)]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-9 py-3 flex items-center justify-between">
        {/* Logo Group */}
        <Link href="/" className="flex items-center gap-3 no-underline group shrink-0">
          <SiteLogo size={52} className="group-hover:scale-105 transition-transform shadow-xs" />
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-[#0F1B3E] leading-[1.1] m-0">
              አቡነ ሚዲያ
            </h1>
            <span className="text-[11px] text-[#A27B2C] tracking-[1.5px] uppercase font-bold block mt-0.5">
              ABUNE MEDIA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-[22px]">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === '/teachings' && (pathname === '/teaching' || pathname.startsWith('/teachings/'))) ||
              (link.href === '/gallery' && (pathname === '/gallary' || pathname.startsWith('/gallery/')));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13.5px] font-semibold transition-colors relative py-1 ${
                  isActive
                    ? 'text-[#0F1B3E] font-bold'
                    : 'text-[#2A354F] hover:text-[#0F1B3E]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[14px] left-0 right-0 h-[3px] bg-[#C99A3B] rounded-[2px]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLocale}
            className="bg-[#0F1B3E] text-white border-[1.5px] border-[#C99A3B] rounded-full py-1 pl-3 pr-1.5 flex items-center gap-2 text-xs font-bold cursor-pointer transition hover:bg-[#13224F]"
          >
            <span>{locale === 'am' ? 'አማ' : 'EN'}</span>
            <span className="bg-white text-[#0F1B3E] px-2 py-0.5 rounded-xl text-[11px] font-extrabold">
              {locale === 'am' ? 'EN' : 'አማ'}
            </span>
          </button>

          {/* Calendar Icon Button */}
          <Link
            href="/schedule"
            title="Service Schedule & Calendar"
            className="text-[#0F1B3E] hover:text-[#C99A3B] text-lg p-1.5 transition flex items-center justify-center"
          >
            📅
          </Link>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            className="text-[#0F1B3E] hover:text-[#C99A3B] text-lg p-1.5 transition flex items-center justify-center cursor-pointer lg:hidden"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E8EEF5] px-6 py-4 space-y-2.5 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === '/teachings' && (pathname === '/teaching' || pathname.startsWith('/teachings/')));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-semibold transition-colors border-b border-slate-50 ${
                  isActive
                    ? 'text-[#0F1B3E] font-bold border-l-4 border-l-[#C99A3B] pl-2'
                    : 'text-[#2A354F] hover:text-[#0F1B3E]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
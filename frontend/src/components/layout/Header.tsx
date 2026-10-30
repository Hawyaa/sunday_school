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

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const pathname = usePathname();
  const { locale, toggleLocale } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/reports', label: 'Reports' },
    { href: '/mezmur', label: 'Mezmur' },
    { href: '/teachings', label: 'Teachings' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={
        transparent
          ? 'absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/75 via-black/35 to-transparent border-none text-white'
          : 'bg-white border-b-2 border-[#C99A3B] sticky top-0 z-50 shadow-[0_3px_12px_rgba(15,27,62,0.04)] text-[#0F1B3E]'
      }
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-9 py-3 flex items-center justify-between">
        {/* Logo Group */}
        <Link href="/" className="flex items-center gap-3 no-underline group shrink-0">
          <SiteLogo size={48} className="group-hover:scale-105 transition-transform shadow-xs" />
          <div className="flex flex-col">
            <h1
              className={`text-lg sm:text-xl font-extrabold leading-[1.1] m-0 font-serif ${
                transparent ? 'text-white' : 'text-[#0F1B3E]'
              }`}
            >
              አቡነ ሚዲያ
            </h1>
            <span
              className={`text-[10px] sm:text-[11px] tracking-[1.5px] uppercase font-bold block mt-0.5 ${
                transparent ? 'text-[#D4AF37]' : 'text-[#A27B2C]'
              }`}
            >
              ETHIOPIAN ORTHODOX
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-[24px]">
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
                    ? transparent
                      ? 'text-white font-bold'
                      : 'text-[#0F1B3E] font-bold'
                    : transparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-[#2A354F] hover:text-[#0F1B3E]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[10px] left-0 right-0 h-[2.5px] bg-[#C99A3B] rounded-[2px]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLocale}
            className={`border rounded-full py-1 pl-3 pr-1.5 flex items-center gap-2 text-xs font-bold cursor-pointer transition ${
              transparent
                ? 'bg-black/30 text-white border-white/30 hover:bg-black/50'
                : 'bg-[#0F1B3E] text-white border-[#C99A3B] hover:bg-[#13224F]'
            }`}
          >
            <span>{locale === 'am' ? 'አማ' : 'EN'}</span>
            <span
              className={`px-2 py-0.5 rounded-xl text-[11px] font-extrabold ${
                transparent ? 'bg-[#C99A3B] text-[#0F1B3E]' : 'bg-white text-[#0F1B3E]'
              }`}
            >
              {locale === 'am' ? 'EN' : 'አማ'}
            </span>
          </button>

          {/* Get Started Gold Button (from structure) */}
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C99A3B] hover:bg-[#d8a846] text-[#0F1B3E] text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <span>→</span>
          </Link>

          {/* Calendar Icon Button */}
          <Link
            href="/schedule"
            title="Service Schedule & Calendar"
            className={`text-lg p-1.5 transition flex items-center justify-center ${
              transparent ? 'text-white/90 hover:text-[#C99A3B]' : 'text-[#0F1B3E] hover:text-[#C99A3B]'
            }`}
          >
            📅
          </Link>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            className={`text-lg p-1.5 transition flex items-center justify-center cursor-pointer lg:hidden ${
              transparent ? 'text-white hover:text-[#C99A3B]' : 'text-[#0F1B3E] hover:text-[#C99A3B]'
            }`}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F1B3E] text-white border-t border-white/10 px-6 py-4 space-y-2.5 shadow-2xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === '/teachings' && (pathname === '/teaching' || pathname.startsWith('/teachings/')));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-semibold transition-colors border-b border-white/5 ${
                  isActive
                    ? 'text-[#C99A3B] font-bold border-l-4 border-l-[#C99A3B] pl-2'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 rounded-full bg-[#C99A3B] text-[#0F1B3E] text-xs font-bold"
            >
              Get Started →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
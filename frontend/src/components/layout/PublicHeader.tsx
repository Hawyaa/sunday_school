'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { toEthiopicDate } from '@/lib/calendar';

export function PublicHeader() {
  const pathname = usePathname();
  const { locale, toggleLocale, isEthiopicCalendarFirst, toggleCalendarPreference, t } = useAppStore();
  const [todayEth, setTodayEth] = useState<{ monthNameAm: string; monthNameEn: string; date: number }>({
    monthNameAm: 'መስከረም',
    monthNameEn: 'Meskerem',
    date: 1,
  });

  useEffect(() => {
    // Read current date only inside useEffect on client mount to avoid static prerender mismatch
    const eth = toEthiopicDate(new Date());
    setTodayEth(eth);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_12px_rgba(15,23,42,0.04)]">
      <div className="max-w-5xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
        {/* Left: Logo and Identity */}
        <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
          <div className="relative w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center p-1.5 shadow-sm ring-1 ring-slate-900/10 flex-shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-amber-400 text-[20px]">church</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-base tracking-tight leading-tight">
                {locale === 'am' ? 'አቡነ ሚዲያ' : 'Abune Media'}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 leading-none truncate">
              {t.subTitle}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav.home}
          </Link>
          <Link
            href="/schedule"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname === '/schedule' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav.schedule}
          </Link>
          <Link
            href="/announcements"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname?.startsWith('/announcements') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav.announcements}
          </Link>
          <Link
            href="/events"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname?.startsWith('/events') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav.events}
          </Link>
          <Link
            href="/mezmur"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname?.startsWith('/mezmur') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav.mezmur}
          </Link>
          <Link
            href="/teachings"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname?.startsWith('/teachings') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav.teachings}
          </Link>
          <Link
            href="/gallery"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname?.startsWith('/gallery') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav.gallery}
          </Link>
          <Link
            href="/reports"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname?.startsWith('/reports') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.nav.reports}
          </Link>
        </nav>

        {/* Right: Language Pill, Calendar Pill, Admin Link */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/80">
            <button
              onClick={() => toggleLocale()}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                locale === 'en'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              type="button"
            >
              EN
            </button>
            <button
              onClick={() => toggleLocale()}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                locale === 'am'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              type="button"
            >
              አማ
            </button>
          </div>

          {/* Ethiopian Calendar Pill */}
          <button
            onClick={() => toggleCalendarPreference()}
            title={isEthiopicCalendarFirst ? 'Showing Ethiopian Date first (Click to toggle)' : 'Showing Gregorian Date first'}
            className="h-8 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-amber-500">calendar_month</span>
            <span>{locale === 'am' ? todayEth.monthNameAm : todayEth.monthNameEn} {todayEth.date}</span>
          </button>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
            title="Admin Console"
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

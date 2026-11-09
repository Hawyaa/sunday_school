'use client';

/**
 * AnnouncementsEventsSection.tsx   →  src/components/home/AnnouncementsEventsSection.tsx
 *
 * Home page: "Latest Announcements" + "Upcoming Events", side by side.
 *
 * Usage (replaces your current section on the home page):
 *   <AnnouncementsEventsSection />                       // sample data
 *   <AnnouncementsEventsSection announcements={...} events={...} />   // your real data
 *
 * - Dates are plain "YYYY-MM-DD" strings, formatted without `Date` timezone
 *   tricks, so the server and the browser always render the same text
 *   (no hydration errors).
 * - Long text is clamped, so nothing runs off the card any more.
 * - Needs  public/images/cross.png  (the same gold cross used in the hero).
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export interface AnnouncementItem {
  id: string | number;
  date: string; // YYYY-MM-DD
  title: string;
  titleAm?: string;
  excerpt: string;
  excerptAm?: string;
  href?: string;
  isNew?: boolean;
}

export interface UpcomingEvent {
  id: string | number;
  date: string; // YYYY-MM-DD
  title: string;
  titleAm?: string;
  place: string;
  placeAm?: string;
  time?: string;
  href?: string;
}

/* ⚠️ SAMPLE DATA, replace by passing your own props. */
const SAMPLE_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 1,
    date: '2026-10-10',
    title: 'Feast of the Holy Cross Preparation',
    excerpt: 'Join our weekly preparation sessions and spiritual reflections leading up to the feast.',
    isNew: true,
  },
  {
    id: 2,
    date: '2026-10-08',
    title: 'New Sunday School Semester Registration',
    excerpt: 'Registration is now open for children and youth classes this semester.',
  },
  {
    id: 3,
    date: '2026-10-07',
    title: 'Community Charity & Outreach Program',
    excerpt: 'Support our parish charity mission to assist families in need across the community.',
  },
];

const SAMPLE_EVENTS: UpcomingEvent[] = [
  { id: 1, date: '2026-11-15', title: 'Meskel Celebration', place: 'Church Hall', time: '9:00 AM' },
  { id: 2, date: '2026-11-08', title: 'Youth Fellowship', place: 'Church Hall' },
  { id: 3, date: '2026-11-11', title: 'Bible Study & Teaching', place: 'Church Hall' },
  { id: 4, date: '2026-11-13', title: 'Confession & Spiritual Guidance', place: 'Church Hall' },
];

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/** Deterministic (no timezone, no locale) so server and client agree. */
function parts(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return { month: '---', day: '--', weekday: '---' };
  return {
    month: MONTHS[m - 1] ?? '---',
    day: String(d).padStart(2, '0'),
    weekday: WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()],
  };
}

/* ---------- tiny icons ---------- */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function ArrowRight({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function PinIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function ClockIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/* ---------- shared bits ---------- */
const PF = "font-['Playfair_Display',Georgia,serif]";
const INTER = "font-['Inter',system-ui,sans-serif]";

function SectionHeading({
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel,
}: {
  eyebrow: string;
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <div className={`${INTER} mb-2 flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[#b9852a]`}>
          <span aria-hidden="true" className="h-px w-7 bg-[#c8952f]" />
          {eyebrow}
        </div>
        <h2 className={`${PF} text-[28px] font-bold leading-[1.1] text-[#0f2352] sm:text-[34px]`}>{title}</h2>
      </div>

      <Link
        href={viewAllHref}
        className={`${INTER} group mb-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e6d9b8] bg-[#fffdf9] px-4 py-2 text-[12.5px] font-semibold text-[#0f2352] transition hover:border-[#c8952f] hover:bg-[#fff6e2]`}
      >
        {viewAllLabel}
        <ArrowRight className="size-3.5 text-[#b9852a] transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function DateChip({ top, bottom, tone = 'cream' }: { top: string; bottom: string; tone?: 'cream' | 'light' }) {
  return (
    <div
      className={`${INTER} flex size-[54px] shrink-0 flex-col items-center justify-center rounded-2xl border leading-none ${
        tone === 'light'
          ? 'border-white/20 bg-[#fffdf9] shadow-[0_6px_16px_rgba(0,0,0,0.25)]'
          : 'border-[#efdfb8] bg-[#fbf3e0]'
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#b9852a]">{top}</span>
      <b className="mt-1 text-[20px] font-bold text-[#0f2352]">{bottom}</b>
    </div>
  );
}

const card =
  'overflow-hidden rounded-[26px] border border-[#efe6d3] bg-white shadow-[0_14px_44px_rgba(15,35,82,0.08)]';

/* ---------- main ---------- */
interface Props {
  announcements?: AnnouncementItem[];
  events?: UpcomingEvent[];
}

export function AnnouncementsEventsSection({
  announcements = SAMPLE_ANNOUNCEMENTS,
  events = SAMPLE_EVENTS,
}: Props) {
  const { locale } = useAppStore();
  const am = locale === 'am';

  const [featured, ...others] = events;
  const fp = featured ? parts(featured.date) : null;

  return (
    <section aria-label="Announcements and events" className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8 lg:py-16">
      <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-8">
        {/* ============ Announcements ============ */}
        <div className="flex min-w-0 flex-col">
          <SectionHeading
            eyebrow={am ? 'ወቅታዊ መረጃ' : 'Stay informed'}
            title={am ? 'የቅርብ ጊዜ ማስታወቂያዎች' : 'Latest Announcements'}
            viewAllHref="/announcements"
            viewAllLabel={am ? 'ሁሉንም ይመልከቱ' : 'View All'}
          />

          <div className={`${card} grid flex-1 sm:grid-cols-[190px_1fr]`}>
            {/* Cross panel */}
            <div className="relative grid min-h-[150px] place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#7d5513_0%,#3b2708_34%,#140b02_74%)]">
              <div aria-hidden="true" className="absolute inset-3 rounded-[18px] border border-[#c8952f]/30" />
              <div aria-hidden="true" className="absolute size-44 rounded-full bg-[#e8b040]/20 blur-3xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/cross.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="relative h-[110px] w-auto select-none drop-shadow-[0_0_18px_rgba(232,176,64,0.6)] sm:h-[165px]"
              />
              <span
                className={`${INTER} absolute bottom-5 left-0 right-0 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f0cf86]/80`}
              >
                {am ? 'ማስታወቂያ' : 'Notice Board'}
              </span>
            </div>

            {/* List */}
            <ul className="flex min-w-0 flex-col divide-y divide-[#f1e9d8]">
              {announcements.map((a) => {
                const p = parts(a.date);
                return (
                  <li key={a.id} className="flex flex-1">
                    <Link
                      href={a.href ?? '/announcements'}
                      className="group flex w-full min-w-0 items-center gap-4 px-5 py-4 transition hover:bg-[#fffaf0] sm:px-6"
                    >
                      <DateChip top={p.month} bottom={p.day} />

                      <div className="min-w-0 flex-1">
                        {a.isNew && (
                          <span className={`${INTER} mb-1.5 inline-block rounded-full bg-[#c8952f] px-2 py-0.5 text-[9.5px] font-bold uppercase leading-none tracking-wider text-white`}>
                            {am ? 'አዲስ' : 'New'}
                          </span>
                        )}
                        <h3 className={`${INTER} line-clamp-2 text-[15px] font-semibold leading-snug text-[#0f2352]`}>
                          {am && a.titleAm ? a.titleAm : a.title}
                        </h3>
                        <p className={`${INTER} mt-1 line-clamp-2 text-[13px] leading-[1.5] text-[#6b7690]`}>
                          {am && a.excerptAm ? a.excerptAm : a.excerpt}
                        </p>
                      </div>

                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#ece3cf] text-[#b9852a] transition group-hover:border-[#c8952f] group-hover:bg-[#c8952f] group-hover:text-white">
                        <ArrowRight className="size-3.5" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ============ Upcoming events ============ */}
        <div className="flex min-w-0 flex-col">
          <SectionHeading
            eyebrow={am ? 'ቀን ይመዝግቡ' : 'Mark your calendar'}
            title={am ? 'መጪ ሁነቶች' : 'Upcoming Events'}
            viewAllHref="/events"
            viewAllLabel={am ? 'ሁሉንም ይመልከቱ' : 'View All'}
          />

          <div className={`${card} flex flex-1 flex-col gap-1 p-4 sm:p-5`}>
            {/* Featured (next) event */}
            {featured && fp && (
              <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#0b1a3f_0%,#14306e_100%)] p-5 text-white">
                <div aria-hidden="true" className="absolute -right-10 -top-12 size-44 rounded-full bg-[#c8952f]/25 blur-3xl" />
                <div aria-hidden="true" className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8952f]/60 to-transparent" />

                <div className="relative flex flex-wrap items-center gap-4 sm:flex-nowrap">
                  <DateChip top={fp.month} bottom={fp.day} tone="light" />

                  <div className="min-w-[170px] flex-1">
                    <div className={`${INTER} mb-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#f0cf86]`}>
                      {am ? 'ቀጣይ ዝግጅት' : 'Next event'}
                    </div>
                    <h3 className={`${PF} line-clamp-2 text-[21px] font-bold leading-tight text-white`}>
                      {am && featured.titleAm ? featured.titleAm : featured.title}
                    </h3>
                    <div className={`${INTER} mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-white/75`}>
                      <span className="inline-flex items-center gap-1.5">
                        <PinIcon className="size-3.5 text-[#f0cf86]" />
                        {am && featured.placeAm ? featured.placeAm : featured.place}
                      </span>
                      {featured.time && (
                        <span className="inline-flex items-center gap-1.5">
                          <ClockIcon className="size-3.5 text-[#f0cf86]" />
                          {featured.time}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={featured.href ?? '/events'}
                    className={`${INTER} group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#c8952f] px-5 py-2.5 text-[13px] sm:w-auto font-semibold text-white shadow-[0_6px_16px_rgba(200,149,47,0.35)] transition hover:bg-[#d9a84a]`}
                  >
                    {am ? 'ተጨማሪ ያንብቡ' : 'Read More'}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Other events */}
            <ul className="flex flex-1 flex-col divide-y divide-[#f1e9d8]">
              {others.map((e) => {
                const p = parts(e.date);
                return (
                  <li key={e.id} className="flex flex-1">
                    <Link
                      href={e.href ?? '/events'}
                      className="group -mx-2 flex w-full min-w-0 items-center gap-4 rounded-2xl px-2 py-3 transition hover:bg-[#fffaf0]"
                    >
                      <DateChip top={p.weekday} bottom={p.day} />

                      <div className="min-w-0 flex-1">
                        <h3 className={`${INTER} line-clamp-1 text-[15px] font-semibold text-[#0f2352]`}>
                          {am && e.titleAm ? e.titleAm : e.title}
                        </h3>
                        <div className={`${INTER} mt-1 flex items-center gap-1.5 text-[12.5px] text-[#7b86a0]`}>
                          <PinIcon className="size-3.5 text-[#c8952f]" />
                          <span className="truncate">{am && e.placeAm ? e.placeAm : e.place}</span>
                        </div>
                      </div>

                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#ece3cf] text-[#b9852a] transition group-hover:border-[#c8952f] group-hover:bg-[#c8952f] group-hover:text-white">
                        <ArrowRight className="size-3.5" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
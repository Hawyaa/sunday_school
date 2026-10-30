'use client';

/**
 * app/events/page.tsx: Church Events page.
 *
 * Composition only. The pieces live elsewhere:
 *   EventsHero       components/events/EventsHero.tsx      (video + its own motion)
 *   EventsCalendar   components/events/EventsCalendar.tsx  (own state)
 *   EventsSprite     components/events/EventsSprite.tsx    (SVG icons)
 *   useEventsMotion  ./useEventsMotion.ts                  (scroll animations, driven by data-attributes)
 *   styles           ./events.css  +  ./events.motion.css
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import './events.css';
import './events.motion.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventModal } from '@/components/events/EventModal';
import { EventItem } from '@/components/events/EventCard';
import { EventsHero } from '@/components/events/EventsHero';
import { EventsCalendar } from '@/components/events/EventsCalendar';
import { EventsSprite } from '@/components/events/EventsSprite';
import { useAppStore } from '@/lib/store';
import { getStoredEvents } from '@/lib/contentStore';
import { useEventsMotion } from './useEventsMotion';
import './events.css';
import './events.motion.css';
import './events.size.css';
interface FullEvent extends EventItem {
  titleAm?: string;
  catAm?: string;
  placeAm?: string;
  descriptionAm?: string;
  isFeatured?: boolean;
}

const FALLBACK_IMG = '/images/events/event-1.jpg';
const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const DEFAULT_EVENTS: FullEvent[] = [
  {
    id: 'feat-1',
    title: 'Annual Church Gathering',
    titleAm: 'ዓመታዊ የቤተክርስቲያን ጉባኤና ኅብረት',
    cat: 'Church programs',
    catAm: 'የቤተክርስቲያን መርሐ ግብር',
    icon: 'church',
    date: '2026-11-22',
    time: '9:00 AM – 2:00 PM',
    place: 'St. Gabriel Church, Addis Ababa',
    placeAm: 'ቅዱስ ገብርኤል ቤተክርስቲያን፣ አዲስ አበባ',
    description:
      'A full day of liturgy, fellowship and a shared meal for every family in the parish, with music from the church choir.',
    descriptionAm:
      'ለእያንዳንዱ የምእመናን ቤተሰብ የተዘጋጀ የቅዳሴ፣ የኅብረትና የጋራ ማዕድ ቀን ከመዘምራን ያሬዳዊ ዜማ ጋር።',
    img: '/images/events/featured.jpg',
    isFeatured: true,
  },
  {
    id: 'ev-1',
    title: 'Bible Study Series',
    titleAm: 'የመጽሐፍ ቅዱስ ጥናት መርሐ ግብር',
    cat: 'Teaching',
    catAm: 'ትምህርት',
    icon: 'book',
    date: '2026-11-05',
    time: '6:00 PM',
    place: 'Online, open to all',
    placeAm: 'በበይነመረብ (Online) ለሁሉም ክፍት',
    description: 'Weekly study of the Gospel of John, open to every member of the community.',
    descriptionAm: 'የዮሐንስ ወንጌል ሳምንታዊ ጥናት፤ ለማኅበረሰቡ አባላት በሙሉ ክፍት ነው።',
    img: '/images/events/event-1.jpg',
  },
  {
    id: 'ev-2',
    title: 'Food Donation Drive',
    titleAm: 'የምግብና አልባሳት ልገሳ ዘመቻ',
    cat: 'Community service',
    catAm: 'የማኅበረሰብ አገልግሎት',
    icon: 'heart',
    date: '2026-11-07',
    time: '8:00 AM',
    place: 'Addis Ababa City',
    placeAm: 'አዲስ አበባ ከተማ',
    description: 'Collecting and packing food for families in need across the city.',
    descriptionAm: 'በከተማዋ ለሚገኙ የተቸገሩ ወገኖችና ቤተሰቦች ምግብና ድጋፍ የማሰባሰብ መርሐ ግብር።',
    img: '/images/events/hero.jpg',
  },
  {
    id: 'ev-3',
    title: 'Mezmur Evening',
    titleAm: 'የያሬዳዊ ዜማና መዝሙር ምሽት',
    cat: 'Worship',
    catAm: 'አምልኮና ጸሎት',
    icon: 'star',
    date: '2026-11-12',
    time: '5:30 PM',
    place: 'St. Gabriel Church',
    placeAm: 'ቅዱስ ገብርኤል ቤተክርስቲያን',
    description: 'An evening of hymns with the church choir, the kebero and the tsenatsel.',
    descriptionAm: 'በከበሮ፣ በጸናጽልና በመዘምራን ማኅሌት የታጀበ መንፈሳዊ የበረከት ምሽት።',
    img: '/images/events/featured.jpg',
  },
  {
    id: 'ev-4',
    title: 'Youth Fellowship Night',
    titleAm: 'የወጣቶች ኅብረትና ውይይት ምሽት',
    cat: 'Church programs',
    catAm: 'የቤተክርስቲያን መርሐ ግብር',
    icon: 'users',
    date: '2026-11-14',
    time: '6:30 PM',
    place: 'St. Gabriel Church Hall',
    placeAm: 'ቅዱስ ገብርኤል አዳራሽ',
    description: 'Teaching, discussion and games for young adults between 15 and 25.',
    descriptionAm: 'ዕድሜያቸው ከ15 እስከ 25 ለሆኑ ወጣቶች የተዘጋጀ መንፈሳዊ ትምህርትና የውይይት መድረክ።',
    img: '/images/events/event-1.jpg',
  },
  {
    id: 'ev-5',
    title: 'Church Renovation Fundraising',
    titleAm: 'የቤተክርስቲያን እድሳት የገቢ ማሰባሰቢያ',
    cat: 'Fundraising',
    catAm: 'የገቢ ማሰባሰቢያ',
    icon: 'church',
    date: '2026-11-19',
    time: '2:00 PM',
    place: 'St. Gabriel Church Hall',
    placeAm: 'ቅዱስ ገብርኤል አዳራሽ',
    description: 'Help restore the church hall and courtyard for the next generation.',
    descriptionAm: 'ለቀጣዩ ትውልድ የሚተላለፈውን የታሪክና የቤተክርስቲያን ቅርስ ለማደስ የበኩላችሁን አስተዋጽኦ ያድርጉ።',
    img: '/images/events/hero.jpg',
  },
  {
    id: 'ev-6',
    title: 'Sunday School Annual Day',
    titleAm: 'የሰንበት ትምህርት ቤት ዓመታዊ ቀን',
    cat: 'Church programs',
    catAm: 'የቤተክርስቲያን መርሐ ግብር',
    icon: 'users',
    date: '2026-11-28',
    time: '9:00 AM',
    place: 'St. Gabriel Church Hall',
    placeAm: 'ቅዱስ ገብርኤል አዳራሽ',
    description: 'Students present hymns, recitations and scripture lessons for their families.',
    descriptionAm: 'ተማሪዎች ለመላው ቤተሰብ ዝማሬዎችን፣ ቲያትርና የጥናት ትምህርቶችን የሚያቀርቡበት ዓመታዊ በዓል።',
    img: '/images/events/featured.jpg',
  },
];

/** Admin-store events + the default featured event (shown if the store has none). */
function loadEvents(): FullEvent[] {
  const stored = getStoredEvents();
  if (!stored || stored.length === 0) return DEFAULT_EVENTS;

  const mapped: FullEvent[] = stored.map((s) => ({
    id: String(s.id),
    title: s.title,
    cat: s.cat === 'Church Program' ? 'Church programs' : s.cat,
    icon: s.icon || 'cal',
    date: s.date,
    time: s.time,
    place: s.place,
    description: s.description,
    img: s.img || FALLBACK_IMG,
  }));

  return mapped.some((e) => e.isFeatured) ? mapped : [DEFAULT_EVENTS[0], ...mapped];
}

function getDateBadge(dateStr: string) {
  const [year = '2026', month = '11', day = '01'] = dateStr.split('-');
  return { day, month: MONTH_NAMES[parseInt(month, 10) - 1] ?? 'NOV', year };
}

function matchesFilters(e: FullEvent, term: string, category: string): boolean {
  const matchCat = !category || e.cat.toLowerCase() === category.toLowerCase();
  if (!matchCat) return false;
  if (!term) return true;
  return [e.title, e.titleAm, e.place, e.placeAm, e.cat, e.description].some((v) =>
    v?.toLowerCase().includes(term),
  );
}

export default function EventsPage() {
  const { locale } = useAppStore();
  const am = locale === 'am';
  const rootRef = useRef<HTMLDivElement>(null);

  // Start with the defaults so server and client render the same; load the admin store after mount.
  const [allEvents, setAllEvents] = useState<FullEvent[]>(DEFAULT_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<FullEvent | null>(null);

  useEffect(() => {
    const sync = () => setAllEvents(loadEvents());
    sync();
    window.addEventListener('abune_content_store_updated', sync);
    return () => window.removeEventListener('abune_content_store_updated', sync);
  }, []);

  const featuredEvent = useMemo(() => allEvents.find((e) => e.isFeatured) ?? allEvents[0], [allEvents]);
  const regularEvents = useMemo(() => allEvents.filter((e) => e !== featuredEvent), [allEvents, featuredEvent]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allEvents.forEach((e) => {
      counts[e.cat] = (counts[e.cat] || 0) + 1;
    });
    return counts;
  }, [allEvents]);

  const term = searchQuery.trim().toLowerCase();
  const filteredEvents = useMemo(
    () => regularEvents.filter((e) => matchesFilters(e, term, selectedCategory)),
    [regularEvents, term, selectedCategory],
  );
  const isFeaturedVisible = !!featuredEvent && matchesFilters(featuredEvent, term, selectedCategory);

  const eventDates = useMemo(() => allEvents.map((e) => e.date), [allEvents]);

  useEventsMotion(rootRef, {
    featuredId: isFeaturedVisible ? String(featuredEvent?.id) : '',
    cardsKey: filteredEvents.map((e) => e.id).join('|'),
    catsKey: Object.keys(categoryCounts).join('|'),
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  const toggleCategory = (name: string) =>
    setSelectedCategory((cur) => (cur.toLowerCase() === name.toLowerCase() ? '' : name));

  const openByDate = (iso: string) => {
    const ev = allEvents.find((e) => e.date === iso);
    if (ev) setSelectedEvent(ev);
  };

  return (
    <div className="events-page" ref={rootRef}>
      <EventsSprite />
      <Header />

      <main>
        <EventsHero />

        {/* ================= SEARCH + FILTER BAR ================= */}
        <div className="ev-wrap">
          <form className="ev-filters" role="search" onSubmit={(e) => e.preventDefault()} autoComplete="off">
            <label className="ev-field ev-field--grow">
              <svg width="20" height="20" aria-hidden="true">
                <use href="#i-search" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  am ? 'ሁነቶችን በስም፣ በቦታ ወይም በዓይነት ይፈልጉ' : 'Search events by name, place or category'
                }
                aria-label="Search events"
              />
            </label>

            <label className="ev-field ev-field--sel">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="">{am ? 'ሁሉም ክፍሎች' : 'All categories'}</option>
                <option value="Church programs">{am ? 'የቤተክርስቲያን መርሐ ግብር' : 'Church programs'}</option>
                <option value="Worship">{am ? 'አምልኮና ጸሎት' : 'Worship'}</option>
                <option value="Teaching">{am ? 'ትምህርት' : 'Teaching'}</option>
                <option value="Community service">{am ? 'የማኅበረሰብ አገልግሎት' : 'Community service'}</option>
                <option value="Fundraising">{am ? 'የገቢ ማሰባሰቢያ' : 'Fundraising'}</option>
              </select>
            </label>

            <button
              className="ev-btn ev-btn--dark"
              type="button"
              onClick={resetFilters}
              style={{ height: '52px', paddingInline: '28px' }}
            >
              {am ? 'ዳግም ጀምር' : 'Reset'}
            </button>
          </form>
        </div>

        {/* ================= MAIN LAYOUT ================= */}
        <div className="ev-wrap ev-layout" id="events">
          <div>
            {/* ---------- Featured event ---------- */}
            {isFeaturedVisible && featuredEvent && (
              <section id="featured-sec" aria-labelledby="feat-label">
                <h2
                  className="ev-eyebrow ev-section-title"
                  id="feat-label"
                  style={{ fontFamily: 'var(--sans)', letterSpacing: '.2em' }}
                >
                  {am ? 'ተለይቶ የቀረበ ሁነት' : 'Featured event'}
                </h2>

                <article
                  className="ev-featured"
                  data-featured
                  onClick={() => setSelectedEvent(featuredEvent)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="ev-featured__img ev-ph" role="img" aria-label={featuredEvent.title}>
                    <div
                      className="ev-media"
                      data-reveal="media"
                      style={{ backgroundImage: `url("${featuredEvent.img ?? FALLBACK_IMG}")` }}
                    />
                    <div className="ev-date">
                      <b>{getDateBadge(featuredEvent.date).day}</b>
                      <span>{getDateBadge(featuredEvent.date).month}</span>
                    </div>
                  </div>

                  <div className="ev-featured__body">
                    <span className="ev-pill" data-reveal="text">
                      {am ? featuredEvent.catAm || featuredEvent.cat : featuredEvent.cat}
                    </span>
                    <h2 data-reveal="text">
                      {am ? featuredEvent.titleAm || featuredEvent.title : featuredEvent.title}
                    </h2>
                    <p data-reveal="text">
                      {am ? featuredEvent.descriptionAm || featuredEvent.description : featuredEvent.description}
                    </p>
                    <div className="ev-meta">
                      <span data-reveal="fade">
                        <svg width="18" height="18" aria-hidden="true">
                          <use href="#i-cal" />
                        </svg>
                        <time dateTime={featuredEvent.date}>{featuredEvent.date}</time>
                      </span>
                      <span data-reveal="fade">
                        <svg width="18" height="18" aria-hidden="true">
                          <use href="#i-clock" />
                        </svg>
                        {featuredEvent.time}
                      </span>
                      <span data-reveal="fade">
                        <svg width="18" height="18" aria-hidden="true">
                          <use href="#i-pin" />
                        </svg>
                        {am ? featuredEvent.placeAm || featuredEvent.place : featuredEvent.place}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="ev-btn"
                      data-reveal="scale"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(featuredEvent);
                      }}
                    >
                      {am ? 'ዝርዝር ይመልከቱ' : 'View details'}{' '}
                      <svg width="18" height="18" aria-hidden="true">
                        <use href="#i-arrow" />
                      </svg>
                    </button>
                  </div>
                </article>
              </section>
            )}

            {/* ---------- Upcoming events ---------- */}
            <div className="ev-listhead">
              <h2
                className="ev-eyebrow ev-section-title"
                style={{ fontFamily: 'var(--sans)', letterSpacing: '.2em' }}
              >
                {am ? 'መጪ ሁነቶች' : 'Upcoming events'}
              </h2>
              <p className="ev-count" aria-live="polite">
                {am
                  ? `ከ ${regularEvents.length} ውስጥ ${filteredEvents.length} እየታዩ ነው`
                  : `Showing ${filteredEvents.length} of ${regularEvents.length}`}
              </p>
            </div>

            <div className="ev-list" id="list">
              {filteredEvents.map((evt) => {
                const badge = getDateBadge(evt.date);
                return (
                  <article
                    key={evt.id}
                    className="ev-row"
                    data-reveal="card"
                    onClick={() => setSelectedEvent(evt)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="ev-row__img ev-ph" role="img" aria-label={evt.title}>
                      <div className="ev-media" style={{ backgroundImage: `url("${evt.img ?? FALLBACK_IMG}")` }} />
                      <div className="ev-date">
                        <b>{badge.day}</b>
                        <span>{badge.month}</span>
                      </div>
                    </div>
                    <div className="ev-row__body">
                      <div className="ev-row__tag">
                        <span className="ev-cat">{am ? evt.catAm || evt.cat : evt.cat}</span>
                        <time dateTime={evt.date}>{badge.year}</time>
                      </div>
                      <h3>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedEvent(evt);
                          }}
                        >
                          {am ? evt.titleAm || evt.title : evt.title}
                        </a>
                      </h3>
                      <p>{am ? evt.descriptionAm || evt.description : evt.description}</p>
                      <div className="ev-meta">
                        <span>
                          <svg width="16" height="16" aria-hidden="true">
                            <use href="#i-clock" />
                          </svg>
                          {evt.time}
                        </span>
                        <span>
                          <svg width="16" height="16" aria-hidden="true">
                            <use href="#i-pin" />
                          </svg>
                          {am ? evt.placeAm || evt.place : evt.place}
                        </span>
                      </div>
                    </div>
                    <span className="ev-row__go" aria-hidden="true">
                      <svg width="20" height="20">
                        <use href="#i-arrow" />
                      </svg>
                    </span>
                  </article>
                );
              })}
            </div>

            {filteredEvents.length === 0 && !isFeaturedVisible && (
              <div className="ev-empty">
                <b>{am ? 'ምንም ሁነቶች አልተገኙም' : 'No events found'}</b>
                {am
                  ? 'እባክዎ የተለየ ቃል ይፈልጉ ወይም "ሁሉም ክፍሎች" የሚለውን ይምረጡ።'
                  : 'Try a different search or choose "All categories".'}
              </div>
            )}
          </div>

          {/* ================= SIDEBAR ================= */}
          <aside className="ev-side" aria-label="Event tools">
            <EventsCalendar
              eventDates={eventDates}
              featuredDate={featuredEvent?.date}
              initialMonth={new Date(2026, 10, 1)}
              am={am}
              onSelectDate={openByDate}
            />

            <section className="ev-panel" aria-labelledby="cats-title" data-reveal="side">
              <h2 id="cats-title">{am ? 'በክፍል ይመልከቱ' : 'Browse by category'}</h2>
              <ul className="ev-cats">
                {Object.entries(categoryCounts).map(([name, count]) => (
                  <li key={name} data-reveal="cat">
                    <button
                      type="button"
                      aria-pressed={selectedCategory.toLowerCase() === name.toLowerCase()}
                      onClick={() => toggleCategory(name)}
                    >
                      <span className="ev-cats__label">
                        <svg className="ev-cats__icon" width="14" height="14" aria-hidden="true">
                          <use href="#i-next" />
                        </svg>
                        {name}
                      </span>
                      <b>{count}</b>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="ev-cta" data-reveal="side">
              <svg width="40" height="40" aria-hidden="true" style={{ color: 'var(--gold-soft)' }}>
                <use href="#i-cross" />
              </svg>
              <h2>{am ? 'ማገልገል ይፈልጋሉ?' : 'Want to help?'}</h2>
              <p>
                {am
                  ? 'ፈቃደኛ አገልጋዮች ለእያንዳንዱ ጉባኤ መሳካት መሠረት ናቸው። አገልግሎት ይቀላቀሉና አብረውን ያገልግሉ።'
                  : 'Volunteers make every gathering possible. Join a ministry and serve with us.'}
              </p>
              <Link className="ev-btn" href="/contact">
                {am ? 'አገልግሎት ይቀላቀሉ' : 'Join a ministry'}
              </Link>
            </section>
          </aside>
        </div>
      </main>

      <Footer />

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}

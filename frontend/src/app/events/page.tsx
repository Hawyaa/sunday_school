'use client';

/**
 * app/events/page.tsx — Church Events Page
 *
 * Implements the editorial layout from the master HTML design:
 *   1. Header
 *   2. Hero with animated typography ("Church Events.") + Next-up Slab
 *   3. Interactive Date Ribbon / Timeline (with milestone ticks & selectable dates)
 *   4. Category Filter Tabs & Underline Search Bar
 *   5. Programme List with Outline-Stroke Numeral Accordions
 *   6. Help / Volunteer Band ("Want to help?")
 *   7. Full Brand Footer
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventModal } from '@/components/events/EventModal';
import { EventItem } from '@/components/events/EventCard';
import './events.css';

export interface ChurchEvent extends EventItem {
  d: number; // Day of the month
  monthStr: string;
  monthStrAm: string;
  titleAm: string;
  catAm: string;
  placeAm: string;
  descriptionAm: string;
}

const ALL_EVENTS: ChurchEvent[] = [
  {
    id: 'ev-5',
    d: 5,
    monthStr: 'NOV',
    monthStrAm: 'ኅዳር',
    date: '2026-11-05',
    title: 'Church Renovation Fundraising',
    titleAm: 'የቤተክርስቲያን እድሳት የገቢ ማሰባሰቢያ',
    cat: 'Church Building',
    catAm: 'የሕንፃ ግንባታ',
    time: '3:00 PM',
    place: 'St. Gabriel Church',
    placeAm: 'ቅዱስ ገብርኤል ቤተክርስቲያን',
    description: 'A special parish gathering dedicated to supporting the restoration and beautification of the church sanctuary.',
    descriptionAm: 'የቤተ መቅደሱን እድሳትና ማስዋብ ሥራ ለመደገፍ የተዘጋጀ ልዩ የገቢ ማሰባሰቢያ መርሐ ግብር።',
    img: '/images/events/hero.jpg',
    icon: 'church',
  },
  {
    id: 'ev-8',
    d: 8,
    monthStr: 'NOV',
    monthStrAm: 'ኅዳር',
    date: '2026-11-08',
    title: 'Spiritual Growth Seminar',
    titleAm: 'የመንፈሳዊ ዕድገት ሲምፖዚየም',
    cat: 'Teaching',
    catAm: 'ትምህርት',
    time: '10:00 AM',
    place: 'Seminar Center',
    placeAm: 'የመሰብሰቢያ አዳራሽ',
    description: 'An insightful theological seminar with clergy exploring spiritual growth and Christian living in the modern world.',
    descriptionAm: 'በአበው ካህናት የሚመራ መንፈሳዊ ዕድገትና ክርስቲያናዊ የሕይወት ጎዳናን የሚያስረዳ ጥልቅ የትምህርት መድረክ።',
    img: '/images/events/event-1.jpg',
    icon: 'book',
  },
  {
    id: 'ev-15',
    d: 15,
    monthStr: 'NOV',
    monthStrAm: 'ኅዳር',
    date: '2026-11-15',
    title: 'Youth Fellowship Gathering',
    titleAm: 'የወጣቶች መንፈሳዊ ኅብረት ጉባኤ',
    cat: 'Church Programs',
    catAm: 'የቤተክርስቲያን መርሐ ግብር',
    time: '2:00 PM',
    place: 'St. Gabriel Church Hall',
    placeAm: 'ቅዱስ ገብርኤል አዳራሽ',
    description: 'Connecting youth and young adults through prayer, sacred hymn learning, and spiritual brotherhood.',
    descriptionAm: 'ወጣቶችን በጸሎት፣ በያሬዳዊ ዜማና በመንፈሳዊ ወንድማማችነት የሚያስተሳስር ልዩ የወጣቶች ጉባኤ።',
    img: '/images/events/featured.jpg',
    icon: 'users',
  },
  {
    id: 'ev-22-1',
    d: 22,
    monthStr: 'NOV',
    monthStrAm: 'ኅዳር',
    date: '2026-11-22',
    title: 'Annual Church Gathering',
    titleAm: 'ዓመታዊ የቤተክርስቲያን ጉባኤና ኅብረት',
    cat: 'Church Programs',
    catAm: 'የቤተክርስቲያን መርሐ ግብር',
    time: '9:00 AM – 2:00 PM',
    place: 'St. Gabriel Church, Addis Ababa',
    placeAm: 'ቅዱስ ገብርኤል ቤተክርስቲያን፣ አዲስ አበባ',
    description: 'A full day of divine liturgy, community fellowship, and a shared blessing table for the entire parish family.',
    descriptionAm: 'ለእያንዳንዱ የምእመናን ቤተሰብ የተዘጋጀ የቅዳሴ፣ የኅብረትና የጋራ የበረከት ማዕድ ቀን ከመዘምራን ያሬዳዊ ዜማ ጋር።',
    img: '/images/events/featured.jpg',
    icon: 'church',
  },
  {
    id: 'ev-22-2',
    d: 22,
    monthStr: 'NOV',
    monthStrAm: 'ኅዳር',
    date: '2026-11-22',
    title: 'Charity & Support Program',
    titleAm: 'የበጎ አድራጎትና ድጋፍ መርሐ ግብር',
    cat: 'Community Service',
    catAm: 'የማኅበረሰብ አገልግሎት',
    time: '9:00 AM',
    place: 'Community Center',
    placeAm: 'የማኅበረሰብ ማዕከል',
    description: 'Providing food, clothing, and essential support to elderly and vulnerable families in our diocese.',
    descriptionAm: 'በአካባቢያችን ለሚገኙ አቅመ ደካሞችና አረጋውያን ወገኖች ምግብና አልባሳትን የማዳረስ የፍቅር ማዕድ።',
    img: '/images/events/hero.jpg',
    icon: 'heart',
  },
  {
    id: 'ev-28',
    d: 28,
    monthStr: 'NOV',
    monthStrAm: 'ኅዳር',
    date: '2026-11-28',
    title: 'Feast Day Liturgy & Hymns',
    titleAm: 'የበዓለ ንግሥ ቅዳሴና ዝማሬ',
    cat: 'Feast Celebration',
    catAm: 'በዓላትና አምልኮ',
    time: '6:00 AM – 11:30 AM',
    place: 'Main Sanctuary',
    placeAm: 'ዋናው ቤተ መቅደስ',
    description: 'Solemn liturgical worship, deacons choir procession, and spiritual blessing for the feast day.',
    descriptionAm: 'በካህናትና ዲያቆናት ማኅሌትና ቅዳሴ የሚከናወን ታላቅ የበዓለ ንግሥ መንፈሳዊ ሥርዓት።',
    img: '/images/events/event-1.jpg',
    icon: 'star',
  },
];

const CATEGORIES = [
  'Church Programs',
  'Teaching',
  'Community Service',
  'Church Building',
  'Feast Celebration',
];

export default function EventsPage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  // Filter state
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number>(0); // First item expanded by default
  const [modalEvent, setModalEvent] = useState<EventItem | null>(null);

  // Today reference
  const todayDate = 22; // Mid-month reference for sample

  // Next gathering slab event (e.g. Nov 22 Annual Church Gathering or earliest event >= today)
  const nextEvent = useMemo(() => {
    return ALL_EVENTS.find((e) => e.d >= todayDate) || ALL_EVENTS[0];
  }, []);

  // Unique event days for the date ribbon
  const uniqueDays = useMemo(() => {
    return Array.from(new Set(ALL_EVENTS.map((e) => e.d))).sort((a, b) => a - b);
  }, []);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return ALL_EVENTS.filter((e) => {
      const matchCat = !selectedCat || e.cat === selectedCat;
      const matchDay = !selectedDay || e.d === selectedDay;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.titleAm.toLowerCase().includes(q) ||
        e.cat.toLowerCase().includes(q) ||
        e.place.toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q);

      return matchCat && matchDay && matchSearch;
    });
  }, [selectedCat, selectedDay, searchQuery]);

  const hasActiveFilters = Boolean(selectedCat || selectedDay || searchQuery);

  const clearFilters = () => {
    setSelectedCat('');
    setSelectedDay(0);
    setSearchQuery('');
    setOpenIndex(-1);
  };

  return (
    <div className="events-page">
      <Header />

      <main>
        {/* ── 1. Hero Section: Type + Next-Up Slab ── */}
        <section className="hero">
          <div className="w hg">
            <div>
              <p className="eb">{isAm ? 'መሰባሰብ • አምልኮ • አገልግሎት' : 'Gather · Worship · Serve'}</p>
              <h1>
                <span>
                  <em>{isAm ? 'የቤተክርስቲያን' : 'Church'}</em>
                </span>
                <span>
                  <em>{isAm ? 'መርሐ ግብራት' : 'Events.'}</em>
                </span>
              </h1>
              <p className="tag">
                {isAm
                  ? 'በኅብረት እንሰብሰብ፤ በአንድነት እናምልክ፤ በፍቅር እናገልግል።'
                  : 'Gather. Worship. Serve together.'}
              </p>
            </div>

            {/* Next Gathering Slab */}
            <div className="slab">
              <div className="big">
                {nextEvent.d}
                <small>{isAm ? nextEvent.monthStrAm : nextEvent.monthStr}</small>
              </div>
              <span className="ch" style={{ color: 'var(--gold)' }}>
                {isAm ? 'ቀጣይ መርሐ ግብር' : 'Next gathering'}
              </span>
              <h2>{isAm ? nextEvent.titleAm : nextEvent.title}</h2>
              <p>
                🕘 {nextEvent.time}
                <br />
                📍 {isAm ? nextEvent.placeAm : nextEvent.place}
              </p>
              <button
                type="button"
                className="btn bg"
                onClick={() => setModalEvent(nextEvent)}
              >
                {isAm ? 'ዝርዝር ይመልከቱ' : 'View details'}
              </button>
            </div>
          </div>
        </section>

        <div className="w">
          {/* ── 2. Interactive Date Ribbon / Timeline ── */}
          <div className="rib">
            <div className="rh">
              <h2>{isAm ? 'ኅዳር 2019' : 'November 2026'}</h2>
              <span style={{ fontSize: 13, color: 'var(--slate)' }}>
                {isAm ? 'በዕለቱ የሚከናወነውን ለማየት ቀኑን ይጫኑ።' : 'Tap a date to see what’s on.'}
              </span>
            </div>

            <div className="rl" tabIndex={0} aria-label="Date timeline">
              {/* Milestone ticks for 1, 8, 15, 22, 29 */}
              {[1, 8, 15, 22, 29].map((tick) => (
                <span
                  key={`tick-${tick}`}
                  className="tk"
                  style={{ left: `${((tick - 1) / 29) * 100}%` }}
                >
                  {tick}
                </span>
              ))}

              {/* Interactive Date Nodes */}
              {uniqueDays.map((day) => {
                const isSelected = selectedDay === day;
                const isToday = day === todayDate;
                const eventsOnDay = ALL_EVENTS.filter((e) => e.d === day).length;

                return (
                  <button
                    key={`node-${day}`}
                    type="button"
                    className={`nd ${isSelected ? 'sel' : ''} ${isToday ? 'today' : ''}`}
                    style={{ left: `${((day - 1) / 29) * 100}%` }}
                    onClick={() => setSelectedDay(isSelected ? 0 : day)}
                    aria-label={`November ${day}: ${eventsOnDay} event(s)`}
                  >
                    <b>{day}</b>
                    <i />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 3. Toolbar: Category Tabs & Live Search ── */}
          <div className="bar">
            <div className="tabs" role="group" aria-label="Categories">
              <button
                type="button"
                className={selectedCat === '' ? 'sel' : ''}
                onClick={() => setSelectedCat('')}
              >
                {isAm ? 'ሁሉም' : 'All'}
                <i>{ALL_EVENTS.length}</i>
              </button>

              {CATEGORIES.map((cat) => {
                const count = ALL_EVENTS.filter((e) => e.cat === cat).length;
                const isCatSel = selectedCat === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    className={isCatSel ? 'sel' : ''}
                    onClick={() => setSelectedCat(isCatSel ? '' : cat)}
                  >
                    {isAm
                      ? ALL_EVENTS.find((e) => e.cat === cat)?.catAm || cat
                      : cat}
                    <i>{count}</i>
                  </button>
                );
              })}
            </div>

            <input
              className="sr"
              type="search"
              placeholder={isAm ? 'መርሐ ግብር ይፈልጉ...' : 'Search events...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search events"
            />
          </div>

          {/* Results count & Clear button */}
          <div style={{ fontSize: 13, marginTop: 12, color: 'var(--slate)' }}>
            {isAm
              ? `ከ${ALL_EVENTS.length} ውስጥ ${filteredEvents.length} መርሐ ግብራት ታይተዋል`
              : `Showing ${filteredEvents.length} of ${ALL_EVENTS.length} events`}
            {hasActiveFilters && (
              <button type="button" className="clear" onClick={clearFilters}>
                {isAm ? 'ሁሉንም አጽዳ' : 'Clear filters'}
              </button>
            )}
          </div>

          {/* ── 4. Programme List (Accordion Items with Stroke Numerals) ── */}
          <div className="pg" aria-live="polite">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, idx) => {
                const isOpen = openIndex === idx;

                return (
                  <article
                    key={event.id}
                    className={`it ${isOpen ? 'open' : ''}`}
                    style={{ '--i': idx } as React.CSSProperties}
                  >
                    <button
                      type="button"
                      className="hd"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    >
                      <span className="dn">
                        {event.d}
                        <small>{isAm ? event.monthStrAm : event.monthStr}</small>
                      </span>

                      <span>
                        <span className="ch">{isAm ? event.catAm : event.cat}</span>
                        <h3>{isAm ? event.titleAm : event.title}</h3>
                      </span>

                      <span className="pl" aria-hidden="true">
                        +
                      </span>
                    </button>

                    <div className="dt">
                      <div>
                        <div className="dtin">
                          <span>
                            <b>{isAm ? 'ሰዓት' : 'Time'}</b>
                            {event.time}
                          </span>
                          <span>
                            <b>{isAm ? 'ቦታ' : 'Place'}</b>
                            {isAm ? event.placeAm : event.place}
                          </span>
                          <p style={{ width: '100%', maxWidth: 540, color: 'var(--slate)', fontSize: 14 }}>
                            {isAm ? event.descriptionAm : event.description}
                          </p>
                          <button
                            type="button"
                            className="btn bn"
                            style={{ height: 42, fontSize: 14 }}
                            onClick={() => setModalEvent(event)}
                          >
                            {isAm ? 'ሙሉ ዝርዝር' : 'View details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="empty">
                {isAm ? 'ምንም መርሐ ግብር አልተገኘም።' : 'No events match your search.'}
              </p>
            )}
          </div>
        </div>

        {/* ── 5. Help / Volunteer Band ("Want to help?") ── */}
        <section className="hb">
          <div className="w hbg">
            <h2>{isAm ? 'ማገልገል ይፈልጋሉ?' : 'Want to help?'}</h2>
            <div>
              <p>
                {isAm
                  ? 'በሚመጡ መርሐ ግብሮች ወይም በአገልግሎት ዘርፎች በፈቃደኝነት ይሳተፉ።'
                  : 'Volunteer or support an upcoming event or ministry.'}
              </p>
              <Link className="btn bg" href="/contact">
                {isAm ? 'ይሳተፉ' : 'Get involved'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── 6. Full Brand Footer ── */}
      <Footer compact={false} />

      {/* ── 7. Interactive Event Modal ── */}
      <EventModal event={modalEvent} onClose={() => setModalEvent(null)} />
    </div>
  );
}

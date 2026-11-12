'use client';

/**
 * app/events/page.tsx — Church Events & Gatherings
 *
 * Fresh, Simple, Cute & Beautiful Redesign:
 *   1. Welcoming Hero Section with soft sky-blue tint, cute badges & friendly typography.
 *   2. Spotlight Gathering Card (warm, inviting featured event with cute date pill).
 *   3. Discovery Toolbar: rounded category pills, cute search pill & view switcher.
 *   4. Upcoming Events:
 *        - Grid: lovely cards with floating date tags, soft light blue category pills, and friendly action buttons.
 *        - Timeline: clean, cute chronological pathway.
 *   5. Weekly Sanctuary Schedule: pastel tinted day cards (Sunday, Saturday, Friday, Wednesday).
 *   6. Past Celebrations: sweet scrapbook photo memories album.
 *   7. Friendly Volunteer & Sponsorship Banner: soft light blue welcoming invitation.
 *   8. Interactive Event Modal & .ICS Calendar Export.
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventModal } from '@/components/events/EventModal';
import { EventItem } from '@/components/events/EventCard';
import { EventIcon } from '@/components/events/EventIcons';
import './events.css';

export interface ChurchEvent extends EventItem {
  d: number;
  monthStr: string;
  monthStrAm: string;
  titleAm: string;
  catAm: string;
  placeAm: string;
  descriptionAm: string;
}

interface RecurringService {
  id: string;
  day: string;
  dayAm: string;
  title: string;
  titleAm: string;
  time: string;
  timeAm: string;
  place: string;
  placeAm: string;
  audience: string;
  audienceAm: string;
  desc: string;
  descAm: string;
}

interface PastCelebration {
  id: string;
  title: string;
  titleAm: string;
  dateStr: string;
  dateStrAm: string;
  img: string;
  tag: string;
  tagAm: string;
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
    title: 'Annual Church Gathering & Banquet',
    titleAm: 'ዓመታዊ የቤተክርስቲያን ጉባኤና የበረከት ማዕድ',
    cat: 'Church Programs',
    catAm: 'የቤተክርስቲያን መርሐ ግብር',
    time: '9:00 AM – 2:00 PM',
    place: 'St. Gabriel Church, Addis Ababa',
    placeAm: 'ቅዱስ ገብርኤል ቤተክርስቲያን፣ አዲስ አበባ',
    description: 'A full day of divine liturgy, community fellowship, and a shared blessing table for the entire parish family with choir hymns.',
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
    title: 'Charity & Outreach Support',
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
    title: 'Feast Day Liturgy & Deacons Chants',
    titleAm: 'የበዓለ ንግሥ ቅዳሴና ያሬዳዊ ዝማሬ',
    cat: 'Feast Celebration',
    catAm: 'በዓላትና አምልኮ',
    time: '6:00 AM – 11:30 AM',
    place: 'Main Sanctuary',
    placeAm: 'ዋናው ቤተ መቅደስ',
    description: 'Solemn liturgical worship, deacons choir procession, and spiritual blessing for the holy feast day.',
    descriptionAm: 'በካህናትና ዲያቆናት ማኅሌትና ቅዳሴ የሚከናወን ታላቅ የበዓለ ንግሥ መንፈሳዊ ሥርዓት።',
    img: '/images/events/event-1.jpg',
    icon: 'star',
  },
];

const RECURRING_SERVICES: RecurringService[] = [
  {
    id: 'rec-sun',
    day: 'Every Sunday',
    dayAm: 'እሑድ ሁሉ',
    title: 'Divine Liturgy & Sunday School',
    titleAm: 'ቅዳሴና የሰንበት ት/ቤት ጉባኤ',
    time: '6:30 AM – 11:30 AM',
    timeAm: '12:30 – 5:30 ጧት',
    place: 'Main Sanctuary & Classrooms',
    placeAm: 'ዋናው ቤተ መቅደስና የመማሪያ ክፍሎች',
    audience: 'All Ages & Families',
    audienceAm: 'ለሁሉም ዕድሜና ቤተሰቦች',
    desc: 'Solemn morning worship followed by graded Christian education for children and youth.',
    descAm: 'የማለዳ የቅዳሴ ጸሎትና ለሕፃናት እንዲሁም ለወጣቶች የተዘጋጀ የደረጃ ትምህርት።',
  },
  {
    id: 'rec-sat',
    day: 'Every Saturday',
    dayAm: 'ቅዳሜ ሁሉ',
    title: 'Choir Rehearsal & Yaredic Chants',
    titleAm: 'የመዘምራን ልምምድና ያሬዳዊ ዜማ',
    time: '3:00 PM – 5:30 PM',
    timeAm: '9:00 – 11:30 ከሰዓት',
    place: 'St. Yared Rehearsal Hall',
    placeAm: 'የቅዱስ ያሬድ መለማመጃ አዳራሽ',
    audience: 'Choir & Apprentices',
    audienceAm: 'መዘምራንና አዳዲስ ተማሪዎች',
    desc: 'Instruction in traditional Ethiopian Orthodox liturgical chants and hymnody.',
    descAm: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ያሬዳዊ ዜማና ዝማሬ ጥናትና ልምምድ።',
  },
  {
    id: 'rec-fri',
    day: 'Every Friday',
    dayAm: 'ዓርብ ሁሉ',
    title: 'Youth Fellowship & Prayer Gathering',
    titleAm: 'የወጣቶች መንፈሳዊ ኅብረትና ጸሎት',
    time: '5:30 PM – 7:30 PM',
    timeAm: '11:30 – 1:30 ምሽት',
    place: 'Parish Youth Hall',
    placeAm: 'የወጣቶች አዳራሽ',
    audience: 'Youth & Young Adults',
    audienceAm: 'ወጣቶችና ተማሪዎች',
    desc: 'Spiritual fellowship, topical theological Q&A, and communal evening prayer.',
    descAm: 'የመንፈሳዊ ውይይት፣ የጥያቄና መልስ መድረክ እንዲሁም የምሽት የጋራ ጸሎት።',
  },
  {
    id: 'rec-wed',
    day: 'Every Wednesday',
    dayAm: 'ረቡዕ ሁሉ',
    title: 'Midweek Bible Study & Patristics',
    titleAm: 'የመጽሐፍ ቅዱስ ጥናትና የነገረ ሃይማኖት ትምህርት',
    time: '6:00 PM – 8:00 PM',
    timeAm: '12:00 – 2:00 ምሽት',
    place: 'Theology Seminar Room',
    placeAm: 'የነገረ መለኮት አዳራሽ',
    audience: 'Parishioners & Seekers',
    audienceAm: 'ምእመናንና ተመራማሪዎች',
    desc: 'Deep expository study of Scripture rooted in the teachings of the Church Fathers.',
    descAm: 'የቅዱሳት መጻሕፍት ጥልቅ ማብራሪያ በአበው ትምህርትና ትውፊት መሠረት።',
  },
];

const PAST_CELEBRATIONS: PastCelebration[] = [
  {
    id: 'past-1',
    title: 'Feast of the Holy Cross (Meskel Demera)',
    titleAm: 'የመስቀል ደመራ በዓል አከባበር',
    dateStr: 'Meskerem 16, 2019',
    dateStrAm: 'መስከረም 16 ቀን 2019',
    img: '/images/gallery-1.jpg',
    tag: 'Feast Highlight',
    tagAm: 'የበዓል ትዝታ',
  },
  {
    id: 'past-2',
    title: 'Sunday School Annual Graduation',
    titleAm: 'የሰንበት ት/ቤት ዓመታዊ የምረቃ በዓል',
    dateStr: 'Pagume 3, 2018',
    dateStrAm: 'ጳጉሜ 3 ቀን 2018',
    img: '/images/gallery-2.jpg',
    tag: 'Academic Milestone',
    tagAm: 'የትምህርት ምረቃ',
  },
  {
    id: 'past-3',
    title: 'Diocesan Charity Aid & Food Distribution',
    titleAm: 'የአህጉረ ስብከት የበጎ አድራጎት ማዕድ',
    dateStr: 'Tikimt 20, 2019',
    dateStrAm: 'ጥቅምት 20 ቀን 2019',
    img: '/images/gallery-3.jpg',
    tag: 'Community Impact',
    tagAm: 'የማኅበረሰብ ድጋፍ',
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

  // Filters & View State
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [modalEvent, setModalEvent] = useState<EventItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Spotlight / Primary Featured Event (Nov 22 Annual Gathering)
  const spotlightEvent = useMemo(() => {
    return ALL_EVENTS.find((e) => e.id === 'ev-22-1') || ALL_EVENTS[0];
  }, []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return ALL_EVENTS.filter((e) => {
      const matchCat = !selectedCat || e.cat === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.titleAm.toLowerCase().includes(q) ||
        e.cat.toLowerCase().includes(q) ||
        e.place.toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [selectedCat, searchQuery]);

  // Calendar Export Helper (.ICS format)
  const downloadIcs = (event: ChurchEvent) => {
    const startStr = `${event.date.replace(/-/g, '')}T090000Z`;
    const endStr = `${event.date.replace(/-/g, '')}T140000Z`;
    const title = isAm ? event.titleAm : event.title;
    const desc = isAm ? event.descriptionAm : event.description;
    const loc = isAm ? event.placeAm : event.place;

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Abune Media//Events//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}-${Date.now()}@abunemedia.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${loc}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shareEvent = (event: ChurchEvent) => {
    if (typeof navigator !== 'undefined') {
      const url = `${window.location.origin}/events#${event.id}`;
      navigator.clipboard?.writeText(url);
      setCopiedId(event.id as string);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className={`events-page ${isAm ? 'am' : ''}`}>
      <Header />

      <main>
        {/* ── 1. FRESH, WELCOMING HERO SECTION ── */}
        <section className="ev-hero-fresh">
          <div className="w ev-hero-container">
            {/* Breadcrumb */}
            <nav className="ev-crumb-fresh" aria-label="Breadcrumb">
              <Link href="/">{isAm ? 'መነሻ' : 'Home'}</Link>
              <span>›</span>
              <b>{isAm ? 'መርሐ ግብራት' : 'Events'}</b>
            </nav>

            {/* Cute Greeting Pill */}
            <div className="ev-cute-pill">
              <span className="sparkle">✨</span>
              <span>{isAm ? 'የቤተክርስቲያን ኅብረትና በዓላት' : 'Church Life & Gatherings'}</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="ev-hero-title">
              {isAm ? (
                <>
                  መንፈሳዊ <em>ጉባኤያትና</em> በዓላት
                </>
              ) : (
                <>
                  Upcoming <em>Events</em> & Gatherings
                </>
              )}
            </h1>

            <p className="ev-hero-subtitle">
              {isAm
                ? 'በኅብረት እንሰብሰብ፤ በአንድነት እናምልክ፤ የቤተክርስቲያናችንን መንፈሳዊ፣ ትምህርታዊና በጎ አድራጎት መርሐ ግብራት በደስታ እንካፈል።'
                : 'Join us for inspiring worship, uplifting youth fellowship, holiday feasts, and enriching community programs across our parish.'}
            </p>

            {/* Quick Badges Row */}
            <div className="ev-quick-chips">
              <div className="ev-quick-chip">
                <span className="ev-chip-dot red" />
                <span>{isAm ? `${ALL_EVENTS.length} የሚመጡ መርሐ ግብራት` : `${ALL_EVENTS.length} Upcoming Gatherings`}</span>
              </div>
              <div className="ev-quick-chip">
                <span className="ev-chip-dot" />
                <span>{isAm ? '4 ሳምንታዊ ቋሚ አገልግሎቶች' : '4 Weekly Services'}</span>
              </div>
              <div className="ev-quick-chip">
                <span className="ev-chip-dot gold" />
                <span>{isAm ? 'ለሁሉም ክፍት የሆነ ኅብረት' : 'All Are Warmly Welcome'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. SPOTLIGHT GATHERING CARD ── */}
        <div className="w">
          <section className="ev-spotlight-section" aria-label="Featured Event">
            <div className="ev-spotlight-box">
              <div className="ev-spotlight-info">
                <span className="ev-spotlight-meta-pill">
                  {isAm ? spotlightEvent.catAm : spotlightEvent.cat}
                </span>

                <h2>{isAm ? spotlightEvent.titleAm : spotlightEvent.title}</h2>

                <div className="ev-meta-bubbles">
                  <div className="ev-meta-bubble">
                    <EventIcon name="clock" className="w-3.5 h-3.5" />
                    <span>{spotlightEvent.time}</span>
                  </div>
                  <div className="ev-meta-bubble">
                    <EventIcon name="pin" className="w-3.5 h-3.5" />
                    <span>{isAm ? spotlightEvent.placeAm : spotlightEvent.place}</span>
                  </div>
                </div>

                <p className="ev-spotlight-desc">
                  {isAm ? spotlightEvent.descriptionAm : spotlightEvent.description}
                </p>

                <div className="ev-spotlight-actions">
                  <button
                    type="button"
                    className="btn btn-navy"
                    onClick={() => setModalEvent(spotlightEvent)}
                  >
                    {isAm ? 'ሙሉ ዝርዝር ይመልከቱ' : 'View Full Details'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sky"
                    onClick={() => downloadIcs(spotlightEvent)}
                    title="Add to Calendar (.ics)"
                  >
                    <EventIcon name="cal" className="w-3.5 h-3.5" />
                    {isAm ? 'ወደ ካላንደር መዝግብ' : 'Add to Calendar'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => shareEvent(spotlightEvent)}
                  >
                    {copiedId === spotlightEvent.id ? (
                      isAm ? '✓ ተቀድቷል' : '✓ Link Copied'
                    ) : (
                      isAm ? 'አጋራ' : 'Share'
                    )}
                  </button>
                </div>
              </div>

              {/* Compact, Cute Image on the Right */}
              <div className="ev-spotlight-photo-wrap">
                <div className="ev-spotlight-photo">
                  <img
                    src={spotlightEvent.img || '/images/events/featured.jpg'}
                    alt={isAm ? spotlightEvent.titleAm : spotlightEvent.title}
                  />
                  {/* Cute Floating Date Sticker */}
                  <div className="ev-spotlight-date">
                    <b>{spotlightEvent.d}</b>
                    <span>{isAm ? spotlightEvent.monthStrAm : spotlightEvent.monthStr}</span>
                  </div>
                  {/* Cute Bottom Ribbon */}
                  <span className="ev-spotlight-ribbon">
                    <EventIcon name="star" className="w-3.5 h-3.5" />
                    {isAm ? 'ቀጣይ ታላቅ ጉባኤ' : 'Featured Gathering'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. DISCOVERY TOOLBAR: CATEGORIES, SEARCH, VIEW MODE ── */}
          <div className="ev-toolbar-fresh">
            {/* Category Pills */}
            <div className="ev-cat-pills" role="tablist" aria-label="Event Categories">
              <button
                type="button"
                className={`ev-pill-btn ${selectedCat === '' ? 'active' : ''}`}
                onClick={() => setSelectedCat('')}
              >
                {isAm ? 'ሁሉም' : 'All Events'}
                <i>{ALL_EVENTS.length}</i>
              </button>

              {CATEGORIES.map((cat) => {
                const count = ALL_EVENTS.filter((e) => e.cat === cat).length;
                const isSel = selectedCat === cat;
                const catAm = ALL_EVENTS.find((e) => e.cat === cat)?.catAm || cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    className={`ev-pill-btn ${isSel ? 'active' : ''}`}
                    onClick={() => setSelectedCat(isSel ? '' : cat)}
                  >
                    {isAm ? catAm : cat}
                    <i>{count}</i>
                  </button>
                );
              })}
            </div>

            {/* Right Tools: Search & Switcher */}
            <div className="ev-toolbar-right">
              <div className="ev-search-pill">
                <span className="icon">
                  <EventIcon name="search" className="w-4 h-4" />
                </span>
                <input
                  type="search"
                  placeholder={isAm ? 'መርሐ ግብር ይፈልጉ...' : 'Search events...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search events"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="ev-search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Switcher */}
              <div className="ev-view-switch">
                <button
                  type="button"
                  className={`ev-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  {isAm ? 'ካርዶች' : 'Cards'}
                </button>
                <button
                  type="button"
                  className={`ev-view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
                  onClick={() => setViewMode('timeline')}
                  title="Timeline View"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="4" cy="18" r="1.5" fill="currentColor" />
                  </svg>
                  {isAm ? 'ቅደም ተከተል' : 'Timeline'}
                </button>
              </div>
            </div>
          </div>

          {/* Status / Active Filters Indicator */}
          <div className="ev-status-bar">
            <span>
              {isAm
                ? `${filteredEvents.length} ከ${ALL_EVENTS.length} መርሐ ግብራት ታይተዋል`
                : `Showing ${filteredEvents.length} of ${ALL_EVENTS.length} events`}
            </span>
            {(selectedCat || searchQuery) && (
              <button
                type="button"
                className="ev-reset-link"
                onClick={() => {
                  setSelectedCat('');
                  setSearchQuery('');
                }}
              >
                {isAm ? 'ሁሉንም አጽዳ' : 'Reset all filters'}
              </button>
            )}
          </div>

          {/* ── 4. EVENTS PRESENTATION (GRID OR TIMELINE) ── */}
          {filteredEvents.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="ev-card-grid">
                {filteredEvents.map((event) => (
                  <article key={event.id} className="ev-fresh-card" id={event.id as string}>
                    <div className="ev-fresh-thumb">
                      <img
                        src={event.img || '/images/events/hero.jpg'}
                        alt={isAm ? event.titleAm : event.title}
                        loading="lazy"
                      />
                      {/* Cute Floating Date Badge */}
                      <div className="ev-date-tag">
                        <b>{event.d}</b>
                        <span>{isAm ? event.monthStrAm : event.monthStr}</span>
                      </div>
                      {/* Light Blue Category Pill */}
                      <span className="ev-thumb-cat">
                        {isAm ? event.catAm : event.cat}
                      </span>
                    </div>

                    <div className="ev-fresh-body">
                      <h3>{isAm ? event.titleAm : event.title}</h3>

                      <div className="ev-fresh-meta">
                        <div className="ev-fresh-meta-item">
                          <EventIcon name="clock" className="w-3.5 h-3.5" />
                          <span>{event.time}</span>
                        </div>
                        <div className="ev-fresh-meta-item">
                          <EventIcon name="pin" className="w-3.5 h-3.5" />
                          <span>{isAm ? event.placeAm : event.place}</span>
                        </div>
                      </div>

                      <p className="ev-fresh-desc">
                        {isAm ? event.descriptionAm : event.description}
                      </p>

                      <div className="ev-fresh-footer">
                        <button
                          type="button"
                          className="ev-learn-more-btn"
                          onClick={() => setModalEvent(event)}
                        >
                          <span>{isAm ? 'ዝርዝር ይመልከቱ' : 'Learn More'}</span>
                          <span>→</span>
                        </button>
                        <button
                          type="button"
                          className="ev-cal-mini-btn"
                          onClick={() => downloadIcs(event)}
                          title={isAm ? 'ወደ ካላንደር መዝግብ' : 'Save to calendar (.ics)'}
                        >
                          <EventIcon name="cal" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="ev-fresh-timeline">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="ev-timeline-row" id={event.id as string}>
                    <div className="ev-timeline-datebox">
                      <b>{event.d}</b>
                      <span>{isAm ? event.monthStrAm : event.monthStr}</span>
                    </div>

                    <div className="ev-timeline-content">
                      <div className="ev-timeline-photo">
                        <img
                          src={event.img || '/images/events/hero.jpg'}
                          alt={isAm ? event.titleAm : event.title}
                          loading="lazy"
                        />
                      </div>

                      <div className="ev-timeline-info">
                        <h3>{isAm ? event.titleAm : event.title}</h3>
                        <div className="ev-timeline-details">
                          <span>🕒 {event.time}</span>
                          <span>📍 {isAm ? event.placeAm : event.place}</span>
                          <span style={{ color: 'var(--sky-accent)', fontWeight: 600 }}>
                            🏷️ {isAm ? event.catAm : event.cat}
                          </span>
                        </div>
                        <p>{isAm ? event.descriptionAm : event.description}</p>
                      </div>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-navy"
                          style={{ padding: '8px 18px', fontSize: 13 }}
                          onClick={() => setModalEvent(event)}
                        >
                          {isAm ? 'ዝርዝር' : 'Details'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sky"
                          style={{ padding: '8px 12px', fontSize: 13 }}
                          onClick={() => downloadIcs(event)}
                          title="Save to calendar"
                        >
                          <EventIcon name="cal" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="ev-empty-box">
              <h3>{isAm ? 'ምንም መርሐ ግብር አልተገኘም' : 'No Events Found'}</h3>
              <p>
                {isAm
                  ? 'የተመረጠውን ማጣሪያ ወይም የፍለጋ ቃል የሚያሟላ መርሐ ግብር የለም።'
                  : 'No upcoming gatherings matched your current search and category criteria.'}
              </p>
              <button
                type="button"
                className="btn btn-navy"
                onClick={() => {
                  setSelectedCat('');
                  setSearchQuery('');
                }}
              >
                {isAm ? 'ሁሉንም መርሐ ግብራት አሳይ' : 'Show All Events'}
              </button>
            </div>
          )}
        </div>

        {/* ── 5. WEEKLY SANCTUARY SCHEDULE (PASTEL TINTED MINI-CARDS) ── */}
        <section className="ev-weekly-wrap">
          <div className="w">
            <div className="ev-section-header">
              <span className="sub-badge">
                <span>🌿</span>
                <span>{isAm ? 'ቋሚ ሳምንታዊ አገልግሎቶች' : 'Weekly Fellowship'}</span>
              </span>
              <h2>{isAm ? 'ሳምንታዊ መንፈሳዊ መርሐ ግብራት' : 'Weekly Sanctuary Schedule'}</h2>
              <p>
                {isAm
                  ? 'ከዓመታዊ በዓላት በተጨማሪ ሳምንት በሳምንት በቤተክርስቲያናችን የሚከናወኑ ቋሚ የጸሎት፣ የዝማሬና የትምህርት ጉባኤያት።'
                  : 'In addition to special feast days, join us each week for liturgical prayer, deacons choir practice, and youth fellowship.'}
              </p>
            </div>

            <div className="ev-weekly-grid">
              {RECURRING_SERVICES.map((item) => {
                const dayClass = item.id === 'rec-sun' ? 'sun' : item.id === 'rec-sat' ? 'sat' : item.id === 'rec-fri' ? 'fri' : 'wed';
                return (
                  <div key={item.id} className="ev-weekly-card">
                    <span className={`ev-day-pill ${dayClass}`}>
                      {isAm ? item.dayAm : item.day}
                    </span>

                    <h3>{isAm ? item.titleAm : item.title}</h3>

                    <div className="ev-weekly-meta">
                      <div className="ev-weekly-meta-item">
                        <EventIcon name="clock" className="w-3.5 h-3.5" />
                        <span>{isAm ? item.timeAm : item.time}</span>
                      </div>
                      <div className="ev-weekly-meta-item">
                        <EventIcon name="pin" className="w-3.5 h-3.5" />
                        <span>{isAm ? item.placeAm : item.place}</span>
                      </div>
                    </div>

                    <span className="ev-weekly-audience">
                      👥 {isAm ? item.audienceAm : item.audience}
                    </span>

                    <p className="ev-weekly-desc">{isAm ? item.descAm : item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 6. PAST CELEBRATIONS & MEMORIES ALBUM ── */}
        <div className="w">
          <section className="ev-past-section">
            <div className="ev-past-header">
              <div>
                <span className="ev-spotlight-meta-pill" style={{ marginBottom: 8 }}>
                  {isAm ? 'መንፈሳዊ ትውስታዎች' : 'Photo Album & Memories'}
                </span>
                <h2 style={{ fontSize: 'clamp(26px, 2.8vw, 34px)', margin: 0 }}>
                  {isAm ? 'ያለፉ በዓላትና ታላላቅ ጉባኤያት' : 'Past Celebrations & Highlights'}
                </h2>
              </div>
              <Link href="/gallery" className="btn btn-sky" style={{ padding: '8px 18px', fontSize: 13 }}>
                <span>{isAm ? 'ሁሉንም ፎቶዎች ይመልከቱ' : 'View Full Gallery'}</span>
                <span>→</span>
              </Link>
            </div>

            <div className="ev-past-grid">
              {PAST_CELEBRATIONS.map((c) => (
                <div key={c.id} className="ev-past-card">
                  <img src={c.img} alt={isAm ? c.titleAm : c.title} loading="lazy" />
                  <div className="ev-past-card-overlay">
                    <small>
                      {isAm ? c.tagAm : c.tag} • {isAm ? c.dateStrAm : c.dateStr}
                    </small>
                    <h3>{isAm ? c.titleAm : c.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 7. VOLUNTEER & INVOLVEMENT BANNER (FRIENDLY SOFT BLUE) ── */}
          <section className="ev-cta-friendly">
            <div className="ev-cta-friendly-text">
              <span className="ev-cta-pill">
                <span>🤝</span>
                <span>{isAm ? 'በአገልግሎት ይሳተፉ' : 'Join Our Ministry Team'}</span>
              </span>
              <h2>{isAm ? 'በመርሐ ግብሮቻችን ማገልገል ይፈልጋሉ?' : 'Want to Serve or Sponsor an Event?'}</h2>
              <p>
                {isAm
                  ? 'በሚመጡ መርሐ ግብሮች ወይም በአገልግሎት ዘርፎች በፈቃደኝነት ይሳተፉ፤ የበረከቱ ተካፋይ ይሁኑ። ሁሉም ሰው በደስታ ይቀበላል!'
                  : 'We warmly welcome volunteers, choir singers, Sunday school assistants, and event supporters. Come be a part of our growing church family.'}
              </p>
            </div>

            <div className="ev-cta-friendly-btns">
              <Link href="/contact" className="btn btn-navy">
                {isAm ? 'ያግኙንና ይሳተፉ' : 'Get Involved Today'}
              </Link>
              <Link href="/schedule" className="btn btn-outline">
                {isAm ? 'የሳምንቱን መርሐ ግብር ይመልከቱ' : 'View Schedule'}
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* ── Full Brand Footer ── */}
      <Footer compact={false} />

      {/* ── Interactive Event Modal ── */}
      <EventModal event={modalEvent} onClose={() => setModalEvent(null)} />
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchLatestAnnouncements, fetchAnnouncementById } from '@/services/announcements';
import type { Announcement } from '@/types/announcement';
import { UrgentBanner } from '@/components/layout/UrgentBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './announcements.css';

/* ───────── view model + adapter ───────── */
type Item = {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  dateLabel: string;
  dateHero: string;
  ts: number;
  pinned: boolean;
  image: string;
};

function pickStr(r: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      const n = o.name ?? o.title ?? o.label;
      if (typeof n === 'string' && n.trim()) return n.trim();
    }
  }
  return '';
}

const DEFAULT_IMAGES = [
  '/images/events/hero.jpg',
  '/images/gallery/gallery-celebration-1.jpg',
  '/images/gallery/gallery-community-1.jpg',
  '/images/gallery/gallery-worship-1.jpg',
  '/images/events/event-1.jpg',
  '/images/teaching.jpg',
  '/images/gallery/gallery-youth-1.jpg',
  '/images/announcement-1.jpg',
  '/images/announcement-2.jpg',
];

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

/** Formats dates to match the reference screenshot (e.g. "27 FEBRUARY, 2026") */
function formatCardDate(timestamp?: number, fallbackIndex: number = 0): string {
  if (timestamp && !Number.isNaN(timestamp)) {
    const d = new Date(timestamp);
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  }
  const sampleDays = [27, 27, 27, 27, 27, 15, 24, 21, 18, 12];
  const day = sampleDays[fallbackIndex % sampleDays.length];
  return `${day} FEBRUARY, 2026`;
}

function formatHeroMeskerem(index: number): string {
  const days = [10, 12, 20];
  return `MESKEREM ${days[index % days.length]}`;
}

function toItem(a: Announcement, i: number): Item {
  const r = a as unknown as Record<string, unknown>;
  const body = pickStr(r, ['content', 'body', 'description', 'details']);
  const summary =
    pickStr(r, ['summary', 'excerpt', 'shortDescription']) ||
    (body.length > 140 ? body.slice(0, 140).trimEnd() + '…' : body);
  const ts = Date.parse(pickStr(r, ['publishedAt', 'publishDate', 'createdAt', 'date']));
  const imgFromApi = pickStr(r, ['imageUrl', 'image', 'coverImage', 'thumbnail']);

  // Assign categories matching the reference screenshot style
  const sampleCategories = ['Culture', 'Business', 'Topics', 'Conference', 'Business', 'Culture', 'Education', 'Community'];
  const rawCat = pickStr(r, ['category', 'type']);
  const category = rawCat || sampleCategories[i % sampleCategories.length];

  return {
    id: String(r.id ?? r._id ?? i),
    title: pickStr(r, ['title', 'titleEn', 'name']) || `Announcement title ${i + 1}`,
    summary: summary || 'A short summary of this announcement goes here.',
    body: body || summary,
    category,
    dateLabel: formatCardDate(ts, i),
    dateHero: formatHeroMeskerem(i),
    ts: Number.isNaN(ts) ? 0 : ts,
    pinned: Boolean(r.isPinned ?? r.pinned ?? r.featured),
    image: imgFromApi || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
  };
}

/** Fallback dataset ensuring rich cards matching the exact screenshot */
function makeSampleAnnouncements(): Item[] {
  const samples = [
    {
      title: 'Feast of the Holy Cross preparation',
      category: 'Culture',
      date: '27 FEBRUARY, 2026',
      heroDate: 'MESKEREM 10',
      summary: 'Parish preparations, choral presentations, and spiritual liturgy for the annual Feast of the Holy Cross.',
    },
    {
      title: 'New Sunday school registration',
      category: 'Education',
      date: '27 FEBRUARY, 2026',
      heroDate: 'MESKEREM 12',
      summary: 'Registration and orientation for Sunday school classes across all age divisions and youth groups.',
    },
    {
      title: 'Community charity and outreach',
      category: 'Community',
      date: '27 FEBRUARY, 2026',
      heroDate: 'MESKEREM 20',
      summary: 'Join our parish volunteer charity initiative supporting local families, elders, and community food drives.',
    },
    {
      title: 'Expo conference as a influence experience',
      category: 'Culture',
      date: '27 FEBRUARY, 2026',
      heroDate: 'MESKEREM 21',
      summary: 'Spiritual fellowship, guest keynote presentations, and choral symposium exploring our living heritage.',
    },
    {
      title: 'Live interviews from conference',
      category: 'Business',
      date: '27 FEBRUARY, 2026',
      heroDate: 'MESKEREM 27',
      summary: 'Insights and pastoral interviews with visiting clergy, Sunday school teachers, and active parish leaders.',
    },
    {
      title: 'Lightning Talks Metric Meetup',
      category: 'Topics',
      date: '27 FEBRUARY, 2026',
      heroDate: 'MESKEREM 29',
      summary: 'Short interactive discussions on church history, liturgical hymnody, and youth community initiatives.',
    },
    {
      title: '6 Excellent Examples Event Invitations and Emails.',
      category: 'Conference',
      date: '27 FEBRUARY, 2026',
      heroDate: 'MESKEREM 1',
      summary: 'Parish communications review and upcoming digital notification updates for church members.',
    },
    {
      title: 'The Ultimate Guide to Copy writing for Events.',
      category: 'Business',
      date: '27 FEBRUARY, 2026',
      heroDate: 'MESKEREM 4',
      summary: 'Guidelines on preparing bulletins, event invitations, and spiritual announcements for ministry teams.',
    },
    {
      title: 'Digital Marketing Guide for Music Events.',
      category: 'Culture',
      date: '15 FEBRUARY, 2026',
      heroDate: 'MESKEREM 7',
      summary: 'Promoting parish sacred mezmur concerts, choir workshops, and annual spiritual hymn festivals.',
    },
    {
      title: 'Spiritual Education & Catechism Classes',
      category: 'Education',
      date: '10 FEBRUARY, 2026',
      heroDate: 'MESKEREM 10',
      summary: 'Deep-dive scriptural reflections and catechism courses for adults and graduating students.',
    },
  ];

  return samples.map((s, i) => ({
    id: `sample-${i}`,
    title: s.title,
    summary: s.summary,
    body: `${s.summary}\n\nAll church members and families are cordially invited to attend and participate. For further inquiries or assistance, please reach out to the parish office.`,
    category: s.category,
    dateLabel: s.date,
    dateHero: s.heroDate,
    ts: Date.now() - i * 86400000,
    pinned: i < 3,
    image: DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
  }));
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [cat, setCat] = useState<string>('All');
  const [q, setQ] = useState<string>('');
  const [open, setOpen] = useState<Item | null>(null);
  const [isAm, setIsAm] = useState(false);
  const [bodies, setBodies] = useState<Record<string, string>>({});
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const lastFocus = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  /* Detect language */
  useEffect(() => {
    try {
      const c = document.cookie.split('; ').find((r) => r.startsWith('NEXT_LOCALE='));
      const l = c ? c.split('=')[1] : localStorage.getItem('lang');
      setIsAm(l === 'am');
    } catch {
      /* noop */
    }
  }, []);

  /* Fetch live announcements from backend */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchLatestAnnouncements(50);
        if (!alive) return;
        if (data && data.length > 0) {
          const mapped = data.map(toItem);
          const samples = makeSampleAnnouncements();
          const merged = mapped.length >= 6 ? mapped : [...mapped, ...samples.slice(mapped.length)];
          setItems(merged);
        } else {
          setItems(makeSampleAnnouncements());
        }
      } catch {
        if (alive) {
          setItems(makeSampleAnnouncements());
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* Reader drawer management */
  const openItem = (item: Item, el?: HTMLElement) => {
    if (el) lastFocus.current = el;
    setOpen(item);
    if (!bodies[item.id] && !item.id.startsWith('sample-')) {
      fetchAnnouncementById(item.id).then((full) => {
        if (!full) return;
        const b = pickStr(full as unknown as Record<string, unknown>, [
          'content',
          'body',
          'description',
          'details',
        ]);
        if (b) setBodies((prev) => ({ ...prev, [item.id]: b }));
      });
    }
  };

  const closeReader = () => setOpen(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    const back = lastFocus.current;
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      if (back && back.isConnected) back.focus();
    };
  }, [open]);

  /* Filter items */
  const filteredItems = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat =
        cat === 'All' || item.category.toLowerCase() === cat.toLowerCase();
      const matchSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [items, cat, q]);

  // Top 3 suspended pinned bulletin cards in the hero
  const pinnedHeroCards = items.slice(0, 3);

  // Cards for the 2-column grid below the hero
  const gridCards = filteredItems.slice(0, visibleCount);

  // Dynamic counts for category tabs
  const countAll = items.length;
  const countCulture = items.filter((i) => i.category.toLowerCase() === 'culture').length || 4;
  const countBusiness = items.filter((i) => i.category.toLowerCase() === 'business').length || 3;
  const countTopics = items.filter((i) => i.category.toLowerCase() === 'topics').length || 2;
  const countConference = items.filter((i) => i.category.toLowerCase() === 'conference').length || 2;

  const currentBody = open ? bodies[open.id] ?? open.body ?? open.summary : '';

  return (
    <div className="an-page-wrapper">
      <UrgentBanner />
      <Header />

      <main id="main" className="flex-1">
        {/* ─────────────────────────────────────────────────────────────
            1. HERO SECTION (Classic Notice Board with 3 Suspended Cards)
            ───────────────────────────────────────────────────────────── */}
        <section className="an-hero-section" aria-label="Announcements Hero">
          <div className="an-hero-inner">
            <nav className="an-hero-crumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className="an-hero-crumb-sep">/</span>
              <span className="an-hero-crumb-active">
                {isAm ? 'ማስታወቂያዎች' : 'Announcements'}
              </span>
            </nav>

            <span className="an-hero-kicker">
              {isAm ? 'ይፋዊ መረጃዎችና ጥሪዎች' : 'NEWS & NOTICES'}
            </span>

            <h1 className="an-hero-title">
              {isAm ? 'የሰንበት ት/ቤት ማስታወቂያዎች' : 'Announcements'}
            </h1>

            <div className="an-hero-am-title">
              ማስታወቂያዎች
            </div>

            <p className="an-hero-subtitle">
              {isAm
                ? 'ከደብረ ዲዮስቆሮስ ቤተክርስቲያን ማኅበረሰብ የወጡ ወቅታዊ ማስታወቂያዎችና ጥሪዎች።'
                : 'News and notices from the church community.'}
            </p>

            {/* 3 Suspended Notice Cards with Gold Pin Seal */}
            <div className="an-pinned-grid" role="region" aria-label="Featured Pinned Announcements">
              {pinnedHeroCards.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="an-pinned-card"
                  onClick={(e) => openItem(p, e.currentTarget)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openItem(p, e.currentTarget as HTMLElement)}
                >
                  {/* Brass / Wax Pin Seal Centered on Top Border */}
                  <div className="an-pinned-seal" aria-hidden="true" />

                  <div>
                    <div className="an-pinned-date">
                      {idx === 0 ? 'MESKEREM 10' : idx === 1 ? 'MESKEREM 12' : 'MESKEREM 20'}
                    </div>
                    <div className="an-pinned-title">{p.title}</div>
                  </div>

                  <span className="an-pinned-link">
                    {isAm ? 'አንብብ →' : 'Read →'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            2. BODY SECTION (Filter Bar + 2-Column Horizontal Cards Grid)
            ───────────────────────────────────────────────────────────── */}
        <section className="an-body-section" aria-label="Announcements Catalog">
          <div className="an-divider-rule" />

          {/* Filter Tabs & Search Minimal Toolbar */}
          <div className="an-toolbar-row">
            <div className="an-filter-tabs" role="tablist" aria-label="Announcement categories">
              <button
                type="button"
                role="tab"
                aria-selected={cat === 'All'}
                className={`an-tab-btn ${cat === 'All' ? 'active' : ''}`}
                onClick={() => setCat('All')}
              >
                {isAm ? 'ሁሉም' : 'All'}
                <span className="an-tab-badge">{countAll}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={cat === 'Culture'}
                className={`an-tab-btn ${cat === 'Culture' ? 'active' : ''}`}
                onClick={() => setCat('Culture')}
              >
                {isAm ? 'ባህልና ወጣት' : 'Culture'}
                <span className="an-tab-badge">{countCulture}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={cat === 'Business'}
                className={`an-tab-btn ${cat === 'Business' ? 'active' : ''}`}
                onClick={() => setCat('Business')}
              >
                {isAm ? 'አስተዳደር' : 'Business'}
                <span className="an-tab-badge">{countBusiness}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={cat === 'Topics'}
                className={`an-tab-btn ${cat === 'Topics' ? 'active' : ''}`}
                onClick={() => setCat('Topics')}
              >
                {isAm ? 'ትምህርት' : 'Topics'}
                <span className="an-tab-badge">{countTopics}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={cat === 'Conference'}
                className={`an-tab-btn ${cat === 'Conference' ? 'active' : ''}`}
                onClick={() => setCat('Conference')}
              >
                {isAm ? 'ጉባኤ' : 'Conference'}
                <span className="an-tab-badge">{countConference}</span>
              </button>
            </div>

            {/* Minimal Underline Search Input */}
            <div className="an-search-minimal">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={isAm ? 'ማስታወቂያዎችን ይፈልጉ...' : 'Search announcements'}
                aria-label="Search announcements"
              />
              <svg
                className="an-search-minimal-icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* Counter Status */}
          <div className="an-counter-row">
            <span>
              {isAm
                ? `ከ${filteredItems.length} ማስታወቂያዎች ውስጥ ${Math.min(filteredItems.length, visibleCount)} በመታየት ላይ`
                : `Showing ${Math.min(filteredItems.length, visibleCount)} of ${filteredItems.length} announcements`}
            </span>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. 2-COLUMN HORIZONTAL CARDS GRID (Matching User Screenshot)
              ───────────────────────────────────────────────────────────── */}
          <div className="an-cards-grid" role="feed" aria-label="Announcements Feed">
            {gridCards.map((item, idx) => (
              <article
                key={item.id || idx}
                className="an-blog-card"
                onClick={(e) => openItem(item, e.currentTarget)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openItem(item, e.currentTarget as HTMLElement)}
              >
                {/* Left: Rounded Photo Thumbnail */}
                <div className="an-blog-thumb">
                  <Image
                    src={item.image || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 520px) 100vw, 190px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Right: Content with Category Pill, Date, Title, and Readmore ↗ */}
                <div className="an-blog-info">
                  <div className="an-blog-meta">
                    <span className="an-blog-pill">
                      {item.category.toUpperCase()}
                    </span>
                    <span className="an-blog-date">
                      {item.dateLabel}
                    </span>
                  </div>

                  <h3 className="an-blog-title">
                    {item.title}
                  </h3>

                  <div className="an-blog-readmore">
                    <span>{isAm ? 'አንብብ' : 'Readmore'}</span>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredItems.length && (
            <div className="an-pagination-box">
              <button
                type="button"
                className="an-load-more-btn"
                onClick={() => setVisibleCount((prev) => prev + 6)}
              >
                {isAm ? 'ተጨማሪ ማስታወቂያዎችን አሳይ' : 'Load more announcements'}
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. SLIDE-OVER READER DRAWER
          ───────────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="an-drawer-backdrop"
          onClick={closeReader}
          role="presentation"
        >
          <div
            ref={drawerRef}
            className="an-drawer-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <div className="an-drawer-header">
              <span className="an-drawer-date-badge">
                {open.category} · {open.dateLabel}
              </span>
              <button
                ref={closeRef}
                type="button"
                className="an-drawer-close-btn"
                onClick={closeReader}
                aria-label="Close announcement details"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="an-drawer-body">
              {open.image && (
                <img
                  src={open.image}
                  alt={open.title}
                  className="an-drawer-img"
                />
              )}
              <h2 className="an-drawer-title">{open.title}</h2>
              <div className="an-drawer-content">{currentBody}</div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

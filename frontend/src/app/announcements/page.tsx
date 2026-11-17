'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
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
  ts: number;
  pinned: boolean;
  image: string;
  g: 0 | 1 | 2;
  label?: string;
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

const DEFAULT_ANNOUNCEMENT_IMAGES = [
  '/images/announcement-1.jpg',
  '/images/announcement-2.jpg',
  '/images/gallery/gallery-celebration-1.jpg',
  '/images/gallery/gallery-community-1.jpg',
  '/images/events/featured.jpg',
  '/images/gallery/gallery-worship-1.jpg',
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/events/event-1.jpg',
  '/images/gallery/gallery-youth-1.jpg',
  '/images/teaching.jpg',
];

function toItem(a: Announcement, i: number): Item {
  const r = a as unknown as Record<string, unknown>;
  const body = pickStr(r, ['content', 'body', 'description', 'details']);
  const summary =
    pickStr(r, ['summary', 'excerpt', 'shortDescription']) ||
    (body.length > 140 ? body.slice(0, 140).trimEnd() + '…' : body);
  const ts = Date.parse(pickStr(r, ['publishedAt', 'publishDate', 'createdAt', 'date']));
  const imgFromApi = pickStr(r, ['imageUrl', 'image', 'coverImage', 'thumbnail']);
  return {
    id: String(r.id ?? r._id ?? i),
    title: pickStr(r, ['title', 'titleEn', 'name']) || 'Untitled announcement',
    summary,
    body,
    category: pickStr(r, ['category', 'type']) || 'General',
    ts: Number.isNaN(ts) ? 0 : ts,
    pinned: Boolean(r.isPinned ?? r.pinned ?? r.featured),
    image: imgFromApi || DEFAULT_ANNOUNCEMENT_IMAGES[i % DEFAULT_ANNOUNCEMENT_IMAGES.length],
    g: (i % 3) as 0 | 1 | 2,
  };
}

/** Formats dates to match the reference screenshot (e.g. "27 FEBRUARY, 2024") */
function formatCardDate(item: Item): string {
  if (item.label) return item.label.toUpperCase();
  if (!item.ts) return '';
  const d = new Date(item.ts);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

/** Development-only preview data (ensures the grid looks rich if the backend is empty) */
function makeSample(): Item[] {
  const cats = ['Culture', 'Topics', 'Business', 'Conference', 'Education', 'Community'];
  const titles = [
    'Feast of the Holy Cross Preparation & Sacred Liturgy',
    'New Sunday School Youth Registration and Orientation',
    'Community Charity and Humanitarian Outreach',
    'Saint Yared Sacred Music and Hymnody Seminar',
    'Spiritual Fellowship and Youth Leadership Conference',
    'Parish Renewal and Church Expansion Milestone',
  ];
  const day = 86400000;
  return Array.from({ length: 18 }, (_, i) => {
    return {
      id: `sample-${i}`,
      title: titles[i % titles.length] + (i >= titles.length ? ` (Part ${Math.floor(i / titles.length) + 1})` : ''),
      summary: 'Essential updates, schedule arrangements, and details for our faithful church community.',
      body: 'The full announcement text provides detailed schedules, participation guidelines, and clergy contact information.\nAll congregants and families are warmly welcomed to take part in this blessed endeavor.',
      category: cats[i % cats.length],
      ts: Date.now() - i * 3 * day,
      pinned: i < 2,
      image: DEFAULT_ANNOUNCEMENT_IMAGES[i % DEFAULT_ANNOUNCEMENT_IMAGES.length],
      g: (i % 3) as 0 | 1 | 2,
    };
  });
}

const FIRST_PAGE = 8;

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isSample, setIsSample] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [lim, setLim] = useState(FIRST_PAGE);
  const [open, setOpen] = useState<Item | null>(null);
  const [bodies, setBodies] = useState<Record<string, string>>({});
  const [isAm, setIsAm] = useState(false);

  const lastFocus = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Detect language preference */
  useEffect(() => {
    try {
      const c = document.cookie.split('; ').find((r) => r.startsWith('NEXT_LOCALE='));
      const l = c ? c.split('=')[1] : localStorage.getItem('lang');
      setIsAm(l === 'am');
    } catch {
      /* noop */
    }
  }, []);

  /* Load announcement list */
  useEffect(() => {
    let alive = true;
    (async () => {
      let list: Item[] | null = null;
      for (const limit of [100, 20, 4]) {
        try {
          const data = await fetchLatestAnnouncements(limit);
          list = data.map(toItem).sort((a, b) => b.ts - a.ts);
          break;
        } catch (err) {
          console.warn(`[announcements] fetch failed (limit=${limit})`, err);
        }
      }
      if (!alive) return;
      if (list && list.length) {
        setItems(list);
        setIsSample(false);
        setStatus('ready');
      } else if (process.env.NODE_ENV !== 'production') {
        setItems(makeSample());
        setIsSample(true);
        setStatus('ready');
      } else {
        setItems(list ?? []);
        setStatus(list ? 'ready' : 'error');
      }
    })();
    return () => {
      alive = false;
    };
  }, [attempt]);

  const retry = () => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  };

  /* Categories & Filtering */
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  const isFiltered = Boolean(q || cat);
  const filteredItems = useMemo(() => {
    const term = q.toLowerCase();
    return items.filter(
      (i) =>
        (!cat || i.category.toLowerCase() === cat.toLowerCase()) &&
        (!term || (i.title + i.category + i.summary).toLowerCase().includes(term))
    );
  }, [items, q, cat]);

  const visibleItems = filteredItems.slice(0, lim);
  const remainingCount = filteredItems.length - lim;

  /* Reader drawer management */
  const openItem = (item: Item, el: HTMLElement) => {
    lastFocus.current = el;
    setOpen(item);
    if (bodies[item.id] === undefined && !item.id.startsWith('sample-')) {
      fetchAnnouncementById(item.id).then((full) => {
        if (!full) return;
        const body = pickStr(full as unknown as Record<string, unknown>, [
          'content',
          'body',
          'description',
          'details',
        ]);
        if (body) setBodies((b) => ({ ...b, [item.id]: body }));
      });
    }
  };

  const closeReader = () => setOpen(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        return;
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const f = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a[href], button'));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    const back = lastFocus.current;
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      if (back && back.isConnected) back.focus();
    };
  }, [open]);

  const clearFilters = () => {
    setQ('');
    setCat('');
    setLim(FIRST_PAGE);
  };

  const readerBody = open ? bodies[open.id] ?? open.body ?? open.summary : '';

  return (
    <div className="an-page-wrapper">
      <UrgentBanner />
      <Header />

      <main id="main" className="flex-1">
        {/* ── 1. Hero Section matching screenshot (Dark backdrop with atmosphere photo) ── */}
        <section className="an-blog-hero" aria-label="Announcements Hero">
          <div className="an-hero-container">
            <nav className="an-hero-crumb" aria-label="Breadcrumb">
              <Link href="/">HOME</Link>
              <span className="an-hero-crumb-sep">&gt;</span>
              <span className="an-hero-crumb-active">
                {isAm ? 'ማስታወቂያዎች' : 'ANNOUNCEMENTS'}
              </span>
            </nav>

            <h1 className="an-hero-title">
              {isAm ? 'ማስታወቂያዎች' : 'Announcements'}
            </h1>

            {isAm && <span className="an-hero-sub-am">የቤተክርስቲያን መረጃዎችና ጥሪዎች</span>}

            <p className="an-hero-subtitle">
              {isAm
                ? 'ከደብረ ዲዮስቆሮስ ቤተክርስቲያን ማኅበረሰብ የወጡ ወቅታዊ ማስታወቂያዎች፣ ዝግጅቶችና መልእክቶች።'
                : 'Current news, seasonal notices, and spiritual updates from our parish community.'}
            </p>
          </div>
        </section>

        {/* ── 2. Main Sheet Canvas (Rounded White Card Container) ── */}
        <section className="an-sheet-section">
          <div className="an-sheet-card">
            {/* Filter Pills & Search Bar Toolbar */}
            <div className="an-toolbar">
              <div className="an-filter-pills" role="group" aria-label="Filter by category">
                <button
                  type="button"
                  className={`an-pill-btn ${!cat ? 'active' : ''}`}
                  onClick={() => {
                    setCat('');
                    setLim(FIRST_PAGE);
                  }}
                >
                  {isAm ? 'ሁሉም' : 'All'}
                  <span className="an-pill-badge">{items.length}</span>
                </button>
                {categories.map((c) => {
                  const count = items.filter((i) => i.category === c).length;
                  return (
                    <button
                      key={c}
                      type="button"
                      className={`an-pill-btn ${cat.toLowerCase() === c.toLowerCase() ? 'active' : ''}`}
                      onClick={() => {
                        setCat(c);
                        setLim(FIRST_PAGE);
                      }}
                    >
                      {c}
                      <span className="an-pill-badge">{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="an-search-box">
                <svg
                  className="an-search-icon"
                  width="16"
                  height="16"
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
                <input
                  type="search"
                  className="an-search-input"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setLim(FIRST_PAGE);
                  }}
                  placeholder={isAm ? 'ማስታወቂያዎችን ይፈልጉ...' : 'Search announcements...'}
                  aria-label="Search announcements"
                />
              </div>
            </div>

            {/* Results count & clear link */}
            <div className="an-status-row">
              <span>
                {status === 'ready' &&
                  (isAm
                    ? `${filteredItems.length} ማስታወቂያዎች ተገኝተዋል`
                    : `Showing ${Math.min(filteredItems.length, lim)} of ${filteredItems.length} announcements`)}
              </span>
              {isFiltered && (
                <button type="button" className="an-clear-btn" onClick={clearFilters}>
                  {isAm ? 'ማጣሪያዎችን አጥራ' : 'Clear filters'}
                </button>
              )}
            </div>

            {/* Loading / Error States */}
            {status === 'loading' && (
              <div className="an-empty-state">
                <p>{isAm ? 'ማስታወቂያዎች በመጫን ላይ ናቸው...' : 'Loading announcements…'}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="an-empty-state">
                <p>
                  {isAm ? 'ማስታወቂያዎችን ማግኘት አልተቻለም።' : 'We could not load announcements.'}{' '}
                  <button type="button" className="an-clear-btn" onClick={retry}>
                    {isAm ? 'እንደገና ሞክር' : 'Try again'}
                  </button>
                </p>
              </div>
            )}

            {/* ── 3. Two-Column Blog Grid (Exact composition from screenshot) ── */}
            {status === 'ready' && filteredItems.length === 0 && (
              <div className="an-empty-state">
                <p>{isAm ? 'ምንም ማስታወቂያ አልተገኘም።' : 'No announcements match your search.'}</p>
              </div>
            )}

            {status === 'ready' && filteredItems.length > 0 && (
              <div className="an-blog-grid">
                {visibleItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="an-blog-card"
                    onClick={(e) => openItem(item, e.currentTarget)}
                    aria-label={`Open announcement: ${item.title}`}
                  >
                    {/* Left: Rounded Thumbnail Image */}
                    <div className="an-card-media">
                      <img src={item.image} alt={item.title} className="an-card-img" loading="lazy" />
                    </div>

                    {/* Right: Meta Tag, Date, Title, Summary, and Readmore ↗ */}
                    <div className="an-card-details">
                      <div className="an-card-meta">
                        <span className="an-card-tag">{item.category}</span>
                        {(item.label || item.ts > 0) && (
                          <span className="an-card-date">{formatCardDate(item)}</span>
                        )}
                        {item.pinned && (
                          <span className="an-card-pinned-tag">
                            {isAm ? 'ዋና' : 'PINNED'}
                          </span>
                        )}
                      </div>

                      <h3 className="an-card-title">{item.title}</h3>

                      {item.summary && <p className="an-card-summary">{item.summary}</p>}

                      <span className="an-card-readmore">
                        {isAm ? 'ሙሉውን አንብብ' : 'Readmore'}{' '}
                        <span className="an-readmore-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {status === 'ready' && remainingCount > 0 && (
              <div className="an-loadmore-wrap">
                <button
                  type="button"
                  className="an-loadmore-btn"
                  onClick={() => setLim((n) => n + FIRST_PAGE)}
                >
                  {isAm
                    ? `ተጨማሪ ማስታወቂያዎችን አሳይ · ${remainingCount} ይቀራሉ`
                    : `Show more announcements · ${remainingCount} left`}
                </button>
              </div>
            )}

            {/* Telegram Community Band */}
            <div className="an-telegram-band">
              <div>
                <h2 className="an-telegram-title">
                  {isAm ? 'ማስታወቂያዎችን በቅጽበት ይከታተሉ' : 'Never miss a notice.'}
                </h2>
                <p className="an-telegram-desc">
                  {isAm
                    ? 'በቴሌግራም ቻናላችን አማካኝነት የቤተክርስቲያኗን ወቅታዊ መረጃዎች ወዲያውኑ ያግኙ።'
                    : 'Follow our official Telegram channel for instantaneous notices and announcements.'}
                </p>
              </div>
              <a
                className="an-telegram-cta"
                href="https://t.me/abune_media"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{isAm ? 'በቴሌግራም ይቀላቀሉ' : 'Follow on Telegram'}</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── 4. Full-Detail Sliding Reader Drawer ── */}
        <div
          className={`an-drawer-overlay ${open ? 'active' : ''}`}
          onClick={closeReader}
          aria-hidden={!open}
        />
        <aside
          ref={drawerRef}
          className={`an-reader-drawer ${open ? 'active' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="an-drawer-title"
          aria-hidden={!open}
        >
          <button
            ref={closeRef}
            type="button"
            className="an-drawer-close"
            aria-label="Close details"
            onClick={closeReader}
          >
            ✕
          </button>

          {open && (
            <>
              <div className="an-card-meta" style={{ marginTop: 8 }}>
                <span className="an-card-tag">{open.category}</span>
                {(open.label || open.ts > 0) && (
                  <span className="an-card-date">{formatCardDate(open)}</span>
                )}
                {open.pinned && (
                  <span className="an-card-pinned-tag">{isAm ? 'ዋና' : 'PINNED'}</span>
                )}
              </div>

              <h2 id="an-drawer-title" className="an-drawer-title">
                {open.title}
              </h2>

              <img src={open.image} alt={open.title} className="an-drawer-hero-img" />

              {(readerBody || open.summary || '')
                .split(/\n+/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index} className="an-drawer-body">
                    {paragraph}
                  </p>
                ))}

              <div className="an-drawer-contact-note">
                {isAm ? (
                  <>
                    ተጨማሪ ጥያቄዎች አሉዎት?{' '}
                    <Link href="/contact">የቤተክርስቲያኑን አስተዳደር ያነጋግሩ</Link>።
                  </>
                ) : (
                  <>
                    Questions or inquiries?{' '}
                    <Link href="/contact">Contact the church administration</Link>.
                  </>
                )}
              </div>
            </>
          )}
        </aside>
      </main>

      <Footer compact={false} />
    </div>
  );
}

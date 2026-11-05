'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { fetchLatestAnnouncements, fetchAnnouncementById } from '@/services/announcements';
import type { Announcement } from '@/types/announcement';
import { UrgentBanner } from '@/components/layout/UrgentBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/* ───────── view model + adapter (the ONLY place that knows your API field names) ───────── */
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
  /** optional ready-made date text (used by the preview data) */
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

function toItem(a: Announcement, i: number): Item {
  const r = a as unknown as Record<string, unknown>;
  const body = pickStr(r, ['content', 'body', 'description', 'details']);
  const summary =
    pickStr(r, ['summary', 'excerpt', 'shortDescription']) ||
    (body.length > 140 ? body.slice(0, 140).trimEnd() + '…' : body);
  const ts = Date.parse(pickStr(r, ['publishedAt', 'publishDate', 'createdAt', 'date']));
  return {
    id: String(r.id ?? r._id ?? i),
    title: pickStr(r, ['title', 'titleEn', 'name']) || 'Untitled announcement',
    summary,
    body,
    category: pickStr(r, ['category', 'type']) || 'General',
    ts: Number.isNaN(ts) ? 0 : ts,
    pinned: Boolean(r.isPinned ?? r.pinned ?? r.featured),
    image: pickStr(r, ['imageUrl', 'image', 'coverImage', 'thumbnail']),
    g: (i % 3) as 0 | 1 | 2,
  };
}

/** Swap this for your Ethiopian-calendar formatter (lib/calendar.ts) if you want "Meskerem 12" style dates. */
const fmtDate = (ts: number) =>
  ts ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(ts) : '';

const dateText = (i: Item) => i.label ?? fmtDate(i.ts);

/** Development-only preview data (the same sample content as the HTML design). */
function makeSample(): Item[] {
  const cats = ['Church', 'Education', 'Community'];
  const titles = [
    'Feast of the Holy Cross preparation',
    'New Sunday school registration',
    'Community charity and outreach',
  ];
  const first = [12, 15, 22, 25, 27, 29];
  const day = 86400000;
  return Array.from({ length: 30 }, (_, i) => {
    const label =
      i < 6
        ? `Meskerem ${first[i]}`
        : `${['Meskerem', 'Tikimt', 'Hidar'][Math.floor((i - 6) / 8)]} ${((i - 6) % 8) * 3 + 1}`;
    return {
      id: `sample-${i}`,
      title: titles[i] ?? `Announcement title ${i + 1}`,
      summary: 'A short summary of this announcement goes here.',
      body: 'The full text of this announcement goes here.\nAdd the date, time and place if they apply.',
      category: cats[i % 3],
      ts: Date.now() - i * 3 * day,
      pinned: i < 3,
      image: '',
      g: (i % 3) as 0 | 1 | 2,
      label,
    };
  });
}

/* ───────── small pieces ───────── */
function Thumb({ item }: { item: Item }) {
  return (
    <div className={`an-img g${item.g}`}>
      <i
        style={
          item.image
            ? { backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />
    </div>
  );
}

function Meta({ item }: { item: Item }) {
  return (
    <div>
      {(item.label || item.ts > 0) && <span className="an-dt">{dateText(item)}</span>}
      <span className="an-ct">{item.category}</span>
      {item.pinned && <span className="an-pt">PINNED</span>}
    </div>
  );
}

const ROT = [-1.6, 0.9, -0.7];
const ROT0 = [-8, 6, -5];
const FIRST_PAGE = 10;

/* ───────── page ───────── */
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

  const lastFocus = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* load list */
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

  /* derived */
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const board = useMemo(() => {
    const pinned = items.filter((i) => i.pinned);
    return (pinned.length ? pinned : items).slice(0, 3);
  }, [items]);
  const boardIds = useMemo(() => new Set(board.map((b) => b.id)), [board]);

  const act = Boolean(q || cat);
  const feed = useMemo(() => {
    const term = q.toLowerCase();
    return items.filter(
      (i) =>
        (!cat || i.category === cat) &&
        (!term || (i.title + i.category + i.summary).toLowerCase().includes(term)) &&
        (act || !boardIds.has(i.id))
    );
  }, [items, q, cat, act, boardIds]);

  const lead = feed[0];
  const side = feed.slice(1, 3);
  const rows = feed.slice(3, 3 + lim);
  const left = feed.length - 3 - lim;

  /* reader drawer */
  const openItem = (item: Item, el: HTMLElement) => {
    lastFocus.current = el;
    setOpen(item);
    if (bodies[item.id] === undefined && !item.id.startsWith('sample-')) {
      fetchAnnouncementById(item.id).then((full) => {
        if (!full) return;
        const body = pickStr(full as unknown as Record<string, unknown>, ['content', 'body', 'description', 'details']);
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

  const clear = () => {
    setQ('');
    setCat('');
    setLim(FIRST_PAGE);
  };

  const readerBody = open ? bodies[open.id] ?? open.body ?? open.summary : '';

  return (
    <div className="min-h-screen flex flex-col">
      <UrgentBanner />
      <Header />
      <main id="main" className="an-page flex-1">
      {/* ===== HERO + pinned notes ===== */}
      <section className="an-hero">
        <div className="an-w">
          <nav className="an-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> › <b>Announcements</b>
          </nav>
          <span className="an-kick">NEWS &amp; NOTICES</span>
          <h1 className="an-h1">
            <span className="an-mk">
              <em>Announcements</em>
            </span>
          </h1>
          <span className="an-am an-sub">ማስታወቂያዎች</span>
          <p className="an-lead an-fi">News and notices from the church community.</p>

          {status === 'ready' && board.length > 0 && (
            <div className="an-board">
              {board.map((a, n) => (
                <button
                  key={a.id}
                  type="button"
                  className="an-note"
                  style={{ '--r': `${ROT[n % 3]}deg`, '--r0': `${ROT0[n % 3]}deg`, '--i': n } as React.CSSProperties}
                  onClick={(e) => openItem(a, e.currentTarget)}
                >
                  <span className="an-dt">{(a.label || a.ts ? dateText(a) : a.category).toUpperCase()}</span>
                  <h3>{a.title}</h3>
                  <u>Read →</u>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== toolbar + feed ===== */}
      <div className="an-w" id="list">
        {isSample && (
          <p className="an-dev">Preview data: your API returned nothing. Shown in development only.</p>
        )}

        <div className="an-bar">
          <div className="an-tabs" role="group" aria-label="Categories">
            <button type="button" className={!cat ? 'sel' : ''} onClick={() => { setCat(''); setLim(FIRST_PAGE); }}>
              All<i>{items.length}</i>
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={cat === c ? 'sel' : ''}
                onClick={() => { setCat(c); setLim(FIRST_PAGE); }}
              >
                {c}
                <i>{items.filter((i) => i.category === c).length}</i>
              </button>
            ))}
          </div>
          <input
            className="an-search"
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setLim(FIRST_PAGE); }}
            placeholder="Search announcements"
            aria-label="Search announcements"
          />
        </div>

        <div aria-live="polite">
          {status === 'loading' && <p className="an-empty">Loading announcements…</p>}

          {status === 'error' && (
            <p className="an-empty">
              We couldn’t load announcements.{' '}
              <button type="button" className="an-clr" onClick={retry}>
                Try again
              </button>
            </p>
          )}

          {status === 'ready' && items.length === 0 && <p className="an-empty">No announcements yet.</p>}

          {status === 'ready' && items.length > 0 && (
            <>
              <div className="an-cnt">
                Showing {Math.min(feed.length, 3 + lim)} of {feed.length} announcements
                {act && (
                  <button type="button" className="an-clr" onClick={clear}>
                    Clear filters
                  </button>
                )}
              </div>

              {feed.length === 0 ? (
                <p className="an-empty">No announcements match your search.</p>
              ) : (
                <>
                  <div className="an-fd">
                    {lead && (
                      <button
                        type="button"
                        className="an-st an-leadst"
                        onClick={(e) => openItem(lead, e.currentTarget)}
                      >
                        <Thumb item={lead} />
                        <Meta item={lead} />
                        <h3>{lead.title}</h3>
                        <p>{lead.summary}</p>
                      </button>
                    )}
                    <div className="an-side">
                      {side.map((a, n) => (
                        <button
                          key={a.id}
                          type="button"
                          className="an-st an-sdst"
                          style={{ '--n': n + 1 } as React.CSSProperties}
                          onClick={(e) => openItem(a, e.currentTarget)}
                        >
                          <Thumb item={a} />
                          <div>
                            <Meta item={a} />
                            <h3>{a.title}</h3>
                            <p>{a.summary}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {rows.length > 0 && (
                    <div className="an-rows">
                      {rows.map((a, n) => (
                        <button
                          key={a.id}
                          type="button"
                          className="an-st an-rw"
                          style={{ '--n': Math.min(n + 3, 8) } as React.CSSProperties}
                          onClick={(e) => openItem(a, e.currentTarget)}
                        >
                          <span className="an-dt">{a.label || a.ts ? dateText(a) : ''}</span>
                          <div>
                            <h3>{a.title}</h3>
                            <span className="an-ct" style={{ margin: 0 }}>{a.category}</span>
                          </div>
                          <u>Read →</u>
                        </button>
                      ))}
                    </div>
                  )}

                  {left > 0 && (
                    <div style={{ textAlign: 'center', marginTop: 30 }}>
                      <button type="button" className="an-btn" onClick={() => setLim((n) => n + FIRST_PAGE)}>
                        Show more announcements · {left} left
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ===== Telegram band ===== */}
      <section className="an-tg">
        <div className="an-w">
          <div>
            <h2>Never miss a notice.</h2>
            <p>Follow our Telegram channel for the latest announcements.</p>
          </div>
          <a className="an-btn" href="https://t.me/abune_media" target="_blank" rel="noopener noreferrer">
            Follow on Telegram →
          </a>
        </div>
      </section>

      {/* ===== reader drawer ===== */}
      <div className={`an-ov ${open ? 'on' : ''}`} onClick={closeReader} />
      <aside
        ref={drawerRef}
        className={`an-dr ${open ? 'on' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="an-dt-title"
        aria-hidden={!open}
      >
        <button ref={closeRef} type="button" className="an-x" aria-label="Close" onClick={closeReader}>
          ✕
        </button>
        {open && (
          <>
            <Meta item={open} />
            <h2 id="an-dt-title">{open.title}</h2>
            <Thumb item={open} />
            {(readerBody || '').split(/\n+/).filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="an-nt">
              Questions? <Link href="/contact">Contact the church administration</Link>.
            </div>
          </>
        )}
      </aside>
      </main>

      <Footer compact={false} />
    </div>
  );
}
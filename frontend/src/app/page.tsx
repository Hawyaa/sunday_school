'use client';

/**
 * app/page.tsx — Home page
 *
 * Built to match the exact design language of the provided HTML preview:
 *   • Navy header with gold accent (existing HeroSection untouched)
 *   • Next‑session floating card (gold top‑border, pill CTA)
 *   • Editorial timeline events (.ev / .er rows with serif day numerals)
 *   • Teachings split (5:6 image with quote overlay + right text column)
 *   • Gallery dual‑marquee on deep navy (row 1 LTR, row 2 RTL)
 *   • Announcements (1.3fr featured + 1fr side stack)
 *   • CTA parchment gradient with Amharic calligraphy
 *   • Full brand footer
 *
 * Uses real images from /public and user‑provided Pinterest URLs.
 * Header, HeroSection, and Footer are NOT modified.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useHomeReveal } from './useHomeReveal';
import { fetchEvents } from '@/services/events';
import { fetchLatestAnnouncements } from '@/services/announcements';
import { fetchGalleryPhotos } from '@/services/gallery';
import { fetchSchedules } from '@/services/schedule';
import type { Announcement } from '@/types/announcement';
import './home.css';

// Layout
import { UrgentBanner } from '@/components/layout/UrgentBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';

/* ═══════════════════════════════════════════════════════════════
   STATIC DATA
   ═══════════════════════════════════════════════════════════════ */

const EVENTS = [
  { day: '10', title: 'Meskel Celebration',      titleAm: 'የመስቀል ደመራ በዓል',           meta: 'Meskerem • 4:00 PM', metaAm: 'መስከረም • 10:00 ሰዓት', color: 'blue', on: true },
  { day: '11', title: 'Youth Fellowship',        titleAm: 'የወጣቶች መንፈሳዊ ሕብረት',        meta: 'Meskerem • 2:00 PM', metaAm: 'መስከረም • 8:00 ሰዓት', color: 'green' },
  { day: '13', title: 'Bible Study & Teaching',   titleAm: 'የመጽሐፍ ቅዱስ ጥናትና ትምህርት', meta: 'Meskerem • 6:00 PM', metaAm: 'መስከረም • 12:00 ሰዓት', color: 'orange' },
  { day: '20', title: 'Spiritual Guidance',       titleAm: 'መንፈሳዊ ምክርና ውይይት',        meta: 'Meskerem • 3:00 PM', metaAm: 'መስከረም • 9:00 ሰዓት', color: 'purple' },
  { day: '27', title: 'Sunday School Session',    titleAm: 'የሰንበት ትምህርት ቤት ጉባኤ',     meta: 'Meskerem • 8:00 AM', metaAm: 'መስከረም • 2:00 ሰዓት', color: 'teal' },
];

interface HomeGalleryItem {
  cls: string;
  img: string;
  fallback?: string;
  kicker: string;
  kickerAm: string;
  title: string;
  titleAm: string;
}

const HOME_GALLERY: HomeGalleryItem[] = [
  {
    cls: 'a',
    img: '/images/gallery-1.jpg',
    fallback: 'https://i.pinimg.com/474x/aa/b6/55/aab655bda9ce179c5c34b95c20816317.jpg',
    kicker: 'Manuscript Art',
    kickerAm: 'የብራና ጥበብ',
    title: 'Sacred Ethiopian Iconography',
    titleAm: 'የኢትዮጵያ ቅዱሳት ሥዕላት',
  },
  {
    cls: 'bb',
    img: '/images/gallery-2.jpg',
    fallback: 'https://i.pinimg.com/474x/56/af/4c/56af4cbb84cef34b0fb50b27bd176691.jpg',
    kicker: 'Clergy & Faithful',
    kickerAm: 'ካህናትና ምእመናን',
    title: 'Feast Day Liturgy',
    titleAm: 'የበዓለ ንግሥ ጉባኤ',
  },
  {
    cls: 'cc',
    img: '/images/gallery-3.jpg',
    fallback: 'https://i.pinimg.com/474x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
    kicker: 'Sacred Art',
    kickerAm: 'ቅዱስ ጥበብ',
    title: 'Icon of the Last Supper',
    titleAm: 'የምስጢረ ቍርባን ሥዕል',
  },
  {
    cls: 'd',
    img: '/images/gallery-4.jpg',
    fallback: 'https://i.pinimg.com/474x/97/ab/5c/97ab5cea194f9cc2f4dc52294f585203.jpg',
    kicker: 'Symbol of Faith',
    kickerAm: 'የእምነት ምልክት',
    title: 'The Ethiopian Cross',
    titleAm: 'ቅዱስ መስቀል',
  },
  {
    cls: 'e',
    img: '/images/gallery-5.jpg',
    fallback: '/images/events/featured.jpg',
    kicker: 'Worship',
    kickerAm: 'አምልኮ',
    title: 'Divine Liturgy',
    titleAm: 'ቅዳሴ',
  },
  {
    cls: 'f',
    img: '/images/gallery-6.jpg',
    fallback: '/images/hero/hero-2.jpg',
    kicker: 'Sacred Space',
    kickerAm: 'ቅዱስ ቦታ',
    title: 'Sanctuary & Prayer',
    titleAm: 'ቤተ መቅደስና ጸሎት',
  },
];

interface GivingAccount {
  id: string;
  bank: string;
  bankAm: string;
  logo: string;
  holder: string;
  holderAm: string;
  branch: string;
  branchAm: string;
  account: string;
}

const GIVING_ACCOUNTS: GivingAccount[] = [
  {
    id: 'berhan',
    bank: 'Berhan Bank',
    bankAm: 'ብርሃን ባንክ',
    logo: '/images/banks/berhan-bank.png',
    holder: 'International Evangelical Church',
    holderAm: 'ዓለም አቀፍ ወንጌላዊት ቤተክርስቲያን',
    branch: 'Sarbet Branch',
    branchAm: 'ሳርቤት ቅርንጫፍ',
    account: '1501160065392',
  },
  {
    id: 'cbe',
    bank: 'Commercial Bank of Ethiopia',
    bankAm: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
    logo: '/images/banks/cbe.png',
    holder: 'International Evangelical Church',
    holderAm: 'ዓለም አቀፍ ወንጌላዊት ቤተክርስቲያን',
    branch: 'Hiwot Amba Branch',
    branchAm: 'ሕይወት አምባ ቅርንጫፍ',
    account: '1000248494828',
  },
  {
    id: 'awash',
    bank: 'Awash Bank',
    bankAm: 'አዋሽ ባንክ',
    logo: '/images/banks/awash-bank.png',
    holder: 'International Evangelical Church',
    holderAm: 'ዓለም አቀፍ ወንጌላዊት ቤተክርስቲያን',
    branch: 'Africa Andinet Branch',
    branchAm: 'አፍሪካ አንድነት ቅርንጫፍ',
    account: '01304027715500',
  },
  {
    id: 'hibret',
    bank: 'Hibret Bank',
    bankAm: 'ሕብረት ባንክ',
    logo: '/images/banks/hibret-bank.png',
    holder: 'International Evangelical Church',
    holderAm: 'ዓለም አቀፍ ወንጌላዊት ቤተክርስቲያን',
    branch: 'Bisrate Gabriel Branch',
    branchAm: 'ብስራተ ገብርኤል ቅርንጫፍ',
    account: '1241116270154019',
  },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';
  const rootRef = useHomeReveal();
  const [copiedAcc, setCopiedAcc] = useState<string | null>(null);

  const [eventsData, setEventsData] = useState(EVENTS);
  const [announcementsData, setAnnouncementsData] = useState<Announcement[]>([]);
  const [galleryData, setGalleryData] = useState(HOME_GALLERY);
  const [nextSessionData, setNextSessionData] = useState<{
    title: string;
    titleAm: string;
    meta: string;
    metaAm: string;
  } | null>(null);

  useEffect(() => {
    // Load real upcoming events from API
    fetchEvents(5, 1)
      .then(({ events }) => {
        if (events && events.length > 0) {
          const colors = ['blue', 'green', 'orange', 'purple', 'teal'];
          const mapped = events.map((e, idx) => {
            const d = new Date(e.startDate);
            const dayStr = isNaN(d.getTime()) ? String(idx + 1) : String(d.getDate()).padStart(2, '0');
            const monthStr = isNaN(d.getTime()) ? 'Event' : d.toLocaleDateString('en-US', { month: 'short' });
            return {
              day: dayStr,
              title: e.title,
              titleAm: e.title,
              meta: `${monthStr} • ${e.location || 'Church'}`,
              metaAm: `${monthStr} • ${e.location || 'ቤተክርስቲያን'}`,
              color: colors[idx % colors.length],
              on: idx === 0,
            };
          });
          setEventsData(mapped);
        }
      })
      .catch(() => {});

    // Load real announcements from API
    fetchLatestAnnouncements(6)
      .then((items) => {
        if (items && items.length > 0) {
          setAnnouncementsData(items);
        }
      })
      .catch(() => {});

    // Load real gallery photos from API
    fetchGalleryPhotos()
      .then((photos) => {
        if (photos && photos.length > 0) {
          const classes = ['a', 'bb', 'cc', 'd', 'e', 'f'];
          const mapped = photos.slice(0, 6).map((p, idx) => ({
            cls: classes[idx % classes.length],
            img: p.imageUrl,
            fallback: '/images/gallery-1.jpg',
            kicker: p.album?.title || 'Sanctuary',
            kickerAm: p.album?.title || 'ማዕከለ ስዕል',
            title: p.title,
            titleAm: p.caption || p.title,
          }));
          setGalleryData(mapped);
        }
      })
      .catch(() => {});

    // Load real schedule for next session
    fetchSchedules()
      .then((schedules) => {
        if (schedules && schedules.length > 0) {
          const first = schedules[0];
          setNextSessionData({
            title: first.title,
            titleAm: first.activity || first.title,
            meta: `${first.dayOfWeek} • ${first.startTime} - ${first.endTime} • ${first.location || 'Main Sanctuary'}`,
            metaAm: `${first.dayOfWeek} • ${first.startTime} - ${first.endTime} • ${first.location || 'ዋናው ቤተ መቅደስ'}`,
          });
        }
      })
      .catch(() => {});
  }, []);

  function copyAccount(acc: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(acc);
      setCopiedAcc(acc);
      setTimeout(() => setCopiedAcc(null), 2500);
    }
  }

  return (
    <div ref={rootRef} className="home-page min-h-screen flex flex-col">
      <UrgentBanner />
      <Header />

      <main className="flex-1">
        {/* ── 1. Hero ── */}
        <HeroSection />

      {/* ── 2. Next Session (overlaps hero) ── */}
      <div className="relative z-20" style={{ marginTop: '-64px' }}>
        <div className="wrap">
          <div className="nbox rv">
            <div>
              <small>{isAm ? 'ቀጣይ መርሐ ግብር' : 'Next session'}</small>
              <h3>
                {nextSessionData
                  ? (isAm ? nextSessionData.titleAm : nextSessionData.title)
                  : (isAm ? 'የሰንበት ት/ቤት ጉባኤ' : 'Sunday School Session')}
              </h3>
              <span style={{ color: 'var(--slate)', fontSize: 14 }}>
                {nextSessionData
                  ? (isAm ? nextSessionData.metaAm : nextSessionData.meta)
                  : (isAm ? 'መስከረም 27 • 2:00 ሰዓት • ዋናው አዳራሽ' : 'Meskerem 27 • 8:00 AM • Main hall')}
              </span>
            </div>
            <Link href="/schedule" className="pill pill-navy">
              {isAm ? 'ዝርዝሩን ይመልከቱ' : 'Learn more'}
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3. Upcoming Events (courses grid) ── */}
      <section className="courses" id="events">
        <div className="wrap">
          <div className="head rv">
            <div>
              <div className="eyebrow">{isAm ? 'የቤተክርስቲያን መርሐ ግብር' : 'Church Calendar'}</div>
              <h2>{isAm ? 'የሚመጡ መርሐ ግብሮች' : 'Upcoming events'}</h2>
            </div>
            <span className="note">{isAm ? 'በአምልኮ፣ በትምህርትና በሕብረት ያሳልፉ።' : 'Join us for worship, learning and fellowship.'}</span>
          </div>

          <div className="grid">
            {eventsData.map((e, i) => (
              <Link
                key={i}
                className={`card ${e.on ? 'on' : ''} rv`}
                style={{ '--d': `${i * 0.08}s` } as React.CSSProperties}
                href="/events"
              >
                <span className={`ic ${e.color}`}>
                  <span className="day">{e.day}</span>
                </span>
                <h3>{isAm ? e.titleAm : e.title}</h3>
                <p>{isAm ? e.metaAm : e.meta}</p>
                <span className="more">
                  {isAm ? 'ዝርዝር' : 'Details'}{' '}
                  <svg className="arrow" viewBox="0 0 24 24">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Teachings (split section) ── */}
      <section className="split-sec" id="teach">
        <div className="wrap split">
          <div className="pic rl">
            <img
              src="/images/teaching.jpg"
              alt={isAm ? 'የሰንበት ት/ቤት ትምህርት' : 'Orthodox church domes at sunset'}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes('featured.jpg')) {
                  target.src = '/images/events/featured.jpg';
                }
              }}
            />
            <div className="cap">{isAm ? 'ሃይማኖትን መማር፣ በሃይማኖት መኖር' : 'Learn the faith, live the faith'}</div>
          </div>
          <div className="txt rr">
            <div className="eyebrow">{isAm ? 'ትምህርተ ሃይማኖት' : 'Teachings'}</div>
            <h2>
              {isAm ? (
                <>እምነት<br />በተግባር</>
              ) : (
                <>Faith made<br />practical</>
              )}
            </h2>
            <p>
              {isAm
                ? 'የሰንበት ትምህርት ቤት ትምህርቶችና መንፈሳዊ ጉባኤያት፣ እያንዳንዱ ምእመን በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነቱ እንዲያድግ የተዘጋጀ።'
                : 'Sunday school lessons and spiritual teachings, designed to help each person grow in the Ethiopian Orthodox faith.'}
            </p>
            <p>
              {isAm
                ? 'ከሕፃናት ትምህርተ ሃይማኖት እስከ አዋቂዎች የመጽሐፍ ቅዱስ ጥናት፣ እያንዳንዱ ትምህርት በቅዱሳት መጻሕፍት፣ በቅዱሳን አባቶች ትምህርትና በተዋሕዶ ቤተክርስቲያን ሕያው ትውፊት ላይ የተመሠረተ ነው። መምህራኖቻችን እያንዳንዱን ተማሪ በትዕግሥት ይመራሉ፣ በዚህም እምነት በቤት፣ በቤተክርስቲያንና በማኅበረሰብ ውስጥ የዕለት ተዕለት ሕይወት አካል ይሆናል።'
                : "From children's catechism to adult Bible study, every lesson is rooted in Scripture, the teachings of the Church Fathers, and the living tradition of the Tewahedo Church. Our teachers guide each learner patiently, so faith becomes part of everyday life at home, at church and in the community."}
            </p>
            <ul className="checks">
              <li>{isAm ? 'ለሕፃናት፣ ለወጣቶችና ለአዋቂዎች የተዘጋጁ ትምህርቶች' : 'Lessons for children, youth and adults'}</li>
              <li>{isAm ? 'በቅዱሳት መጻሕፍትና በአበው ትምህርት ላይ የተመሠረተ' : 'Rooted in Scripture and the Church Fathers'}</li>
              <li>{isAm ? 'በሰንበት ትምህርት ቤት ልምድ ባላቸው መምህራን የሚመራ' : 'Led by experienced Sunday school teachers'}</li>
              <li>{isAm ? 'በራስዎ ፍጥነት ለመማር ቪዲዮ፣ ኦዲዮ እና የጥናት ማስታወሻዎች' : 'Video, audio and study notes to learn at your own pace'}</li>
            </ul>
            <Link className="btn" href="/teachings">
              {isAm ? 'ትምህርቶችን ያስሱ' : 'Discover teachings'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Gallery (Editorial Mosaic Grid) ── */}
      <section className="gallery" id="gallery">
        <div className="wrap">
          <div className="head rv">
            <div>
              <h2>{isAm ? 'ማዕከለ ስዕል.' : 'Gallery.'}</h2>
              <p>
                {isAm
                  ? 'ከቤተክርስቲያናችን፣ ከሰንበት ትምህርት ቤታችን እና ከማህበረሰባችን የተመረጡ ቅዱሳት ጊዜያት።'
                  : 'Sacred moments from our church, Sunday school and community, selected by our media team.'}
              </p>
            </div>
            <Link className="all" href="/gallery">
              {isAm ? 'ሁሉንም ፎቶዎች ይመልከቱ →' : 'View all photos →'}
            </Link>
          </div>

          <div className="grid">
            {galleryData.map((g, i) => (
              <Link
                key={i}
                className={`c ${g.cls} rv`}
                style={{ '--d': `${i * 0.08}s` } as React.CSSProperties}
                href="/gallery"
              >
                <img
                  src={g.img}
                  alt={isAm ? g.titleAm : g.title}
                  onError={(e) => {
                    if (g.fallback && e.currentTarget.src !== g.fallback) {
                      e.currentTarget.src = g.fallback;
                    } else {
                      e.currentTarget.style.display = 'none';
                    }
                  }}
                />
                <div>
                  <span className="k">{isAm ? g.kickerAm : g.kicker}</span>
                  <h3>{isAm ? g.titleAm : g.title}</h3>
                </div>
                <span className="b">{isAm ? 'ምስሉን ይመልከቱ' : 'View photo'}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Announcements (News & Events layout) ── */}
      <section className="news" id="announcements">
        <div className="wrap">
          <div className="top rv">
            <div className="eyebrow">{isAm ? 'ዜናና መርሐ ግብሮች' : 'News & Events'}</div>
            <h2>{isAm ? 'ወቅታዊ ማስታወቂያዎች' : 'Latest Announcements'}</h2>
            <span className="bar"></span>
          </div>

          <div className="layout">
            {/* Card 1 */}
            <Link className="card c1 rv" href="/announcements">
              <img
                src={announcementsData[0]?.imageUrl || '/images/announcement-1.jpg'}
                alt={announcementsData[0]?.title || (isAm ? 'የመስቀል በዓል ዝግጅት' : 'Feast of the Holy Cross preparation')}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://i.pinimg.com/474x/97/ab/5c/97ab5cea194f9cc2f4dc52294f585203.jpg';
                }}
              />
              <time>
                {announcementsData[0]?.publishedAt
                  ? new Date(announcementsData[0].publishedAt).toLocaleDateString(isAm ? 'am-ET' : 'en-US', { month: 'short', day: 'numeric' })
                  : (isAm ? 'መስከረም 12' : 'Meskerem 12')}
              </time>
              <h3>
                {announcementsData[0]?.title || (isAm ? 'የመስቀል በዓል መንፈሳዊ ዝግጅት' : 'Feast of the Holy Cross preparation')}
              </h3>
              <span className="rm">{isAm ? 'ተጨማሪ ያንብቡ →' : 'Read More →'}</span>
            </Link>

            {/* Card 2 */}
            <Link className="card c2 rv" href="/register" style={{ '--d': '0.1s' } as React.CSSProperties}>
              <img
                src={announcementsData[1]?.imageUrl || '/images/announcement-2.jpg'}
                alt={announcementsData[1]?.title || (isAm ? 'የአዲሱ ዓመት ሰንበት ት/ቤት ምዝገባ' : 'New Sunday school registration')}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://i.pinimg.com/474x/56/af/4c/56af4cbb84cef34b0fb50b27bd176691.jpg';
                }}
              />
              <time>
                {announcementsData[1]?.publishedAt
                  ? new Date(announcementsData[1].publishedAt).toLocaleDateString(isAm ? 'am-ET' : 'en-US', { month: 'short', day: 'numeric' })
                  : (isAm ? 'መስከረም 15' : 'Meskerem 15')}
              </time>
              <h3>
                {announcementsData[1]?.title || (isAm ? 'የአዲሱ ዓመት ሰንበት ት/ቤት ምዝገባ' : 'New Sunday school registration')}
              </h3>
              <span className="rm">{isAm ? 'ተጨማሪ ያንብቡ →' : 'Read More →'}</span>
            </Link>

            {/* Side list */}
            <div className="list rv" style={{ '--d': '0.2s' } as React.CSSProperties}>
              {(announcementsData.length > 2 ? announcementsData.slice(2, 6) : [
                { id: '1', title: isAm ? 'የማኅበረሰብ በጎ አድራጎትና ድጋፍ' : 'Community charity and outreach', dateStr: isAm ? 'መስከረም 22' : 'Meskerem 22' },
                { id: '2', title: isAm ? 'የወጣቶች ሳምንታዊ ጉባኤ፡ አዲስ ሰዓትና ቦታ' : 'Youth fellowship weekly gathering: new meeting time and location', dateStr: isAm ? 'መስከረም 18' : 'Meskerem 18' },
                { id: '3', title: isAm ? 'የመስቀል በዓል የመዘምራን ልምምድ ክፍት ሆነ' : 'Choir rehearsals open for the Meskel celebration hymns', dateStr: isAm ? 'መስከረም 10' : 'Meskerem 10' },
                { id: '4', title: isAm ? 'የሰንበት ት/ቤት መምህራን ስብሰባ፡ የአዲሱ መንፈቅ ዕቅድ' : "Sunday school teachers' meeting: lesson plans for the new term", dateStr: isAm ? 'መስከረም 8' : 'Meskerem 8' },
              ]).map((item: any, idx: number) => (
                <Link key={item.id || idx} className="item" href="/announcements">
                  <span className="t">{item.title}</span>
                  <time>
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString(isAm ? 'am-ET' : 'en-US', { month: 'short', day: 'numeric' })
                      : item.dateStr || ''}
                  </time>
                </Link>
              ))}
              <Link className="all" href="/announcements">
                {isAm ? 'ሁሉንም ማስታወቂያዎች ይመልከቱ' : 'See all announcements'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Tithes, Gifts & Offerings (Local Giving Marquee) ── */}
      <section className="giving-sec" id="giving">
        <div className="wrap">
          <div className="head rv">
            <span className="eyebrow">{isAm ? 'የአገር ውስጥ ስጦታዎችና ምጽዋት' : 'Local Giving & Donations'}</span>
            <h2>{isAm ? 'ለአሥራት፣ ለስጦታና ለምጽዋት...' : 'For your tithes, gifts and offerings...'}</h2>
            <p className="sub">
              {isAm
                ? 'አሥራት፣ ስጦታና ምጽዋትዎን ከዚህ በታች በተዘረዘሩት የታመኑ የኢትዮጵያ ባንኮች የሒሳብ ቁጥሮች በኩል በቀጥታ ማስተላለፍ ይችላሉ።'
                : 'Transfer your tithes, offerings, and donations directly through any of our verified Ethiopian bank accounts below.'}
            </p>
          </div>
        </div>

        {/* Continuous auto-scrolling track (moves right to left) */}
        <div className="giving-marquee-wrap" aria-label={isAm ? 'የባንክ ሒሳብ አማራጮች' : 'Bank transfer options'}>
          <div className="giving-marquee-track">
            {[...GIVING_ACCOUNTS, ...GIVING_ACCOUNTS, ...GIVING_ACCOUNTS, ...GIVING_ACCOUNTS].map((acc, idx) => (
              <div key={`${acc.id}-${idx}`} className="giving-card">
                <div className="giving-logo-box">
                  <img src={acc.logo} alt={isAm ? acc.bankAm : acc.bank} />
                </div>
                <div className="giving-holder">{isAm ? acc.holderAm : acc.holder}</div>
                <div className="giving-branch">{isAm ? acc.branchAm : acc.branch}</div>
                <div className="giving-acc">{acc.account}</div>
                <button
                  type="button"
                  className="giving-copy-btn"
                  onClick={() => copyAccount(acc.account)}
                  title={isAm ? 'የሒሳብ ቁጥር ቅዳ' : 'Copy account number'}
                >
                  {copiedAcc === acc.account ? (
                    isAm ? '✓ ተቀድቷል' : '✓ Copied'
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {isAm ? 'ቁጥሩን ቅዳ' : 'Copy account'}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Centered bottom link styled like the reference design */}
        <div className="giving-foot-link rv">
          <Link href="/contact">
            {isAm ? 'ስለ ስጦታዎ ወይም የባንክ ዝውውር ጥያቄ አለዎት? ያነጋግሩን ›' : 'Explore all giving, donation & transfer options ›'}
          </Link>
        </div>
      </section>

      {/* ── 8. CTA (parchment gradient) ── */}
      <section className="cta-sec" id="contact">
        <div className="wrap rv">
          <span className="am-head">ጥበብ ለጉዞዎ</span>
          <h2>Faith &bull; Culture &bull; Community</h2>
          <p>
            {isAm
              ? 'የቤተክርስቲያኗን ትምህርት፣ ሥርዓትና ቅርስ ለቀጣዩ ትውልድ ማስተላለፍ የሁላችንም ተልእኮ ነው።'
              : 'Our mission is to share the teachings and heritage of the Church with every generation.'}
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link href="/teachings" className="pill pill-navy">
              {isAm ? 'ትምህርት ጀምር' : 'Start learning'}
            </Link>
            <Link href="/contact" className="pill pill-outline">
              {isAm ? 'ያግኙን' : 'Contact us'}
            </Link>
          </div>
        </div>
      </section>
      </main>

      {/* ── 8. Footer (existing, full variant) ── */}
      <Footer compact={false} />
    </div>
  );
}

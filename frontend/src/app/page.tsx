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

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useHomeReveal } from './useHomeReveal';
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
  { day: '10', title: 'Meskel Celebration',      titleAm: 'የመስቀል ደመራ በዓል',           meta: 'Meskerem • 4:00 PM', metaAm: 'መስከረም • 10:00 ሰዓት' },
  { day: '11', title: 'Youth Fellowship',        titleAm: 'የወጣቶች መንፈሳዊ ሕብረት',        meta: 'Meskerem • 2:00 PM', metaAm: 'መስከረም • 8:00 ሰዓት' },
  { day: '13', title: 'Bible Study & Teaching',   titleAm: 'የመጽሐፍ ቅዱስ ጥናትና ትምህርት', meta: 'Meskerem • 6:00 PM', metaAm: 'መስከረም • 12:00 ሰዓት' },
  { day: '20', title: 'Spiritual Guidance',       titleAm: 'መንፈሳዊ ምክርና ውይይት',        meta: 'Meskerem • 3:00 PM', metaAm: 'መስከረም • 9:00 ሰዓት' },
  { day: '27', title: 'Sunday School Session',    titleAm: 'የሰንበት ትምህርት ቤት ጉባኤ',     meta: 'Meskerem • 8:00 AM', metaAm: 'መስከረም • 2:00 ሰዓት' },
];

interface GalImg {
  src: string;
  label: string;
  labelAm: string;
  cat: string;
  catAm: string;
}

const ROW_1: GalImg[] = [
  { src: 'https://i.pinimg.com/474x/aa/b6/55/aab655bda9ce179c5c34b95c20816317.jpg', label: 'Sacred Ethiopian Iconography', labelAm: 'የኢትዮጵያ ቅዱሳት ሥዕላት', cat: 'Manuscript Art', catAm: 'የብራና ጥበብ' },
  { src: 'https://i.pinimg.com/474x/56/af/4c/56af4cbb84cef34b0fb50b27bd176691.jpg', label: 'Feast Day Liturgy', labelAm: 'የበዓለ ንግሥ ጉባኤ', cat: 'Clergy & Faithful', catAm: 'ካህናትና ምእመናን' },
  { src: 'https://i.pinimg.com/474x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg', label: 'Icon of the Last Supper', labelAm: 'የምስጢረ ቍርባን ሥዕል', cat: 'Sacred Art', catAm: 'ቅዱስ ጥበብ' },
  { src: 'https://i.pinimg.com/474x/97/ab/5c/97ab5cea194f9cc2f4dc52294f585203.jpg', label: 'The Ethiopian Cross', labelAm: 'ቅዱስ መስቀል', cat: 'Symbol of Faith', catAm: 'የእምነት ምልክት' },
  { src: '/images/events/featured.jpg',  label: 'Divine Liturgy', labelAm: 'ቅዳሴ', cat: 'Worship', catAm: 'አምልኮ' },
  { src: '/images/hero/hero-1.jpg',      label: 'Parish Heritage', labelAm: 'ቤተክርስቲያን ቅርስ', cat: 'Heritage', catAm: 'ቅርስ' },
];

const ROW_2: GalImg[] = [
  { src: '/images/hero/hero-2.jpg',      label: 'Sanctuary & Prayer', labelAm: 'ቤተ መቅደስና ጸሎት', cat: 'Sacred Space', catAm: 'ቅዱስ ቦታ' },
  { src: '/images/abune-diskoros-portrait.png', label: 'Apostolic Blessing', labelAm: 'ሐዋርያዊ ቡራኬ', cat: 'Leadership', catAm: 'ትምህርት' },
  { src: 'https://i.pinimg.com/474x/dd/8a/ac/dd8aacb498e705f0a0f5ed84adec2714.jpg', label: 'Community Fellowship', labelAm: 'ሕብረት', cat: 'Fellowship', catAm: 'ማኅበር' },
  { src: 'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg', label: 'Holy Saturday', labelAm: 'ቀዳም ስዑር', cat: 'Devotion', catAm: 'ተመስጦ' },
  { src: 'https://i.pinimg.com/736x/d5/e8/67/d5e86784cc782e8616d91447b16109fb.jpg', label: 'The Life of Saint Mary', labelAm: 'የእመቤታችን ሕይወት', cat: 'Grace', catAm: 'ጸጋ' },
  { src: '/images/hero/hero-3.jpg',      label: 'Celebration & Joy', labelAm: 'ደስታና በረከት', cat: 'Feast Days', catAm: 'በዓላት' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';
  const rootRef = useHomeReveal();

  // Duplicate gallery rows for seamless loop
  const r1 = [...ROW_1, ...ROW_1];
  const r2 = [...ROW_2, ...ROW_2];

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
              <h3>{isAm ? 'የሰንበት ት/ቤት ጉባኤ' : 'Sunday School Session'}</h3>
              <span style={{ color: 'var(--slate)', fontSize: 14 }}>
                {isAm ? 'መስከረም 27 • 2:00 ሰዓት • ዋናው አዳራሽ' : 'Meskerem 27 • 8:00 AM • Main hall'}
              </span>
            </div>
            <Link href="/schedule" className="pill pill-navy">
              {isAm ? 'ዝርዝሩን ይመልከቱ' : 'Learn more'}
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3. Upcoming Events (editorial timeline) ── */}
      <section id="events">
        <div className="wrap">
          <div className="head rv">
            <h2>{isAm ? 'የሚመጡ መርሐ ግብሮች' : 'Upcoming events'}</h2>
            <p>{isAm ? 'በአምልኮ፣ በትምህርትና በሕብረት ያሳልፉ።' : 'Join us for worship, learning and fellowship.'}</p>
          </div>

          <div className="ev">
            {EVENTS.map((e, i) => (
              <Link
                key={i}
                href="/events"
                className="er rv"
                style={{ '--d': `${i * 0.08}s` } as React.CSSProperties}
              >
                <b>{e.day}</b>
                <div>
                  <h3>{isAm ? e.titleAm : e.title}</h3>
                  <small>{isAm ? e.metaAm : e.meta}</small>
                </div>
                <span className="arrow">{isAm ? 'ዝርዝር →' : 'Details →'}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Teachings (split layout with image + quote) ── */}
      <section className="teach" id="teach">
        <div className="wrap split">
          {/* Left: image with quote overlay */}
          <div className="timg rl">
            <img
              src="https://i.pinimg.com/474x/56/af/4c/56af4cbb84cef34b0fb50b27bd176691.jpg"
              alt={isAm ? 'የሰንበት ት/ቤት ትምህርት' : 'Ethiopian Orthodox Sunday School'}
              loading="lazy"
            />
            <div className="quote">
              {isAm ? 'ሃይማኖትን መማር፣\nበሃይማኖት መኖር' : 'Learn the faith,\nlive the faith'}
            </div>
            {/* Dark gradient overlay for text clarity */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to bottom, rgba(15,35,82,0.45), rgba(15,35,82,0.15) 50%, rgba(15,35,82,0.65))',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Right: text */}
          <div className="rr">
            <h2>{isAm ? 'እምነት በተግባር' : 'Faith made practical'}</h2>
            <p>
              {isAm
                ? 'የሰንበት ትምህርት ቤት ትምህርቶች፣ ለእያንዳንዱ ዕድሜ የሚመጥን መንፈሳዊ ዕድገትና የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት ጥልቅ ግንዛቤ።'
                : 'Sunday school lessons and spiritual teachings, designed to help every age grow in the Ethiopian Orthodox faith.'}
            </p>
            <Link href="/teachings" className="pill pill-navy">
              {isAm ? 'ትምህርቶችን ያስሱ' : 'Discover teachings'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Gallery (dual marquee on navy) ── */}
      <section className="gal" id="gallery">
        <div className="wrap rv">
          <h2>{isAm ? 'የሥዕላት ማኅደር' : 'Gallery'}</h2>
        </div>

        {/* Row 1 → moves left (forward) */}
        <div className="mq">
          {r1.map((g, i) => (
            <div className="gimg" key={`r1-${i}`}>
              <img src={g.src} alt={isAm ? g.labelAm : g.label} loading="lazy" />
              <div className="gc">
                <small>{isAm ? g.catAm : g.cat}</small>
                <span>{isAm ? g.labelAm : g.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 → moves right (reverse) */}
        <div className="mq rev">
          {r2.map((g, i) => (
            <div className="gimg" key={`r2-${i}`}>
              <img src={g.src} alt={isAm ? g.labelAm : g.label} loading="lazy" />
              <div className="gc">
                <small>{isAm ? g.catAm : g.cat}</small>
                <span>{isAm ? g.labelAm : g.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Announcements (featured + side stack) ── */}
      <section>
        <div className="wrap">
          <div className="head rv">
            <h2>{isAm ? 'ወቅታዊ ማስታወቂያዎች' : 'Latest announcements'}</h2>
            <Link href="/announcements" className="hlink">
              {isAm ? 'ሁሉንም ይመልከቱ' : 'See all announcements'}
            </Link>
          </div>

          <div className="ann">
            {/* Featured article */}
            <article className="feat rv">
              <div className="feat-img">
                <img
                  src="https://i.pinimg.com/474x/97/ab/5c/97ab5cea194f9cc2f4dc52294f585203.jpg"
                  alt={isAm ? 'የመስቀል በዓል ዝግጅት' : 'Feast of the Holy Cross preparation'}
                  loading="lazy"
                />
              </div>
              <span className="date">{isAm ? 'መስከረም 12' : 'Meskerem 12'}</span>
              <h3>{isAm ? 'የመስቀል በዓል መንፈሳዊ ዝግጅት' : 'Feast of the Holy Cross preparation'}</h3>
              <p>{isAm ? 'ከቤተክርስቲያን ማኅበረሰብ የቅርብ ጊዜ ዜናዎችና ማስታወቂያዎች።' : 'News and notices from the church community.'}</p>
            </article>

            {/* Side stack */}
            <div className="side rv" style={{ '--d': '0.15s' } as React.CSSProperties}>
              <Link href="/register">
                <span className="date">{isAm ? 'መስከረም 15' : 'Meskerem 15'}</span>
                <h3>{isAm ? 'የአዲሱ ዓመት ሰንበት ት/ቤት ምዝገባ' : 'New Sunday school registration'}</h3>
              </Link>
              <Link href="/announcements">
                <span className="date">{isAm ? 'መስከረም 22' : 'Meskerem 22'}</span>
                <h3>{isAm ? 'የበጎ አድራጎትና የማኅበራዊ ድጋፍ' : 'Community charity and outreach'}</h3>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CTA (parchment gradient) ── */}
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

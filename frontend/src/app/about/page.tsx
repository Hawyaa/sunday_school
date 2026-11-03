'use client';

/**
 * app/about/page.tsx — About Page
 *
 * Implements the exact editorial layout from the provided HTML:
 *   1. Sticky Header
 *   2. Hero with Breadcrumb, Animated Word-Rise H1, Red Accent Tag, and Stats
 *   3. The Legacy of Abune Diskoros (with authentic portrait image & 3 pillars)
 *   4. A Path of Faith and Service (horizontal timeline nodes with red numerals)
 *   5. Guided by Faith, Driven by Service (3 cards + James 2:17 quote strip)
 *   6. Sunday School Journey (navy section, 3 metrics & Mark 10:14 quote card)
 *   7. More Ways to Serve (4 ministry cards with interactive diamond bullets)
 *   8. Call to Action Banner (navy with geometric diamond grid & Amharic calligraphy)
 *   9. Full Brand Footer
 */

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useHomeReveal } from '@/app/useHomeReveal';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './about.css';

export default function AboutPage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';
  const rootRef = useHomeReveal();

  return (
    <div ref={rootRef} className="about-page min-h-screen flex flex-col">
      {/* ── 1. Header ── */}
      <Header />

      <main className="flex-1">
        {/* ── 2. Hero Section ── */}
        <div className="hero">
          <div className="w">
            <nav className="crumb" aria-label="Breadcrumb">
              <Link href="/">{isAm ? 'መነሻ' : 'Home'}</Link> › <b>{isAm ? 'ስለ እኛ' : 'About'}</b>
            </nav>

            <div className="hg">
              <div>
                <h1>
                  <em>{isAm ? 'ስለ ' : 'About '}</em>
                  <em className="us">{isAm ? 'እኛ' : 'Us'}</em>
                </h1>
                <p className="tag">
                  {isAm ? 'እምነታችን። ተልእኳችን። ማኅበረሰባችን።' : 'Our Faith. Our Mission. Our Community.'}
                </p>
              </div>

              <dl className="stats">
                <div>
                  <dt>{isAm ? 'ያገለገለበት ዘመን' : 'Serving since'}</dt>
                  <dd>1998</dd>
                </div>
                <div>
                  <dt>{isAm ? 'የሰንበት ት/ቤት ተማሪዎች' : 'Sunday school students'}</dt>
                  <dd>200+</dd>
                </div>
                <div>
                  <dt>{isAm ? 'ተግባራዊ አገልግሎቶች' : 'Active ministries'}</dt>
                  <dd>4</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* ── 3. Legacy Section (Abune Diskoros with authentic portrait) ── */}
        <section className="legacy">
          <div className="w lgrid">
            <div className="pw rv">
              <div className="pt">
                <img
                  src="/images/abune-diskoros-portrait.png"
                  alt={isAm ? 'ብፁዕ አቡነ ዲዮስቆሮስ' : 'His Grace Abune Diskoros'}
                  loading="lazy"
                />
              </div>
              <div className="badge">
                <b>1930 – 2008</b>
                <small>{isAm ? 'እረኛና መምህር' : 'Shepherd & Teacher'}</small>
              </div>
            </div>

            <div className="rv" style={{ '--d': '.12s' } as React.CSSProperties}>
              <p className="eb">{isAm ? 'ታሪካችንና ቅርሳችን' : 'Our Legacy'}</p>
              <h2>
                {isAm ? 'የብፁዕ አቡነ ዲዮስቆሮስ ' : 'The Legacy of '}
                <em>{isAm ? 'መንፈሳዊ ቅርስ' : 'Abune Diskoros'}</em>
              </h2>
              <p className="bd">
                {isAm
                  ? 'ብፁዕ አቡነ ዲዮስቆሮስ ጥልቅ እምነት ያላቸው፣ ራእይ የነበራቸውና የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን ያለመታከት ያገለገሉ አባት ነበሩ። ሕይወታቸውን ወንጌልን ለማዳረስ፣ ቤተክርስቲያንን ለማጽናት እና የምእመናንን መንፈሳዊና ማኅበራዊ ሕይወት ከፍ ለማድረግ ሰጥተዋል።'
                  : 'Abune Diskoros was a visionary bishop, a man of deep faith, and a tireless servant of the Ethiopian Orthodox Tewahedo Church. He dedicated his life to spreading the Gospel, strengthening the Church, and uplifting the spiritual and societal life of the faithful.'}
              </p>

              <ul className="pil">
                <li>
                  <b>{isAm ? 'ወንጌል' : 'Gospel'}</b>
                  <span>{isAm ? 'እምነትን አዳረሱ' : 'Spread the faith'}</span>
                </li>
                <li>
                  <b>{isAm ? 'ቤተክርስቲያን' : 'Church'}</b>
                  <span>{isAm ? 'አካሏን አጸኑ' : 'Strengthened the body'}</span>
                </li>
                <li>
                  <b>{isAm ? 'ምእመናን' : 'Faithful'}</b>
                  <span>{isAm ? 'ሕይወትን አነጹ' : 'Uplifted the lives'}</span>
                </li>
              </ul>

              <a className="btn bn" href="#journey">
                {isAm ? 'የጉዟችን ታሪክ' : 'Our journey'}
              </a>
            </div>
          </div>
        </section>

        {/* ── 4. Journey Timeline ── */}
        <section id="journey">
          <div className="w">
            <div className="rv">
              <p className="eb">{isAm ? 'የጉዞ ማኅደር' : 'Our Journey'}</p>
              <h2>{isAm ? 'የእምነትና የአገልግሎት ጎዳና' : 'A Path of Faith and Service'}</h2>
              <p className="bd">
                {isAm
                  ? 'እያንዳንዱ ወሳኝ ምዕራፍ የተጀመረው ከአንድ ዓላማ ነው፦ እምነት ሕያው ሆኖ ለእያንዳንዱ የማኅበረሰብ አባል ተደራሽ እንዲሆን ማድረግ።'
                  : 'Every milestone grew from one aim: keeping the faith alive and within reach of every member of the community.'}
              </p>
            </div>

            <ol className="tl">
              <li className="node rv">
                <span className="dot"></span>
                <b className="yr">1998</b>
                <h3>{isAm ? 'ጅማሮው' : 'The Beginning'}</h3>
                <p>
                  {isAm
                    ? 'አገልግሎታችን ተጀመረ፤ ምእመናን በጸሎትና በትምህርት ተሰባሰቡ።'
                    : 'Our ministry began, gathering the faithful in prayer and study.'}
                </p>
              </li>
              <li className="node rv" style={{ '--d': '.12s' } as React.CSSProperties}>
                <span className="dot"></span>
                <b className="yr">2006</b>
                <h3>{isAm ? 'ዲጂታል መድረክ' : 'Digital Platform'}</h3>
                <p>
                  {isAm
                    ? 'ትምህርቶችና የጥናት ጽሑፎች በድረ-ገጽ ወደ ማኅበረሰቡ መድረስ ጀመሩ።'
                    : 'Teachings and study materials began reaching the community online.'}
                </p>
              </li>
              <li className="node rv" style={{ '--d': '.24s' } as React.CSSProperties}>
                <span className="dot"></span>
                <b className="yr">2012</b>
                <h3>{isAm ? 'ቀጣይ ዕድገት' : 'Constant Expansion'}</h3>
                <p>
                  {isAm
                    ? 'ያሬዳዊ ዝማሬዎች፣ የመጽሐፍ ቅዱስ ጥናትና ማኅበራዊ አገልግሎት ተጠናከሩ።'
                    : 'Hymns, scripture study and outreach were added to our work.'}
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── 5. Mission & Vision Section ── */}
        <section className="mvv">
          <div className="w">
            <div className="mh rv">
              <div>
                <p className="eb">{isAm ? 'ተልእኮና ራእይ' : 'Our Mission & Vision'}</p>
                <h2 style={{ margin: 0 }}>
                  {isAm ? 'በእምነት እየተመራን፣\nበአገልግሎት እየተጋን' : 'Guided by Faith,\nDriven by Service'}
                </h2>
              </div>
              <p className="bd">
                {isAm
                  ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን መንፈሳዊ ቅርስ በአምልኮ፣ በትምህርት እና እርስ በርስ በመተሳሰብ ለመጠበቅና ለማካፈል ቆርጠን ተነስተናል።'
                  : 'We are committed to preserving and sharing the spiritual heritage of the Ethiopian Orthodox Tewahedo Church through worship, learning and care for one another.'}
              </p>
            </div>

            <div className="cards">
              <div className="card rv">
                <h3>{isAm ? 'ተልእኳችን' : 'Our Mission'}</h3>
                <p>
                  {isAm
                    ? 'ወንጌልን ማወጅ፣ ምእመናንን በመንፈሳዊ ዕውቀት ማነጽ እና ማኅበረሰቡን በፍቅር ማገልገል።'
                    : 'To proclaim the Gospel, nurture the faithful and serve the community with love.'}
                </p>
              </div>
              <div className="card dark rv" style={{ '--d': '.1s' } as React.CSSProperties}>
                <h3>{isAm ? 'ራእያችን' : 'Our Vision'}</h3>
                <p>
                  {isAm
                    ? 'የአበው እምነት የጸናባት፣ የተማረችና አፍቃሪ የሆነች የተባበረች የቤተክርስቲያን ቤተሰብ።'
                    : 'A united, learned and compassionate church family, rooted in the faith of our fathers.'}
                </p>
              </div>
              <div className="card rv" style={{ '--d': '.2s' } as React.CSSProperties}>
                <h3>{isAm ? 'እሴቶቻችን' : 'Our Values'}</h3>
                <ul className="vals">
                  <li>{isAm ? 'እምነት' : 'Faith'}</li>
                  <li>{isAm ? 'ማኅበረሰብ' : 'Community'}</li>
                  <li>{isAm ? 'ዕውቀት' : 'Knowledge'}</li>
                  <li>{isAm ? 'ምሕረት' : 'Compassion'}</li>
                  <li>{isAm ? 'ታማኝነት' : 'Integrity'}</li>
                </ul>
              </div>
            </div>

            <div className="strip rv">
              <span className="orn" aria-hidden="true">◆</span>
              <p>
                {isAm
                  ? '«እምነት ከሥራ የተለየ ከሆነ በራሱ የሞተ ነው።»'
                  : 'Faith, if it hath not works, is dead, being alone.'}
              </p>
              <small>{isAm ? 'ያዕቆብ 2፥17' : 'JAMES 2:17'}</small>
              <span className="orn" aria-hidden="true">◆</span>
            </div>
          </div>
        </section>

        {/* ── 6. Sunday School Section ── */}
        <section className="ss">
          <div className="w ssg">
            <div className="rv">
              <p className="eb ssEb">{isAm ? 'ሰንበት ትምህርት ቤት' : 'Sunday School'}</p>
              <h2>{isAm ? 'የሰንበት ት/ቤት ጉዞ' : 'Sunday School Journey'}</h2>
              <p className="sub">{isAm ? 'ቀጣዩን ትውልድ ማስተማር' : 'Teaching the next generation'}</p>
              <p className="bd ssLead">
                {isAm
                  ? 'የሰንበት ትምህርት ቤታችን ለሕፃናትና ወጣቶች ቅዱሳት መጻሕፍትን፣ ያሬዳዊ ዜማዎችንና የቤተክርስቲያንን ሥርዓት የሚማሩበት እና በክርስቲያናዊ ሕብረት የሚያድጉበት ቅዱስ ስፍራ ነው።'
                  : 'Our Sunday School gives children and young people a place to learn scripture, the hymns and the traditions of the Church, and to grow in Christian fellowship.'}
              </p>

              <div className="nums">
                <div>
                  <b>200+</b>
                  <small>{isAm ? 'ተማሪዎች' : 'Students'}</small>
                </div>
                <div>
                  <b>20</b>
                  <small>{isAm ? 'መምህራን' : 'Teachers'}</small>
                </div>
                <div>
                  <b>15</b>
                  <small>{isAm ? 'ዓመታት' : 'Years'}</small>
                </div>
              </div>
            </div>

            <figure className="qc rv" style={{ '--d': '.15s' } as React.CSSProperties}>
              <span className="qm" aria-hidden="true">“</span>
              <p>
                {isAm
                  ? '«ሕፃናትን ወደ እኔ ይመጡ ዘንድ ተዉአቸው አትከልክሏቸው፤»'
                  : 'Let the little children come to me, and do not hinder them.'}
              </p>
              <small>{isAm ? 'ማርቆስ 10፥14' : 'MARK 10:14'}</small>
            </figure>
          </div>
        </section>

        {/* ── 7. Our Ministries Section ── */}
        <section className="wy">
          <div className="w">
            <div className="wyHead rv">
              <div>
                <p className="eb">{isAm ? 'አገልግሎቶቻችን' : 'Our Ministries'}</p>
                <h2 style={{ margin: 0 }}>{isAm ? 'የተለያዩ የአገልግሎት ዘርፎች' : 'More Ways to Serve'}</h2>
              </div>
              <p className="bd">
                {isAm
                  ? 'በልዩ ልዩ አገልግሎቶቻችን፣ የትምህርትና የማኅበረሰብ መርሐ ግብሮቻችን እያንዳንዱ አባል የሚያድግበትና የበረከት ተካፋይ የሚሆንበት ዕድል አለ።'
                  : 'Through our ministries, education and community programs, there is a place for every member to grow and to give.'}
              </p>
            </div>

            <div className="ways">
              <Link className="way rv" href="/mezmur">
                <span className="dia"></span>
                <h3>{isAm ? 'አምልኮና መንፈሳዊ ዝማሬ' : 'Worship & Spiritual Music'}</h3>
                <p>
                  {isAm
                    ? 'አገልግሎታችንን የሚመራውን የዝማሬ ማኅበር ይቀላቀሉ።'
                    : 'Join the choir and the ministry that leads our services.'}
                </p>
                <u>{isAm ? 'ተጨማሪ ይመልከቱ →' : 'Learn more →'}</u>
              </Link>

              <Link className="way rv" style={{ '--d': '.08s' } as React.CSSProperties} href="/announcements">
                <span className="dia"></span>
                <h3>{isAm ? 'የማኅበረሰብ አገልግሎት' : 'Community Service'}</h3>
                <p>
                  {isAm
                    ? 'ችግረኛ ቤተሰቦችን በበጎ አድራጎት ሥራ ይደግፉ።'
                    : 'Support families in need through outreach and charity work.'}
                </p>
                <u>{isAm ? 'ተጨማሪ ይመልከቱ →' : 'Learn more →'}</u>
              </Link>

              <Link className="way rv" style={{ '--d': '.16s' } as React.CSSProperties} href="/teachings">
                <span className="dia"></span>
                <h3>{isAm ? 'ባሕላዊና መንፈሳዊ ቅርስ' : 'Cultural Heritage'}</h3>
                <p>
                  {isAm
                    ? 'የቤተክርስቲያኗን ቅርስ፣ ቋንቋና ትውፊት ይጠብቁ።'
                    : 'Preserve the heritage, language and traditions of the Church.'}
                </p>
                <u>{isAm ? 'ተጨማሪ ይመልከቱ →' : 'Learn more →'}</u>
              </Link>

              <Link className="way rv" style={{ '--d': '.24s' } as React.CSSProperties} href="/events">
                <span className="dia"></span>
                <h3>{isAm ? 'በዓላትና ጉባኤያት' : 'Events & Gatherings'}</h3>
                <p>
                  {isAm
                    ? 'በዓመቱ ውስጥ በዓላትንና የማኅበር ጊዜያትን ያክብሩ።'
                    : 'Celebrate feasts, festivals and fellowship through the year.'}
                </p>
                <u>{isAm ? 'ተጨማሪ ይመልከቱ →' : 'Learn more →'}</u>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 8. Call to Action Banner ── */}
        <section className="cbs">
          <div className="w">
            <div className="cb rv">
              <span className="am">{isAm ? 'ጥበብ ለጉዞዎ' : 'ጥበብ ለጉዞዎ'}</span>
              <h2>Faith &bull; Culture &bull; Community</h2>
              <p>
                {isAm
                  ? 'የቤተክርስቲያኗን ትምህርት፣ ሥርዓትና ቅርስ ለቀጣዩ ትውልድ ማስተላለፍ የሁላችንም ተልእኮ ነው።'
                  : 'Our mission is to share the teachings and heritage of the Church with every generation.'}
              </p>
              <div className="row">
                <Link className="btn bg" href="/teachings">
                  {isAm ? 'ትምህርት ጀምር' : 'Start learning'}
                </Link>
                <Link className="btn bo" href="/contact">
                  {isAm ? 'ያግኙን' : 'Contact us'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── 9. Footer ── */}
      <Footer compact={false} />
    </div>
  );
}

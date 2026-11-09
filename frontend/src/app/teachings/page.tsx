'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { getStoredTeachings } from '@/lib/contentStore';
import './teachings.css';

interface TeachingItem {
  id: string;
  title: string;
  titleAm?: string;
  who: string;
  category: string;
  categoryAm?: string;
  description: string;
  descriptionAm?: string;
  videoId?: string;
  duration?: string;
  pdfUrl?: string | null;
  pdfPages?: string;
}

const DEFAULT_TEACHINGS: TeachingItem[] = [
  {
    id: '1',
    title: 'The Mystery of the Holy Trinity & Dogma',
    titleAm: 'ምሥጢረ ሥላሴ እና የኦርቶዶክስ ተዋሕዶ ሃይማኖት',
    who: 'Abba Melke Sedek',
    category: 'Faith',
    categoryAm: 'ሃይማኖት',
    description: 'A deep lecture and complete accompanying study book exploring the mystery of the Holy Trinity and Church Dogma.',
    descriptionAm: 'ስለ ምሥጢረ ሥላሴ አንድነትና ሦስትነት እንዲሁም የኦርቶዶክስ ተዋሕዶ ሃይማኖት ዶግማ የተዘጋጀ ጥልቅ ትምህርት።',
    videoId: 'dQw4w9WgXcQ',
    duration: '24 min',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: '18 pages',
  },
  {
    id: '2',
    title: 'Spiritual Lessons from the Holy Bible',
    titleAm: 'መንፈሳዊ ትምህርቶች ከመጽሐፍ ቅዱስ',
    who: 'Abune Yohannes',
    category: 'Scripture',
    categoryAm: 'መጽሐፍ ቅዱስ',
    description: 'In-depth study of the Holy Scriptures guided by experienced clergy and theological teachers for daily living.',
    descriptionAm: 'ለዕለታዊ መንፈሳዊ ሕይወት የሚረዱ መሠረታዊ የመጽሐፍ ቅዱስ ትምህርቶችና የሕይወት መመሪያዎች።',
    videoId: 'dQw4w9WgXcQ',
    duration: '18 min',
  },
  {
    id: '3',
    title: 'The Spiritual Discipline of Fasting & Prayer',
    titleAm: 'የጾምና የጸሎት መንፈሳዊ ሥርዓት',
    who: 'Teacher Samuel',
    category: 'Fasting',
    categoryAm: 'ጾምና ጸሎት',
    description: 'An authoritative study book outlining the seven canonical fasts of the church and biblical fasting spiritual fruits.',
    descriptionAm: 'ስለ ሰባቱ አጽዋማት መንፈሳዊ ጥቅም፣ ሕግጋትና የጾም መንፈሳዊ በረከቶች የተዘጋጀ አጠቃላይ የጥናት ሰነድ።',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: '8 pages',
  },
  {
    id: '4',
    title: 'The Seven Holy Sacraments of the Church',
    titleAm: 'ሰባቱ ምሥጢራተ ቤተክርስቲያን',
    who: 'Abba Gebriel',
    category: 'Faith',
    categoryAm: 'ሃይማኖት',
    description: 'Comprehensive study of Baptism, Holy Communion, Matrimony, and the divine mysteries of salvation.',
    descriptionAm: 'ከጥምቀት እስከ ክህነት ያሉትን ሰባቱን ምሥጢራተ ቤተክርስቲያን የሚዳስስ የተሟላ የቪዲዮና የጽሑፍ ትምህርት።',
    videoId: 'dQw4w9WgXcQ',
    duration: '31 min',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: '20 pages',
  },
  {
    id: '5',
    title: 'Feasts of Our Lady Mary & Saintly Commemorations',
    titleAm: 'የእመቤታችን ቅድስት ድንግል ማርያም በዓላትና ታሪክ',
    who: 'Deacon Daniel',
    category: 'Feasts',
    categoryAm: 'በዓላት',
    description: 'The biblical, historical, and liturgical significance of annual Marian feasts and patron saint celebrations.',
    descriptionAm: 'የእመቤታችን ዓመታዊ በዓላትና የቅዱሳን መታሰቢያ በዓላት ታሪካዊና መንፈሳዊ ይዘት።',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfPages: '6 pages',
  },
  {
    id: '6',
    title: 'The Wisdom of King Solomon & Patristic Commentary',
    titleAm: 'ጥበበ ሰሎሞን እና የሊቃውንት ትርጓሜ',
    who: 'Teacher Kibreab',
    category: 'Scripture',
    categoryAm: 'መጽሐፍ ቅዱስ',
    description: 'Exploring the Book of Proverbs, Ecclesiastes, and the spiritual wisdom taught by the Holy Fathers.',
    descriptionAm: 'ከመጽሐፈ ምሳሌና መክብብ የተገኙ መንፈሳዊ ጥበቦች እና የቤተክርስቲያን ሊቃውንት የትርጓሜ ትምህርቶች።',
    videoId: 'dQw4w9WgXcQ',
    duration: '27 min',
  },
];

export default function TeachingsPage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const [teachings, setTeachings] = useState<TeachingItem[]>(DEFAULT_TEACHINGS);

  // Sync with stored teachings if available
  useEffect(() => {
    try {
      const stored = getStoredTeachings();
      if (stored && stored.length > 0) {
        const mapped: TeachingItem[] = stored.map((t, idx) => {
          const hasV = Boolean(t.videoUrl && t.videoUrl.trim().length > 0);
          const hasP = Boolean(t.pdfUrl && t.pdfUrl.trim().length > 0);
          // extract youtube ID if valid
          let vId = hasV ? 'dQw4w9WgXcQ' : undefined;
          if (t.videoUrl) {
            const m = t.videoUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?]+)/);
            if (m) vId = m[1];
          }

          return {
            id: t.id || String(idx + 1),
            title: t.title,
            titleAm: t.titleAm,
            who: t.author || 'Abune Media Teacher',
            category: t.category || (t.subject as string) || 'Faith',
            categoryAm: t.category === 'Dogma' ? 'ሃይማኖት' : t.category === 'Holy Bible' ? 'መጽሐፍ ቅዱስ' : 'ሃይማኖት',
            description: t.description || (t.content ? t.content.slice(0, 150) + '...' : ''),
            descriptionAm: t.titleAm ? `${t.titleAm} - የተሟላ መንፈሳዊ ትምህርት።` : '',
            videoId: vId,
            duration: `${t.durationMinutes || 25} min`,
            pdfUrl: hasP ? t.pdfUrl : undefined,
            pdfPages: `${t.pdfPages || 12} pages`,
          };
        });
        if (mapped.length >= DEFAULT_TEACHINGS.length) {
          setTeachings(mapped);
        }
      }
    } catch {
      // Keep defaults
    }
  }, []);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState<string>(''); // "" = all, "v" = video, "p" = pdf
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Open panel state
  const [openLessonIndex, setOpenLessonIndex] = useState<number>(-1);
  const [activeTabType, setActiveTabType] = useState<'v' | 'p'>('v');

  const listRef = useRef<HTMLDivElement | null>(null);

  // Distinct categories with counts
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    teachings.forEach((t) => {
      map.set(t.category, (map.get(t.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([k, count]) => ({ key: k, count }));
  }, [teachings]);

  // Filtered teachings
  const filteredTeachings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return teachings.filter((t) => {
      const matchCat = !selectedCategory || t.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchFormat =
        !formatFilter ||
        (formatFilter === 'v' && Boolean(t.videoId)) ||
        (formatFilter === 'p' && Boolean(t.pdfUrl));
      const text = `${t.title} ${t.titleAm || ''} ${t.who} ${t.category} ${t.description} ${t.descriptionAm || ''}`.toLowerCase();
      const matchSearch = !q || text.includes(q);

      return matchCat && matchFormat && matchSearch;
    });
  }, [teachings, selectedCategory, formatFilter, searchQuery]);

  const hasActiveFilters = Boolean(selectedCategory || formatFilter || searchQuery.trim());

  const clearFilters = () => {
    setSelectedCategory('');
    setFormatFilter('');
    setSearchQuery('');
    setOpenLessonIndex(-1);
  };

  // Find latest featured lesson with video
  const featuredLesson = useMemo(() => {
    return teachings.find((t) => Boolean(t.videoId)) || teachings[0];
  }, [teachings]);

  // Open lesson from featured card or action button
  const handleOpenLesson = (index: number, tab: 'v' | 'p') => {
    if (openLessonIndex === index && activeTabType === tab) {
      setOpenLessonIndex(-1);
    } else {
      setOpenLessonIndex(index);
      setActiveTabType(tab);
    }
  };

  const handleFeaturedClick = () => {
    const fi = teachings.findIndex((t) => t.id === featuredLesson.id);
    if (fi !== -1) {
      clearFilters();
      setOpenLessonIndex(fi);
      setActiveTabType('v');
      setTimeout(() => {
        const el = document.getElementById(`teaching-item-${fi}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <div className="teachings-page">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="w">
            <div className="crumb">
              <Link href="/">{isAm ? 'መነሻ' : 'Home'}</Link> › <b>{isAm ? 'ትምህርት' : 'Teachings'}</b>
            </div>

            <div className="hg">
              <div>
                <span className="kick">
                  {isAm ? 'የሰንበት ት/ቤትና መንፈሳዊ ትምህርት' : 'SUNDAY SCHOOL & SPIRITUAL TEACHING'}
                </span>
                <h1>
                  <em>Teachings</em>
                </h1>
                <span className="am sub">ትምህርት</span>
                <p className="l">
                  {isAm
                    ? 'ትምህርቶችን ይመልከቱ፣ የጥናት መጻሕፍትን ያንብቡ፣ በሁሉም የእድሜ ክልል በኦርቶዶክሳዊ እምነትዎ ያድጉ።'
                    : 'Watch lessons, read study guides, and grow in the Ethiopian Orthodox faith at every age.'}
                </p>
                <a className="btn bn" href="#list">
                  {isAm ? 'ሁሉንም ትምህርቶች ይመልከቱ →' : 'Browse all teachings →'}
                </a>
              </div>

              {/* Featured Video Card */}
              <div
                className="fv"
                id="fv"
                role="button"
                tabIndex={0}
                aria-label="Watch the latest teaching"
                onClick={handleFeaturedClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFeaturedClick();
                  }
                }}
              >
                <span className="pp1" aria-hidden="true">
                  ▶
                </span>
                <div className="cp">
                  <small>{isAm ? 'አዲሱ ትምህርት' : 'LATEST TEACHING'}</small>
                  <h2>
                    {isAm && featuredLesson.titleAm
                      ? featuredLesson.titleAm
                      : featuredLesson.title}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <div className="w" id="list" ref={listRef}>
          <div className="bar">
            {/* Topic Category Tabs */}
            <div className="tabs" id="tabs" role="group" aria-label="Topics">
              <button
                type="button"
                className={selectedCategory === '' ? 'sel' : ''}
                onClick={() => {
                  setSelectedCategory('');
                  setOpenLessonIndex(-1);
                }}
              >
                {isAm ? 'ሁሉም' : 'All'}
                <i>{teachings.length}</i>
              </button>
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={selectedCategory === c.key ? 'sel' : ''}
                  onClick={() => {
                    setSelectedCategory(c.key);
                    setOpenLessonIndex(-1);
                  }}
                >
                  {c.key}
                  <i>{c.count}</i>
                </button>
              ))}
            </div>

            {/* Format selector and search */}
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <select
                className="sr"
                id="ty"
                value={formatFilter}
                onChange={(e) => {
                  setFormatFilter(e.target.value);
                  setOpenLessonIndex(-1);
                }}
                aria-label="Format"
              >
                <option value="">{isAm ? 'ሁሉም ቅርጾች' : 'All formats'}</option>
                <option value="v">{isAm ? 'ቪዲዮ' : 'Video'}</option>
                <option value="p">{isAm ? 'ፒዲኤፍ (PDF)' : 'PDF'}</option>
              </select>

              <input
                className="sr"
                id="q"
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenLessonIndex(-1);
                }}
                placeholder={isAm ? 'ትምህርት ይፈልጉ…' : 'Search teachings'}
                aria-label="Search teachings"
              />
            </div>
          </div>

          {/* Results Counter and Clear */}
          <div className="cnt" id="cnt">
            {isAm
              ? `ከ${teachings.length} ውስጥ ${filteredTeachings.length} እየታዩ ነው`
              : `Showing ${filteredTeachings.length} of ${teachings.length}`}
            {hasActiveFilters && (
              <button className="clr" id="cl" type="button" onClick={clearFilters}>
                {isAm ? 'ማጣሪያዎችን አጽዳ' : 'Clear filters'}
              </button>
            )}
          </div>

          {/* Lessons List */}
          <div className="tl" id="tl" aria-live="polite">
            {filteredTeachings.length > 0 ? (
              filteredTeachings.map((teaching, n) => {
                const isOpen = openLessonIndex === n;
                const both = Boolean(teaching.videoId && teaching.pdfUrl);
                const defaultTab = teaching.videoId ? 'v' : 'p';
                const currentTab = isOpen ? activeTabType : defaultTab;
                const displayNum = String(n + 1).padStart(2, '0');

                return (
                  <article
                    key={teaching.id}
                    id={`teaching-item-${n}`}
                    className={`it ${isOpen ? 'open' : ''}`}
                    data-i={n}
                    data-tab={currentTab}
                  >
                    <div className="tr" style={{ '--i': n } as React.CSSProperties}>
                      {/* Outline Number */}
                      <span className="nm">{displayNum}</span>

                      {/* Thumbnail graphic */}
                      <div
                        className={`th ${teaching.videoId ? 'vd' : 'pd'}${both ? ' pdf-too' : ''}`}
                        onClick={() => handleOpenLesson(n, teaching.videoId ? 'v' : 'p')}
                        role="button"
                        tabIndex={0}
                        style={{ cursor: 'pointer' }}
                        aria-label={`Open ${teaching.title}`}
                      >
                        {teaching.videoId && <span>▶</span>}
                      </div>

                      {/* Info Column */}
                      <div className="inf">
                        <span className="meta">
                          {isAm && teaching.categoryAm ? teaching.categoryAm : teaching.category}
                          {teaching.videoId && <b className="bd">{isAm ? 'ቪዲዮ' : 'Video'}</b>}
                          {teaching.pdfUrl && <b className="bd">PDF</b>}
                        </span>

                        <h3>{isAm && teaching.titleAm ? teaching.titleAm : teaching.title}</h3>
                        <p>{isAm && teaching.descriptionAm ? teaching.descriptionAm : teaching.description}</p>

                        <span className="who">
                          {teaching.who}
                          {teaching.videoId && teaching.duration ? ` · ${teaching.duration}` : ''}
                          {teaching.pdfUrl && teaching.pdfPages ? ` · ${teaching.pdfPages}` : ''}
                        </span>
                      </div>

                      {/* Actions */}
                      <span className="ac">
                        {teaching.videoId && (
                          <button
                            type="button"
                            className="av"
                            onClick={() => handleOpenLesson(n, 'v')}
                            aria-expanded={isOpen && currentTab === 'v'}
                          >
                            ▶ {isAm ? 'እይ' : 'Watch'}
                          </button>
                        )}
                        {teaching.pdfUrl && (
                          <button
                            type="button"
                            className="ap"
                            onClick={() => handleOpenLesson(n, 'p')}
                            aria-expanded={isOpen && currentTab === 'p'}
                          >
                            PDF
                          </button>
                        )}
                      </span>
                    </div>

                    {/* Smooth Collapsible Expansion Panel */}
                    <div className="pn">
                      <div>
                        <div className="pin">
                          {/* Inner Tabs for Lessons with both Video and PDF */}
                          {both && (
                            <div className="pt">
                              <button
                                type="button"
                                className={`t-v ${currentTab === 'v' ? 'sel' : ''}`}
                                onClick={() => setActiveTabType('v')}
                              >
                                {isAm ? 'ቪዲዮ' : 'Video'}
                              </button>
                              <button
                                type="button"
                                className={`t-p ${currentTab === 'p' ? 'sel' : ''}`}
                                onClick={() => setActiveTabType('p')}
                              >
                                PDF
                              </button>
                            </div>
                          )}

                          {/* Video View */}
                          {teaching.videoId && currentTab === 'v' && (
                            <div className="pv">
                              <div className="vf">
                                <iframe
                                  src={`https://www.youtube-nocookie.com/embed/${teaching.videoId}`}
                                  title={teaching.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  loading="lazy"
                                />
                              </div>
                              <a
                                className="vl"
                                href={`https://www.youtube.com/watch?v=${teaching.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {isAm ? 'በዩቲዩብ ይመልከቱ ↗' : 'Watch on YouTube ↗'}
                              </a>
                            </div>
                          )}

                          {/* PDF View */}
                          {teaching.pdfUrl && currentTab === 'p' && (
                            <div className="pp">
                              <div className="sheet" aria-hidden="true">
                                <i style={{ width: '70%' }} />
                                <i />
                                <i />
                                <i style={{ width: '85%' }} />
                                <i />
                                <i style={{ width: '60%' }} />
                              </div>

                              <div>
                                <h3 style={{ fontSize: '28px' }}>
                                  {isAm && teaching.titleAm ? teaching.titleAm : teaching.title}
                                </h3>
                                <span className="who">{teaching.pdfPages || '12 pages'}</span>
                                <div className="r">
                                  <a
                                    className="btn bn"
                                    href={teaching.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {isAm ? 'ፒዲኤፍ ክፈት ↗' : 'Open PDF ↗'}
                                  </a>
                                  <a
                                    className="btn bo"
                                    href={teaching.pdfUrl}
                                    download
                                  >
                                    {isAm ? 'አውርድ (Download)' : 'Download'}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="empty">
                {isAm
                  ? 'ከፍለጋዎ ጋር የሚዛመድ ትምህርት አልተገኘም።'
                  : 'No teachings match your search.'}
              </p>
            )}
          </div>
        </div>

        {/* Sacred Quote Section */}
        <section className="qb">
          <div className="w">
            <blockquote>
              {isAm ? (
                <>
                  እምነትህን እወቅ፤
                  <br />
                  በእምነትህም ኑር።
                </>
              ) : (
                <>
                  Learn the faith,
                  <br />
                  live the faith.
                </>
              )}
            </blockquote>
            <small>✛ {isAm ? 'አቡነ ሚዲያ' : 'ABUNE MEDIA'}</small>
          </div>
        </section>
      </main>

      <Footer compact={false} />
    </div>
  );
}

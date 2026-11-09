'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { getStoredMezmurs } from '@/lib/contentStore';
import './mezmur.css';

interface TrackItem {
  id: string;
  title: string;
  titleEn: string;
  choir: string;
  category: string;
  categoryAm?: string;
  duration: number; // in seconds
  hasAudio: boolean;
  hasLyrics: boolean;
  audioUrl?: string;
  lyrics?: string;
}

const DEFAULT_TRACKS: TrackItem[] = [
  {
    id: '1',
    title: 'አቡነ ዘበሰማያት (Our Father)',
    titleEn: 'Abune Zebesemayat',
    choir: 'Abune Diskoros Choir',
    category: 'Praise',
    categoryAm: 'ምስጋና',
    duration: 252,
    hasAudio: true,
    hasLyrics: true,
    audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
    lyrics: `አቡነ ዘበሰማያት፡ ይትቀደስ ስምከ።
ትምጻእ መንግሥትከ። ወይኩን ፈቃድከ
በሰማይ ከመ በምድር።
ሲሳይነ ዘለለ ዕለትነ ሀበነ ዮም።
ኅድግ ለነ አበሳነ ወጌጋይነ፡
ከመ ንሕነኒ ንኅድግ ለዘአበሰ ለነ።
ኢታብአነ እግዚኦ ውስተ መንሱት፡
አላ አድኅነነ ወባልሐነ እምኩሉ እኩይ።
እስመ ዚአከ ይእቲ መንግሥት ኃይል ወስብሐት ለዓለመ ዓለም አሜን።`,
  },
  {
    id: '2',
    title: 'መስቀል አብርሃ (The Cross Shone)',
    titleEn: 'Meskel Abreha',
    choir: 'St. Stephen Choir',
    category: 'Meskel',
    categoryAm: 'መስቀል',
    duration: 318,
    hasAudio: true,
    hasLyrics: false,
    audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
    lyrics: '',
  },
  {
    id: '3',
    title: 'ሰላም ለኪ ማርያም (Hail Mary)',
    titleEn: 'Selam Leki Mariam',
    choir: 'St. Mary Choir',
    category: 'Mariam',
    categoryAm: 'ማርያም',
    duration: 0,
    hasAudio: false,
    hasLyrics: true,
    audioUrl: '',
    lyrics: `ሰላም ለኪ ማርያም እግዚአብሔር ምስሌኪ።
ቡርክት አንቲ እምአንስት ወቡሩክ ፍሬ ከርሥኪ።
ተፈሥሒ ፍሥሕት ኦ ምልእተ ጸጋ፡
እግዚአብሔር ምስሌኪ።
ጸልዪ ወስእሊ ምሕረተ ወሣህለ፡
ቅድመ መንበረ ጸጋሁ ለአምላክነ።`,
  },
  {
    id: '4',
    title: 'ጾም ወጸሎት (Fasting and Prayer)',
    titleEn: 'Tsom WeTselot',
    choir: 'Zion Youth Choir',
    category: 'Fasting',
    categoryAm: 'ጾምና ጸሎት',
    duration: 276,
    hasAudio: true,
    hasLyrics: true,
    audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
    lyrics: `ጾም ትቀድስ ነፍሰ ወታነጽሕ ሥጋ።
ጾም መሠረተ ጽድቅ ወመድኃኒተ ኲሉ።
በጾም ወበጸሎት ይወጽእ ኃይለ ጸላኢ።
እግዚአብሔር ይቀበል ጾመነ ወጸሎተነ።`,
  },
  {
    id: '5',
    title: 'ቅዱስ እግዚአብሔር (Holy God)',
    titleEn: 'Kedus Egziabher',
    choir: 'St. Yared Choral Ministry',
    category: 'Praise',
    categoryAm: 'ምስጋና',
    duration: 341,
    hasAudio: true,
    hasLyrics: false,
    audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
    lyrics: '',
  },
  {
    id: '6',
    title: 'በመስቀሉ ሰላም አደረገ (Peace Through His Cross)',
    titleEn: 'Bemeskelu Selam Aderege',
    choir: 'Holy Cross Youth Choir',
    category: 'Meskel',
    categoryAm: 'መስቀል',
    duration: 0,
    hasAudio: false,
    hasLyrics: true,
    audioUrl: '',
    lyrics: `በመስቀሉ ሰላም አደረገ በደሙ ዋጀን።
ክርስቶስ ቤዛችን ተሰቀለ ስለ እኛ።
ሞትን በሞቱ ድል ነሥቶ ሕይወትን ሰጠን።
ክብርና ምስጋና ለአምላካችን ይሁን።`,
  },
];

const WAVEFORM_HEIGHTS = [
  30, 52, 38, 70, 46, 88, 60, 40, 76, 54, 92, 44, 66, 34, 80, 50, 72, 42, 58, 36, 84, 48, 64, 40,
];

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function MezmurPage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  // Load custom stored mezmurs from localStorage if available
  const [allTracks, setAllTracks] = useState<TrackItem[]>(DEFAULT_TRACKS);

  useEffect(() => {
    try {
      const stored = getStoredMezmurs();
      if (stored && stored.length > 0) {
        // Map stored mezmurs if they differ
        const mapped: TrackItem[] = stored.map((item, idx) => {
          const hasA = Boolean(item.audioUrl && item.audioUrl.trim().length > 0);
          const hasL = Boolean(item.lyrics && item.lyrics.length > 0);
          return {
            id: item.id || String(idx + 1),
            title: item.title,
            titleEn: item.titleEn || item.title,
            choir: 'Abune Diskoros Choir',
            category: item.category === 'fasting' ? 'Fasting' : item.category === 'choir' ? 'Meskel' : item.category === 'sundayschool' ? 'Mariam' : 'Praise',
            categoryAm: item.category === 'fasting' ? 'ጾምና ጸሎት' : item.category === 'choir' ? 'መስቀል' : item.category === 'sundayschool' ? 'ማርያም' : 'ምስጋና',
            duration: hasA ? 250 + (idx * 30) % 120 : 0,
            hasAudio: hasA,
            hasLyrics: hasL,
            audioUrl: item.audioUrl || '',
            lyrics: Array.isArray(item.lyrics) ? item.lyrics.join('\n') : (item.lyrics || ''),
          };
        });
        setAllTracks(mapped.length >= DEFAULT_TRACKS.length ? mapped : DEFAULT_TRACKS);
      }
    } catch {
      // Use defaults
    }
  }, []);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState<string>(''); // "" = all, "a" = audio, "l" = lyrics
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audio player state
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [openLyricsId, setOpenLyricsId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Derive categories list with live counts
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    allTracks.forEach((t) => {
      map.set(t.category, (map.get(t.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([k, count]) => ({ key: k, count }));
  }, [allTracks]);

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allTracks.filter((t) => {
      const matchCat = !selectedCategory || t.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchFormat =
        !formatFilter ||
        (formatFilter === 'a' && t.hasAudio) ||
        (formatFilter === 'l' && t.hasLyrics);
      const text = `${t.title} ${t.titleEn} ${t.choir} ${t.category} ${t.lyrics || ''}`.toLowerCase();
      const matchSearch = !q || text.includes(q);

      return matchCat && matchFormat && matchSearch;
    });
  }, [allTracks, selectedCategory, formatFilter, searchQuery]);

  const hasActiveFilters = Boolean(selectedCategory || formatFilter || searchQuery.trim());

  const clearFilters = () => {
    setSelectedCategory('');
    setFormatFilter('');
    setSearchQuery('');
  };

  // Featured track (featured or now playing)
  const featuredTrack = useMemo(() => {
    if (currentTrackIndex >= 0 && allTracks[currentTrackIndex]) {
      return allTracks[currentTrackIndex];
    }
    return allTracks.find((t) => t.hasAudio) || allTracks[0];
  }, [currentTrackIndex, allTracks]);

  // Audio controls
  const togglePlayTrack = (trackId: string) => {
    const index = allTracks.findIndex((t) => t.id === trackId);
    if (index === -1) return;

    if (currentTrackIndex !== index) {
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = allTracks[index].audioUrl || 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3';
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      // Toggle play/pause on current track
      if (isPlaying) {
        setIsPlaying(false);
        audioRef.current?.pause();
      } else {
        setIsPlaying(true);
        audioRef.current?.play().catch(() => {});
      }
    }
  };

  const handleNextTrack = () => {
    const audioTrackIndices = allTracks
      .map((t, idx) => (t.hasAudio ? idx : -1))
      .filter((idx) => idx !== -1);

    if (audioTrackIndices.length === 0) return;

    const currentPos = audioTrackIndices.indexOf(currentTrackIndex);
    const nextIdx =
      currentPos === -1 || currentPos === audioTrackIndices.length - 1
        ? audioTrackIndices[0]
        : audioTrackIndices[currentPos + 1];

    togglePlayTrack(allTracks[nextIdx].id);
  };

  const handlePrevTrack = () => {
    const audioTrackIndices = allTracks
      .map((t, idx) => (t.hasAudio ? idx : -1))
      .filter((idx) => idx !== -1);

    if (audioTrackIndices.length === 0) return;

    const currentPos = audioTrackIndices.indexOf(currentTrackIndex);
    const prevIdx =
      currentPos <= 0
        ? audioTrackIndices[audioTrackIndices.length - 1]
        : audioTrackIndices[currentPos - 1];

    togglePlayTrack(allTracks[prevIdx].id);
  };

  // Audio time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      handleNextTrack();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrackIndex, allTracks]);

  // Click to seek in mini player
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || currentTrackIndex === -1) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const currentTrack = allTracks[currentTrackIndex];
    const duration = currentTrack?.duration || 250;
    const seekTime = ratio * duration;

    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const currentPlayingTrack = currentTrackIndex >= 0 ? allTracks[currentTrackIndex] : null;

  return (
    <div className="mezmur-page">
      {/* Hidden audio element for authentic sound playback */}
      <audio ref={audioRef} preload="metadata" />

      <Header />

      <main>
        {/* Hero Section with Musical Staff Lines */}
        <section className="hero">
          <div className="staff" aria-hidden="true">
            <i style={{ top: 0 }} />
            <i style={{ top: '40px', animationDelay: '0.1s' }} />
            <i style={{ top: '80px', animationDelay: '0.2s' }} />
            <i style={{ top: '120px', animationDelay: '0.3s' }} />
            <i style={{ top: '160px', animationDelay: '0.4s' }} />
          </div>

          <div className="w">
            <div className="crumb">
              <Link href="/">{isAm ? 'መነሻ' : 'Home'}</Link> › <b>{isAm ? 'መዝሙር' : 'Mezmur'}</b>
            </div>

            <div className="hg">
              <div>
                <span className="kick">{isAm ? 'ቅዱሳት መዝሙራት' : 'SACRED HYMNS'}</span>
                <h1>
                  <em>Mezmur</em>
                </h1>
                <span className="am sub">መዝሙር</span>
                <p>
                  {isAm
                    ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን መንፈሳዊ መዝሙራትንና ቅዱሳት ዜማዎችን ያድምጡ።'
                    : 'Listen to spiritual hymns and sacred songs from the Ethiopian Orthodox tradition.'}
                </p>
                <a className="btn bn" href="#list">
                  {isAm ? 'ሁሉንም መዝሙራት ይመልከቱ →' : 'Browse all mezmur →'}
                </a>
              </div>

              {/* Featured / Now Playing Panel */}
              <div className={`ft ${isPlaying ? 'playing' : ''}`} id="ft">
                <small>
                  {currentTrackIndex < 0
                    ? isAm
                      ? 'የተመረጠ መዝሙር'
                      : 'FEATURED MEZMUR'
                    : isAm
                    ? 'አሁን የሚደመጥ'
                    : 'NOW PLAYING'}
                </small>
                <h2>{featuredTrack ? (isAm && featuredTrack.title ? featuredTrack.title : featuredTrack.titleEn || featuredTrack.title) : 'Sacred Hymn'}</h2>
                <div className="meta-info">
                  {featuredTrack?.choir} · {isAm && featuredTrack?.categoryAm ? featuredTrack.categoryAm : featuredTrack?.category}
                </div>

                {/* Animated Waveform */}
                <div className="wv">
                  {WAVEFORM_HEIGHTS.map((h, n) => (
                    <i
                      key={n}
                      style={
                        {
                          '--h': `${h}%`,
                          '--n': n,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>

                <div className="fr">
                  <button
                    className="pb"
                    type="button"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    onClick={() => featuredTrack && togglePlayTrack(featuredTrack.id)}
                  >
                    {isPlaying && currentTrackIndex === (allTracks.findIndex((t) => t.id === featuredTrack?.id)) ? '❚❚' : '▶'}
                  </button>
                  <span style={{ fontSize: '14px' }}>
                    {formatTime(featuredTrack?.duration || 252)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <div className="w" id="list">
          <div className="bar">
            {/* Category tabs */}
            <div className="tabs" role="group" aria-label="Categories">
              <button
                type="button"
                className={selectedCategory === '' ? 'sel' : ''}
                onClick={() => setSelectedCategory('')}
              >
                {isAm ? 'ሁሉም' : 'All'}
                <i>{allTracks.length}</i>
              </button>
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={selectedCategory === c.key ? 'sel' : ''}
                  onClick={() => setSelectedCategory(c.key)}
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
                onChange={(e) => setFormatFilter(e.target.value)}
                aria-label="Format"
              >
                <option value="">{isAm ? 'ሁሉም ቅርጾች' : 'All formats'}</option>
                <option value="a">{isAm ? 'ድምፅ ያለው' : 'With audio'}</option>
                <option value="l">{isAm ? 'ግጥም ብቻ' : 'Lyrics only'}</option>
              </select>

              <input
                className="sr"
                id="q"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAm ? 'መዝሙር ይፈልጉ…' : 'Search mezmur'}
                aria-label="Search mezmur"
              />
            </div>
          </div>

          {/* Result Count and Clear Filters */}
          <div className="cnt" id="cnt">
            {isAm
              ? `ከ${allTracks.length} ውስጥ ${filteredTracks.length} እየታዩ ነው`
              : `Showing ${filteredTracks.length} of ${allTracks.length}`}
            {hasActiveFilters && (
              <button className="clr" id="cl" type="button" onClick={clearFilters}>
                {isAm ? 'ማጣሪያዎችን አጽዳ' : 'Clear filters'}
              </button>
            )}
          </div>

          {/* Tracklist */}
          <div className="tl" id="tl" aria-live="polite">
            {filteredTracks.length > 0 ? (
              filteredTracks.map((track, n) => {
                const isCurrent = currentTrackIndex >= 0 && allTracks[currentTrackIndex]?.id === track.id;
                const isLyricsOpen = openLyricsId === track.id;
                const displayNum = String(n + 1).padStart(2, '0');

                return (
                  <article key={track.id} className={`it ${isLyricsOpen ? 'open' : ''}`}>
                    <div
                      className={`tr ${isCurrent ? 'cur' : ''}`}
                      style={{ '--i': n } as React.CSSProperties}
                    >
                      <span className="nm">{displayNum}</span>

                      <div>
                        <span className="meta">
                          {isAm && track.categoryAm ? track.categoryAm : track.category}
                          {track.hasAudio && <b className="bd">{isAm ? 'ድምፅ' : 'Audio'}</b>}
                          {track.hasLyrics && <b className="bd">{isAm ? 'ግጥም' : 'Lyrics'}</b>}
                        </span>
                        <h3>{isAm && track.title ? track.title : track.titleEn || track.title}</h3>
                        <span style={{ fontSize: '14px', color: 'var(--slate)' }}>
                          {track.choir}
                        </span>
                      </div>

                      <span className="du">
                        {track.hasAudio ? formatTime(track.duration) : '—'}
                      </span>

                      <span className="ac">
                        {track.hasLyrics && (
                          <button
                            type="button"
                            className="lb"
                            onClick={() => setOpenLyricsId(isLyricsOpen ? null : track.id)}
                            aria-expanded={isLyricsOpen}
                          >
                            {isAm ? 'ግጥም' : 'Lyrics'} <u>+</u>
                          </button>
                        )}
                        {track.hasAudio && (
                          <button
                            type="button"
                            className="pl"
                            onClick={() => togglePlayTrack(track.id)}
                            aria-label={`${isCurrent && isPlaying ? 'Pause' : 'Play'} ${track.title}`}
                          >
                            {isCurrent && isPlaying ? '❚❚' : '▶'}
                          </button>
                        )}
                      </span>
                    </div>

                    {/* Smooth Accordion for Lyrics */}
                    {track.hasLyrics && (
                      <div className="ly">
                        <div>
                          <div className="lyin">{track.lyrics}</div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <p className="empty">
                {isAm
                  ? 'ከፍለጋዎ ጋር የሚዛመድ መዝሙር አልተገኘም።'
                  : 'No mezmur match your search.'}
              </p>
            )}
          </div>
        </div>

        {/* Sacred Quote Section */}
        <section className="qb">
          <div className="w">
            <blockquote>
              {isAm
                ? '«ለእግዚአብሔር አዲስ ምስጋና አመስግኑ፤ ድንቅ ሥራን ሠርቷልና።»'
                : 'Sing to the Lord a new song, for He has done marvelous things.'}
            </blockquote>
            <small>✛ {isAm ? 'አቡነ ሚዲያ' : 'ABUNE MEDIA'}</small>
          </div>
        </section>
      </main>

      <Footer compact={false} />

      {/* Floating Bottom Mini Player */}
      <div className={`mp ${currentTrackIndex >= 0 ? 'on' : ''}`} id="mp">
        <div className="w">
          <div>
            <small id="mc">
              {currentPlayingTrack
                ? `${currentPlayingTrack.choir.toUpperCase()} · ${currentPlayingTrack.category.toUpperCase()}`
                : ''}
            </small>
            <h3 id="mt">
              {currentPlayingTrack
                ? isAm && currentPlayingTrack.title
                  ? currentPlayingTrack.title
                  : currentPlayingTrack.titleEn || currentPlayingTrack.title
                : ''}
            </h3>
          </div>

          <div className="ct">
            <button
              id="pv"
              type="button"
              aria-label="Previous"
              onClick={handlePrevTrack}
            >
              ⏮
            </button>
            <button
              className="pb"
              id="mb"
              type="button"
              aria-label="Play or pause"
              onClick={() => currentPlayingTrack && togglePlayTrack(currentPlayingTrack.id)}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button
              id="nx"
              type="button"
              aria-label="Next"
              onClick={handleNextTrack}
            >
              ⏭
            </button>
          </div>

          <div className="pr">
            <span id="a1">{formatTime(currentTime)}</span>
            <div
              className="bar-container"
              ref={progressRef}
              onClick={handleSeek}
              role="slider"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={currentPlayingTrack?.duration || 250}
              tabIndex={0}
            >
              <i
                id="bf"
                style={{
                  width: `${Math.min(
                    100,
                    (currentTime / (currentPlayingTrack?.duration || 250)) * 100
                  )}%`,
                }}
              />
            </div>
            <span id="a2">
              {formatTime(currentPlayingTrack?.duration || 250)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

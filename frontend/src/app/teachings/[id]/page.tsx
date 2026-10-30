'use client';

import React, { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getStoredTeachings } from '@/lib/contentStore';
import type { Teaching } from '@/types/teaching';
import { DEFAULT_TEACHING_COVER } from '@/types/teaching';
import { TIcon } from '@/components/teachings/TeachingsIcons';

function parseYoutubeEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  // Match youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
}

function TeachingDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [teachings, setTeachings] = useState<Teaching[]>(() => {
    if (typeof window !== 'undefined') {
      return getStoredTeachings();
    }
    return [];
  });

  // Dual view tabs: 'dual' | 'video' | 'book' | 'audio'
  const [activeMediaTab, setActiveMediaTab] = useState<'dual' | 'video' | 'book' | 'audio'>('dual');

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setTeachings(getStoredTeachings());
    const handleUpdate = () => setTeachings(getStoredTeachings());
    window.addEventListener('abune_content_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const teaching = useMemo(() => {
    return teachings.find((t) => String(t.id) === String(id)) || teachings[0];
  }, [teachings, id]);

  const relatedTeachings = useMemo(() => {
    if (!teaching) return [];
    return teachings.filter((t) => String(t.id) !== String(teaching.id)).slice(0, 3);
  }, [teachings, teaching]);

  const hasVideo = Boolean(teaching?.videoUrl);
  const hasPdf = Boolean(teaching?.pdfUrl);
  const hasAudio = Boolean(teaching?.audioUrl);
  const isBoth = (hasVideo && hasPdf) || (hasAudio && hasPdf) || teaching?.format === 'both';

  // Synchronize active media tab when teaching changes
  useEffect(() => {
    if (isBoth) {
      setActiveMediaTab('dual');
    } else if (hasVideo) {
      setActiveMediaTab('video');
    } else if (hasPdf) {
      setActiveMediaTab('book');
    } else if (hasAudio) {
      setActiveMediaTab('audio');
    }
  }, [isBoth, hasVideo, hasPdf, hasAudio]);

  const youtubeEmbedUrl = useMemo(() => {
    return parseYoutubeEmbed(teaching?.videoUrl);
  }, [teaching?.videoUrl]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!teaching) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#0f2352]">Teaching Material Not Found</h2>
        <p className="mt-2 text-sm text-[#35609a]">The requested lesson or study material could not be located.</p>
        <button
          onClick={() => router.push('/teachings')}
          className="mt-6 rounded-full bg-[#0f2352] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#b9852a] transition-colors"
        >
          ← Return to All Teachings
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f1e6]">
      <Header />

      {/* Breadcrumb & Navigation Bar */}
      <div className="border-b border-[#ece5d8] bg-[#fffdf9]/90 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <Link
            href="/teachings"
            className="group flex items-center gap-2 rounded-full border border-[#dcc08a] bg-[#fffbf1] px-4 py-1.5 font-['Crimson_Text',serif] text-sm font-medium text-[#b9852a] hover:bg-[#b9852a] hover:text-white transition-all shadow-xs"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to All Teachings</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#6B7897]">
            <Link href="/" className="hover:text-[#0f2352]">Home</Link>
            <span>/</span>
            <Link href="/teachings" className="hover:text-[#0f2352]">Teachings</Link>
            <span>/</span>
            <span className="font-semibold text-[#0f2352] truncate max-w-[200px] sm:max-w-xs">{teaching.title}</span>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1300px] flex-1 px-4 py-6 sm:px-8">
        {/* Header Hero Section */}
        <section className="mb-8 rounded-2xl border border-[#ece5d8] bg-[#fffdf9] p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,35,82,0.06)] relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#dcc08a]/10 blur-2xl pointer-events-none" />

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="rounded-full bg-[#0f2352] px-3 py-1 font-serif text-xs font-semibold text-white tracking-wide">
              {teaching.category || 'General'}
            </span>

            {isBoth ? (
              <span className="rounded-full bg-[#6B21A8]/10 border border-[#6B21A8]/20 px-3 py-1 text-xs font-bold text-[#6B21A8]">
                🎥 Video + 📖 Study Book
              </span>
            ) : hasPdf ? (
              <span className="rounded-full bg-[#b9852a]/15 border border-[#b9852a]/30 px-3 py-1 text-xs font-bold text-[#b9852a]">
                📄 PDF Book
              </span>
            ) : hasVideo ? (
              <span className="rounded-full bg-[#DC2626]/10 border border-[#DC2626]/20 px-3 py-1 text-xs font-bold text-[#DC2626]">
                🎥 Video Lecture
              </span>
            ) : hasAudio ? (
              <span className="rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 px-3 py-1 text-xs font-bold text-[#0284C7]">
                🎧 Audio Sermon
              </span>
            ) : null}

            {teaching.durationMinutes && (
              <span className="rounded-full bg-[#f0ebe1] px-3 py-1 text-xs font-medium text-[#4b5563]">
                ⏱ {teaching.durationMinutes} min
              </span>
            )}

            {teaching.pdfPages && (
              <span className="rounded-full bg-[#f0ebe1] px-3 py-1 text-xs font-medium text-[#4b5563]">
                📄 {teaching.pdfPages} Pages
              </span>
            )}
          </div>

          {/* Titles */}
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0f2352] sm:text-4xl">
            {teaching.title}
          </h1>
          {teaching.titleAm && (
            <h2 className="mt-1 font-serif text-xl font-medium text-[#b9852a] sm:text-2xl">
              {teaching.titleAm}
            </h2>
          )}

          {/* Speaker / Date Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#ece5d8] pt-4 text-xs sm:text-sm text-[#4b5563]">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#b9852a]/20 text-[#b9852a]">
                <TIcon name="user" solid className="h-3.5 w-3.5" />
              </span>
              <span className="font-semibold text-[#0f2352]">{teaching.author || 'Abune Media Teacher'}</span>
            </div>

            <div className="flex items-center gap-2">
              <TIcon name="cal" className="h-4 w-4 text-[#b9852a]" />
              <span>Published: {new Date(teaching.publishedAt || teaching.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>

            {teaching.metaExtra && (
              <div className="flex items-center gap-2 text-[#35609a] font-medium">
                <span>• {teaching.metaExtra}</span>
              </div>
            )}
          </div>
        </section>

        {/* Multi-Media Material Player / Viewer Section */}
        <section className="mb-10 rounded-2xl border border-[#ece5d8] bg-[#fffdf9] p-5 sm:p-7 shadow-[0_4px_20px_rgba(15,35,82,0.06)]">
          {/* Multi-Media Switcher Tabs (Only if item holds multiple formats or user wants to switch) */}
          {isBoth && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#ece5d8] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#b9852a]">
                  Interactive Multi-Format Material
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0f2352]">
                  This teaching includes both Video Lecture and Companion Study Book
                </h3>
              </div>

              {/* View Switcher Pills */}
              <div className="inline-flex rounded-xl bg-[#f0ebe1] p-1 border border-[#e2dacf]">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('dual')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    activeMediaTab === 'dual'
                      ? 'bg-[#0f2352] text-white shadow-xs'
                      : 'text-[#4b5563] hover:text-[#0f2352]'
                  }`}
                >
                  ⚡ Dual View (Video + Book)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    activeMediaTab === 'video'
                      ? 'bg-[#0f2352] text-white shadow-xs'
                      : 'text-[#4b5563] hover:text-[#0f2352]'
                  }`}
                >
                  🎥 Video Only
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('book')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    activeMediaTab === 'book'
                      ? 'bg-[#0f2352] text-white shadow-xs'
                      : 'text-[#4b5563] hover:text-[#0f2352]'
                  }`}
                >
                  📖 PDF Book Only
                </button>
              </div>
            </div>
          )}

          {/* DUAL VIEW (Video on Left, PDF Book on Right) */}
          {isBoth && activeMediaTab === 'dual' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Video Lecture */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-serif font-bold text-[#0f2352]">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#DC2626]/10 text-[#DC2626]">🎥</span>
                    Video Lecture
                  </span>
                  <span className="text-xs text-[#6B7897]">HD Player</span>
                </div>

                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-md border border-[#0f2352]/20">
                  {youtubeEmbedUrl ? (
                    <iframe
                      src={youtubeEmbedUrl}
                      title={teaching.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : teaching.videoUrl ? (
                    <video
                      controls
                      src={teaching.videoUrl}
                      poster={teaching.imageUrl || DEFAULT_TEACHING_COVER}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white">
                      <span>Video lecture unavailable</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#4b5563] italic">
                  Tip: Watch the lecture on the left while referencing and following along the study book on the right.
                </p>
              </div>

              {/* Right Column: PDF Book Reader */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-serif font-bold text-[#0f2352]">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#b9852a]/15 text-[#b9852a]">📖</span>
                    Companion Study Book (PDF)
                  </span>
                  {teaching.pdfUrl && (
                    <a
                      href={teaching.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={teaching.pdfFileName || 'Teaching_Study_Book.pdf'}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#b9852a] hover:bg-[#976a1e] text-white px-3 py-1 text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>📥</span>
                      <span>Download PDF</span>
                    </a>
                  )}
                </div>

                <div className="relative h-[340px] sm:h-[420px] w-full overflow-hidden rounded-xl border border-[#dcc08a] bg-[#faf8f5] shadow-inner">
                  {teaching.pdfUrl ? (
                    <iframe
                      src={`${teaching.pdfUrl}#toolbar=1`}
                      title="PDF Book Reader"
                      className="h-full w-full border-0"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                      <span className="text-4xl">📄</span>
                      <p className="mt-2 text-sm font-semibold text-[#0f2352]">Companion Book Attached</p>
                      <p className="text-xs text-[#6B7897]">PDF reader preview is ready for download.</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[#6B7897]">
                  <span>File: {teaching.pdfFileName || 'Teaching_Guide.pdf'}</span>
                  <span>{teaching.pdfPages ? `${teaching.pdfPages} Pages` : 'Complete Edition'}</span>
                </div>
              </div>
            </div>
          )}

          {/* VIDEO ONLY VIEW */}
          {(activeMediaTab === 'video' || (!isBoth && hasVideo)) && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-serif font-bold text-[#0f2352]">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#DC2626]/10 text-[#DC2626]">🎥</span>
                  Recorded Video Lecture
                </span>
                <span className="text-xs text-[#6B7897]">Full Screen Supported</span>
              </div>

              <div className="relative aspect-video max-h-[580px] w-full overflow-hidden rounded-2xl bg-black shadow-lg border border-[#0f2352]/20">
                {youtubeEmbedUrl ? (
                  <iframe
                    src={youtubeEmbedUrl}
                    title={teaching.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : teaching.videoUrl ? (
                  <video
                    controls
                    src={teaching.videoUrl}
                    poster={teaching.imageUrl || DEFAULT_TEACHING_COVER}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white">
                    <span>Video stream unavailable</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PDF BOOK ONLY VIEW */}
          {(activeMediaTab === 'book' || (!isBoth && hasPdf && !hasVideo)) && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fffbf1] p-4 rounded-xl border border-[#dcc08a]">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#b9852a] text-white text-xl">
                    📄
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-[#0f2352] text-base">
                      {teaching.pdfFileName || `${teaching.title}.pdf`}
                    </h4>
                    <p className="text-xs text-[#6B7897]">
                      Official Sunday School Textbook • {teaching.pdfPages ? `${teaching.pdfPages} Pages` : 'Complete Document'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {teaching.pdfUrl && (
                    <>
                      <a
                        href={teaching.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#dcc08a] bg-white hover:bg-[#fff9e6] px-4 py-2 text-xs font-semibold text-[#b9852a] shadow-xs transition-colors"
                      >
                        <span>⤢</span>
                        <span>Open in New Tab</span>
                      </a>
                      <a
                        href={teaching.pdfUrl}
                        download={teaching.pdfFileName || 'teaching-book.pdf'}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f2352] hover:bg-[#b9852a] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
                      >
                        <span>📥</span>
                        <span>Download PDF Book</span>
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Embedded Document Frame */}
              <div className="relative h-[650px] w-full overflow-hidden rounded-2xl border-2 border-[#dcc08a]/60 bg-white shadow-lg">
                {teaching.pdfUrl ? (
                  <iframe
                    src={`${teaching.pdfUrl}#toolbar=1`}
                    title="Document Viewer"
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                    <span className="text-5xl">📖</span>
                    <h4 className="mt-3 font-serif text-lg font-bold text-[#0f2352]">
                      Document Preview
                    </h4>
                    <p className="text-xs text-[#6B7897] max-w-sm mt-1">
                      Click the download button above to access the complete printed book.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AUDIO ONLY VIEW */}
          {(activeMediaTab === 'audio' || (!isBoth && hasAudio && !hasVideo && !hasPdf)) && (
            <div className="rounded-2xl border border-[#dcc08a] bg-gradient-to-br from-[#fffdf9] to-[#fffbf1] p-6 sm:p-8 shadow-sm">
              <audio
                ref={audioRef}
                src={teaching.audioUrl || undefined}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />

              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Big Round Play Button */}
                <button
                  type="button"
                  onClick={toggleAudio}
                  aria-label={isPlaying ? 'Pause sermon' : 'Play sermon'}
                  className="group relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-[#0f2352] hover:bg-[#b9852a] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <span className="text-2xl font-bold">⏸</span>
                  ) : (
                    <span className="ml-1 text-2xl font-bold">▶</span>
                  )}
                  {isPlaying && (
                    <span className="absolute -inset-1 rounded-full border-2 border-[#b9852a] animate-ping opacity-30" />
                  )}
                </button>

                {/* Track Details & Scrubber */}
                <div className="w-full flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#b9852a]">
                        Audio Sermon & Sacred Lecture
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#0f2352]">
                        {teaching.audioFileName || `${teaching.title} — Lecture Audio`}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-[#35609a]">
                      {formatTime(currentTime)} / {formatTime(duration || 1680)}
                    </span>
                  </div>

                  {/* Scrubber Progress Bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 rounded-lg bg-[#e2dacf] accent-[#b9852a] cursor-pointer"
                  />

                  {/* Audio Controls Extras */}
                  <div className="mt-3 flex items-center justify-between text-xs text-[#6B7897]">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Speaker: {teaching.author || 'Orthodox Clergy'}
                    </span>

                    {teaching.audioUrl && (
                      <a
                        href={teaching.audioUrl}
                        download={teaching.audioFileName || 'sermon.mp3'}
                        className="inline-flex items-center gap-1 hover:text-[#0f2352] font-medium"
                      >
                        <span>📥 Download Audio (MP3)</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Content & Study Outline Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start mb-12">
          {/* Main Article & Notes */}
          <article className="rounded-2xl border border-[#ece5d8] bg-[#fffdf9] p-6 sm:p-8 shadow-[0_2px_12px_rgba(15,35,82,0.04)] font-['Crimson_Text',serif]">
            <h3 className="font-serif text-2xl font-bold text-[#0f2352] border-b border-[#ece5d8] pb-3 mb-5">
              Study Overview & Scriptural Reflections
            </h3>

            {/* Description Paragraphs */}
            <div className="prose prose-slate max-w-none text-base leading-relaxed text-[#2d3748] space-y-4 whitespace-pre-line">
              {teaching.content || teaching.description}
            </div>

            {/* If Outline is provided */}
            {teaching.outline && teaching.outline.length > 0 && (
              <div className="mt-8 rounded-xl bg-[#fffbf1] p-5 border border-[#dcc08a]">
                <h4 className="font-serif text-lg font-bold text-[#0f2352] mb-3 flex items-center gap-2">
                  <span className="text-[#b9852a]">✦</span> Key Study Topics & Outline
                </h4>
                <ul className="space-y-2 text-sm text-[#34476b]">
                  {teaching.outline.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-[#b9852a]/20 text-[11px] font-bold text-[#b9852a]">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* Sidebar: Related Teachings & Resource Links */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-[#ece5d8] bg-[#fffdf9] p-5 shadow-[0_2px_12px_rgba(15,35,82,0.04)]">
              <h4 className="font-serif text-base font-bold text-[#0f2352] border-b border-[#ece5d8] pb-2 mb-4">
                More in {teaching.category || 'Teachings'}
              </h4>

              <div className="space-y-3">
                {relatedTeachings.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/teachings/${rel.id}`}
                    className="group block rounded-xl border border-[#ece5d8] bg-white p-3 hover:border-[#b9852a] hover:shadow-xs transition-all"
                  >
                    <div className="flex gap-3 items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.imageUrl || DEFAULT_TEACHING_COVER}
                        alt=""
                        className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="font-serif text-sm font-semibold text-[#0f2352] group-hover:text-[#b9852a] line-clamp-1 transition-colors">
                          {rel.title}
                        </h5>
                        <p className="text-xs text-[#6B7897] truncate">{rel.author || 'Abune Media'}</p>
                        <span className="mt-1 inline-block text-[10px] font-semibold text-[#b9852a]">
                          {rel.format === 'both' ? '🎥 Video + 📖 Book' : rel.format === 'pdf' ? '📄 PDF Book' : '🎥 Video'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/teachings"
                className="mt-4 block text-center rounded-xl border border-[#dcc08a] bg-[#fffbf1] py-2 text-xs font-semibold text-[#b9852a] hover:bg-[#b9852a] hover:text-white transition-colors"
              >
                Browse All Lessons →
              </Link>
            </div>

            {/* Quick Sunday School Support Notice */}
            <div className="rounded-2xl border border-[#dcc08a] bg-[#fffdf9] p-5">
              <h5 className="font-serif font-bold text-sm text-[#0f2352] mb-1">
                Sunday School Curriculum
              </h5>
              <p className="text-xs text-[#6B7897] leading-relaxed">
                All study books and lectures are reviewed and blessed by the spiritual committee of the Ethiopian Orthodox Tewahedo Church.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TeachingDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f1e6]" />}>
      <TeachingDetailContent />
    </Suspense>
  );
}

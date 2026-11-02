'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { getStoredAnnouncements, AnnouncementItem } from '@/lib/contentStore';
import { apiClient } from '@/lib/api';

export default function AnnouncementsPage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() =>
    getStoredAnnouncements()
  );
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  // Fetch from backend API on mount, fallback to contentStore
  useEffect(() => {
    async function fetchFromBackend() {
      try {
        const res = await apiClient.get('/announcements');
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mapped: AnnouncementItem[] = res.data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            titleAm: item.title,
            summary: item.summary || item.content?.slice(0, 120),
            content: item.content,
            category: item.category || 'Parish Notices',
            categoryAm: item.category || 'ጠቅላላ ማስታወቂያ',
            priority: item.isPinned ? 'Urgent' : 'General',
            dateStr: item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Oct 2026',
            author: item.createdBy?.name || 'Church Administration',
            imageUrl: item.imageUrl || undefined,
            isPinned: !!item.isPinned,
            publishedAt: item.publishedAt || new Date().toISOString(),
          }));
          setAnnouncements(mapped);
        }
      } catch (err) {
        // Fallback to local persistent store
        setAnnouncements(getStoredAnnouncements());
      }
    }

    fetchFromBackend();

    const handleUpdate = () => {
      setAnnouncements(getStoredAnnouncements());
    };
    window.addEventListener('abune_content_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
    };
  }, []);

  const categories = [
    { key: 'All', en: 'All Notices', am: 'ሁሉም ማስታወቂያዎች' },
    { key: 'Feasts & Holidays', en: 'Feasts & Holidays', am: 'የበዓላት ማስታወቂያ' },
    { key: 'Sunday School', en: 'Sunday School', am: 'የሰንበት ት/ቤት' },
    { key: 'Parish Notices', en: 'Parish Notices', am: 'ጠቅላላ ማስታወቂያ' },
    { key: 'Urgent Calls', en: 'Urgent Calls', am: 'አስቸኳይ ጥሪ' },
  ];

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.titleAm && a.titleAm.toLowerCase().includes(q)) ||
        a.summary.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === 'All' ||
        a.category === selectedCategory ||
        (selectedCategory === 'Urgent Calls' && (a.priority === 'Urgent' || a.isPinned));

      return matchesSearch && matchesCat;
    });
  }, [announcements, search, selectedCategory]);

  const pinned = filteredAnnouncements.find((a) => a.isPinned || a.priority === 'Urgent');
  const regularList = filteredAnnouncements.filter((a) => a.id !== pinned?.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EF] text-[#2A354F]">
      <Header />

      <main className="flex-1 pb-20">
        {/* Hero Banner with Orthodox Gold Corner Styling */}
        <section className="relative bg-gradient-to-b from-[#0F1B3E] to-[#162344] text-white py-16 px-6 sm:px-12 border-b-2 border-[#C99A3B] shadow-md overflow-hidden">
          {/* Subtle Church Arch Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <span className="inline-block text-xs font-serif tracking-widest text-[#E2B258] uppercase mb-2">
              {isAm ? 'አቡነ ሚዲያ · ይፋዊ ማስታወቂያዎች' : 'Abune Media · Official Notices'}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              {isAm ? 'የሰንበት ትምህርት ቤት ማስታወቂያዎች' : 'Announcements & Parish Notices'}
            </h1>
            <p className="text-xs sm:text-sm text-[#E8EEF5]/80 max-w-2xl mx-auto leading-relaxed">
              {isAm
                ? 'የበዓላት መርሐግብራት፣ የጉባኤ ጥሪዎች፣ የትምህርት ምዝገባና ማኅበራዊ አገልግሎት መረጃዎችን እዚህ ያግኙ።'
                : 'Stay informed with upcoming feast celebrations, spiritual assemblies, Sunday School updates, and community notices.'}
            </p>
          </div>
        </section>

        {/* Search & Filter Controls */}
        <section className="max-w-6xl mx-auto px-6 sm:px-12 -mt-7 relative z-20">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(15,27,62,0.08)] border border-[#E8EEF5] flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C88A8]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                placeholder={isAm ? 'ማስታወቂያዎችን ይፈልጉ...' : 'Search notices...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#D5D0C7] focus:outline-none focus:border-[#C99A3B] bg-[#FCFAF7]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((c) => {
                const isActive = selectedCategory === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCategory(c.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-[#0F1B3E] text-[#E2B258] shadow-sm'
                        : 'bg-[#FAF6EF] text-[#505E7B] hover:bg-[#F0EAE1]'
                    }`}
                  >
                    {isAm ? c.am : c.en}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="max-w-6xl mx-auto px-6 sm:px-12 mt-10 space-y-8">
          {/* Featured / Pinned Announcement */}
          {pinned && (
            <div className="relative rounded-2xl overflow-hidden bg-white border-2 border-[#C99A3B] shadow-[0_4px_20px_rgba(201,154,59,0.12)] p-6 sm:p-8">
              <div className="absolute top-0 right-0 bg-[#C99A3B] text-[#0F1B3E] text-[11px] font-bold tracking-wider uppercase px-4 py-1 rounded-bl-xl shadow-xs">
                {isAm ? 'አስቸኳይ ማስታወቂያ' : 'Featured Announcement'}
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {pinned.imageUrl && (
                  <div className="w-full md:w-64 h-44 rounded-xl overflow-hidden flex-shrink-0 bg-[#EAE6DF] border border-[#E8EEF5]">
                    <img
                      src={pinned.imageUrl}
                      alt={pinned.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#7C88A8]">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold bg-[#FAF4E6] text-[#A27B2C] border border-[#E9D9B2]">
                      {isAm ? pinned.categoryAm || pinned.category : pinned.category}
                    </span>
                    <span>•</span>
                    <span>📅 {pinned.dateStr}</span>
                    <span>•</span>
                    <span>👤 {pinned.author}</span>
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F1B3E]">
                    {isAm && pinned.titleAm ? pinned.titleAm : pinned.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#505E7B] leading-relaxed">
                    {pinned.summary || pinned.content}
                  </p>

                  <button
                    onClick={() => setSelectedAnnouncement(pinned)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F1B3E] hover:bg-[#1A2D66] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>{isAm ? 'ሙሉውን አንብብ' : 'Read Full Notice'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Regular Announcements Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-[#0F1B3E]">
                {isAm ? 'የቅርብ ጊዜ ማስታወቂያዎች' : 'Recent Announcements'}
              </h3>
              <span className="text-xs text-[#7C88A8]">
                {filteredAnnouncements.length} {isAm ? 'ማስታወቂያዎች ተገኝተዋል' : 'notices posted'}
              </span>
            </div>

            {filteredAnnouncements.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E8EEF5] text-[#7C88A8] text-sm">
                {isAm
                  ? 'ምንም ማስታወቂያ አልተገኘም። እባክዎ ፍለጋዎን ይቀይሩ።'
                  : 'No announcements found matching your criteria.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(pinned ? regularList : filteredAnnouncements).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E8EEF5] hover:border-[#C99A3B] transition-all shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {item.imageUrl && (
                        <div className="h-40 w-full overflow-hidden bg-[#FAF6EF] border-b border-[#E8EEF5]">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#7C88A8]">
                          <span className="px-2 py-0.5 rounded-md font-semibold bg-[#FAF4E6] text-[#A27B2C] border border-[#E9D9B2]">
                            {isAm ? item.categoryAm || item.category : item.category}
                          </span>
                          <span>{item.dateStr}</span>
                        </div>

                        <h4 className="font-serif text-base font-bold text-[#0F1B3E] line-clamp-2 leading-snug">
                          {isAm && item.titleAm ? item.titleAm : item.title}
                        </h4>

                        <p className="text-xs text-[#505E7B] line-clamp-3 leading-relaxed">
                          {item.summary || item.content}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-[#FAF6EF] flex items-center justify-between text-xs font-semibold">
                      <span className="text-[11px] text-[#7C88A8] truncate max-w-[140px]">
                        {item.author}
                      </span>
                      <button
                        onClick={() => setSelectedAnnouncement(item)}
                        className="text-[#C99A3B] hover:text-[#0F1B3E] transition-colors"
                      >
                        {isAm ? 'ዝርዝር እይ →' : 'Details →'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Read Notice Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8EEF5] max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EF] mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#FAF4E6] text-[#A27B2C] border border-[#E9D9B2]">
                {isAm
                  ? selectedAnnouncement.categoryAm || selectedAnnouncement.category
                  : selectedAnnouncement.category}
              </span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="text-[#7C88A8] hover:text-[#0F1B3E] text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {selectedAnnouncement.imageUrl && (
              <img
                src={selectedAnnouncement.imageUrl}
                alt={selectedAnnouncement.title}
                className="w-full h-48 object-cover rounded-xl mb-4 border border-[#E8EEF5]"
              />
            )}

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F1B3E] mb-2 leading-snug">
              {isAm && selectedAnnouncement.titleAm
                ? selectedAnnouncement.titleAm
                : selectedAnnouncement.title}
            </h3>

            <div className="text-xs text-[#7C88A8] mb-4 flex items-center gap-3">
              <span>📅 {selectedAnnouncement.dateStr}</span>
              <span>•</span>
              <span>👤 {selectedAnnouncement.author}</span>
            </div>

            <div className="text-xs sm:text-sm text-[#2A354F] leading-relaxed whitespace-pre-line py-3 border-t border-b border-[#FAF6EF]">
              {selectedAnnouncement.content || selectedAnnouncement.summary}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2 rounded-xl bg-[#0F1B3E] text-white text-xs font-semibold hover:bg-[#1A2D66] transition-colors"
              >
                {isAm ? 'ዝጋ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

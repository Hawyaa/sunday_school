'use client';

/**
 * app/events/page.tsx — Events Page
 *
 * Exact implementation matching Abune Media Events template:
 * - Unified Header & Footer
 * - EventsHero with exact Ethiopian Orthodox cross image, church backdrop, breadcrumbs, and scripture verse
 * - EventsToolbar with category chips, keyword search, and sorting
 * - 2-Column Responsive Layout:
 *   Left (.list):
 *     .grid with EventCards (image, date badge, category tag, metadata, action button)
 *     .pager with page numbers (1, 2, ...) and prev/next navigation
 *   Right: FeaturedEventCard with Holy Week special services and gold button
 * - EventModal for interactive event details
 * - Live synchronized with Admin panel via contentStore
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventsHero } from '@/components/events/EventsHero';
import { EventsToolbar } from '@/components/events/EventsToolbar';
import { EventCard, EventItem } from '@/components/events/EventCard';
import { FeaturedEventCard } from '@/components/events/FeaturedEventCard';
import { EventsPagination } from '@/components/events/EventsPagination';
import { EventModal } from '@/components/events/EventModal';
import { getStoredEvents, StoredEventItem } from '@/lib/contentStore';

const FEATURED_EVENT: EventItem = {
  id: 'featured',
  title: 'Holy Week Special Services',
  cat: 'Special Event',
  icon: 'star',
  date: '2025-04-13',
  place: 'St. Gabriel Church',
  time: 'Apr 13 – Apr 20, 2025',
  img: 'https://i.pinimg.com/474x/53/d4/74/53d474d703be2c6a18c5e0e4af555787.jpg',
  description:
    'Join us for the solemn and spiritually uplifting Holy Week services, as we remember the passion, death and resurrection of our Lord Jesus Christ.',
};

const PER_PAGE = 6;

export default function EventsPage() {
  const [eventsList, setEventsList] = useState<StoredEventItem[]>(() => getStoredEvents());
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'name'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const toolbarRef = useRef<HTMLDivElement>(null);

  // Synchronize in real time with Admin actions
  useEffect(() => {
    const handleUpdate = () => {
      setEventsList(getStoredEvents());
    };
    window.addEventListener('abune_content_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
    };
  }, []);

  // Filter & sort logic matching template
  const filteredEvents = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();

    const list = (eventsList as EventItem[]).filter((e) => {
      const matchCat = activeCat === 'all' || e.cat === activeCat;
      const matchQuery =
        !term || (e.title + ' ' + e.place + ' ' + e.cat).toLowerCase().includes(term);
      return matchCat && matchQuery;
    });

    list.sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      const timeA = new Date(a.date).getTime() || 0;
      const timeB = new Date(b.date).getTime() || 0;
      if (sortBy === 'oldest') return timeA - timeB;
      // 'latest': newest / latest dates first
      return timeB - timeA;
    });

    return list;
  }, [eventsList, activeCat, searchQuery, sortBy]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedEvents = useMemo(() => {
    const startIndex = (safePage - 1) * PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + PER_PAGE);
  }, [filteredEvents, safePage]);

  const handleSelectCat = (cat: string) => {
    setActiveCat(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: 'latest' | 'oldest' | 'name') => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to toolbar when user pages
    if (toolbarRef.current) {
      toolbarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf8f3] text-[#1c2740] font-sans">
      {/* 1. Global Public Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero with Church Backdrop, Ethiopian Cross, Breadcrumbs & Verse */}
        <EventsHero />

        {/* 3. Toolbar: Category chips, Search bar, Sort dropdown */}
        <div ref={toolbarRef}>
          <EventsToolbar
            activeCat={activeCat}
            onSelectCat={handleSelectCat}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>

        {/* 4. Main Two-Column Layout */}
        <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-9">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
            {/* Left Column: Events Grid & Pagination */}
            <div className="space-y-8">
              {paginatedEvents.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#ece5d8] shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-[#fbf8f3] border border-[#ece5d8] flex items-center justify-center mx-auto mb-3 text-[#c8952f]">
                    🔍
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0f2352] mb-1">
                    No Events Found
                  </h3>
                  <p className="text-xs text-[#5a6479]">
                    Try adjusting your category filter or search keywords.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCat('all');
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="mt-4 px-4 py-1.5 rounded-lg bg-[#0f2352] text-white text-xs font-semibold hover:bg-[#19377d] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {paginatedEvents.map((evt) => (
                    <EventCard
                      key={evt.id}
                      event={evt}
                      onClick={(item) => setSelectedEvent(item)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination controls with page numbers */}
              {totalPages > 1 && (
                <div className="pt-4 border-t border-[#ece5d8]">
                  <EventsPagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Featured Event Card */}
            <aside className="sticky top-20">
              <FeaturedEventCard
                onViewDetails={() => setSelectedEvent(FEATURED_EVENT)}
              />
            </aside>
          </div>
        </section>
      </main>

      {/* 5. Interactive Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* 6. Global Public Footer */}
      <Footer />
    </div>
  );
}

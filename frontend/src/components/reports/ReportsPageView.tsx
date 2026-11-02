'use client';

/**
 * ReportsPageView.tsx  (components/reports/ReportsPageView.tsx)
 *
 * Composes the Reports page: hero, filter bar, list, sidebar and the PDF viewer pop-up.
 * - Restricted / locked reports are not shown.
 * - The list renders only AFTER the page has mounted in the browser. This keeps the server HTML
 *   and the first client render identical (fixes the "Hydration failed" error when the real
 *   data comes from a store / localStorage / API).
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ReportsHero } from '@/components/reports/ReportsHero';
import { ReportsFilterBar, type ReportSort } from '@/components/reports/ReportsFilterBar';
import { ReportsList } from '@/components/reports/ReportsList';
import { ReportsSidebar } from '@/components/reports/ReportsSidebar';
import { ReportViewer } from '@/components/reports/ReportViewer';
import type { ChurchReport } from '@/types/report';

/** Sample data (used only when the page passes no `reports`). */
const SAMPLE_REPORTS = [
  { id: '1', title: 'Clergy Service Report', dateStr: 'April 2025', fileSize: '2.4 MB', description: 'Administrative and clergy service summary report, including pastoral visits, liturgical activities, and community engagement.', fileUrl: '#', isRestricted: false, category: 'Administrative', year: '2025', iconKey: 'doc', publishedAt: '2025-04-01' },
  { id: '2', title: 'Education Department Activity Report', dateStr: 'Megabit 2025', fileSize: '1.8 MB', description: 'Educational and student activity performance report, including Sunday School, youth programs, and academic progress.', fileUrl: '#', isRestricted: false, category: 'Administrative', year: '2025', iconKey: 'book', publishedAt: '2025-03-01' },
  { id: '3', title: 'Choirs Service Performance Report', dateStr: 'Yekatit 2025', fileSize: '2.3 MB', description: 'Sacred music and choir group ministry performance report, including festivals, rehearsals, and special services.', fileUrl: '#', isRestricted: false, category: 'Administrative', year: '2025', iconKey: 'music', publishedAt: '2025-02-01' },
  { id: '4', title: 'Audit Financial Report', dateStr: 'Tir 2024', fileSize: '2.7 MB', description: 'Administrative and financial audit document summary, including budget analysis and expenditure reports.', fileUrl: '#', isRestricted: false, category: 'Financial', year: '2024', iconKey: 'chart', publishedAt: '2024-01-01' },
] as unknown as ChurchReport[];

type Extra = { year?: string; category?: string; publishedAt?: string };

export function ReportsPageView({ reports = SAMPLE_REPORTS, isLoading = false }: { reports?: ChurchReport[]; isLoading?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState('All');
  const [category, setCategory] = useState('All Types');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ReportSort>('newest');
  const [viewing, setViewing] = useState<ChurchReport | null>(null); // report open in the PDF viewer

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const list = reports.filter((r) => {
      if (r.isRestricted) return false; // locked reports are not shown
      const x = r as ChurchReport & Extra;
      if (year !== 'All' && x.year && x.year !== year) return false;
      if (category !== 'All Types' && x.category && x.category !== category) return false;
      if (q) {
        const hay = `${r.title} ${r.titleAm ?? ''} ${r.description ?? ''} ${r.descriptionAm ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const byDate = (r: ChurchReport) => {
      const d = (r as ChurchReport & Extra).publishedAt;
      return d ? new Date(d).getTime() : 0;
    };

    return [...list].sort((a, b) => (sort === 'newest' ? byDate(b) - byDate(a) : byDate(a) - byDate(b)));
  }, [reports, year, category, search, sort]);

  return (
    <div className="bg-[#f7f1e6] font-['Crimson_Text',Georgia,serif] text-[#1c2740]">
      <ReportsHero />

      <div className="mx-auto max-w-[1440px] px-5 pb-10 lg:px-[70px]">
        <div className="mt-[13px] grid grid-cols-1 gap-7 lg:grid-cols-[1fr_313px]">
          <section className="rounded-[14px] border border-[#ece5d8] bg-[#fffdf9]/70 px-[15px] pb-3.5 pt-3">
            <ReportsFilterBar
              year={year}
              onYearChange={setYear}
              category={category}
              onCategoryChange={setCategory}
              search={search}
              onSearchChange={setSearch}
              sort={sort}
              onSortChange={setSort}
            />
            {/* skeleton until mounted, so server HTML === first client render */}
            <ReportsList reports={filtered} isLoading={isLoading || !mounted} onView={setViewing} />
          </section>

          <ReportsSidebar />
        </div>
      </div>

      {/* PDF opens here, inside the website */}
      <ReportViewer report={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
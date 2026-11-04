'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useReportsData } from '@/hooks/useReportsData';
import { useAppStore } from '@/lib/store';
import { ReportViewer } from '@/components/reports/ReportViewer';
import type { ChurchReport } from '@/types/report';
import './reports.css';

export default function ReportsPage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  // Load live/stored reports
  const { reports, isLoading } = useReportsData('All', 'All Types', '');

  // Local state for instant client filtering & sorting matching the HTML script
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'n' | 'o'>('n');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [activeViewerReport, setActiveViewerReport] = useState<ChurchReport | null>(null);

  // Extract distinct years from reports list
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    reports.forEach((r) => {
      const match = r.dateStr.match(/\d{4}/);
      if (match) {
        yearsSet.add(match[0]);
      }
    });
    return Array.from(yearsSet).sort().reverse();
  }, [reports]);

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let result = reports.filter((r) => {
      const textToSearch = [
        r.title,
        r.titleAm || '',
        r.description || '',
        r.descriptionAm || '',
        r.category,
        r.dateStr,
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = !q || textToSearch.includes(q);
      const matchesYear = !selectedYear || r.dateStr.includes(selectedYear);

      return matchesQuery && matchesYear;
    });

    // Sort order: 'n' = newest first, 'o' = oldest first
    result.sort((a, b) => {
      // Numerical or ID based order fallback
      const yearA = parseInt(a.dateStr.match(/\d{4}/)?.[0] || '0', 10);
      const yearB = parseInt(b.dateStr.match(/\d{4}/)?.[0] || '0', 10);
      if (yearA !== yearB) {
        return sortOrder === 'n' ? yearB - yearA : yearA - yearB;
      }
      return sortOrder === 'n' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
    });

    return result;
  }, [reports, searchQuery, sortOrder, selectedYear]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedYear !== '';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedYear('');
  };

  const handleOpenReport = (e: React.MouseEvent, report: ChurchReport) => {
    e.preventDefault();
    if (report.fileUrl && report.fileUrl !== '#') {
      window.open(report.fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      setActiveViewerReport(report);
    }
  };

  return (
    <div className="reports-page">
      <Header />

      <main className="flex-1">
        <div className="w hero">
          {/* Breadcrumb */}
          <div className="crumb">
            <Link href="/">{isAm ? 'መነሻ' : 'Home'}</Link> › <b>{isAm ? 'ሪፖርቶች' : 'Reports'}</b>
          </div>

          {/* 3D Flip Book Hero */}
          <div className="bk">
            <div className="flip">
              <div className="front" aria-hidden="true">
                <span className="x">✛</span>
                <b className="am">አቡነ ሚዲያ</b>
                <span>REPORTS</span>
              </div>
              <div className="back pgL">
                <span className="kick">{isAm ? 'የሪፖርቶች ማዕከል' : 'REPORTS HUB'}</span>
                <h1>
                  <em>
                    <b>R</b>{isAm ? 'ፖርቶች' : 'eports'}
                  </em>
                </h1>
                <p>
                  {isAm
                    ? 'ትምህርታዊ፣ መንፈሳዊና ማህበራዊ አገልግሎቶችን ጨምሮ የተለያዩ ይፋዊ የቤተክርስቲያንና የአስተዳደር ሪፖርቶችን ይመልከቱ።'
                    : 'Access and review various official church and administrative reports, including educational, service, and community reports.'}
                </p>
                <a className="btn bn" href="#list">
                  {isAm ? 'ሁሉንም ሪፖርቶች ይመልከቱ →' : 'View all reports →'}
                </a>
              </div>
            </div>

            <div className="pgR">
              <span className="x">✛</span>
              <q>
                {isAm
                  ? '«መዝገባችሁ ባለበት ልባችሁ ደግሞ በዚያ ይሆናልና።»'
                  : '“For where your treasure is, there your heart will be also.”'}
              </q>
              <small>{isAm ? 'ማቴዎስ ፮፥፳፩' : 'MATTHEW 6:21'}</small>
            </div>
          </div>

          {/* Tools Bar */}
          <div id="list" className="tools">
            <label>
              <span aria-hidden="true">⌕</span>
              <input
                id="q"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAm ? 'ሪፖርቶችን በርእስ ወይም በቁልፍ ቃል ይፈልጉ…' : 'Search reports by title or keyword…'}
                aria-label="Search reports"
              />
            </label>

            <select
              id="s"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'n' | 'o')}
              aria-label="Sort"
            >
              <option value="n">{isAm ? 'ቅደም ተከተል፡ አዲስ' : 'Sort by: Newest'}</option>
              <option value="o">{isAm ? 'ቅደም ተከተል፡ የቆየ' : 'Sort by: Oldest'}</option>
            </select>

            <span className="cnt" id="c">
              {filteredReports.length}{' '}
              {filteredReports.length === 1
                ? isAm
                  ? 'ሪፖርት'
                  : 'report'
                : isAm
                ? 'ሪፖርቶች'
                : 'reports'}
              {hasActiveFilters && (
                <button type="button" className="clr" id="clr" onClick={clearFilters}>
                  {isAm ? 'ማጣሪያዎችን አጽዳ' : 'Clear filters'}
                </button>
              )}
            </span>
          </div>

          {/* Year Filter Tabs */}
          <div className="yt" id="yt" role="group" aria-label="Filter by year">
            <button
              type="button"
              className={selectedYear === '' ? 'sel' : ''}
              onClick={() => setSelectedYear('')}
            >
              {isAm ? 'ሁሉም' : 'All'}
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                type="button"
                className={selectedYear === year ? 'sel' : ''}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Main Layout Grid */}
          <div className="main">
            <div id="rl">
              {isLoading ? (
                <div className="py-12 text-center text-slate-500 font-serif italic text-xl">
                  {isAm ? 'ሪፖርቶች በመጫን ላይ ናቸው...' : 'Loading official reports...'}
                </div>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report, idx) => (
                  <div
                    key={report.id}
                    className="rp"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                    onClick={(e) => handleOpenReport(e, report)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleOpenReport(e as any, report);
                      }
                    }}
                  >
                    <div className="d">
                      {report.dateStr}
                      <small>{report.fileSize || '1.8 MB'}</small>
                    </div>

                    <div>
                      <h3>{isAm && report.titleAm ? report.titleAm : report.title}</h3>
                      <p>
                        {isAm && report.descriptionAm
                          ? report.descriptionAm
                          : report.description ||
                            (isAm
                              ? 'ኦፊሴላዊ የሰንበት ት/ቤትና የአስተዳደር አገልግሎት ሪፖርት።'
                              : 'Official Sunday school administrative and service report.')}
                      </p>
                    </div>

                    <span className="pdf">
                      {isAm ? 'ፒዲኤፍ እይ →' : 'View PDF →'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="none" style={{ display: 'block' }}>
                  {isAm ? 'ከፍለጋዎ ጋር የሚዛመድ ሪፖርት አልተገኘም።' : 'No reports match your search.'}
                </div>
              )}
            </div>

            {/* Sticky Marginalia Sidebar */}
            <aside>
              <div className="note">
                <span className="cross">✛</span>
                <h3>{isAm ? 'የተለየ ሪፖርት ይፈልጋሉ?' : 'Need a specific report?'}</h3>
                <p>
                  {isAm
                    ? 'የሚፈልጉትን ሪፖርት ካላገኙ እባክዎን የቤተክርስቲያኑን አስተዳደር በቀጥታ ያነጋግሩ።'
                    : 'If you can’t find the report you’re looking for, please contact the church administration.'}
                </p>
                <Link className="btn bn" href="/contact">
                  {isAm ? 'አስተዳደሩን ያነጋግሩ' : 'Contact Admin'}
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* Sacred Quote Band */}
        <section className="band">
          <div className="w">
            <blockquote>
              {isAm
                ? '«ቤተክርስቲያኑን በቅን ልብ የሚያገለግሉትን ሁሉ እግዚአብሔር ይባርክ።»'
                : 'May the Lord bless all who serve His Church with a pure heart.'}
            </blockquote>
            <small>✛ {isAm ? 'አቡነ ሚዲያ' : 'ABUNE MEDIA'}</small>
          </div>
        </section>
      </main>

      <Footer compact={false} />

      {/* PDF Modal Viewer for in-browser inspection */}
      {activeViewerReport && (
        <ReportViewer
          report={activeViewerReport}
          onClose={() => setActiveViewerReport(null)}
        />
      )}
    </div>
  );
}

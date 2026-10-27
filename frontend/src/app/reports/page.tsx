'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ReportsPageView } from '@/components/reports/ReportsPageView';
import { useReportsData } from '@/hooks/useReportsData';

export default function ReportsPage() {
  const { reports, isLoading } = useReportsData('All', 'All Types', '');

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f1e6]">
      <Header />

      <main id="main-content" className="w-full flex-1">
        <ReportsPageView reports={reports} isLoading={isLoading} />
      </main>

      <Footer />
    </div>
  );
}
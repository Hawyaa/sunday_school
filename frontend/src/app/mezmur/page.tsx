'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MezmurPageView } from '@/components/mezmur/MezmurPageView';

export default function MezmurPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f1e6]">
      <Header />
      <main id="main-content" className="w-full flex-1">
        <MezmurPageView />
      </main>
      <Footer />
    </div>
  );
}
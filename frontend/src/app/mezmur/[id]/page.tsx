'use client';

/**
 * app/mezmur/[id]/page.tsx
 * Detail page for an individual Mezmur, displaying Image 2 view directly.
 */

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MezmurPageView } from '@/components/mezmur/MezmurPageView';

function MezmurDetailContent() {
  const params = useParams();
  const id =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : undefined;

  return <MezmurPageView initialSelectedId={id} />;
}

export default function MezmurDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f1e6]" />}>
      <div className="flex min-h-screen flex-col bg-[#f7f1e6]">
        <Header />
        <main id="main-content" className="w-full flex-1">
          <MezmurDetailContent />
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}

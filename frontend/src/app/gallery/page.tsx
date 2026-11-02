'use client';

/**
 * Gallery Page (/gallery)
 *
 * Exact implementation of the Gallery design requested by the user:
 * 1. Top Navigation Bar (Header)
 * 2. Hero Banner with church background & gold corner accents (GalleryHero)
 * 3. Mosaic Gallery Grid (7 items) & Featured Album Box (GalleryMosaicGrid)
 * 4. Site Footer with contacts and motto (Footer)
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GalleryHero } from '@/components/gallery/GalleryHero';
import { GalleryMosaicGrid } from '@/components/gallery/GalleryMosaicGrid';

export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EF]">
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Hero Banner */}
      <GalleryHero />

      {/* 3. Main Gallery Container: Mosaic Grid & Featured Album */}
      <main className="flex-1">
        <GalleryMosaicGrid />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}

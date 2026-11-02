'use client';

/**
 * Contact Us Page (/contact)
 *
 * Dedicated contact orchestrator with physical address cards, communication form,
 * interactive map link, and parish details.
 * Features the shared global Header and Footer layouts.
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactInfoGrid } from '@/components/contact/ContactInfoGrid';
import { ContactFormCard } from '@/components/contact/ContactFormCard';
import { ContactMapSection } from '@/components/contact/ContactMapSection';
import { ContactQuoteFooter } from '@/components/contact/ContactQuoteFooter';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF7F0]">
      {/* 1. Global Header Navigation */}
      <Header />

      {/* 2. Hero Section */}
      <ContactHero />

      {/* 3. Main Content Area */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 space-y-10 w-full flex-1">
        {/* Four Info Cards */}
        <ContactInfoGrid />

        {/* Form and Map Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7">
            <ContactFormCard />
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <ContactMapSection />
          </div>
        </div>

        {/* Scripture Quote Reflection */}
        <ContactQuoteFooter />
      </main>

      {/* 4. Global Gold-Bordered Footer */}
      <Footer />
    </div>
  );
}

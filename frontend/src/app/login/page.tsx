/**
 * src/app/login/page.tsx  ->  /login
 */

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PortalHero } from '@/components/auth/PortalHero';
import { LoginCard } from '@/components/auth/LoginCard';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5eee1]">
      <Header />
      <PortalHero crumb="Login" title="Portal Login" subtitle="Sign in to manage the website content or to view your student portal." />

      <main className="flex-1 px-4 py-10 sm:py-14">
        <Suspense fallback={null}>
          <LoginCard />
        </Suspense>
        <p className="mt-6 text-center font-['Crimson_Text',Georgia,serif] text-[15px] text-[#35609a]">
          <Link href="/" className="underline">← Back to the website</Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
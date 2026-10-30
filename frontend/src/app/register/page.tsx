/**
 * src/app/register/page.tsx  ->  /register   (public: anyone can apply)
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PortalHero } from '@/components/auth/PortalHero';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5eee1]">
      <Header />
      <PortalHero crumb="Register" title="Member Registration" subtitle="Join our Sunday School family. Fill in the form; the administration will review and approve your registration." />
      <main className="flex-1 px-4 py-10 sm:py-12">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}
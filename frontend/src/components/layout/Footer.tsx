'use client';

import React from 'react';
import Link from 'next/link';
import { SiteLogo } from '@/components/layout/SiteLogo';
import { useAppStore } from '@/lib/store';
import './layout.css';

interface FooterProps {
  compact?: boolean;
}

const FOOTER_LINKS = [
  { href: '/', labelEn: 'Home', labelAm: 'መነሻ' },
  { href: '/about', labelEn: 'About', labelAm: 'ስለ እኛ' },
  { href: '/events', labelEn: 'Events', labelAm: 'መርሐ ግብሮች' },
  { href: '/reports', labelEn: 'Reports', labelAm: 'ሪፖርቶች' },
  { href: '/mezmur', labelEn: 'Mezmur', labelAm: 'መዝሙር' },
  { href: '/teachings', labelEn: 'Teachings', labelAm: 'ትምህርት' },
  { href: '/gallery', labelEn: 'Gallery', labelAm: 'ማዕከለ ስዕል' },
  { href: '/contact', labelEn: 'Contact', labelAm: 'ያግኙን' },
];

export function Footer({ compact = false }: FooterProps) {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  return (
    <footer className="site-ftr select-none">
      {/* Huge Ethiopic Watermark */}
      <div className="wm am" aria-hidden="true">
        አቡነ ሚዲያ
      </div>

      {/* 4-Column Grid */}
      <div className="w fg">
        {/* Column 1: Brand & Description */}
        <div>
          <Link href="/" className="brand">
            <span className="lg">
              <SiteLogo size={42} />
            </span>
            <span>
              <b className="am">አቡነ ሚዲያ</b>
              <small>ABUNE MEDIA PLATFORM</small>
            </span>
          </Link>
          <p className="d">
            {isAm
              ? 'ለሰንበት ትምህርት ቤት ትምህርት፣ ለመንፈሳዊነትና ለኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቅርስ ዲጂታል ማዕከል።'
              : 'A digital home for Sunday school teachings, spirituality and Ethiopian Orthodox heritage.'}
          </p>
          <p className="tag">{isAm ? 'እምነት። ባህል። ማህበረሰብ።' : 'Faith. Culture. Community.'}</p>
        </div>

        {/* Column 2: Explore Navigation */}
        <nav aria-label="Footer">
          <h4>{isAm ? 'አስስ' : 'Explore'}</h4>
          <ul className="fl">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{isAm ? link.labelAm : link.labelEn}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Column 3: Follow Us (Social Channels) */}
        <div>
          <h4>{isAm ? 'ይከተሉን' : 'Follow us'}</h4>
          <div className="ch">
            {/* Telegram */}
            <a href="https://t.me/abune_media" target="_blank" rel="noopener noreferrer">
              <i>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21.5 3.5 2.8 10.8c-.8.3-.8 1.4 0 1.7l4.6 1.5 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.5 4.7 3.4c.6.4 1.4.1 1.6-.6L22.9 4.7c.2-.9-.7-1.5-1.4-1.2zM9.1 13.6l8.5-5.2-6.6 6.3-.3 3z" />
                </svg>
              </i>
              <span>
                <b>Telegram</b>
                <span>t.me/abune_media</span>
              </span>
            </a>

            {/* YouTube */}
            <a href="https://youtube.com/@abune_media" target="_blank" rel="noopener noreferrer">
              <i>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="1.5" y="4.5" width="21" height="15" rx="4.5" />
                  <path className="cut" d="M10 8.8v6.4l5.4-3.2z" />
                </svg>
              </i>
              <span>
                <b>YouTube</b>
                <span>youtube.com/@abune_media</span>
              </span>
            </a>

            {/* TikTok */}
            <a href="https://tiktok.com/@abune_media" target="_blank" rel="noopener noreferrer">
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14.5 3v11.2a3.7 3.7 0 1 1-3.7-3.7M14.5 3c.4 2.7 2.1 4.2 5 4.4" />
                </svg>
              </i>
              <span>
                <b>TikTok</b>
                <span>@abune_media</span>
              </span>
            </a>
          </div>
        </div>

        {/* Column 4: Visit & Contact */}
        <div>
          <h4>{isAm ? 'አድራሻና ግንኙነት' : 'Visit & contact'}</h4>
          <address>
            {isAm ? 'አዲስ አበባ፣ አቡነ ወረዳ' : 'Addis Ababa, Abune Wereda'}
            <br />
            <a href="tel:+251911123456">+251 911 123 456</a>
            <br />
            <a href="https://t.me/abune_media" target="_blank" rel="noopener noreferrer">
              t.me/abune_media
            </a>
          </address>
        </div>
      </div>

      {/* Geometric Ornament Divider */}
      <div className="orn" aria-hidden="true" />

      {/* Bottom Bar */}
      <div className="w fb">
        <span>© 2017 – 2025 Abune Media. All rights reserved.</span>
        <span className="am">አቡነ ሚዲያ | እምነት ባህል ማህበረሰብ</span>
      </div>
    </footer>
  );
}

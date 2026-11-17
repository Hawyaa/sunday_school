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
                  <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.674c.458 0 .66-.21.916-.457l2.199-2.138 4.574 3.379c.843.465 1.45.225 1.66-.782l2.997-14.122c.307-1.23-.467-1.785-1.209-1.42z" />
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
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
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
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.35-.07 2.54-.97 2.89-2.27.13-.5.17-1.02.16-1.54V.02z" />
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

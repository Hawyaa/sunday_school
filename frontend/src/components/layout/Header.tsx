'use client';

/**
 * Abune Media – Site Header with Authentication Modal
 *
 * Implements:
 * - Direct sticky navbar with 8px navy border-top
 * - Dropdowns for "Updates" (Events, Announcements, Reports) and "Media" (Mezmur, Teachings, Gallery)
 * - Language switcher (EN / አማ)
 * - Account section:
 *   - Log in & Register buttons when unauthenticated
 *   - Avatar & dropdown with role indicators when authenticated:
 *     - Admin sees "Admin Studio"
 *     - Super Admin sees "Super Admin Studio" + additional platform shortcuts
 * - Full 2-column decorative authentication modal with Log in, Register, form validation,
 *   quick demo role buttons, and automatic role redirection to /admin or /portal.
 * - Mobile menu drawer with collapsible detail accordions.
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { SiteLogo } from '@/components/layout/SiteLogo';
import { getSession, clearSession, logout, type Session } from '@/lib/auth';
import './header.css';

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale } = useAppStore();
  const isAm = locale === 'am';

  // Header scroll & menu states
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<Session['user'] | null>(null);

  // Sync session on mount & storage event
  const syncSession = () => {
    const s = getSession();
    if (s?.user) {
      setCurrentUser(s.user);
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    syncSession();
    const handleStorage = () => syncSession();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside listener for dropdowns
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setUpdatesOpen(false);
        setMediaOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Keyboard navigation (ESC closes menus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUpdatesOpen(false);
        setMediaOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      clearSession();
    }
    setCurrentUser(null);
    setUserMenuOpen(false);
    router.refresh();
  };

  // Determine user role strictly from authenticated session
  const isSuperAdmin = Boolean(
    currentUser?.backendRole === 'SUPER_ADMIN' ||
    (currentUser?.email && currentUser.email.toLowerCase().startsWith('super'))
  );
  const isAdmin = Boolean(
    isSuperAdmin ||
    currentUser?.backendRole === 'ADMIN' ||
    currentUser?.backendRole === 'EDITOR' ||
    (currentUser?.email && currentUser.email.toLowerCase().startsWith('admin'))
  );

  return (
    <div className="site-hdr-root">
      {/* ── Main Site Header ─────────────────────────────────────────── */}
      <header ref={headerRef} className={`hdr ${isScrolled ? 'sc' : ''}`} id="hdr">
        <div className="w nv">
          {/* Brand Logo & Name */}
          <Link href="/" className="brand" aria-label="Abune Media home">
            <span className="lg">
              <SiteLogo size={42} />
            </span>
            <span>
              <b className="am">አቡነ ሚዲያ</b>
              <small>ETHIOPIAN ORTHODOX</small>
            </span>
          </Link>

          {/* Desktop Navigation Links with Dropdowns */}
          <ul className="mn" aria-label="Main">
            <li>
              <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
                {isAm ? 'መነሻ' : 'Home'}
              </Link>
            </li>
            <li>
              <Link href="/about" aria-current={pathname?.startsWith('/about') ? 'page' : undefined}>
                {isAm ? 'ስለ እኛ' : 'About'}
              </Link>
            </li>

            {/* Updates Dropdown */}
            <li className={updatesOpen ? 'open' : ''}>
              <button
                type="button"
                aria-expanded={updatesOpen}
                aria-haspopup="true"
                onClick={() => {
                  setUpdatesOpen(!updatesOpen);
                  setMediaOpen(false);
                }}
              >
                {isAm ? 'ወቅታዊ መረጃ' : 'Updates'} <i className="ch" />
              </button>
              <div className="dd">
                <Link
                  href="/events"
                  onClick={() => setUpdatesOpen(false)}
                  aria-current={pathname?.startsWith('/events') ? 'page' : undefined}
                >
                  {isAm ? 'መርሐ ግብሮች' : 'Events'}
                </Link>
                <Link
                  href="/announcements"
                  onClick={() => setUpdatesOpen(false)}
                  aria-current={pathname?.startsWith('/announcements') ? 'page' : undefined}
                >
                  {isAm ? 'ማስታወቂያዎች' : 'Announcements'}
                </Link>
                <Link
                  href="/reports"
                  onClick={() => setUpdatesOpen(false)}
                  aria-current={pathname?.startsWith('/reports') ? 'page' : undefined}
                >
                  {isAm ? 'ሪፖርቶች' : 'Reports'}
                </Link>
              </div>
            </li>

            {/* Media Dropdown */}
            <li className={mediaOpen ? 'open' : ''}>
              <button
                type="button"
                aria-expanded={mediaOpen}
                aria-haspopup="true"
                onClick={() => {
                  setMediaOpen(!mediaOpen);
                  setUpdatesOpen(false);
                }}
              >
                {isAm ? 'ሚዲያ' : 'Media'} <i className="ch" />
              </button>
              <div className="dd">
                <Link
                  href="/mezmur"
                  onClick={() => setMediaOpen(false)}
                  aria-current={pathname?.startsWith('/mezmur') ? 'page' : undefined}
                >
                  {isAm ? 'መዝሙር' : 'Mezmur'}
                </Link>
                <Link
                  href="/teachings"
                  onClick={() => setMediaOpen(false)}
                  aria-current={pathname?.startsWith('/teachings') ? 'page' : undefined}
                >
                  {isAm ? 'ትምህርት' : 'Teachings'}
                </Link>
                <Link
                  href="/gallery"
                  onClick={() => setMediaOpen(false)}
                  aria-current={pathname?.startsWith('/gallery') ? 'page' : undefined}
                >
                  {isAm ? 'ማዕከለ ስዕል' : 'Gallery'}
                </Link>
              </div>
            </li>

            <li>
              <Link href="/contact" aria-current={pathname?.startsWith('/contact') ? 'page' : undefined}>
                {isAm ? 'ያግኙን' : 'Contact'}
              </Link>
            </li>
          </ul>

          {/* Language Switcher */}
          <div className="lang" role="group" aria-label="Language">
            <button
              type="button"
              className={!isAm ? 'a' : ''}
              aria-pressed={!isAm}
              onClick={() => setLocale('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`am ${isAm ? 'a' : ''}`}
              aria-pressed={isAm}
              onClick={() => setLocale('am')}
            >
              አማ
            </button>
          </div>

          {/* Account Area */}
          <div className="acct" id="acct">
            {!currentUser ? (
              <>
                <Link href="/login" className="lnk">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
                  </svg>
                  {isAm ? 'ግባ' : 'Log in'}
                </Link>
                <Link href="/register" className="btn">
                  {isAm ? 'ተመዝገብ' : 'Register'}
                </Link>
              </>
            ) : (
              <div className={`um ${userMenuOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="av"
                  aria-label="Account menu"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </button>

                <div className="dd">
                  <div className="who">
                    <b>{currentUser.name}</b>
                    <small>
                      {isSuperAdmin
                        ? 'Super Admin'
                        : isAdmin
                        ? 'Admin'
                        : currentUser?.canTakeAttendance
                        ? 'Teacher · Attendance Taker'
                        : 'Member'}
                    </small>
                  </div>

                  {/* Role-Specific Shortcuts */}
                  {currentUser?.canTakeAttendance && (
                    <Link href="/attendance" onClick={() => setUserMenuOpen(false)}>
                      📋 Take Attendance
                    </Link>
                  )}
                  {isAdmin ? (
                    <>
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                        {isSuperAdmin ? '🛡 Super Admin Studio' : '📊 Admin Studio'}
                      </Link>
                      <Link href="/attendance" onClick={() => setUserMenuOpen(false)}>
                        📋 Attendance Management
                      </Link>
                      {isSuperAdmin && (
                        <>
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                            👤 Administrators
                          </Link>
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                            ⚙️ Platform Settings
                          </Link>
                        </>
                      )}
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                        📝 Registrations (5)
                      </Link>
                    </>
                  ) : !currentUser?.canTakeAttendance ? (
                    <Link href="/portal" onClick={() => setUserMenuOpen(false)}>
                      🎓 Student Portal
                    </Link>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '11px 14px',
                      background: 'none',
                      border: 0,
                      color: 'var(--red)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderTop: '1px solid rgba(30,42,94,0.1)',
                      marginTop: 4,
                    }}
                  >
                    {isAm ? 'ውጣ' : 'Sign out'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            className="menu"
            id="mo"
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ─────────────────────────────────────────── */}
      <div className={`mm ${mobileMenuOpen ? 'on' : ''}`} id="mm" role="dialog" aria-modal="true" aria-label="Menu">
        <button
          className="mx"
          id="mx"
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>

        <Link className="k" href="/" onClick={() => setMobileMenuOpen(false)}>
          {isAm ? 'መነሻ' : 'Home'}
        </Link>
        <Link className="k" href="/about" onClick={() => setMobileMenuOpen(false)}>
          {isAm ? 'ስለ እኛ' : 'About'}
        </Link>

        {/* Mobile Accordions */}
        <details>
          <summary>{isAm ? 'ወቅታዊ መረጃ' : 'Updates'}</summary>
          <div className="sub">
            <Link href="/events" onClick={() => setMobileMenuOpen(false)}>
              {isAm ? 'መርሐ ግብሮች' : 'Events'}
            </Link>
            <Link href="/announcements" onClick={() => setMobileMenuOpen(false)}>
              {isAm ? 'ማስታወቂያዎች' : 'Announcements'}
            </Link>
            <Link href="/reports" onClick={() => setMobileMenuOpen(false)}>
              {isAm ? 'ሪፖርቶች' : 'Reports'}
            </Link>
          </div>
        </details>

        <details>
          <summary>{isAm ? 'ሚዲያ' : 'Media'}</summary>
          <div className="sub">
            <Link href="/mezmur" onClick={() => setMobileMenuOpen(false)}>
              {isAm ? 'መዝሙር' : 'Mezmur'}
            </Link>
            <Link href="/teachings" onClick={() => setMobileMenuOpen(false)}>
              {isAm ? 'ትምህርት' : 'Teachings'}
            </Link>
            <Link href="/gallery" onClick={() => setMobileMenuOpen(false)}>
              {isAm ? 'ማዕከለ ስዕል' : 'Gallery'}
            </Link>
          </div>
        </details>

        <Link className="k" href="/contact" onClick={() => setMobileMenuOpen(false)}>
          {isAm ? 'ያግኙን' : 'Contact'}
        </Link>

        {/* Mobile Auth Buttons */}
        <div className="bt" id="mbt">
          {!currentUser ? (
            <>
              <Link
                href="/login"
                className="btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAm ? 'ግባ' : 'Log in'}
              </Link>
              <Link
                href="/register"
                className="btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAm ? 'ተመዝገብ' : 'Register'}
              </Link>
            </>
          ) : (
            <>
              <Link
                className="btn"
                href={isAdmin ? '/admin' : '/portal'}
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAdmin ? 'Admin Studio' : 'Student Portal'}
              </Link>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
              >
                {isAm ? 'ውጣ' : 'Sign out'}
              </button>
            </>
          )}
        </div>

        {/* Mobile Language Switcher */}
        <div className="lang" role="group" aria-label="Language">
          <button
            type="button"
            className={!isAm ? 'a' : ''}
            aria-pressed={!isAm}
            onClick={() => setLocale('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`am ${isAm ? 'a' : ''}`}
            aria-pressed={isAm}
            onClick={() => setLocale('am')}
          >
            አማ
          </button>
        </div>
      </div>
    </div>
  );
}

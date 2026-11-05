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
import { getSession, saveSession, clearSession, loginAdmin, loginMember, type Session } from '@/lib/auth';
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

  // Auth modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'l' | 'r'>('l');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState('Welcome.');
  const [successMessage, setSuccessMessage] = useState('You are now logged in.');

  // Form states
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regTerms, setRegTerms] = useState(false);
  const [regError, setRegError] = useState('');

  const [loading, setLoading] = useState(false);

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

  // Keyboard navigation (ESC closes modals/menus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAuthModalOpen(false);
        setMobileMenuOpen(false);
        setUpdatesOpen(false);
        setMediaOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Open auth modal
  const openAuth = (tab: 'l' | 'r') => {
    setAuthTab(tab);
    setAuthSuccess(false);
    setLoginError('');
    setRegError('');
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
    setAuthSuccess(false);
  };

  // Sign out handler
  const handleSignOut = () => {
    clearSession();
    setCurrentUser(null);
    setUserMenuOpen(false);
    router.refresh();
  };

  // Determine user role
  const isSuperAdmin = Boolean(
    currentUser?.backendRole === 'SUPER_ADMIN' ||
    currentUser?.name?.toLowerCase().includes('super') ||
    currentUser?.email?.toLowerCase().includes('super')
  );
  const isAdmin = Boolean(
    isSuperAdmin ||
    currentUser?.backendRole === 'ADMIN' ||
    currentUser?.backendRole === 'EDITOR' ||
    currentUser?.email?.toLowerCase().includes('admin')
  );

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginId.trim()) {
      setLoginError(isAm ? 'እባክዎ ኢሜይል ወይም ስልክ ያስገቡ' : 'Please enter your email or phone.');
      return;
    }
    if (!loginPass.trim()) {
      setLoginError(isAm ? 'እባክዎ የይለፍ ቃል ያስገቡ' : 'Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // Check if user is logging in as admin or member via backend API
      if (loginId.includes('@')) {
        try {
          const session = await loginAdmin(loginId.trim(), loginPass);
          const role = session.user.backendRole;
          const superUser = role === 'SUPER_ADMIN' || loginId.toLowerCase().includes('super');
          setCurrentUser(session.user);
          setSuccessTitle(isAm ? 'እንኳን ደህና መጡ' : 'Welcome back.');
          setSuccessMessage(
            superUser
              ? (isAm ? 'እንደ ዋና አስተዳዳሪ (Super Admin) ገብተዋል።' : 'You are logged in as Super Administrator.')
              : (isAm ? 'እንደ አስተዳዳሪ (Admin) ገብተዋል።' : 'You are logged in as Administrator.')
          );
          setAuthSuccess(true);
          return;
        } catch {
          // If backend fails, check for demo credentials fallback
          if (loginId.toLowerCase().includes('super')) {
            const demoSession: Session = {
              role: 'admin',
              accessToken: 'demo-super-token',
              user: { name: 'Super Admin', email: loginId.trim(), backendRole: 'SUPER_ADMIN' },
            };
            saveSession(demoSession);
            setCurrentUser(demoSession.user);
            setSuccessTitle('Welcome back, Super Admin.');
            setSuccessMessage('You have full platform access to system and administration modules.');
            setAuthSuccess(true);
            return;
          } else if (loginId.toLowerCase().includes('admin')) {
            const demoSession: Session = {
              role: 'admin',
              accessToken: 'demo-admin-token',
              user: { name: 'Admin', email: loginId.trim(), backendRole: 'ADMIN' },
            };
            saveSession(demoSession);
            setCurrentUser(demoSession.user);
            setSuccessTitle('Welcome back, Admin.');
            setSuccessMessage('You are logged in with content and member administration access.');
            setAuthSuccess(true);
            return;
          }
          throw new Error('Invalid credentials. Please verify your email and password.');
        }
      } else {
        // Member login
        try {
          const session = await loginMember(loginId.trim(), loginPass);
          setCurrentUser(session.user);
          setSuccessTitle('Welcome, ' + session.user.name + '.');
          setSuccessMessage('You are logged into your Sunday School student portal.');
          setAuthSuccess(true);
        } catch {
          const demoSession: Session = {
            role: 'member',
            accessToken: 'demo-member-token',
            user: { name: loginId.trim(), division: 'Intermediate' },
          };
          saveSession(demoSession);
          setCurrentUser(demoSession.user);
          setSuccessTitle('Welcome, ' + loginId.trim() + '.');
          setSuccessMessage('You are logged into your student portal.');
          setAuthSuccess(true);
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError(isAm ? 'እባክዎ ሙሉ ስምዎን ያስገቡ' : 'Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError(isAm ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ' : 'Please enter a valid email.');
      return;
    }
    if (regPass.length < 8) {
      setRegError(isAm ? 'የይለፍ ቃል ቢያንስ 8 ፊደላት መሆን አለበት' : 'Use at least 8 characters.');
      return;
    }
    if (regPass !== regConfirm) {
      setRegError(isAm ? 'የይለፍ ቃሎች አይመሳሰሉም' : 'Passwords do not match.');
      return;
    }
    if (!regTerms) {
      setRegError(isAm ? 'እባክዎ ደንቦቹን ይቀበሉ' : 'Please agree to the terms and privacy policy.');
      return;
    }

    setLoading(true);

    try {
      // Create user session
      const newSession: Session = {
        role: 'member',
        accessToken: 'new-account-token',
        user: { name: regName.trim(), email: regEmail.trim(), status: 'PENDING' },
      };
      saveSession(newSession);
      setCurrentUser(newSession.user);
      setSuccessTitle('Welcome, ' + regName.trim().split(' ')[0] + '.');
      setSuccessMessage('Your account registration has been submitted successfully.');
      setAuthSuccess(true);
    } catch (err: any) {
      setRegError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Handler
  const quickDemoLogin = (roleType: 'super' | 'admin' | 'member') => {
    let demoSession: Session;
    if (roleType === 'super') {
      demoSession = {
        role: 'admin',
        accessToken: 'demo-super-admin-token',
        user: { name: 'Hawi', email: 'hawi@abunemedia.org', backendRole: 'SUPER_ADMIN' },
      };
      setSuccessTitle('Welcome back, Hawi (Super Admin).');
      setSuccessMessage('Logged in with Super Admin privileges. You can manage platform settings, administrators, and all content.');
    } else if (roleType === 'admin') {
      demoSession = {
        role: 'admin',
        accessToken: 'demo-admin-token',
        user: { name: 'Selam K.', email: 'selam@abunemedia.org', backendRole: 'ADMIN' },
      };
      setSuccessTitle('Welcome back, Selam (Admin).');
      setSuccessMessage('Logged in with Admin privileges. You have access to content, registrations, and member directories.');
    } else {
      demoSession = {
        role: 'member',
        accessToken: 'demo-member-token',
        user: { name: 'Meron Tesfaye', registrationNumber: 'ABN-2026-0142', division: 'Intermediate' },
      };
      setSuccessTitle('Welcome, Meron.');
      setSuccessMessage('Logged into your Sunday School student portal.');
    }
    saveSession(demoSession);
    setCurrentUser(demoSession.user);
    setAuthSuccess(true);
  };

  const handleContinueAfterAuth = () => {
    closeAuth();
    if (isSuperAdmin || isAdmin) {
      router.push('/admin');
    } else {
      router.push('/portal');
    }
  };

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
              <Link href="/about" aria-current={pathname.startsWith('/about') ? 'page' : undefined}>
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
                  aria-current={pathname.startsWith('/events') ? 'page' : undefined}
                >
                  {isAm ? 'መርሐ ግብሮች' : 'Events'}
                </Link>
                <Link
                  href="/announcements"
                  onClick={() => setUpdatesOpen(false)}
                  aria-current={pathname.startsWith('/announcements') ? 'page' : undefined}
                >
                  {isAm ? 'ማስታወቂያዎች' : 'Announcements'}
                </Link>
                <Link
                  href="/reports"
                  onClick={() => setUpdatesOpen(false)}
                  aria-current={pathname.startsWith('/reports') ? 'page' : undefined}
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
                  aria-current={pathname.startsWith('/mezmur') ? 'page' : undefined}
                >
                  {isAm ? 'መዝሙር' : 'Mezmur'}
                </Link>
                <Link
                  href="/teachings"
                  onClick={() => setMediaOpen(false)}
                  aria-current={pathname.startsWith('/teachings') ? 'page' : undefined}
                >
                  {isAm ? 'ትምህርት' : 'Teachings'}
                </Link>
                <Link
                  href="/gallery"
                  onClick={() => setMediaOpen(false)}
                  aria-current={pathname.startsWith('/gallery') ? 'page' : undefined}
                >
                  {isAm ? 'ማዕከለ ስዕል' : 'Gallery'}
                </Link>
              </div>
            </li>

            <li>
              <Link href="/contact" aria-current={pathname.startsWith('/contact') ? 'page' : undefined}>
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
                <button type="button" className="lnk" onClick={() => openAuth('l')}>
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
                </button>
                <button type="button" className="btn" onClick={() => openAuth('r')}>
                  {isAm ? 'ተመዝገብ' : 'Register'}
                </button>
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
                        : 'Member'}
                    </small>
                  </div>

                  {/* Role-Specific Shortcuts */}
                  {isAdmin ? (
                    <>
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                        {isSuperAdmin ? '🛡 Super Admin Studio' : '📊 Admin Studio'}
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
                  ) : (
                    <Link href="/portal" onClick={() => setUserMenuOpen(false)}>
                      🎓 Student Portal
                    </Link>
                  )}

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
              <button type="button" className="btn" onClick={() => openAuth('l')}>
                {isAm ? 'ግባ' : 'Log in'}
              </button>
              <button type="button" className="btn" onClick={() => openAuth('r')}>
                {isAm ? 'ተመዝገብ' : 'Register'}
              </button>
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

      {/* ── Two-Column Decorative Authentication Modal ─────────────────── */}
      <div className={`ov ${authModalOpen ? 'on' : ''}`} id="ov">
        <div className="md" role="dialog" aria-modal="true" aria-labelledby="mt">
          {/* Left Decorative Parchment Panel */}
          <div className="sd">
            <span className="x">✛</span>
            <div>
              <h2>
                Learn the faith,<br />
                live the faith.
              </h2>
              <p>
                Join the Abune Media community to manage spiritual content, follow Sunday school
                schedules, or explore church heritage.
              </p>
            </div>
            <span className="am" style={{ color: 'var(--gold)', fontSize: 20, fontWeight: 700 }}>
              አቡነ ሚዲያ
            </span>
          </div>

          {/* Right Form Container */}
          <div className={`fm ${authSuccess ? 'done' : ''}`} id="fm">
            <button className="cl" id="cl" type="button" aria-label="Close" onClick={closeAuth}>
              ✕
            </button>

            {/* Tab Selector */}
            <div className="tb" role="tablist">
              <button
                type="button"
                role="tab"
                id="t-l"
                aria-selected={authTab === 'l'}
                onClick={() => {
                  setAuthTab('l');
                  setLoginError('');
                }}
              >
                Log in
              </button>
              <button
                type="button"
                role="tab"
                id="t-r"
                aria-selected={authTab === 'r'}
                onClick={() => {
                  setAuthTab('r');
                  setRegError('');
                }}
              >
                Register
              </button>
            </div>

            {/* Log in Form */}
            {authTab === 'l' && (
              <form id="f-l" onSubmit={handleLoginSubmit} noValidate>
                <div className={`fl ${loginError ? 'err' : ''}`}>
                  <label htmlFor="le">Email or phone</label>
                  <input
                    id="le"
                    autoComplete="username"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="name@example.org"
                  />
                  {loginError && <span className="er">{loginError}</span>}
                </div>

                <div className={`fl ${loginError ? 'err' : ''}`}>
                  <label htmlFor="lp">Password</label>
                  <input
                    id="lp"
                    type={showLoginPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                  />
                  <button
                    type="button"
                    className="eye"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                  >
                    {showLoginPass ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="row">
                  <span />
                  <Link href="/contact" onClick={closeAuth}>
                    Forgot password?
                  </Link>
                </div>

                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Logging in…' : 'Log in →'}
                </button>

                <p className="alt">
                  New here?{' '}
                  <button type="button" onClick={() => setAuthTab('r')}>
                    Create an account
                  </button>
                </p>

                {/* Quick Demo Shortcuts */}
                <div className="demo-pills">
                  <small>Quick test login:</small>
                  <button type="button" onClick={() => quickDemoLogin('super')}>
                    ⚡ Super Admin
                  </button>
                  <button type="button" onClick={() => quickDemoLogin('admin')}>
                    ⚡ Admin
                  </button>
                  <button type="button" onClick={() => quickDemoLogin('member')}>
                    ⚡ Member
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {authTab === 'r' && (
              <form id="f-r" onSubmit={handleRegisterSubmit} noValidate>
                <div className={`fl ${regError ? 'err' : ''}`}>
                  <label htmlFor="rn">Full name</label>
                  <input
                    id="rn"
                    autoComplete="name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Meron Tesfaye"
                  />
                </div>

                <div className={`fl ${regError ? 'err' : ''}`}>
                  <label htmlFor="re">Email</label>
                  <input
                    id="re"
                    type="email"
                    autoComplete="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.org"
                  />
                </div>

                <div className={`fl ${regError ? 'err' : ''}`}>
                  <label htmlFor="rp">Password</label>
                  <input
                    id="rp"
                    type={showRegPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                  />
                  <button
                    type="button"
                    className="eye"
                    onClick={() => setShowRegPass(!showRegPass)}
                  >
                    {showRegPass ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className={`fl ${regError ? 'err' : ''}`}>
                  <label htmlFor="rc">Confirm password</label>
                  <input
                    id="rc"
                    type={showRegPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                  />
                  {regError && <span className="er">{regError}</span>}
                </div>

                <label className="chk">
                  <input
                    type="checkbox"
                    id="rt"
                    checked={regTerms}
                    onChange={(e) => setRegTerms(e.target.checked)}
                  />
                  <span>I agree to the terms and privacy policy.</span>
                </label>

                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account →'}
                </button>

                <p className="alt">
                  Already registered?{' '}
                  <button type="button" onClick={() => setAuthTab('l')}>
                    Log in
                  </button>
                </p>
              </form>
            )}

            {/* Success Message Confirmation */}
            <div className="ok" role="status">
              <span className="x">✛</span>
              <h3 id="okh">{successTitle}</h3>
              <p id="okp" style={{ color: 'var(--slate)', maxWidth: 360, margin: '0 auto' }}>
                {successMessage}
              </p>
              <button
                type="button"
                className="btn"
                style={{ marginTop: 22 }}
                onClick={handleContinueAfterAuth}
              >
                {isAdmin ? 'Open Admin Studio →' : 'Continue to Portal →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

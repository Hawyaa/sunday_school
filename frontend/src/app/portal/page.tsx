'use client';

/**
 * app/portal/page.tsx — Abune Media Member Portal (Design v3)
 *
 * Implements:
 * - Full responsive layout with sticky sidebar and header
 * - Dynamic view routing: Dashboard (home), Profile (prof), Notices (not),
 *   Attendance (att), Notifications (notif), Settings (set), Logout (out)
 * - Real session detection with fallback to student demo profile
 * - Interactive profile editing for contact and emergency details
 * - Interactive attendance ring chart, KPI cards, and history table
 * - Notice filtering by member group (Sunday School, Choir, or Both)
 * - Notification read / mark-all-read states
 * - Interactive switches for notifications and password change
 * - Mobile responsive drawer with backdrop overlay
 * - Interactive preview toolbar to test different student states
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, clearSession } from '@/lib/auth';
import './portal.css';

/* ── SVG Icons ─────────────────────────────────────────────────────────── */
const SVG_PATHS: Record<string, string> = {
  home: 'M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  check: 'M4 12l5 5L20 6M3 21h18',
  bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 21h4',
  gear: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-2-4-2 1-2-1V5h-4v2l-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1v2h4v-2l2-1 2 1 2-4-2-1z',
  out: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  lock: 'M6 11h12v9H6zM9 11V8a3 3 0 016 0v3',
};

function Icon({ name, style }: { name: string; style?: React.CSSProperties }) {
  const path = SVG_PATHS[name] || SVG_PATHS.home;
  return (
    <svg className="i" viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/* ── Types & Static Definitions ────────────────────────────────────────── */
type PortalView = 'home' | 'prof' | 'not' | 'att' | 'notif' | 'set' | 'out';
type MemberType = 's' | 'c' | 'b'; // Sunday School, Choir, Both

interface NotificationItem {
  id: string;
  t: string;
  s: string;
  w: string;
  r: number;
}

interface NoticeItem {
  id: string;
  t: string;
  g: string;
  d: string;
  m: string;
  r: number;
  forGroup?: 'all' | 's' | 'c';
}

const NAV_ITEMS: [PortalView, string, string][] = [
  ['home', 'home', 'Dashboard'],
  ['prof', 'user', 'My profile'],
  ['not', 'mail', 'My notices'],
  ['att', 'check', 'My attendance'],
  ['notif', 'bell', 'Notifications'],
  ['set', 'gear', 'Account settings'],
  ['out', 'out', 'Log out'],
];

export default function MemberPortalPage() {
  const router = useRouter();

  // Current view state
  const [cur, setCur] = useState<PortalView>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('');
  const [toastActive, setToastActive] = useState(false);

  // Student Profile Data
  const [studentName, setStudentName] = useState('Meron Tesfaye');
  const [christianName] = useState('ማርያም ወልደ');
  const [regNo, setRegNo] = useState('ABN-2026-0142');
  const [division, setDivision] = useState('Intermediate');
  const [phone, setPhone] = useState('+251 911 000 000');
  const [address, setAddress] = useState('Adama');
  const [kebele, setKebele] = useState('05 / 214');
  const [emergencyName, setEmergencyName] = useState('Almaz Haile');
  const [emergencyRel, setEmergencyRel] = useState('Mother');
  const [emergencyPhone, setEmergencyPhone] = useState('+251 922 000 000');

  // Preview simulation controls
  const [memberType, setMemberType] = useState<MemberType>('b');
  const [hasNotices, setHasNotices] = useState<'y' | 'n'>('y');
  const [deptAssigned, setDeptAssigned] = useState<'y' | 'n'>('y');
  const [hasAttendance, setHasAttendance] = useState<'y' | 'n'>('y');

  // Notification toggles in settings
  const [notifNotices, setNotifNotices] = useState(true);
  const [notifUpdates, setNotifUpdates] = useState(true);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', t: 'Your registration was approved', s: 'Account', w: '2 days ago', r: 0 },
    { id: '2', t: 'New notice: Choir practice time', s: 'My notices', w: 'Yesterday', r: 0 },
    { id: '3', t: 'Your phone number was updated', s: 'Account', w: '5 days ago', r: 1 },
  ]);

  // Sync with authenticated session if available
  useEffect(() => {
    const session = getSession();
    if (session?.user) {
      if (session.user.name) setStudentName(session.user.name);
      if (session.user.registrationNumber) setRegNo(session.user.registrationNumber);
      if (session.user.division) setDivision(session.user.division);
    }
  }, []);

  // Helper Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastActive(true);
    setTimeout(() => setToastActive(false), 2200);
  };

  // Label for current member type
  const getMemberLabel = (type = memberType) => {
    switch (type) {
      case 's': return 'Sunday School';
      case 'c': return 'Choir';
      case 'b': return 'Sunday School & Choir';
    }
  };

  // Computed unread counts
  const unreadNotifCount = notifications.filter((n) => !n.r).length;

  // Filtered notices
  const allNotices: NoticeItem[] = [
    {
      id: 'n1',
      t: 'Sunday School class starts at 9:00 AM',
      g: 'Sunday School',
      d: 'Meskerem 20',
      m: 'Please arrive 15 minutes early with your notebook and Bible.',
      r: 0,
      forGroup: 's',
    },
    {
      id: 'n2',
      t: 'Choir practice time updated',
      g: 'Choir',
      d: 'Meskerem 19',
      m: 'This week’s practice moves to Saturday afternoon in the main rehearsal hall.',
      r: 0,
      forGroup: 'c',
    },
    {
      id: 'n3',
      t: 'Reminder to keep your contact details current',
      g: 'All members',
      d: 'Meskerem 12',
      m: 'Use “Edit my details” on your profile if your address or emergency phone number has changed.',
      r: 1,
      forGroup: 'all',
    },
  ];

  const filteredNotices = hasNotices === 'n'
    ? []
    : allNotices.filter((n) => {
        if (n.forGroup === 'all') return true;
        if (memberType === 'b') return true;
        return n.forGroup === memberType;
      });

  const unreadNoticeCount = filteredNotices.filter((n) => !n.r).length;

  // Attendance Records
  const attendanceRaw: [string, number][] = [
    ['Meskerem 27', 0],
    ['Meskerem 20', 0],
    ['Meskerem 13', 1],
    ['Meskerem 6', 0],
    ['Nehase 29', 0],
    ['Nehase 22', 0],
    ['Nehase 15', 1],
    ['Nehase 8', 0],
  ];

  const attendanceRecords = hasAttendance === 'n'
    ? []
    : attendanceRaw.map(([date, isAbsent], idx) => {
        const sessionName =
          memberType === 'c' || (memberType === 'b' && idx % 2 === 1)
            ? 'Choir practice'
            : 'Sunday School session';
        return {
          date,
          session: sessionName,
          status: isAbsent ? 'Absent' : 'Present',
        };
      });

  const attendedCount = attendanceRecords.filter((r) => r.status === 'Present').length;
  const totalSessions = attendanceRecords.length;
  const absenceCount = totalSessions - attendedCount;
  const attendancePercent = totalSessions ? Math.round((attendedCount / totalSessions) * 100) : 0;

  // Navigation handler
  const navigateTo = (view: PortalView) => {
    setCur(view);
    if (view !== 'prof') setIsEditingProfile(false);
    setUserMenuOpen(false);
    setMobileOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, r: 1 })));
    showToast('All notifications marked as read');
  };

  const markSingleNotifRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, r: 1 } : n))
    );
  };

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const initials = studentName
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'MT';

  const firstName = studentName.split(' ')[0] || 'Meron';

  return (
    <div className="portal-root">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`portal-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Left Sidebar ──────────────────────────────────────────────── */}
      <aside className={mobileOpen ? 'open' : ''}>
        <Link href="/" className="logo">
          <b>አ</b>
          <div>
            <span>Abune Media</span>
            <small>MEMBER SPACE</small>
          </div>
        </Link>

        <nav className="nav-list">
          {NAV_ITEMS.map(([key, icon, label]) => {
            const isCurrent = cur === key;
            const badgeCount =
              key === 'notif' && unreadNotifCount
                ? unreadNotifCount
                : key === 'not' && unreadNoticeCount
                ? unreadNoticeCount
                : 0;

            return (
              <button
                key={key}
                type="button"
                className={`nv ${isCurrent ? 'on' : ''}`}
                onClick={() => navigateTo(key)}
              >
                <Icon name={icon} />
                <span>{label}</span>
                {badgeCount > 0 && <em>{badgeCount}</em>}
              </button>
            );
          })}
        </nav>

        <div className="verse">
          “Let the little children come to me, and do not hinder them.”
          <small>MATTHEW 19:14</small>
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────────────────────────── */}
      <div className="wrap">
        <header>
          {/* Mobile hamburger menu */}
          <button
            type="button"
            className="ib mob"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open navigation menu"
          >
            <svg className="i" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Back to main website pill */}
          <Link href="/" className="back" title="Go to the main Abune Media website">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            <span className="lg">Back to Main Website</span>
            <span className="sm">Main Website</span>
          </Link>

          {/* Greeting */}
          <div className="hi">
            Selam, <b>{firstName}</b>
          </div>

          <div className="sp" />

          {/* Notification Bell */}
          <button
            type="button"
            className="ib"
            onClick={() => navigateTo('notif')}
            title="Notifications"
          >
            <Icon name="bell" />
            {unreadNotifCount > 0 && <i>{unreadNotifCount}</i>}
          </button>

          {/* User Profile Avatar Dropdown */}
          <div className="dd">
            <div
              className="av"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              role="button"
              tabIndex={0}
              aria-label="Account menu"
            >
              {initials}
            </div>

            <div className={`menu ${userMenuOpen ? 'on' : ''}`}>
              <div className="who">
                <b style={{ color: 'var(--text)' }}>{studentName}</b>
                <br />
                {regNo}
              </div>
              <hr />
              <button type="button" onClick={() => navigateTo('prof')}>
                <Icon name="user" style={{ width: 16, height: 16 }} />
                My profile
              </button>
              <button type="button" onClick={() => navigateTo('set')}>
                <Icon name="gear" style={{ width: 16, height: 16 }} />
                Account settings
              </button>
              <hr />
              <button
                type="button"
                onClick={() => navigateTo('out')}
                style={{ color: 'var(--red)' }}
              >
                <Icon name="out" style={{ width: 16, height: 16 }} />
                Log out
              </button>
            </div>
          </div>
        </header>

        {/* ── Dynamic Main View ────────────────────────────────────────── */}
        <main id="view">
          {/* 1. DASHBOARD VIEW (home) */}
          {cur === 'home' && (
            <div>
              <div className="hero">
                <div className="av">{initials}</div>
                <div>
                  <small>{getMemberLabel().toUpperCase()} MEMBER</small>
                  <h1>Welcome back, {firstName}</h1>
                  <p>Glad to see you again. Here’s your personal student space.</p>
                </div>
              </div>

              {/* 4 Summary Cards */}
              <div className="grid g4">
                <div className="card info">
                  <small>Registration no.</small>
                  <b>{regNo}</b>
                </div>
                <div className="card info">
                  <small>Status</small>
                  <b>
                    <span className="tag pub" style={{ font: '600 12px Inter, sans-serif' }}>
                      Approved
                    </span>
                  </b>
                </div>
                <div className="card info">
                  <small>Division / group</small>
                  <b>
                    {division} · {getMemberLabel()}
                  </b>
                </div>
                {deptAssigned === 'y' && (
                  <div className="card info">
                    <small>Department / class</small>
                    <b>Mezmur · Mezmur A</b>
                  </div>
                )}
              </div>

              {/* Split 2-column Content */}
              <div className="grid g2" style={{ marginTop: 22 }}>
                <div>
                  <div className="sh">
                    <h2>My notices</h2>
                    <a onClick={() => navigateTo('not')}>Open →</a>
                  </div>
                  <div className="grid">
                    {filteredNotices.length > 0 ? (
                      filteredNotices.slice(0, 2).map((n) => (
                        <div key={n.id} className={`card notice ${n.r ? 'rd' : ''}`}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className="tag bl">{n.g}</span>
                            <small style={{ color: 'var(--slate)' }}>{n.d}</small>
                            {!n.r && <span className="tag dr">New</span>}
                          </div>
                          <h3 style={{ fontSize: 22, margin: '8px 0 4px' }}>{n.t}</h3>
                          <p style={{ color: 'var(--slate)' }}>{n.m}</p>
                        </div>
                      ))
                    ) : (
                      <div className="empty">
                        <Icon name="mail" />
                        <b>No notices for you right now</b>
                        Notices for {getMemberLabel()} members will appear here.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="sh">
                    <h2>My attendance</h2>
                    <a onClick={() => navigateTo('att')}>Open →</a>
                  </div>
                  <div className="card">
                    {totalSessions > 0 ? (
                      <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div
                          className="ring"
                          style={{
                            background: `conic-gradient(var(--gold) ${attendancePercent * 3.6}deg, var(--sky) 0)`,
                          }}
                        >
                          <div>{attendancePercent}%</div>
                        </div>
                        <div
                          className="kv"
                          style={{ flex: 1, gap: 10, gridTemplateColumns: 'repeat(3, 1fr)' }}
                        >
                          <div>
                            <small>Sessions</small>
                            <b>{totalSessions}</b>
                          </div>
                          <div>
                            <small>Attended</small>
                            <b>{attendedCount}</b>
                          </div>
                          <div>
                            <small>Absent</small>
                            <b>{absenceCount}</b>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="empty" style={{ padding: 22 }}>
                        <Icon name="check" />
                        <b style={{ fontSize: 20 }}>No attendance recorded yet</b>
                        Your attendance will appear here after roll-call begins.
                      </div>
                    )}
                  </div>

                  <div className="sh" style={{ marginTop: 22 }}>
                    <h2>Recent notifications</h2>
                    <a onClick={() => navigateTo('notif')}>Open →</a>
                  </div>
                  <div className="card" style={{ padding: '4px 20px' }}>
                    {notifications.slice(0, 3).map((n) => (
                      <div key={n.id} className={`nt ${n.r ? 'rd' : ''}`}>
                        <i className="d" />
                        <div>
                          <b>{n.t}</b>
                          <small>{n.w}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILE VIEW (prof) */}
          {cur === 'prof' && (
            <div>
              <div className="pt">
                <h1>My profile</h1>
                <p>Your registration information and church records.</p>
              </div>

              <div
                className="card"
                style={{
                  display: 'flex',
                  gap: 18,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: 16,
                }}
              >
                <div className="av" style={{ width: 84, height: 84, fontSize: 32 }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 34 }}>{studentName}</h2>
                  <span className="am" style={{ color: 'var(--ochre)' }}>
                    {christianName}
                  </span>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <span className="tag pub">Approved</span>
                    <span className="tag bl">{getMemberLabel()}</span>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button
                    type="button"
                    className="btn g"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Edit my details
                  </button>
                )}
              </div>

              <div className="grid g2">
                {/* Personal Information (Locked) */}
                <div className="card">
                  <h3 style={{ fontSize: 24, marginBottom: 12 }}>Personal</h3>
                  <div className="kv">
                    <div>
                      <small>
                        Full name{' '}
                        <span className="lk">
                          <Icon name="lock" style={{ width: 11, height: 11 }} />
                        </span>
                      </small>
                      {studentName}
                    </div>
                    <div>
                      <small>
                        Christian name{' '}
                        <span className="lk">
                          <Icon name="lock" style={{ width: 11, height: 11 }} />
                        </span>
                      </small>
                      {christianName}
                    </div>
                    <div>
                      <small>
                        Registration no.{' '}
                        <span className="lk">
                          <Icon name="lock" style={{ width: 11, height: 11 }} />
                        </span>
                      </small>
                      {regNo}
                    </div>
                    <div>
                      <small>
                        Gender{' '}
                        <span className="lk">
                          <Icon name="lock" style={{ width: 11, height: 11 }} />
                        </span>
                      </small>
                      Female
                    </div>
                    <div>
                      <small>
                        Date of birth{' '}
                        <span className="lk">
                          <Icon name="lock" style={{ width: 11, height: 11 }} />
                        </span>
                      </small>
                      12 Mar 2010
                    </div>
                    <div>
                      <small>Age</small>
                      16
                    </div>
                    <div>
                      <small>
                        Division{' '}
                        <span className="lk">
                          <Icon name="lock" style={{ width: 11, height: 11 }} />
                        </span>
                      </small>
                      {division}
                    </div>
                    <div>
                      <small>
                        Registration type{' '}
                        <span className="lk">
                          <Icon name="lock" style={{ width: 11, height: 11 }} />
                        </span>
                      </small>
                      Long term
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card">
                  <h3 style={{ fontSize: 24, marginBottom: 12 }}>
                    Contact {isEditingProfile && <span className="tag dr">editing</span>}
                  </h3>
                  {isEditingProfile ? (
                    <div>
                      <label>Phone</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 911 000 000"
                      />
                      <label>Address</label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="City / Region"
                      />
                      <label>Kebele / house no.</label>
                      <input
                        value={kebele}
                        onChange={(e) => setKebele(e.target.value)}
                        placeholder="05 / 214"
                      />
                    </div>
                  ) : (
                    <div className="kv">
                      <div>
                        <small>Phone</small>
                        {phone}
                      </div>
                      <div>
                        <small>Address</small>
                        {address}
                      </div>
                      <div>
                        <small>Kebele / house no.</small>
                        {kebele}
                      </div>
                    </div>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="card">
                  <h3 style={{ fontSize: 24, marginBottom: 12 }}>
                    Emergency contact {isEditingProfile && <span className="tag dr">editing</span>}
                  </h3>
                  {isEditingProfile ? (
                    <div>
                      <label>Name</label>
                      <input
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                      />
                      <label>Relationship</label>
                      <input
                        value={emergencyRel}
                        onChange={(e) => setEmergencyRel(e.target.value)}
                      />
                      <label>Phone</label>
                      <input
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="kv">
                      <div>
                        <small>Name</small>
                        {emergencyName}
                      </div>
                      <div>
                        <small>Relationship</small>
                        {emergencyRel}
                      </div>
                      <div>
                        <small>Phone</small>
                        {emergencyPhone}
                      </div>
                    </div>
                  )}
                </div>

                {/* Parent / Guardian Information */}
                <div className="card">
                  <h3 style={{ fontSize: 24, marginBottom: 12 }}>Parent / guardian</h3>
                  <div className="kv">
                    <div>
                      <small>
                        Name{' '}
                        <span className="lk">
                          <Icon name="lock" style={{ width: 11, height: 11 }} />
                        </span>
                      </small>
                      {emergencyName}
                    </div>
                    <div>
                      <small>
                        Consent{' '}
                        <span className="lk">
                          <Icon name="lock" style={{ width: 11, height: 11 }} />
                        </span>
                      </small>
                      Given
                    </div>
                  </div>
                  <p style={{ color: 'var(--slate)', fontSize: 12, marginTop: 12 }}>
                    Shown only for members under 18 years of age.
                  </p>
                </div>
              </div>

              {isEditingProfile && (
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button
                    type="button"
                    className="btn g"
                    onClick={() => {
                      setIsEditingProfile(false);
                      showToast('Profile updated successfully');
                    }}
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="btn o"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}

              <p
                style={{
                  color: 'var(--slate)',
                  fontSize: 12,
                  marginTop: 16,
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                }}
              >
                <Icon name="lock" style={{ width: 13, height: 13 }} />
                Locked fields are managed by the administration. Contact the church administration to change them.
              </p>
            </div>
          )}

          {/* 3. NOTICES VIEW (not) */}
          {cur === 'not' && (
            <div>
              <div className="pt">
                <h1>My notices</h1>
                <p>Messages meant for {getMemberLabel()} members. Others never see them.</p>
              </div>

              {filteredNotices.length > 0 ? (
                <div className="grid">
                  {filteredNotices.map((n) => (
                    <div key={n.id} className={`card notice ${n.r ? 'rd' : ''}`}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="tag bl">{n.g}</span>
                        <small style={{ color: 'var(--slate)' }}>{n.d}</small>
                        {!n.r && <span className="tag dr">New</span>}
                      </div>
                      <h3 style={{ fontSize: 24, margin: '8px 0 4px' }}>{n.t}</h3>
                      <p style={{ color: 'var(--slate)', lineHeight: 1.6 }}>{n.m}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <Icon name="mail" />
                  <b>No notices for you right now</b>
                  Notices for {getMemberLabel()} members will appear here.
                </div>
              )}
            </div>
          )}

          {/* 4. ATTENDANCE VIEW (att) */}
          {cur === 'att' && (
            <div>
              <div className="pt">
                <h1>My attendance</h1>
                <p>Recorded by your Sunday School and Choir teachers at roll-call.</p>
              </div>

              {totalSessions > 0 ? (
                <>
                  <div className="grid g4" style={{ marginBottom: 16 }}>
                    <div className="card info">
                      <small>Total sessions</small>
                      <b>{totalSessions}</b>
                    </div>
                    <div className="card info">
                      <small>Attended</small>
                      <b>{attendedCount}</b>
                    </div>
                    <div className="card info">
                      <small>Absences</small>
                      <b>{absenceCount}</b>
                    </div>
                    <div className="card info">
                      <small>Attendance</small>
                      <b>{attendancePercent}%</b>
                    </div>
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: 24, marginBottom: 12 }}>History</h3>
                    <div className="tw">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Session</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceRecords.map((r, i) => (
                            <tr key={i}>
                              <td>{r.date}</td>
                              <td>{r.session}</td>
                              <td>
                                <span className={`tag ${r.status === 'Present' ? 'pub' : 'rd2'}`}>
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty">
                  <Icon name="check" />
                  <b>No attendance recorded yet</b>
                  Your sessions will appear here once roll-call starts. Nothing is shown until real records exist.
                </div>
              )}
            </div>
          )}

          {/* 5. NOTIFICATIONS VIEW (notif) */}
          {cur === 'notif' && (
            <div>
              <div
                className="pt"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div>
                  <h1>Notifications</h1>
                  <p>Updates about your registration, approvals, and member groups.</p>
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    type="button"
                    className="btn o s"
                    onClick={markAllNotifsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="card" style={{ padding: '6px 22px' }}>
                {notifications.map((n) => (
                  <div key={n.id} className={`nt ${n.r ? 'rd' : ''}`}>
                    <i className="d" />
                    <div style={{ flex: 1 }}>
                      <b>{n.t}</b>
                      <small>
                        {n.s} · {n.w}
                      </small>
                    </div>
                    {!n.r && (
                      <button
                        type="button"
                        className="btn o s"
                        onClick={() => markSingleNotifRead(n.id)}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. SETTINGS VIEW (set) */}
          {cur === 'set' && (
            <div>
              <div className="pt">
                <h1>Account settings</h1>
                <p>Password, account details and member notification preferences.</p>
              </div>

              <div className="grid g2">
                <div className="card">
                  <h3 style={{ fontSize: 24, marginBottom: 8 }}>Account</h3>
                  <div className="kv">
                    <div>
                      <small>Name</small>
                      {studentName}
                    </div>
                    <div>
                      <small>Registration no.</small>
                      {regNo}
                    </div>
                    <div>
                      <small>Member group</small>
                      {getMemberLabel()}
                    </div>
                  </div>

                  <h3 style={{ fontSize: 24, margin: '20px 0 4px' }}>Notifications</h3>
                  <div className="row">
                    <span>New notices for me</span>
                    <span
                      className={`sw ${notifNotices ? 'on' : ''}`}
                      onClick={() => setNotifNotices(!notifNotices)}
                      role="switch"
                      aria-checked={notifNotices}
                    />
                  </div>
                  <div className="row">
                    <span>Account updates</span>
                    <span
                      className={`sw ${notifUpdates ? 'on' : ''}`}
                      onClick={() => setNotifUpdates(!notifUpdates)}
                      role="switch"
                      aria-checked={notifUpdates}
                    />
                  </div>

                  <p style={{ color: 'var(--slate)', fontSize: 12, marginTop: 14 }}>
                    Need help with your account? Contact the church administration office.
                  </p>
                  <button
                    type="button"
                    className="btn o"
                    style={{ marginTop: 14 }}
                    onClick={() => navigateTo('out')}
                  >
                    Log out
                  </button>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: 24, marginBottom: 4 }}>Change password</h3>
                  <label>Current password</label>
                  <input type="password" placeholder="••••••••" />
                  <label>New password</label>
                  <input type="password" placeholder="At least 6 characters" />
                  <label>Confirm new password</label>
                  <input type="password" placeholder="Confirm new password" />
                  <button
                    type="button"
                    className="btn g"
                    style={{ marginTop: 18 }}
                    onClick={() => showToast('Password updated successfully')}
                  >
                    Update password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. LOG OUT VIEW (out) */}
          {cur === 'out' && (
            <div className="empty" style={{ marginTop: 60, maxWidth: 540, margin: '60px auto 0' }}>
              <Icon name="out" style={{ width: 36, height: 36, margin: '0 auto 8px' }} />
              <b style={{ fontSize: 28 }}>Log out of Abune Media?</b>
              <p style={{ margin: '10px 0 20px', color: 'var(--slate)' }}>
                You will return to the login page and your current student session will end.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button type="button" className="btn g" onClick={handleLogout}>
                  Yes, log out
                </button>
                <button type="button" className="btn o" onClick={() => navigateTo('home')}>
                  Stay in portal
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Interactive Preview Simulator (Fixed at Bottom-Right) ──────── */}
      <aside className="pv" aria-label="Portal interactive simulator">
        <b>DESIGN PREVIEW ONLY</b>
        <label>
          Member
          <select
            value={memberType}
            onChange={(e) => setMemberType(e.target.value as MemberType)}
          >
            <option value="s">Sunday School</option>
            <option value="c">Choir</option>
            <option value="b">Both</option>
          </select>
        </label>
        <label>
          Notices
          <select
            value={hasNotices}
            onChange={(e) => setHasNotices(e.target.value as 'y' | 'n')}
          >
            <option value="y">Some</option>
            <option value="n">None</option>
          </select>
        </label>
        <label>
          Official dept.
          <select
            value={deptAssigned}
            onChange={(e) => setDeptAssigned(e.target.value as 'y' | 'n')}
          >
            <option value="n">Not assigned</option>
            <option value="y">Assigned</option>
          </select>
        </label>
        <label>
          Attendance
          <select
            value={hasAttendance}
            onChange={(e) => setHasAttendance(e.target.value as 'y' | 'n')}
          >
            <option value="n">No records yet</option>
            <option value="y">Has records</option>
          </select>
        </label>
      </aside>

      {/* ── Toast notification feedback ────────────────────────────────── */}
      <div className={`toast ${toastActive ? 'on' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
}

'use client';

/**
 * Abune Media – Admin & Super Admin Studio
 *
 * Implements the complete design preview specification:
 * - Dynamic Admin vs Super Admin role switcher & automatic session detection
 * - Collapsible sidebar (desktop compact 66px mode + mobile drawer)
 * - All modules: Overview, Platform Overview, Registrations, Students & Members,
 *   Departments & Classes (Coming Soon), Import/Export, Pages & Sections,
 *   Announcements, Events, Media & Gallery, Teachings & Mezmur, Reports,
 *   Live Stream (Coming Soon), Contact Messages, Member Notices,
 *   Administrators, Roles & Permissions, Audit Log, Platform Settings,
 *   System Monitoring, and My Account.
 * - Interactive modals, switches, permission checkboxes, and filters.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, clearSession } from '@/lib/auth';
import './admin.css';

// Type definitions
type ViewKey =
  | 'ov'
  | 'pov'
  | 'reg'
  | 'mem'
  | 'dep'
  | 'imp'
  | 'pag'
  | 'ann'
  | 'evt'
  | 'med'
  | 'tea'
  | 'rep'
  | 'liv'
  | 'msg'
  | 'not'
  | 'adm'
  | 'rol'
  | 'aud'
  | 'set'
  | 'sys'
  | 'acc';

interface NavItem {
  id: ViewKey;
  icon: string;
  label: string;
  badge?: string;
  superOnly?: boolean;
}

interface NavGroup {
  type: 'G';
  title: string;
  superOnly?: boolean;
}

type NavEntry = NavGroup | (NavItem & { type?: never });

const NAV_STRUCTURE: NavEntry[] = [
  { type: 'G', title: 'Overview' },
  { id: 'ov', icon: '📊', label: 'Overview' },
  { id: 'pov', icon: '🛡', label: 'Platform overview', superOnly: true },

  { type: 'G', title: 'Members' },
  { id: 'reg', icon: '📝', label: 'Registrations', badge: '5' },
  { id: 'mem', icon: '👥', label: 'Students & members' },
  { id: 'dep', icon: '🏛', label: 'Departments & classes', badge: 'SOON' },
  { id: 'imp', icon: '📥', label: 'Import / Export' },

  { type: 'G', title: 'Website' },
  { id: 'pag', icon: '📄', label: 'Pages & sections' },
  { id: 'ann', icon: '📣', label: 'Announcements' },
  { id: 'evt', icon: '📅', label: 'Events' },
  { id: 'med', icon: '🖼', label: 'Media & gallery' },
  { id: 'tea', icon: '📖', label: 'Teachings & mezmur' },
  { id: 'rep', icon: '📑', label: 'Reports' },
  { id: 'liv', icon: '🔴', label: 'Live stream', badge: 'SOON' },
  { id: 'msg', icon: '✉️', label: 'Contact messages', badge: '3' },

  { type: 'G', title: 'Portal' },
  { id: 'not', icon: '🔔', label: 'Member notices' },

  { type: 'G', title: 'Platform', superOnly: true },
  { id: 'adm', icon: '👤', label: 'Administrators', superOnly: true },
  { id: 'rol', icon: '🔑', label: 'Roles & permissions', superOnly: true },
  { id: 'aud', icon: '🧾', label: 'Audit log', superOnly: true },
  { id: 'set', icon: '⚙️', label: 'Platform settings', superOnly: true },
  { id: 'sys', icon: '🩺', label: 'System monitoring', superOnly: true },

  { type: 'G', title: 'Account' },
  { id: 'acc', icon: '🙍', label: 'My account' },
];

const SUPER_ONLY_VIEWS: ViewKey[] = ['pov', 'adm', 'rol', 'aud', 'set', 'sys'];

export default function AdminPage() {
  const router = useRouter();

  // Authentication & session state
  const [userName, setUserName] = useState<string>('Hawi');
  const [userEmail, setUserEmail] = useState<string>('hawi@abunemedia.org');
  const [isSuper, setIsSuper] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ViewKey>('ov');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Confirmation Modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('Confirm');
  const [modalPrompt, setModalPrompt] = useState<string>('');
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);

  // Initialize session from login
  useEffect(() => {
    const session = getSession();
    if (session?.user) {
      if (session.user.name) setUserName(session.user.name);
      if (session.user.email) setUserEmail(session.user.email);
      const isSuperUser = Boolean(
        session.user.backendRole === 'SUPER_ADMIN' ||
        session.user.name.toLowerCase().includes('super') ||
        session.user.email?.toLowerCase().includes('admin')
      );
      setIsSuper(isSuperUser);
      setActiveView(isSuperUser ? 'pov' : 'ov');
    }
  }, []);

  // Switch role handler
  const switchRole = (toSuper: boolean) => {
    setIsSuper(toSuper);
    if (toSuper) {
      if (activeView === 'ov') setActiveView('pov');
    } else {
      if (SUPER_ONLY_VIEWS.includes(activeView)) setActiveView('ov');
    }
  };

  const handleNavClick = (view: ViewKey) => {
    if (!isSuper && SUPER_ONLY_VIEWS.includes(view)) {
      setActiveView('ov');
    } else {
      setActiveView(view);
    }
    setMobileOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ask = (title: string, prompt: string, action?: () => void) => {
    setModalTitle(title);
    setModalPrompt(prompt);
    setModalAction(() => action || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAction(null);
  };

  const confirmModal = () => {
    if (modalAction) modalAction();
    closeModal();
  };

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  // Reusable Tag helper
  const renderTag = (variant: 'pub' | 'dr' | 'un' | 'bl' | 'rd' | 'fe', text: string) => (
    <span className={`tag ${variant}`}>{text}</span>
  );

  return (
    <div className={`admin-layout ${isSuper ? 'super' : ''} ${collapsed ? 'col' : ''}`}>
      {/* ── Left Sidebar ────────────────────────────────────────────── */}
      <aside id="side" className={mobileOpen ? 'open' : ''}>
        <Link href="/" className="logo" title="Visit public website">
          <b className="am">አ</b>
          <div>
            <span>Abune Media</span>
            <small>CONTENT STUDIO</small>
          </div>
        </Link>

        <div className="badge">{isSuper ? 'SUPER ADMIN' : 'ADMIN'}</div>

        <nav style={{ flex: 1 }}>
          {NAV_STRUCTURE.map((item, idx) => {
            if ('type' in item && item.type === 'G') {
              if (item.superOnly && !isSuper) return null;
              return (
                <div key={`grp-${idx}`} className="grp">
                  {item.title}
                </div>
              );
            }

            const navItem = item as NavItem;
            if (navItem.superOnly && !isSuper) return null;
            if (!isSuper && navItem.id === 'pov') return null;
            if (isSuper && navItem.id === 'ov') return null;

            const isCurrent = activeView === navItem.id;

            return (
              <button
                key={navItem.id}
                type="button"
                className={`nav-btn ${isCurrent ? 'on' : ''}`}
                onClick={() => handleNavClick(navItem.id)}
              >
                <u>{navItem.icon}</u>
                <span>{navItem.label}</span>
                {navItem.badge && (
                  navItem.badge === 'SOON' ? (
                    <em>{navItem.badge}</em>
                  ) : (
                    <i>{navItem.badge}</i>
                  )
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer actions inside sidebar */}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link
            href="/"
            className="nav-btn"
            style={{ fontSize: 13, color: '#e3eef8', marginBottom: 4 }}
            title="View the public website in a new tab"
            target="_blank"
          >
            <u>🌐</u>
            <span>Live Website</span>
            <em>↗</em>
          </Link>
          <button
            type="button"
            className="nav-btn"
            style={{ fontSize: 13, color: '#f8dcdc' }}
            onClick={() => ask('Sign Out', 'Are you sure you want to log out of the administration studio?', handleLogout)}
          >
            <u>🚪</u>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <main>
        {/* Sticky Top Header */}
        <header>
          {/* Mobile menu button */}
          <button
            type="button"
            className="ib mob"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>

          {/* Sidebar collapse button */}
          <button
            type="button"
            className="ib"
            onClick={() => setCollapsed(!collapsed)}
            title="Toggle sidebar collapse"
          >
            {collapsed ? '⇥' : '⇤'}
          </button>

          {/* Quick search input */}
          <input
            className="search"
            placeholder="Search anything…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search across portal"
          />

          {/* Role Switcher Segmented Control */}
          <div className="seg" id="role" role="group" aria-label="Role selector">
            <button
              type="button"
              className={!isSuper ? 'on' : ''}
              onClick={() => switchRole(false)}
            >
              Admin
            </button>
            <button
              type="button"
              className={isSuper ? 'on' : ''}
              onClick={() => switchRole(true)}
            >
              Super Admin
            </button>
          </div>

          {/* Notification Bell */}
          <span
            className="bell"
            title="5 notifications"
            onClick={() => ask('Notifications', 'You have 5 pending registrations awaiting approval and 3 unread messages.')}
          >
            🔔
          </span>

          {/* User Profile Avatar */}
          <button
            type="button"
            className="av"
            title={`${userName} (${isSuper ? 'Super Admin' : 'Admin'})`}
            onClick={() => handleNavClick('acc')}
            style={{ border: 0, cursor: 'pointer' }}
          >
            {userName.charAt(0).toUpperCase()}
          </button>
        </header>

        {/* View Container */}
        <div className="pad">
          {/* 1. ADMIN OVERVIEW (ov) */}
          {activeView === 'ov' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Welcome back, {userName}</h1>
                  <p>Everyday overview of members and website content.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn o" onClick={() => handleNavClick('reg')}>
                    Review registrations
                  </button>
                  <button className="btn g" onClick={() => handleNavClick('ann')}>
                    + Announcement
                  </button>
                </div>
              </div>

              {/* Stat Cards Row 1 */}
              <div className="grid g4">
                <div className="card stat w">
                  <small>Total members</small>
                  <b>312</b>
                  <em>students &amp; choir</em>
                </div>
                <div className="card stat">
                  <small>Pending</small>
                  <b style={{ color: 'var(--ochre)' }}>5</b>
                  <em>awaiting review</em>
                </div>
                <div className="card stat">
                  <small>Approved / Rejected</small>
                  <b>303 / 4</b>
                </div>
                <div className="card stat">
                  <small>Active / Inactive</small>
                  <b>268 / 35</b>
                </div>
              </div>

              {/* Stat Cards Row 2 */}
              <div className="grid g4" style={{ marginTop: 14 }}>
                <div className="card stat">
                  <small>Published announcements</small>
                  <b>18</b>
                </div>
                <div className="card stat">
                  <small>Upcoming events</small>
                  <b>6</b>
                </div>
                <div className="card stat">
                  <small>Media items</small>
                  <b>142</b>
                </div>
                <div className="card stat">
                  <small>Unread messages</small>
                  <b>3</b>
                </div>
              </div>

              {/* Charts & Breakdown Row */}
              <div className="grid g3" style={{ marginTop: 14 }}>
                <div className="card">
                  <h3>Registrations (monthly)</h3>
                  <TrendChart />
                </div>
                <div className="card">
                  <h3>By age group</h3>
                  <BarRow label="Children <15" value={118} max={130} />
                  <BarRow label="Middle 15–17" value={74} max={130} />
                  <BarRow label="Adults 18+" value={115} max={130} />
                  <h3 style={{ marginTop: 16 }}>By division</h3>
                  <BarRow label="Children" value={121} max={130} />
                  <BarRow label="Intermediate" value={70} max={130} />
                  <BarRow label="Youth" value={116} max={130} />
                </div>
                <div className="card">
                  <h3>By department</h3>
                  <BarRow label="Timhirt" value={164} max={170} />
                  <BarRow label="Mezmur" value={96} max={170} />
                  <BarRow label="Kine Tibeb" value={41} max={170} />
                  <small style={{ color: 'var(--slate)', display: 'block', margin: '4px 0 12px' }}>
                    Confirmed assignments only
                  </small>
                  <h3>Approval status</h3>
                  <BarRow label="Approved" value={303} max={310} />
                  <BarRow label="Pending" value={5} max={310} />
                  <BarRow label="Rejected" value={4} max={310} />
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid g2" style={{ marginTop: 14 }}>
                <div className="card">
                  <h3>Quick actions</h3>
                  <div className="chips">
                    <button className="chip" onClick={() => handleNavClick('evt')}>+ Event</button>
                    <button className="chip" onClick={() => handleNavClick('ann')}>+ Announcement</button>
                    <button className="chip" onClick={() => handleNavClick('not')}>+ Member notice</button>
                    <button className="chip" onClick={() => handleNavClick('med')}>Upload media</button>
                    <button className="chip" onClick={() => handleNavClick('mem')}>+ Student</button>
                  </div>
                  <h3 style={{ marginTop: 16 }}>Your access</h3>
                  <div className="chips">
                    {['Members', 'Announcements', 'Events', 'Media', 'Messages'].map((x) => (
                      <span key={x} className="tag pub" style={{ marginRight: 6 }}>
                        ✓ {x}
                      </span>
                    ))}
                    <span className="tag un" style={{ marginRight: 6 }}>✕ Users &amp; roles</span>
                    <span className="tag un">✕ Audit log</span>
                  </div>
                </div>

                <div className="card">
                  <h3>Recent activity</h3>
                  {[
                    ['Selam published “Feast of the Holy Cross”', '12 min ago'],
                    ['Hawi approved Meron Tesfaye', '2 h ago'],
                    ['Yonas uploaded 6 gallery images', 'Yesterday'],
                  ].map((r, i) => (
                    <div key={i} className="row">
                      <div>
                        <b>{r[0]}</b>
                        <small>{r[1]}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. SUPER ADMIN PLATFORM OVERVIEW (pov) */}
          {activeView === 'pov' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Platform overview</h1>
                  <p>Everything above, plus administrators and system health.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn o" onClick={() => handleNavClick('aud')}>
                    Audit log
                  </button>
                  <button className="btn g" onClick={() => handleNavClick('adm')}>
                    + Administrator
                  </button>
                </div>
              </div>

              <div className="grid g4">
                <div className="card stat w">
                  <small>Administrators</small>
                  <b>6</b>
                  <em>5 active · 1 suspended</em>
                </div>
                <div className="card stat">
                  <small>Members</small>
                  <b>312</b>
                  <em>5 pending</em>
                </div>
                <div className="card stat">
                  <small>Published content</small>
                  <b>24</b>
                  <em>18 ann. · 6 events</em>
                </div>
                <div className="card stat">
                  <small>Media items</small>
                  <b>142</b>
                </div>
              </div>

              <div className="grid g2" style={{ marginTop: 14 }}>
                <div className="card">
                  <h3>System alerts</h3>
                  <div className="row">
                    <div>
                      <span className="dot" style={{ background: 'var(--red)' }} />
                      Admin “Rahel B.” had 5 failed logins
                      <small>Security · 1 h ago</small>
                    </div>
                    <button className="btn o s" onClick={() => handleNavClick('adm')}>
                      Review
                    </button>
                  </div>
                  <div className="row">
                    <div>
                      <span className="dot" style={{ background: 'var(--gold)' }} />
                      Media storage at 78%
                      <small>Storage</small>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3>Recent platform activity</h3>
                  {[
                    ['Hawi changed Selam’s role', 'Today'],
                    ['Selam deleted gallery image', 'Today'],
                    ['Hawi exported 268 students', 'Yesterday'],
                  ].map((r, i) => (
                    <div key={i} className="row">
                      <div>
                        <b>{r[0]}</b>
                        <small>{r[1]}</small>
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn o s"
                    style={{ marginTop: 12 }}
                    onClick={() => handleNavClick('aud')}
                  >
                    Open audit log
                  </button>
                </div>
              </div>

              <div className="card" style={{ marginTop: 14 }}>
                <h3>Registrations (monthly)</h3>
                <TrendChart />
              </div>
            </div>
          )}

          {/* 3. REGISTRATIONS (reg) */}
          {activeView === 'reg' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Registration requests</h1>
                  <p>Review public registrations before they become official members.</p>
                </div>
              </div>

              <div className="chips">
                <button className="chip on">Pending (5)</button>
                <button className="chip">Approved (303)</button>
                <button className="chip">Rejected (4)</button>
              </div>

              <div
                className="grid"
                style={{ gridTemplateColumns: 'minmax(250px, 1fr) minmax(300px, 1.3fr)' }}
              >
                <div className="card" style={{ padding: '4px 14px' }}>
                  {[
                    ['Meron Tesfaye', 'Intermediate', '2 days ago'],
                    ['Dawit Alemu', 'Children', '3 days ago'],
                    ['Kidus Worku', 'Youth', '4 days ago'],
                    ['Selam Tadesse', 'Children', '5 days ago'],
                    ['Abel Hailu', 'Youth', '6 days ago'],
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="row"
                      style={
                        i === 0
                          ? { background: 'var(--sky)', margin: '0 -14px', padding: '9px 14px' }
                          : undefined
                      }
                    >
                      <div>
                        <b>{item[0]}</b>
                        <small>{item[1]} · {item[2]}</small>
                      </div>
                      {renderTag('dr', 'Pending')}
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h3>Meron Tesfaye</h3>
                  <div className="note w">Possible duplicate: “Meron Tesfay”, same phone number.</div>

                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <small style={{ color: 'var(--slate)', textTransform: 'uppercase', fontSize: 11, fontWeight: 600 }}>
                        Division
                      </small>
                      <br />
                      Intermediate
                    </div>
                    <div>
                      <small style={{ color: 'var(--slate)', textTransform: 'uppercase', fontSize: 11, fontWeight: 600 }}>
                        Age / DOB
                      </small>
                      <br />
                      16 · 12 Mar 2010
                    </div>
                    <div>
                      <small style={{ color: 'var(--slate)', textTransform: 'uppercase', fontSize: 11, fontWeight: 600 }}>
                        Preferred dept.
                      </small>
                      <br />
                      Mezmur <span className="tag un">preference only</span>
                    </div>
                    <div>
                      <small style={{ color: 'var(--slate)', textTransform: 'uppercase', fontSize: 11, fontWeight: 600 }}>
                        Guardian
                      </small>
                      <br />
                      Almaz Haile ✓
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                    <button
                      className="btn g"
                      onClick={() =>
                        ask(
                          'Approve registration?',
                          'Creates one official member record. Duplicates are checked first.'
                        )
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="btn r"
                      onClick={() =>
                        ask(
                          'Reject registration?',
                          'A reason is required and will be sent to the applicant.'
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. STUDENTS & MEMBERS (mem) */}
          {activeView === 'mem' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Students &amp; members</h1>
                  <p>Sunday School students and choir members.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn o" onClick={() => handleNavClick('imp')}>
                    Export
                  </button>
                  <button
                    className="btn g"
                    onClick={() => ask('Add Member', 'Add a student or choir member manually.')}
                  >
                    + Add member
                  </button>
                </div>
              </div>

              <div className="fl">
                <input placeholder="Name, Christian name, reg. no., phone…" />
                <select><option>Division</option><option>Children</option><option>Intermediate</option><option>Youth</option></select>
                <select><option>Age group</option><option>Children &lt;15</option><option>Middle 15–17</option><option>Adults 18+</option></select>
                <select><option>Department</option><option>Timhirt</option><option>Mezmur</option><option>Kine Tibeb</option></select>
                <select><option>Class</option></select>
                <select><option>Status</option><option>Active</option><option>Inactive</option></select>
              </div>

              <div className="card wrap" style={{ padding: '6px 10px' }}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 30 }}><input type="checkbox" /></th>
                      <th>Name</th>
                      <th>Reg. no.</th>
                      <th>Division</th>
                      <th>Age group</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hv">
                      <td><input type="checkbox" /></td>
                      <td><b>Meron Tesfaye</b></td>
                      <td>ABN-2026-0142</td>
                      <td>Intermediate</td>
                      <td>Middle</td>
                      <td><span className="tag un">none yet</span></td>
                      <td>{renderTag('pub', 'Active')}</td>
                    </tr>
                    <tr className="hv">
                      <td><input type="checkbox" /></td>
                      <td><b>Hana Bekele</b></td>
                      <td>ABN-2026-0139</td>
                      <td>Youth</td>
                      <td>Adults</td>
                      <td>Kine Tibeb, Mezmur</td>
                      <td>{renderTag('pub', 'Active')}</td>
                    </tr>
                    <tr className="hv">
                      <td><input type="checkbox" /></td>
                      <td><b>Samuel Girma</b></td>
                      <td>ABN-2026-0133</td>
                      <td>Intermediate</td>
                      <td>Children</td>
                      <td>Timhirt</td>
                      <td>{renderTag('un', 'Inactive')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p style={{ color: 'var(--slate)', marginTop: 10, fontSize: 13 }}>
                Sortable columns · 1–3 of 303 members · ‹ 1 2 3 ›. Bulk bar appears on selection.
              </p>
            </div>
          )}

          {/* 5. DEPARTMENTS & CLASSES (dep) -> COMING SOON per user request */}
          {activeView === 'dep' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Departments &amp; classes</h1>
                  <p>Sunday School academic departments, choir sections and class rosters.</p>
                </div>
              </div>

              <div className="coming-soon-card">
                <span className="coming-soon-pill">✨ Coming Soon</span>
                <h2>Departments &amp; Classes Management</h2>
                <p style={{ maxWidth: 560, margin: '0 auto 20px', color: 'var(--slate)', lineHeight: 1.6 }}>
                  Automated class rosters, teacher assignments, and confirmed student allocations for Timhirt, Mezmur, and Kine Tibeb are currently in development.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    className="btn g"
                    onClick={() =>
                      ask(
                        'Department Notifications',
                        'You will receive an alert once department and class rosters are activated.'
                      )
                    }
                  >
                    Notify Me
                  </button>
                  <button className="btn o" onClick={() => handleNavClick('mem')}>
                    View All Students
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. IMPORT / EXPORT (imp) */}
          {activeView === 'imp' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Import / Export</h1>
                  <p>Excel (.xlsx) or CSV. The database stays the master record.</p>
                </div>
                <button
                  className="btn o"
                  onClick={() => ask('Download Template', 'Downloading Sunday School member import template (.xlsx).')}
                >
                  Download template
                </button>
              </div>

              <div className="grid g2">
                <div className="card">
                  <h3>Import</h3>
                  <div
                    className="drop"
                    onClick={() => ask('Upload File', 'Select .xlsx or .csv member list from your computer.')}
                  >
                    Drop Excel or CSV file here, or click to browse
                  </div>
                  <div className="chips" style={{ marginTop: 12 }}>
                    <span className="tag pub">96 valid</span>
                    <span className="tag dr">4 duplicates</span>
                    <span className="tag rd">3 errors</span>
                  </div>
                  <div className="wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Row</th>
                          <th>Issue</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>7</td>
                          <td>Name required · invalid phone</td>
                          <td><button className="btn o s">Fix</button></td>
                        </tr>
                        <tr>
                          <td>12</td>
                          <td>Possible duplicate</td>
                          <td><button className="btn o s">Skip</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button
                    className="btn g"
                    style={{ marginTop: 14 }}
                    onClick={() => ask('Confirm Import', 'Proceeding with import of 96 valid student rows.')}
                  >
                    Import 96 valid rows
                  </button>
                </div>

                <div className="card">
                  <h3>Export</h3>
                  <label>Scope</label>
                  <select>
                    <option>Current filter</option>
                    <option>All members</option>
                    <option>Department / class / division / age group</option>
                  </select>
                  <label>Format</label>
                  <select>
                    <option>.xlsx (Excel spreadsheet)</option>
                    <option>.csv (Comma separated values)</option>
                  </select>
                  <button
                    className="btn g"
                    style={{ marginTop: 18 }}
                    onClick={() => ask('Export Data', 'Generating export file. Your download will begin shortly.')}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. PAGES & SECTIONS (pag) */}
          {activeView === 'pag' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Pages &amp; sections</h1>
                  <p>Edit the real sections of each public page. The homepage design is locked.</p>
                </div>
              </div>

              <div
                className="grid"
                style={{ gridTemplateColumns: 'minmax(200px, 0.7fr) minmax(300px, 1.6fr)' }}
              >
                <div className="card" style={{ padding: '4px 14px' }}>
                  {[
                    'Home 🔒',
                    'About',
                    'Announcements',
                    'Events',
                    'Reports',
                    'Mezmur',
                    'Teachings',
                    'Gallery',
                    'Contact',
                  ].map((p, i) => (
                    <div
                      key={p}
                      className="row"
                      style={
                        i === 1
                          ? { background: 'var(--sky)', margin: '0 -14px', padding: '9px 14px' }
                          : undefined
                      }
                    >
                      <b>{p}</b>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h3>About · sections</h3>
                  {[
                    'Hero stats (1998 · 200+ · 4)',
                    'Legacy of Abune Diskoros',
                    'Milestone Timeline',
                    'Mission · Vision · Values',
                    'Sunday School Journey',
                    'More Ways to Serve',
                  ].map((s, i) => (
                    <div key={i} className="row">
                      <span>⋮⋮ {s}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <InteractiveSwitch defaultOn={true} />
                        <button className="btn o s" onClick={() => ask('Edit Section', `Open section editor for: ${s}`)}>
                          Edit
                        </button>
                      </span>
                    </div>
                  ))}
                  <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
                    <button className="btn o" onClick={() => ask('Preview', 'Opening section preview in new tab.')}>
                      Preview
                    </button>
                    <button className="btn o" onClick={() => ask('Save Draft', 'Section drafts saved successfully.')}>
                      Save draft
                    </button>
                    <button className="btn g" onClick={() => ask('Publish Sections', 'Publishing section changes live.')}>
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. ANNOUNCEMENTS (ann) */}
          {activeView === 'ann' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Announcements</h1>
                  <p>Public news. The member portal reuses these, never a copy.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href="/announcements" target="_blank" className="btn o">
                    Preview
                  </Link>
                  <button
                    className="btn g"
                    onClick={() => ask('New Announcement', 'Draft a new church announcement.')}
                  >
                    + New
                  </button>
                </div>
              </div>

              <div className="chips">
                <button className="chip on">All</button>
                <button className="chip">Church</button>
                <button className="chip">Education</button>
                <button className="chip">Community</button>
              </div>

              <div className="card wrap" style={{ padding: '6px 10px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hv">
                      <td><b>Feast of the Holy Cross preparation</b></td>
                      <td>Church</td>
                      <td>Meskerem 17</td>
                      <td>{renderTag('fe', 'Featured')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Announcement', 'Are you sure? This cannot be undone.')}>Delete</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td><b>New Sunday school registration</b></td>
                      <td>Education</td>
                      <td>Meskerem 11</td>
                      <td>{renderTag('pub', 'Published')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Announcement', 'Are you sure? This cannot be undone.')}>Delete</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td><b>Community charity and outreach</b></td>
                      <td>Community</td>
                      <td>Meskerem 22</td>
                      <td>{renderTag('dr', 'Draft')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Announcement', 'Are you sure? This cannot be undone.')}>Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. EVENTS (evt) */}
          {activeView === 'evt' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Events</h1>
                  <p>Published events appear on the public Events page and in the portal.</p>
                </div>
                <button
                  className="btn g"
                  onClick={() => ask('New Event', 'Create an event schedule entry.')}
                >
                  + New event
                </button>
              </div>

              <div className="chips">
                <button className="chip on">Upcoming</button>
                <button className="chip">Past</button>
                <button className="chip">Drafts</button>
              </div>

              <div className="card wrap" style={{ padding: '6px 10px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hv">
                      <td>Nov 22</td>
                      <td><b>Annual Church Gathering</b></td>
                      <td>Church Programs</td>
                      <td>{renderTag('fe', 'Featured')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Event', 'Are you sure? This cannot be undone.')}>Delete</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td>Nov 15</td>
                      <td><b>Youth Fellowship Gathering</b></td>
                      <td>Church Programs</td>
                      <td>{renderTag('pub', 'Published')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Event', 'Are you sure? This cannot be undone.')}>Delete</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td>Nov 28</td>
                      <td><b>Feast Day Liturgy &amp; Hymns</b></td>
                      <td>Feast Celebration</td>
                      <td>{renderTag('dr', 'Draft')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Event', 'Are you sure? This cannot be undone.')}>Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10. MEDIA & GALLERY (med) */}
          {activeView === 'med' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Media &amp; gallery</h1>
                  <p>Images, video and audio with alt text and categories.</p>
                </div>
                <button
                  className="btn g"
                  onClick={() => ask('Upload Media', 'Select photos or media assets to upload.')}
                >
                  Upload
                </button>
              </div>

              <div className="chips">
                <button className="chip on">All</button>
                <button className="chip">Worship</button>
                <button className="chip">Celebrations</button>
                <button className="chip">Youth</button>
                <button className="chip">Community</button>
                <button className="chip">Video</button>
                <button className="chip">Audio</button>
              </div>

              <div className="gal">
                {[
                  '#C99A3B, #1E2A5E',
                  '#8A6414, #2F5D9E',
                  '#1E2A5E, #C99A3B',
                  '#2F5D9E, #E3EEF8',
                  '#b3262e, #1E2A5E',
                  '#C99A3B, #8A6414',
                  '#1E2A5E, #2F5D9E',
                  '#C99A3B, #2F5D9E',
                ].map((g, i) => (
                  <div key={i}>
                    <div
                      className="ph"
                      style={{ background: `linear-gradient(135deg, ${g})` }}
                    >
                      {['Worship', 'Celebrations', 'Youth', 'Community'][i % 4]}
                    </div>
                    <small style={{ color: 'var(--slate)', display: 'block', marginTop: 4 }}>
                      {i === 2 ? (
                        <span style={{ color: 'var(--red)' }}>no alt text</span>
                      ) : (
                        'alt ✓'
                      )}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. TEACHINGS & MEZMUR (tea) */}
          {activeView === 'tea' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Teachings &amp; mezmur</h1>
                  <p>Video, audio and PDF content with categories and thumbnails.</p>
                </div>
                <button
                  className="btn g"
                  onClick={() => ask('New Teaching', 'Add new teaching or mezmur hymn.')}
                >
                  + New
                </button>
              </div>

              <div className="chips">
                <button className="chip on">Teachings</button>
                <button className="chip">Mezmur</button>
                <button className="chip">Dogma</button>
                <button className="chip">Holy Bible</button>
                <button className="chip">Church History</button>
                <button className="chip">Patristics</button>
              </div>

              <div className="card wrap" style={{ padding: '6px 10px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Formats</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hv">
                      <td><b>The Mystery of the Holy Trinity</b></td>
                      <td>Dogma</td>
                      <td>Video · PDF</td>
                      <td>{renderTag('fe', 'Featured')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Content', 'Are you sure?')}>Delete</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td><b>Spiritual Lessons from the Holy Bible</b></td>
                      <td>Holy Bible</td>
                      <td>PDF</td>
                      <td>{renderTag('pub', 'Published')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Content', 'Are you sure?')}>Delete</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td><b>Holy God (ቅዱስ እግዚአብሔር)</b></td>
                      <td>Mezmur</td>
                      <td>Audio · Lyrics</td>
                      <td>{renderTag('pub', 'Published')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Content', 'Are you sure?')}>Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 12. REPORTS (rep) */}
          {activeView === 'rep' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Reports</h1>
                  <p>PDF reports by year, public or restricted.</p>
                </div>
                <button
                  className="btn g"
                  onClick={() => ask('Upload PDF', 'Upload church audit or financial report.')}
                >
                  + Upload PDF
                </button>
              </div>

              <div className="card wrap" style={{ padding: '6px 10px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Year</th>
                      <th>Access</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hv">
                      <td><b>Financial Management Report</b></td>
                      <td>2025</td>
                      <td>Restricted</td>
                      <td>{renderTag('pub', 'Published')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Report', 'Are you sure?')}>Delete</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td><b>Audit Financial Report</b></td>
                      <td>2024</td>
                      <td>Restricted</td>
                      <td>{renderTag('pub', 'Published')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn r s" onClick={() => ask('Delete Report', 'Are you sure?')}>Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 13. LIVE STREAM (liv) -> COMING SOON per user request */}
          {activeView === 'liv' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Live stream</h1>
                  <p>Real-time video and liturgical broadcast streaming.</p>
                </div>
              </div>

              <div className="coming-soon-card">
                <span className="coming-soon-pill">🔴 Coming Soon</span>
                <h2>Church Live Stream Integration</h2>
                <p style={{ maxWidth: 560, margin: '0 auto 20px', color: 'var(--slate)', lineHeight: 1.6 }}>
                  Direct live stream broadcast capability for Sunday Liturgy, feast day celebrations, and Sunday school lessons will be available once the dedicated streaming provider connection is established.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    className="btn g"
                    onClick={() =>
                      ask('Live Stream Setup', 'Streaming provider settings will be accessible in Platform Settings.')
                    }
                  >
                    Setup Provider
                  </button>
                  <button className="btn o" onClick={() => handleNavClick('evt')}>
                    View Scheduled Events
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 14. CONTACT MESSAGES (msg) */}
          {activeView === 'msg' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Contact messages</h1>
                  <p>Private inquiries and prayer requests submitted via the contact page.</p>
                </div>
              </div>

              <div className="chips">
                <button className="chip on">All</button>
                <button className="chip">Unread (3)</button>
                <button className="chip">Resolved</button>
              </div>

              <div className="card wrap" style={{ padding: '6px 10px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>Topic</th>
                      <th>Preview</th>
                      <th>When</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hv">
                      <td><b>Marta T.</b></td>
                      <td>Prayer request</td>
                      <td>Please pray for our family during…</td>
                      <td>1 h</td>
                      <td>{renderTag('dr', 'New')}</td>
                      <td>
                        <button className="btn o s" onClick={() => ask('Message Detail', 'From Marta T.: Please pray for our family during our upcoming journey.')}>Open</button>{' '}
                        <button className="btn o s" onClick={() => ask('Resolve Message', 'Mark message as resolved?')}>Resolve</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td><b>Dawit A.</b></td>
                      <td>General</td>
                      <td>What time is Sunday school lit…</td>
                      <td>Yesterday</td>
                      <td>{renderTag('dr', 'New')}</td>
                      <td>
                        <button className="btn o s" onClick={() => ask('Message Detail', 'From Dawit A.: What time is Sunday school liturgy service?')}>Open</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td><b>Liya G.</b></td>
                      <td>Volunteering</td>
                      <td>I would like to volunteer with…</td>
                      <td>2 d</td>
                      <td>{renderTag('pub', 'Resolved')}</td>
                      <td>
                        <button className="btn o s" onClick={() => ask('Message Detail', 'From Liya G.: I would like to volunteer with choir.')}>Open</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 15. MEMBER NOTICES (not) */}
          {activeView === 'not' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Member notices</h1>
                  <p>Targeted directly to enrolled members, separate from public news.</p>
                </div>
              </div>

              <div className="grid g2">
                <div className="card">
                  <h3>New notice</h3>
                  <label>Title</label>
                  <input placeholder="e.g. Choir practice rescheduled" />
                  <label>Message</label>
                  <textarea rows={3} placeholder="Write announcement details for members…" />
                  <label>Audience</label>
                  <div className="chips" style={{ marginTop: 6 }}>
                    <span className="chip on">All members</span>
                    <span className="chip">Sunday School</span>
                    <span className="chip">Choir</span>
                    <span className="chip">Department…</span>
                  </div>
                  <label>Expires</label>
                  <input type="date" />
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <button className="btn o" onClick={() => ask('Save Draft', 'Member notice draft saved.')}>
                      Save draft
                    </button>
                    <button className="btn g" onClick={() => ask('Publish Notice', 'Send notice to enrolled members?')}>
                      Publish
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3>Published notices</h3>
                  <div className="wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Audience</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><b>Choir practice moved</b></td>
                          <td>Choir</td>
                          <td>{renderTag('pub', 'Published')}</td>
                        </tr>
                        <tr>
                          <td><b>Registration reminder</b></td>
                          <td>All members</td>
                          <td>{renderTag('un', 'Unpublished')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p style={{ color: 'var(--slate)', marginTop: 12, fontSize: 13 }}>
                    Audience filters integrate with enrolled Sunday School rosters.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 16. ADMINISTRATORS (adm - Super Admin Only) */}
          {activeView === 'adm' && isSuper && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Administrators</h1>
                  <p>Create accounts, assign roles, suspend or reset access.</p>
                </div>
                <button
                  className="btn g"
                  onClick={() => ask('New Administrator', 'Create a new staff or editor login.')}
                >
                  + New administrator
                </button>
              </div>

              <div className="card wrap" style={{ padding: '6px 10px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Last active</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hv">
                      <td><b>Hawi</b></td>
                      <td>hawi@abunemedia.org</td>
                      <td>Super Admin</td>
                      <td>Now</td>
                      <td>{renderTag('pub', 'Active')}</td>
                      <td>—</td>
                    </tr>
                    <tr className="hv">
                      <td><b>Selam K.</b></td>
                      <td>selam@abunemedia.org</td>
                      <td>Admin · Content</td>
                      <td>2 h ago</td>
                      <td>{renderTag('pub', 'Active')}</td>
                      <td>
                        <button className="btn o s">Edit</button>{' '}
                        <button className="btn o s" onClick={() => ask('Password Reset', 'Send password reset link to Selam K.?')}>Reset password</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td><b>Yonas M.</b></td>
                      <td>yonas@abunemedia.org</td>
                      <td>Admin · Media</td>
                      <td>5 d ago</td>
                      <td>{renderTag('pub', 'Active')}</td>
                      <td>
                        <button className="btn o s">Edit</button>
                      </td>
                    </tr>
                    <tr className="hv">
                      <td><b>Rahel B.</b></td>
                      <td>rahel@abunemedia.org</td>
                      <td>Admin</td>
                      <td>—</td>
                      <td>{renderTag('rd', 'Suspended')}</td>
                      <td>
                        <button className="btn o s" onClick={() => ask('Reactivate Account', 'Reactivate Rahel B.’s account?')}>Reactivate</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p style={{ color: 'var(--slate)', marginTop: 10, fontSize: 13 }}>
                An Admin can never create a Super Admin or change their own role. Only Super Admins hold platform credentials.
              </p>
            </div>
          )}

          {/* 17. ROLES & PERMISSIONS (rol - Super Admin Only) */}
          {activeView === 'rol' && isSuper && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Roles &amp; permissions</h1>
                  <p>Configurable and enforced on the server.</p>
                </div>
                <button
                  className="btn g"
                  onClick={() => ask('New Role', 'Configure a custom staff permission set.')}
                >
                  + New role
                </button>
              </div>

              <div className="card wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Role</th>
                      {['View', 'Create', 'Edit', 'Delete', 'Publish', 'Members', 'Content', 'Media', 'Pages', 'Messages', 'Users'].map((p) => (
                        <th key={p} style={{ textAlign: 'center' }}>
                          {p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: 'Super Admin', perms: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], locked: true },
                      { role: 'Admin', perms: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], locked: false },
                      { role: 'Content Editor', perms: [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0], locked: false },
                      { role: 'Media Manager', perms: [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0], locked: false },
                    ].map((row, i) => (
                      <tr key={row.role}>
                        <td><b>{row.role}</b></td>
                        {row.perms.map((val, pIdx) => (
                          <td key={pIdx} style={{ textAlign: 'center' }}>
                            <InteractiveCheckbox initial={val === 1} disabled={row.locked} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ color: 'var(--slate)', marginTop: 10, fontSize: 13 }}>
                Super Admin permissions are locked. The “Users” permission is restricted exclusively to Super Admins.
              </p>
            </div>
          )}

          {/* 18. AUDIT LOG (aud - Super Admin Only) */}
          {activeView === 'aud' && isSuper && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Audit log</h1>
                  <p>Every sensitive action: who, what, where, when.</p>
                </div>
                <button
                  className="btn o"
                  onClick={() => ask('Export Audit Log', 'Exporting security audit log to CSV.')}
                >
                  Export
                </button>
              </div>

              <div className="chips">
                <button className="chip on">All</button>
                <button className="chip">Login</button>
                <button className="chip">Content</button>
                <button className="chip">Approvals</button>
                <button className="chip">Students</button>
                <button className="chip">Accounts</button>
                <button className="chip">Permissions</button>
                <button className="chip">Settings</button>
              </div>

              <div className="card wrap" style={{ padding: '6px 10px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Who</th>
                      <th>Action</th>
                      <th>Target</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hv">
                      <td>Today 09:14</td>
                      <td><b>Hawi</b></td>
                      <td>Approved</td>
                      <td>Registration · Meron Tesfaye</td>
                      <td>Created member ABN-2026-0142</td>
                    </tr>
                    <tr className="hv">
                      <td>Today 07:02</td>
                      <td><b>Selam K.</b></td>
                      <td>Published</td>
                      <td>Announcement</td>
                      <td>Feast of the Holy Cross</td>
                    </tr>
                    <tr className="hv">
                      <td>Yesterday</td>
                      <td><b>Hawi</b></td>
                      <td>Changed role</td>
                      <td>Selam K.</td>
                      <td>Admin → Content Editor</td>
                    </tr>
                    <tr className="hv">
                      <td>Yesterday</td>
                      <td><b>Hawi</b></td>
                      <td>Exported</td>
                      <td>Students</td>
                      <td>268 rows</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 19. PLATFORM SETTINGS (set - Super Admin Only) */}
          {activeView === 'set' && isSuper && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>Platform settings</h1>
                  <p>Site-wide configuration. Secrets are never exposed.</p>
                </div>
                <button
                  className="btn g"
                  onClick={() => ask('Save Settings', 'Configuration settings saved successfully.')}
                >
                  Save
                </button>
              </div>

              <div className="grid g2">
                <div className="card">
                  <h3>Branding</h3>
                  <label>Website name</label>
                  <input defaultValue="Abune Media" />
                  <label>Logo</label>
                  <div className="drop" onClick={() => ask('Upload Logo', 'Select brand logo PNG/SVG.')}>
                    Upload logo
                  </div>
                  <label>Favicon</label>
                  <div className="drop" onClick={() => ask('Upload Favicon', 'Select favicon .ico / .png.')}>
                    Upload favicon
                  </div>
                </div>

                <div className="card">
                  <h3>Contact &amp; social</h3>
                  <label>Address</label>
                  <input defaultValue="Addis Ababa, Abune Wereda" />
                  <label>Phone</label>
                  <input defaultValue="+251 911 123 456" />
                  <label>Telegram</label>
                  <input defaultValue="https://t.me/abune_media" />
                  <label>YouTube</label>
                  <input defaultValue="https://youtube.com/@abune_media" />
                  <label>TikTok</label>
                  <input defaultValue="https://tiktok.com/@abune_media" />
                </div>

                <div className="card">
                  <h3>Upload limits</h3>
                  <label>Max image size (MB)</label>
                  <input defaultValue="5" type="number" />
                  <label>Max video size (MB)</label>
                  <input defaultValue="200" type="number" />
                </div>

                <div className="card">
                  <h3>Security</h3>
                  <div className="row">
                    <span>
                      Maintenance mode
                      <small>Temporarily restricts public site to admins</small>
                    </span>
                    <InteractiveSwitch defaultOn={false} />
                  </div>
                  <div className="row">
                    <span>
                      Require strong passwords
                      <small>Enforce 8+ characters, digits, and special symbols</small>
                    </span>
                    <InteractiveSwitch defaultOn={true} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 20. SYSTEM MONITORING (sys - Super Admin Only) */}
          {activeView === 'sys' && isSuper && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>System monitoring</h1>
                  <p>Live health checks across database, storage, and server processes.</p>
                </div>
              </div>

              <div className="grid g4">
                <div className="card stat">
                  <small>Application</small>
                  <b style={{ fontSize: 28, color: 'var(--ok)' }}>Healthy</b>
                </div>
                <div className="card stat">
                  <small>Database</small>
                  <b style={{ fontSize: 28, color: 'var(--ok)' }}>Connected</b>
                </div>
                <div className="card stat">
                  <small>Storage</small>
                  <b style={{ fontSize: 28 }}>78%</b>
                </div>
                <div className="card stat">
                  <small>Background jobs</small>
                  <b style={{ fontSize: 28, color: 'var(--slate)' }}>Active</b>
                </div>
              </div>

              <div className="card" style={{ marginTop: 14 }}>
                <h3>Recent errors</h3>
                <p style={{ color: 'var(--slate)', fontSize: 14 }}>
                  No errors recorded. All API services operating within normal latency.
                </p>
              </div>
            </div>
          )}

          {/* 21. MY ACCOUNT (acc) */}
          {activeView === 'acc' && (
            <div>
              <div className="top-heading">
                <div>
                  <h1>My account</h1>
                  <p>Profile and credentials. You cannot alter your own role permissions.</p>
                </div>
              </div>

              <div className="grid g2">
                <div className="card">
                  <h3>Profile</h3>
                  <label>Name</label>
                  <input defaultValue={userName} />
                  <label>Email</label>
                  <input defaultValue={userEmail} />
                  <label>Role</label>
                  <input disabled value={isSuper ? 'Super Admin' : 'Admin'} />

                  <h3 style={{ marginTop: 18 }}>Notifications</h3>
                  <div className="row">
                    <span>New registrations</span>
                    <InteractiveSwitch defaultOn={true} />
                  </div>
                  <div className="row">
                    <span>New messages</span>
                    <InteractiveSwitch defaultOn={true} />
                  </div>
                </div>

                <div className="card">
                  <h3>Change password</h3>
                  <label>Current password</label>
                  <input type="password" />
                  <label>New password</label>
                  <input type="password" />
                  <label>Confirm new password</label>
                  <input type="password" />
                  <p style={{ marginTop: 16 }}>
                    <button
                      className="btn g"
                      onClick={() => ask('Update Password', 'Password updated successfully.')}
                    >
                      Update
                    </button>
                  </p>

                  <h3 style={{ marginTop: 22 }}>My recent activity</h3>
                  <div className="row">
                    <div>
                      Logged into administration studio
                      <small>Today 08:50</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Global Confirmation Modal ─────────────────────────────────── */}
      <div className={`modal ${modalOpen ? 'on' : ''}`} role="dialog" aria-modal="true">
        <div className="card">
          <h3 id="mt">{modalTitle}</h3>
          <p id="mp" style={{ color: 'var(--slate)', marginBottom: 14, fontSize: 14 }}>
            {modalPrompt}
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" className="btn o" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="btn g" onClick={confirmModal}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Interactive helper components

function InteractiveSwitch({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <span
      className={`sw ${on ? 'on' : ''}`}
      onClick={() => setOn(!on)}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setOn(!on);
        }
      }}
    />
  );
}

function InteractiveCheckbox({ initial = false, disabled = false }: { initial?: boolean; disabled?: boolean }) {
  const [checked, setChecked] = useState(initial);
  return (
    <span
      className={`chk ${checked ? 'on' : ''}`}
      style={{ opacity: disabled ? 0.75 : 1, cursor: disabled ? 'default' : 'pointer' }}
      onClick={() => {
        if (!disabled) setChecked(!checked);
      }}
    >
      {checked ? '✓' : ''}
    </span>
  );
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="bar">
      <span>{label}</span>
      <div>
        <i style={{ width: `${pct}%` }} />
      </div>
      <b>{value}</b>
    </div>
  );
}

function TrendChart() {
  return (
    <svg viewBox="0 0 300 110" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <polyline
        fill="none"
        stroke="#2F5D9E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="5,90 55,78 105,70 155,50 205,56 255,30 295,18"
      />
      <polyline
        fill="rgba(201, 154, 59, 0.2)"
        stroke="none"
        points="5,105 5,90 55,78 105,70 155,50 205,56 255,30 295,18 295,105"
      />
      {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m, i) => (
        <text
          key={m}
          x={5 + i * 46}
          y="108"
          fontSize="9"
          fill="currentColor"
          opacity="0.65"
          fontFamily="Inter, sans-serif"
        >
          {m}
        </text>
      ))}
    </svg>
  );
}

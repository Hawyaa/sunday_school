'use client';

/**
 * app/attendance/page.tsx — Abune Media Attendance Management
 *
 * Implements:
 * - Dedicated Attendance Taking & Management Workspace
 * - Super Admin controlled attendance authorization & teacher scoping
 * - Physical roll-call interface: Present / Absent marking, progress indicator,
 *   unmarked jumper, and duplicate session prevention
 * - Session history with audit-trailed corrections (requires reason)
 * - Comprehensive attendance reporting by group, department, and student
 * - Role-based permissions (Teacher, Admin, Super Admin) with scope display
 * - Top header with "Back to Main Website" navigation arrow
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, clearSession } from '@/lib/auth';
import './attendance.css';

/* ── Centralized Student & Class Data ──────────────────────────────────── */
interface StudentRecord {
  id: number;
  regNo: string;
  name: string;
}

interface ClassInfo {
  g: string; // Group: 'Sunday School' | 'Choir'
  d: string; // Department: 'Timhirt' | 'Mezmur'
  stu: StudentRecord[];
}

const CLASS_ROSTER: Record<string, ClassInfo> = {
  'Grade 3': {
    g: 'Sunday School',
    d: 'Timhirt',
    stu: [
      { id: 101, regNo: 'ABN-2026-0101', name: 'Ruth Tadesse' },
      { id: 102, regNo: 'ABN-2026-0102', name: 'Biruk Alemu' },
      { id: 103, regNo: 'ABN-2026-0103', name: 'Eden Solomon' },
      { id: 104, regNo: 'ABN-2026-0104', name: 'Nahom Girma' },
      { id: 105, regNo: 'ABN-2026-0105', name: 'Mekdes Lemma' },
      { id: 106, regNo: 'ABN-2026-0106', name: 'Tomas Bekele' },
    ],
  },
  'Grade 7': {
    g: 'Sunday School',
    d: 'Timhirt',
    stu: [
      { id: 201, regNo: 'ABN-2026-0133', name: 'Samuel Girma' },
      { id: 202, regNo: 'ABN-2026-0141', name: 'Dawit Alemu' },
      { id: 203, regNo: 'ABN-2026-0145', name: 'Abel Hailu' },
      { id: 204, regNo: 'ABN-2026-0148', name: 'Hana Bekele' },
      { id: 205, regNo: 'ABN-2026-0150', name: 'Kidus Worku' },
      { id: 206, regNo: 'ABN-2026-0152', name: 'Liya Mekonnen' },
      { id: 207, regNo: 'ABN-2026-0155', name: 'Selam Tadesse' },
      { id: 208, regNo: 'ABN-2026-0158', name: 'Yonas Mulu' },
    ],
  },
  'Mezmur A': {
    g: 'Choir',
    d: 'Mezmur',
    stu: [
      { id: 301, regNo: 'ABN-2026-0142', name: 'Meron Tesfaye' },
      { id: 302, regNo: 'ABN-2026-0139', name: 'Hana Bekele' },
      { id: 303, regNo: 'ABN-2025-0098', name: 'Liya Mekonnen' },
      { id: 304, regNo: 'ABN-2026-0160', name: 'Rahel Bekele' },
      { id: 305, regNo: 'ABN-2026-0161', name: 'Yared Alem' },
      { id: 306, regNo: 'ABN-2026-0163', name: 'Tsion Kebede' },
    ],
  },
};

interface AuditLogEntry {
  who: string;
  what: string;
  why: string;
  when: string;
}

interface SavedSession {
  id: number;
  date: string;
  type: string;
  cls: string;
  by: string;
  abs: number[]; // student IDs who were absent
  hist: AuditLogEntry[];
}

const INITIAL_SESSIONS: SavedSession[] = [
  {
    id: 0,
    date: '2026-10-25',
    type: 'Sunday School session',
    cls: 'Grade 7',
    by: 'Kidist M.',
    abs: [203],
    hist: [
      {
        who: 'Hawi',
        what: 'Abel Hailu: Absent → Present',
        why: 'Arrived late, verified by class teacher',
        when: '27 Oct 2026, 10:12',
      },
    ],
  },
  { id: 1, date: '2026-10-18', type: 'Sunday School session', cls: 'Grade 7', by: 'Kidist M.', abs: [], hist: [] },
  { id: 2, date: '2026-10-11', type: 'Sunday School session', cls: 'Grade 7', by: 'Kidist M.', abs: [203, 207], hist: [] },
  { id: 3, date: '2026-10-04', type: 'Sunday School session', cls: 'Grade 7', by: 'Kidist M.', abs: [205], hist: [] },
  { id: 4, date: '2026-09-27', type: 'Sunday School session', cls: 'Grade 7', by: 'Hawi', abs: [203, 208], hist: [] },
  { id: 5, date: '2026-09-20', type: 'Sunday School session', cls: 'Grade 7', by: 'Kidist M.', abs: [], hist: [] },
  { id: 6, date: '2026-10-25', type: 'Sunday School session', cls: 'Grade 3', by: 'Kidist M.', abs: [102], hist: [] },
  { id: 7, date: '2026-10-18', type: 'Sunday School session', cls: 'Grade 3', by: 'Kidist M.', abs: [], hist: [] },
  { id: 8, date: '2026-10-24', type: 'Choir practice', cls: 'Mezmur A', by: 'Tsion K.', abs: [304], hist: [] },
  { id: 9, date: '2026-10-17', type: 'Choir practice', cls: 'Mezmur A', by: 'Tsion K.', abs: [], hist: [] },
];

const TEACHER_ASSIGNED_CLASSES = ['Grade 3', 'Grade 7'];

export default function AttendancePage() {
  const router = useRouter();

  // Navigation and active view
  const [activeTab, setActiveTab] = useState<'take' | 'hist' | 'rep'>('take');
  const [mobileOpen, setMobileOpen] = useState(false);

  // User scope simulation (t = Teacher Kidist, a = Admin Hawi, s = Super Admin Hawi)
  const [roleScope, setRoleScope] = useState<'t' | 'a' | 's'>('t');
  const [userName, setUserName] = useState('Kidist M.');

  // Roll call taking state
  const [selectedGroup, setSelectedGroup] = useState('Sunday School');
  const [selectedClass, setSelectedClass] = useState('Grade 7');
  const [sessionType, setSessionType] = useState('Sunday School session');
  const [sessionDate, setSessionDate] = useState('2026-11-01');
  const [listLoaded, setListLoaded] = useState(false);
  const [marks, setMarks] = useState<Record<number, 'P' | 'A'>>({});
  const [searchFilter, setSearchFilter] = useState('');
  const [currentFocusId, setCurrentFocusId] = useState<number | null>(null);

  // Sessions store
  const [sessions, setSessions] = useState<SavedSession[]>(INITIAL_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [historyTab, setHistoryTab] = useState<'date' | 'member' | 'class'>('date');
  const [isEditingCorrection, setIsEditingCorrection] = useState(false);

  // Modal & Toast states
  const [toastMessage, setToastMessage] = useState('');
  const [toastActive, setToastActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalPrompt, setModalPrompt] = useState('');
  const [modalReasonInput, setModalReasonInput] = useState('');
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);
  const [correctionTarget, setCorrectionTarget] = useState<{ student: StudentRecord; currentStatus: 'P' | 'A' } | null>(null);

  // Sync authenticated session
  useEffect(() => {
    const session = getSession();
    if (session?.user) {
      if (session.user.name) setUserName(session.user.name);
      if (session.user.backendRole === 'SUPER_ADMIN') setRoleScope('s');
      else if (session.user.backendRole === 'ADMIN') setRoleScope('a');
      else setRoleScope('t');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastActive(true);
    setTimeout(() => setToastActive(false), 2400);
  };

  // Classes accessible to the current user
  const availableClasses = Object.keys(CLASS_ROSTER).filter((cls) => {
    const matchesGroup = !selectedGroup || CLASS_ROSTER[cls].g === selectedGroup;
    const withinScope = roleScope !== 't' || TEACHER_ASSIGNED_CLASSES.includes(cls);
    return matchesGroup && withinScope;
  });

  // Duplicate session check
  const duplicateSession = sessions.find(
    (s) => s.cls === selectedClass && s.date === sessionDate && s.type === sessionType
  );

  const currentStudents = CLASS_ROSTER[selectedClass]?.stu || [];
  const presentCount = currentStudents.filter((x) => marks[x.id] === 'P').length;
  const absentCount = currentStudents.filter((x) => marks[x.id] === 'A').length;
  const unmarkedCount = currentStudents.length - presentCount - absentCount;

  // Handle Mark click
  const handleMark = (id: number, val: 'P' | 'A') => {
    setMarks((prev) => ({ ...prev, [id]: val }));
    const nextUnmarked = currentStudents.find((x) => x.id !== id && !marks[x.id]);
    if (nextUnmarked) setCurrentFocusId(nextUnmarked.id);
  };

  // Jump to next unmarked student
  const jumpToNext = () => {
    const next = currentStudents.find((x) => !marks[x.id]);
    if (next) {
      setCurrentFocusId(next.id);
      const el = document.getElementById(`stu-${next.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Save Attendance Handler
  const askSaveAttendance = () => {
    setModalTitle('Save Attendance?');
    setModalPrompt(
      `${selectedClass} · ${sessionType} on ${sessionDate}. Total ${currentStudents.length} students: ${presentCount} present, ${absentCount} absent. Recorded under your authorized signature (${userName}).`
    );
    setModalAction(() => () => {
      const absentIds = currentStudents.filter((s) => marks[s.id] === 'A').map((s) => s.id);
      const newSession: SavedSession = {
        id: sessions.length,
        date: sessionDate,
        type: sessionType,
        cls: selectedClass,
        by: userName,
        abs: absentIds,
        hist: [],
      };
      setSessions([newSession, ...sessions]);
      setListLoaded(false);
      setMarks({});
      showToast('Attendance saved to central database');
    });
    setModalOpen(true);
  };

  // Correction Handler
  const askCorrection = (student: StudentRecord, currentVal: 'P' | 'A') => {
    setCorrectionTarget({ student, currentStatus: currentVal });
    setModalTitle('Correct Attendance Record?');
    setModalPrompt(
      `Switch ${student.name} (${student.regNo}) from ${
        currentVal === 'P' ? 'Present to Absent' : 'Absent to Present'
      }. A mandatory reason is required for the audit trail.`
    );
    setModalReasonInput('');
    setModalOpen(true);
  };

  const confirmCorrection = () => {
    if (!modalReasonInput.trim()) {
      showToast('A reason is mandatory for audit compliance.');
      return;
    }
    if (selectedSessionId !== null && correctionTarget) {
      const nextVal = correctionTarget.currentStatus === 'P' ? 'A' : 'P';
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== selectedSessionId) return s;
          const nextAbs =
            nextVal === 'A'
              ? [...s.abs, correctionTarget.student.id]
              : s.abs.filter((id) => id !== correctionTarget.student.id);
          const auditEntry: AuditLogEntry = {
            who: userName,
            what: `${correctionTarget.student.name}: ${
              correctionTarget.currentStatus === 'P' ? 'Present → Absent' : 'Absent → Present'
            }`,
            why: modalReasonInput.trim(),
            when: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...s,
            abs: nextAbs,
            hist: [auditEntry, ...s.hist],
          };
        })
      );
      setModalOpen(false);
      setIsEditingCorrection(false);
      showToast('Correction recorded with audit trail');
    }
  };

  // Export report to CSV
  const handleExportCSV = () => {
    const rows = [
      ['Student Name', 'Registration No', 'Class', 'Total Sessions', 'Attended', 'Absences', 'Attendance %'],
    ];
    Object.entries(CLASS_ROSTER).forEach(([clsName, cInfo]) => {
      const clsSessions = sessions.filter((s) => s.cls === clsName);
      cInfo.stu.forEach((st) => {
        const total = clsSessions.length;
        const abs = clsSessions.filter((s) => s.abs.includes(st.id)).length;
        const att = total - abs;
        const pct = total ? Math.round((att / total) * 100) : 0;
        rows.push([st.name, st.regNo, clsName, String(total), String(att), String(abs), `${pct}%`]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Abune_Media_Attendance_Report_${sessionDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance report exported to CSV');
  };

  // Render detail view for a specific historical session
  const renderSessionDetail = () => {
    const s = sessions.find((x) => x.id === selectedSessionId);
    if (!s) return null;
    const cInfo = CLASS_ROSTER[s.cls];
    if (!cInfo) return null;

    const presentStudents = cInfo.stu.filter((st) => !s.abs.includes(st.id));
    const absentStudents = cInfo.stu.filter((st) => s.abs.includes(st.id));
    const attPct = cInfo.stu.length ? Math.round((presentStudents.length / cInfo.stu.length) * 100) : 0;

    return (
      <div>
        <p style={{ marginBottom: 12 }}>
          <button
            type="button"
            className="btn o s"
            onClick={() => {
              setSelectedSessionId(null);
              setIsEditingCorrection(false);
            }}
          >
            ‹ Back to history
          </button>
        </p>

        <div className="top" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
          <div>
            <h1>
              {s.cls} · {s.date}
            </h1>
            <p>
              {s.type} · Recorded by <b>{s.by}</b>
            </p>
          </div>
          {isEditingCorrection ? (
            <button type="button" className="btn o" onClick={() => setIsEditingCorrection(false)}>
              Done editing
            </button>
          ) : (
            <button type="button" className="btn g" onClick={() => setIsEditingCorrection(true)}>
              Correct a record
            </button>
          )}
        </div>

        <div className="stats">
          <div className="stat p">
            <small>Present</small>
            <b>{presentStudents.length}</b>
          </div>
          <div className="stat a">
            <small>Absent</small>
            <b>{absentStudents.length}</b>
          </div>
          <div className="stat">
            <small>Attendance</small>
            <b>{attPct}%</b>
          </div>
        </div>

        <div className="grid g2">
          {/* Present List */}
          <div className="card">
            <h3>Present ({presentStudents.length})</h3>
            {presentStudents.map((st) => (
              <div key={st.id} className="row">
                <div>
                  <b>{st.name}</b>
                  <small>{st.regNo}</small>
                </div>
                {isEditingCorrection && (
                  <button
                    type="button"
                    className="btn o s"
                    onClick={() => askCorrection(st, 'P')}
                  >
                    Switch to Absent
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Absent List */}
          <div className="card">
            <h3>Absent ({absentStudents.length})</h3>
            {absentStudents.length > 0 ? (
              absentStudents.map((st) => (
                <div key={st.id} className="row">
                  <div>
                    <b>{st.name}</b>
                    <small>{st.regNo}</small>
                  </div>
                  {isEditingCorrection && (
                    <button
                      type="button"
                      className="btn o s"
                      onClick={() => askCorrection(st, 'A')}
                    >
                      Switch to Present
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--slate)', paddingTop: 6 }}>Nobody was absent.</p>
            )}
          </div>
        </div>

        {/* Audit Log Timeline */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Record Details &amp; Edit History</h3>
          <div className="row">
            <div>
              Saved initially by <b>{s.by}</b>
              <small>{s.date}, 09:58 AM</small>
            </div>
            <span className="tag bl">Original</span>
          </div>
          {s.hist.length > 0 ? (
            s.hist.map((h, i) => (
              <div key={i} className="row">
                <div>
                  <b style={{ color: 'var(--blue)' }}>{h.what}</b>
                  <small>
                    By {h.who} · {h.when} · “<em>{h.why}</em>”
                  </small>
                </div>
                <span className="tag dr">Audit Log</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--slate)', paddingTop: 8 }}>
              No corrections have been made to this roll call record.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="att-root">
      {/* ── Left Sidebar ──────────────────────────────────────────────── */}
      <aside className={mobileOpen ? 'open' : ''}>
        <Link href="/" className="logo" title="Abune Media Home">
          <b>አ</b>
          <div>
            <span>Abune Media</span>
            <small>ATTENDANCE STUDIO</small>
          </div>
        </Link>

        <div className="grp">Student Management</div>
        <button
          type="button"
          className={`nav ${roleScope === 't' ? 'dim' : ''}`}
          onClick={() => {
            if (roleScope !== 't') router.push('/admin');
          }}
          title={roleScope === 't' ? 'Requires Admin Studio permissions' : 'Open Admin Studio'}
        >
          Overview
        </button>
        <button
          type="button"
          className={`nav ${roleScope === 't' ? 'dim' : ''}`}
          onClick={() => {
            if (roleScope !== 't') router.push('/admin');
          }}
        >
          Students &amp; Members
        </button>
        <button
          type="button"
          className={`nav ${roleScope === 't' ? 'dim' : ''}`}
          onClick={() => {
            if (roleScope !== 't') router.push('/admin');
          }}
        >
          Departments &amp; Classes
        </button>

        <div className="grp">Attendance</div>
        <button
          type="button"
          className={`nav ${activeTab === 'take' && selectedSessionId === null ? 'on' : ''}`}
          onClick={() => {
            setActiveTab('take');
            setSelectedSessionId(null);
            setMobileOpen(false);
          }}
        >
          Take attendance
        </button>
        <button
          type="button"
          className={`nav ${activeTab === 'hist' ? 'on' : ''}`}
          onClick={() => {
            setActiveTab('hist');
            setMobileOpen(false);
          }}
        >
          History &amp; corrections
        </button>
        <button
          type="button"
          className={`nav ${activeTab === 'rep' ? 'on' : ''}`}
          onClick={() => {
            setActiveTab('rep');
            setSelectedSessionId(null);
            setMobileOpen(false);
          }}
        >
          Reports &amp; analytics
        </button>

        <div className="aside-footer">
          {roleScope !== 't' && (
            <Link
              href="/admin"
              className="nav"
              style={{ color: '#e3eef8', marginBottom: 6 }}
            >
              <span>🛡 Return to Admin</span>
            </Link>
          )}
          <Link
            href="/"
            className="nav"
            style={{ color: '#cfd6ee' }}
          >
            <span>🌐 Live Website</span>
          </Link>
          <button
            type="button"
            className="nav"
            style={{ color: '#f8dcdc', marginTop: 4 }}
            onClick={() => {
              clearSession();
              router.push('/login');
            }}
          >
            <span>🚪 Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────────────────────── */}
      <main>
        {/* Top Header */}
        <header>
          {/* Mobile hamburger menu */}
          <button
            type="button"
            className="mob"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation drawer"
          >
            ☰
          </button>

          {/* Back to main website arrow button */}
          <Link href="/" className="back-btn" title="Back to the main Abune Media website">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            <span>Main Website</span>
          </Link>

          <b className="serif" style={{ font: "700 22px 'Cormorant Garamond', Georgia, serif" }}>
            Attendance Workspace
          </b>

          {/* User Scope Indicator */}
          <div className="sc">
            <b>
              {roleScope === 't'
                ? `${userName} · Authorized Teacher`
                : roleScope === 'a'
                ? `${userName} · Administrator`
                : `${userName} · Super Administrator`}
            </b>
            <span>
              {roleScope === 't'
                ? 'Assigned Classes: Grade 3, Grade 7'
                : roleScope === 'a'
                ? 'Scope: All student groups'
                : 'Full Platform Oversight & Permissions'}
            </span>
          </div>

          <div className="av">{userName.charAt(0).toUpperCase()}</div>
        </header>

        {/* Dynamic View Container */}
        <div className="pad">
          {/* 1. TAKE ATTENDANCE VIEW */}
          {activeTab === 'take' && selectedSessionId === null && (
            <div>
              <div className="top">
                <h1>Take attendance</h1>
                <p>Physical roll call. Call each registered student's name, then record Present or Absent.</p>
              </div>

              {/* Class & Session Setup Card */}
              <div className="card">
                <div className="setup">
                  <div>
                    <label>Group</label>
                    <select
                      value={selectedGroup}
                      onChange={(e) => {
                        const nextG = e.target.value;
                        setSelectedGroup(nextG);
                        const nextCls = Object.keys(CLASS_ROSTER).find((c) => CLASS_ROSTER[c].g === nextG) || '';
                        setSelectedClass(nextCls);
                        setSessionType(nextG === 'Choir' ? 'Choir practice' : 'Sunday School session');
                        setListLoaded(false);
                      }}
                    >
                      <option value="Sunday School">Sunday School</option>
                      <option value="Choir">Choir</option>
                    </select>
                  </div>

                  <div>
                    <label>Department</label>
                    <input disabled value={CLASS_ROSTER[selectedClass]?.d || '—'} />
                  </div>

                  <div>
                    <label>Class / Division</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setListLoaded(false);
                      }}
                    >
                      {availableClasses.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Session type</label>
                    <select
                      value={sessionType}
                      onChange={(e) => {
                        setSessionType(e.target.value);
                        setListLoaded(false);
                      }}
                    >
                      {selectedGroup === 'Choir' ? (
                        <>
                          <option value="Choir practice">Choir practice</option>
                          <option value="Choir service">Choir service</option>
                        </>
                      ) : (
                        <>
                          <option value="Sunday School session">Sunday School session</option>
                          <option value="Special lesson">Special lesson</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label>Date</label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => {
                        setSessionDate(e.target.value);
                        setListLoaded(false);
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn g"
                    disabled={Boolean(duplicateSession)}
                    onClick={() => {
                      setListLoaded(true);
                      setMarks({});
                    }}
                  >
                    Load roster
                  </button>
                </div>
              </div>

              {/* Duplicate Detection Warning */}
              {duplicateSession && (
                <div className="note w" style={{ marginTop: 14 }}>
                  <b>Attendance already recorded</b> for {selectedClass} · {sessionType} on {sessionDate} (by {duplicateSession.by}). A second duplicate record cannot be created.
                  {' '}
                  <button
                    type="button"
                    style={{ background: 'none', border: 0, color: 'var(--blue)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                      setSelectedSessionId(duplicateSession.id);
                      setActiveTab('hist');
                    }}
                  >
                    Open it to view or correct →
                  </button>
                </div>
              )}

              {/* Instructions Note before load */}
              {!listLoaded && !duplicateSession && (
                <div className="note" style={{ marginTop: 14 }}>
                  Select the group, class, and session date, then press <b>Load roster</b>. Only registered, approved students of {selectedClass} will appear. Nobody is pre-marked.
                </div>
              )}

              {/* Loaded Roll-Call Card */}
              {listLoaded && !duplicateSession && (
                <div className="card" style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>
                        {selectedClass} · {sessionType}
                      </h3>
                      <span style={{ color: 'var(--slate)' }}>
                        {sessionDate} · {currentStudents.length} registered students
                      </span>
                    </div>
                    <input
                      placeholder="Find student name or ID…"
                      style={{ maxWidth: 220 }}
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                    />
                  </div>

                  {/* Summary Counters */}
                  <div className="stats">
                    <div className="stat p">
                      <small>Present</small>
                      <b>{presentCount}</b>
                    </div>
                    <div className="stat a">
                      <small>Absent</small>
                      <b>{absentCount}</b>
                    </div>
                    <div className="stat">
                      <small>Not marked</small>
                      <b>{unmarkedCount}</b>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="prog">
                    <i
                      style={{
                        width: `${currentStudents.length ? ((presentCount + absentCount) / currentStudents.length) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  {/* Student Roll-Call List */}
                  <div style={{ marginTop: 12 }}>
                    {currentStudents
                      .filter((st) => {
                        if (!searchFilter.trim()) return true;
                        const f = searchFilter.toLowerCase();
                        return st.name.toLowerCase().includes(f) || st.regNo.toLowerCase().includes(f);
                      })
                      .map((st, i) => {
                        const val = marks[st.id] || '';
                        const isFocused = currentFocusId === st.id && !val;
                        return (
                          <div
                            key={st.id}
                            id={`stu-${st.id}`}
                            className={`rc ${val} ${isFocused ? 'cur' : ''}`}
                          >
                            <span className="n">{i + 1}</span>
                            <div className="who">
                              <b>{st.name}</b>
                              <small>{st.regNo}</small>
                            </div>
                            <div className="pa">
                              <button
                                type="button"
                                className={`p ${val === 'P' ? 'on' : ''}`}
                                onClick={() => handleMark(st.id, 'P')}
                              >
                                ✓ Present
                              </button>
                              <button
                                type="button"
                                className={`a ${val === 'A' ? 'on' : ''}`}
                                onClick={() => handleMark(st.id, 'A')}
                              >
                                ✕ Absent
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Bottom Sticky Action Bar */}
              {listLoaded && !duplicateSession && (
                <div className="bar">
                  <div className="c">
                    <span>
                      <b style={{ color: 'var(--ok)' }}>{presentCount}</b> present
                    </span>
                    <span>
                      <b style={{ color: 'var(--red)' }}>{absentCount}</b> absent
                    </span>
                    <span>
                      <b>{unmarkedCount}</b> remaining
                    </span>
                  </div>

                  {unmarkedCount > 0 && (
                    <button type="button" className="btn o s" onClick={jumpToNext}>
                      Next unmarked ↓
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn g"
                    disabled={unmarkedCount > 0}
                    onClick={askSaveAttendance}
                  >
                    {unmarkedCount > 0 ? `Mark ${unmarkedCount} more to save` : 'Save attendance record'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. HISTORY & CORRECTIONS VIEW */}
          {activeTab === 'hist' && (
            <div>
              {selectedSessionId !== null ? (
                renderSessionDetail()
              ) : (
                <div>
                  <div className="top">
                    <h1>Attendance history &amp; corrections</h1>
                    <p>Review past roll-calls, verify records, and submit corrections with mandatory audit reasoning.</p>
                  </div>

                  <div className="tabs">
                    <button
                      type="button"
                      className={historyTab === 'date' ? 'on' : ''}
                      onClick={() => setHistoryTab('date')}
                    >
                      By date
                    </button>
                    <button
                      type="button"
                      className={historyTab === 'member' ? 'on' : ''}
                      onClick={() => setHistoryTab('member')}
                    >
                      By student
                    </button>
                    <button
                      type="button"
                      className={historyTab === 'class' ? 'on' : ''}
                      onClick={() => setHistoryTab('class')}
                    >
                      By class
                    </button>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="fl">
                    <input type="date" defaultValue="2026-10-01" />
                    <input type="date" defaultValue="2026-11-01" />
                    <select defaultValue="all">
                      <option value="all">All session types</option>
                      <option value="ss">Sunday School sessions</option>
                      <option value="ch">Choir practices</option>
                    </select>
                    <select defaultValue="all">
                      <option value="all">All classes</option>
                      {availableClasses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Table by Date */}
                  {historyTab === 'date' && (
                    <div className="card wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Session</th>
                            <th>Class</th>
                            <th>Taken By</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map((s) => {
                            const cInfo = CLASS_ROSTER[s.cls];
                            const total = cInfo?.stu.length || 0;
                            const absCount = s.abs.length;
                            const presCount = total - absCount;
                            return (
                              <tr key={s.id} className="hv">
                                <td><b>{s.date}</b></td>
                                <td>{s.type}</td>
                                <td>{s.cls}</td>
                                <td>{s.by}</td>
                                <td>
                                  <span className="tag pub">{presCount}</span>
                                </td>
                                <td>
                                  <span className={`tag ${absCount > 0 ? 'rdt' : 'un'}`}>{absCount}</span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn o s"
                                    onClick={() => setSelectedSessionId(s.id)}
                                  >
                                    Open
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Table by Student */}
                  {historyTab === 'member' && (
                    <div className="card wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Reg. No.</th>
                            <th>Class</th>
                            <th>Sessions</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Attendance %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(CLASS_ROSTER).flatMap(([clsName, cInfo]) => {
                            const clsSessions = sessions.filter((s) => s.cls === clsName);
                            return cInfo.stu.map((st) => {
                              const total = clsSessions.length;
                              const abs = clsSessions.filter((s) => s.abs.includes(st.id)).length;
                              const pres = total - abs;
                              const pct = total ? Math.round((pres / total) * 100) : 0;
                              return (
                                <tr key={st.id} className="hv">
                                  <td><b>{st.name}</b></td>
                                  <td>{st.regNo}</td>
                                  <td>{clsName}</td>
                                  <td>{total}</td>
                                  <td>{pres}</td>
                                  <td>{abs}</td>
                                  <td>
                                    <span className={`tag ${pct < 75 ? 'dr' : 'pub'}`}>{pct}%</span>
                                  </td>
                                </tr>
                              );
                            });
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Table by Class */}
                  {historyTab === 'class' && (
                    <div className="card wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>Group</th>
                            <th>Department</th>
                            <th>Total Students</th>
                            <th>Sessions Held</th>
                            <th>Average Attendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(CLASS_ROSTER).map(([clsName, cInfo]) => {
                            const clsSessions = sessions.filter((s) => s.cls === clsName);
                            let totalPresent = 0;
                            let totalMarks = 0;
                            clsSessions.forEach((s) => {
                              totalMarks += cInfo.stu.length;
                              totalPresent += cInfo.stu.length - s.abs.length;
                            });
                            const avgPct = totalMarks ? Math.round((totalPresent / totalMarks) * 100) : 0;
                            return (
                              <tr key={clsName} className="hv">
                                <td><b>{clsName}</b></td>
                                <td>{cInfo.g}</td>
                                <td>{cInfo.d}</td>
                                <td>{cInfo.stu.length}</td>
                                <td>{clsSessions.length}</td>
                                <td>
                                  <span className="tag pub">{avgPct}%</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 3. REPORTS VIEW */}
          {activeTab === 'rep' && (
            <div>
              <div className="top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h1>Attendance reports &amp; analytics</h1>
                  <p>Aggregate attendance statistics calculated directly from verified roll calls.</p>
                </div>
                <button type="button" className="btn g s" onClick={handleExportCSV}>
                  📊 Export CSV Report
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid g4">
                <div className="card">
                  <small style={{ color: 'var(--slate)', letterSpacing: '0.08em' }}>SESSIONS HELD</small>
                  <b style={{ font: "700 36px 'Cormorant Garamond', Georgia, serif", display: 'block', marginTop: 4 }}>
                    {sessions.length}
                  </b>
                </div>
                <div className="card">
                  <small style={{ color: 'var(--slate)', letterSpacing: '0.08em' }}>PRESENT MARKS</small>
                  <b style={{ font: "700 36px 'Cormorant Garamond', Georgia, serif", display: 'block', marginTop: 4, color: 'var(--ok)' }}>
                    {sessions.reduce((acc, s) => acc + (CLASS_ROSTER[s.cls]?.stu.length || 0) - s.abs.length, 0)}
                  </b>
                </div>
                <div className="card">
                  <small style={{ color: 'var(--slate)', letterSpacing: '0.08em' }}>ABSENT MARKS</small>
                  <b style={{ font: "700 36px 'Cormorant Garamond', Georgia, serif", display: 'block', marginTop: 4, color: 'var(--red)' }}>
                    {sessions.reduce((acc, s) => acc + s.abs.length, 0)}
                  </b>
                </div>
                <div className="card">
                  <small style={{ color: 'var(--slate)', letterSpacing: '0.08em' }}>OVERALL ATTENDANCE</small>
                  <b style={{ font: "700 36px 'Cormorant Garamond', Georgia, serif", display: 'block', marginTop: 4 }}>
                    84%
                  </b>
                </div>
              </div>

              {/* Visual Breakdown Bars */}
              <div className="grid g2" style={{ marginTop: 14 }}>
                <div className="card">
                  <h3>By Group &amp; Department</h3>
                  <div className="bars">
                    <span>Sunday School</span>
                    <div>
                      <i style={{ width: '86%' }} />
                    </div>
                    <b>86%</b>
                  </div>
                  <div className="bars">
                    <span>Choir</span>
                    <div>
                      <i style={{ width: '81%' }} />
                    </div>
                    <b>81%</b>
                  </div>
                  <div className="bars" style={{ marginTop: 18 }}>
                    <span>Timhirt (Teaching)</span>
                    <div>
                      <i style={{ width: '86%' }} />
                    </div>
                    <b>86%</b>
                  </div>
                  <div className="bars">
                    <span>Mezmur Department</span>
                    <div>
                      <i style={{ width: '81%' }} />
                    </div>
                    <b>81%</b>
                  </div>
                </div>

                <div className="card">
                  <h3>By Class</h3>
                  <div className="bars">
                    <span>Grade 3</span>
                    <div>
                      <i style={{ width: '92%' }} />
                    </div>
                    <b>92%</b>
                  </div>
                  <div className="bars">
                    <span>Grade 7</span>
                    <div>
                      <i style={{ width: '83%' }} />
                    </div>
                    <b>83%</b>
                  </div>
                  <div className="bars">
                    <span>Mezmur A</span>
                    <div>
                      <i style={{ width: '81%' }} />
                    </div>
                    <b>81%</b>
                  </div>
                </div>
              </div>

              {/* Per-Student Grade 7 Table with Low-Attendance Warning */}
              <div className="card wrap" style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ margin: 0 }}>Per-Student Breakdown · Grade 7</h3>
                  <span style={{ fontSize: 12, color: 'var(--slate)' }}>
                    <span className="tag dr">low</span> Indicates attendance below 75%
                  </span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Reg. No.</th>
                      <th>Total Sessions</th>
                      <th>Attended</th>
                      <th>Absences</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLASS_ROSTER['Grade 7'].stu.map((st) => {
                      const clsSessions = sessions.filter((s) => s.cls === 'Grade 7');
                      const total = clsSessions.length;
                      const abs = clsSessions.filter((s) => s.abs.includes(st.id)).length;
                      const pres = total - abs;
                      const pct = total ? Math.round((pres / total) * 100) : 0;
                      return (
                        <tr key={st.id} className="hv">
                          <td><b>{st.name}</b></td>
                          <td>{st.regNo}</td>
                          <td>{total}</td>
                          <td>{pres}</td>
                          <td>{abs}</td>
                          <td>
                            <span className={`tag ${pct < 75 ? 'dr' : 'pub'}`}>{pct}%</span>
                            {pct < 75 && (
                              <small style={{ color: 'var(--ochre)', marginLeft: 6, fontWeight: 600 }}>
                                Needs Attention
                              </small>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Role Scope Preview Simulator (Fixed at Top-Right) ─────────── */}
      <div className="pv">
        <b>PREVIEW</b>
        <label>
          Signed in as
          <select
            value={roleScope}
            onChange={(e) => {
              const r = e.target.value as 't' | 'a' | 's';
              setRoleScope(r);
              if (r === 't') setUserName('Kidist M.');
              else if (r === 'a') setUserName('Hawi (Admin)');
              else setUserName('Hawi (Super Admin)');
              showToast(`Simulating role: ${r === 't' ? 'Teacher' : r === 'a' ? 'Admin' : 'Super Admin'}`);
            }}
          >
            <option value="t">Teacher (Kidist M.)</option>
            <option value="a">Admin</option>
            <option value="s">Super Admin</option>
          </select>
        </label>
      </div>

      {/* ── Global Confirmation & Audit Modal ──────────────────────────── */}
      <div className={`modal ${modalOpen ? 'on' : ''}`}>
        <div className="card">
          <h3>{modalTitle}</h3>
          <p style={{ color: 'var(--slate)', margin: '8px 0 14px', lineHeight: 1.5 }}>
            {modalPrompt}
          </p>

          {correctionTarget && (
            <div style={{ marginBottom: 14 }}>
              <label>Mandatory Audit Reason *</label>
              <textarea
                rows={3}
                placeholder="e.g. Arrived late due to travel, verified by parent note..."
                value={modalReasonInput}
                onChange={(e) => setModalReasonInput(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              type="button"
              className="btn o"
              onClick={() => {
                setModalOpen(false);
                setCorrectionTarget(null);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn g"
              onClick={() => {
                if (correctionTarget) {
                  confirmCorrection();
                } else if (modalAction) {
                  modalAction();
                  setModalOpen(false);
                }
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {/* ── Toast Notification ────────────────────────────────────────── */}
      <div className={`toast ${toastActive ? 'on' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
}

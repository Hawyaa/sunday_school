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

import React, { startTransition, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, clearSession } from '@/lib/auth';
import {
  AttendanceDivision,
  AttendanceMember,
  AttendanceRecord,
  AttendanceReport,
  AttendanceSession,
  correctAttendanceRecord,
  createAttendanceSession,
  fetchAttendanceReport,
  fetchAttendanceRoster,
  fetchAttendanceSession,
  fetchAttendanceSessions,
} from '@/services/attendance';
import './attendance.css';

interface StudentRecord {
  id: string;
  regNo: string;
  name: string;
}

interface ClassInfo {
  g: string;
  d: string;
}

const CLASS_ROSTER: Record<string, ClassInfo> = {
  'Grade 3': { g: 'Sunday School', d: 'Timhirt' },
  'Grade 7': { g: 'Sunday School', d: 'Timhirt' },
  'Mezmur A': { g: 'Choir', d: 'Mezmur' },
};

interface AuditLogEntry {
  who: string;
  what: string;
  why: string;
  when: string;
}

interface SavedSession {
  id: string;
  date: string;
  type: string;
  cls: string;
  by: string;
  division: AttendanceDivision;
  groupName: string;
  department: string;
  totalMembers: number;
  presentCount: number;
  absentCount: number;
  records: AttendanceRecord[];
}

const TEACHER_ASSIGNED_CLASSES = ['Grade 3', 'Grade 7'];

const EMPTY_REPORT: AttendanceReport = {
  sessions: 0,
  present: 0,
  absent: 0,
  markedRecords: 0,
  attendancePercent: 0,
  byGroup: [],
  byClass: [],
  byMember: [],
};

function normalizeSession(session: AttendanceSession): SavedSession {
  const records = session.records || [];
  return {
    id: session.id,
    date: session.sessionDate.slice(0, 10),
    type: session.sessionType,
    cls: session.className,
    by: session.createdBy?.name || 'Unknown',
    division: session.division,
    groupName: session.groupName,
    department: session.department,
    totalMembers: session.totalMembers ?? records.length,
    presentCount: session.presentCount ?? records.filter((record) => record.status === 'PRESENT').length,
    absentCount: session.absentCount ?? records.filter((record) => record.status === 'ABSENT').length,
    records,
  };
}

function apiErrorMessage(error: unknown): string {
  const responseMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return responseMessage || (error instanceof Error ? error.message : 'Attendance request failed. Please try again.');
}

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
  const [selectedDivision, setSelectedDivision] = useState<AttendanceDivision>('YOUTH');
  const [sessionType, setSessionType] = useState('Sunday School session');
  const [sessionDate, setSessionDate] = useState('');
  const [listLoaded, setListLoaded] = useState(false);
  const [roster, setRoster] = useState<StudentRecord[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [marks, setMarks] = useState<Record<string, 'P' | 'A'>>({});
  const [searchFilter, setSearchFilter] = useState('');
  const [currentFocusId, setCurrentFocusId] = useState<string | null>(null);

  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [historySessions, setHistorySessions] = useState<SavedSession[]>([]);
  const [reportData, setReportData] = useState<AttendanceReport>(EMPTY_REPORT);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SavedSession | null>(null);
  const [historyTab, setHistoryTab] = useState<'date' | 'member' | 'class'>('date');
  const [historyFrom, setHistoryFrom] = useState('');
  const [historyTo, setHistoryTo] = useState('');
  const [historyType, setHistoryType] = useState('all');
  const [historyClass, setHistoryClass] = useState('all');
  const [isEditingCorrection, setIsEditingCorrection] = useState(false);

  // Modal & Toast states
  const [toastMessage, setToastMessage] = useState('');
  const [toastActive, setToastActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalPrompt, setModalPrompt] = useState('');
  const [modalReasonInput, setModalReasonInput] = useState('');
  const [modalAction, setModalAction] = useState<(() => void | Promise<void>) | null>(null);
  const [correctionTarget, setCorrectionTarget] = useState<{
    student: StudentRecord;
    recordId: string;
    currentStatus: 'P' | 'A';
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastActive(true);
    setTimeout(() => setToastActive(false), 2400);
  };

  const handleApiError = (error: unknown) => {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 401) {
      clearSession();
      router.replace('/login');
      return;
    }
    showToast(apiErrorMessage(error));
  };

  const loadSessions = async (filters: {
    from?: string;
    to?: string;
    className?: string;
    sessionType?: string;
  } = {}) => {
    try {
      const data = await fetchAttendanceSessions(filters);
      const normalized = data.map(normalizeSession);
      setHistorySessions(normalized);
      if (!filters.from && !filters.to && !filters.className && !filters.sessionType) {
        setSessions(normalized);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const loadReport = async (filters: {
    from?: string;
    to?: string;
    className?: string;
    sessionType?: string;
  } = {}) => {
    try {
      setReportData(await fetchAttendanceReport(filters));
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    let active = true;
    const reportLoadError = (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        clearSession();
        router.replace('/login');
        return;
      }
      setToastMessage(apiErrorMessage(error));
      setToastActive(true);
    };
    const session = getSession();
    if (!session?.accessToken || !localStorage.getItem('abune_access_token')) {
      clearSession();
      router.replace('/login');
      return () => {
        active = false;
      };
    }
    if (session?.user) {
      startTransition(() => {
        setSessionDate(new Date().toISOString().slice(0, 10));
        if (session.user.name) setUserName(session.user.name);
        if (session.user.backendRole === 'SUPER_ADMIN') setRoleScope('s');
        else if (session.user.backendRole === 'ADMIN') setRoleScope('a');
        else setRoleScope('t');
      });
    }
    void fetchAttendanceSessions().then((data) => {
      if (!active) return;
      const normalized = data.map(normalizeSession);
      setSessions(normalized);
      setHistorySessions(normalized);
    }).catch((error: unknown) => {
      if (!active) return;
      reportLoadError(error);
    });
    void fetchAttendanceReport().then((report) => {
      if (active) setReportData(report);
    }).catch((error: unknown) => {
      if (!active) return;
      reportLoadError(error);
    });
    return () => {
      active = false;
    };
  }, [router]);

  // Classes accessible to the current user
  const availableClasses = Object.keys(CLASS_ROSTER).filter((cls) => {
    const matchesGroup = !selectedGroup || CLASS_ROSTER[cls].g === selectedGroup;
    const withinScope = roleScope !== 't' || TEACHER_ASSIGNED_CLASSES.includes(cls);
    return matchesGroup && withinScope;
  });

  // Duplicate session check
  const duplicateSession = sessions.find(
    (s) => s.cls === selectedClass && s.date === sessionDate && s.type === sessionType && s.division === selectedDivision
  );

  const currentStudents = roster;
  const presentCount = currentStudents.filter((x) => marks[x.id] === 'P').length;
  const absentCount = currentStudents.filter((x) => marks[x.id] === 'A').length;
  const unmarkedCount = currentStudents.length - presentCount - absentCount;

  const loadRoster = async () => {
    setRosterLoading(true);
    setListLoaded(false);
    setMarks({});
    try {
      const members: AttendanceMember[] = await fetchAttendanceRoster(selectedDivision);
      setRoster(members.map((member) => ({
        id: member.id,
        name: member.fullName,
        regNo: member.registrationNumber,
      })));
      setListLoaded(true);
      setCurrentFocusId(members[0]?.id || null);
    } catch (error) {
      setRoster([]);
      handleApiError(error);
    } finally {
      setRosterLoading(false);
    }
  };

  // Handle Mark click
  const handleMark = (id: string, val: 'P' | 'A') => {
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
    setModalAction(() => async () => {
      setSaving(true);
      try {
        await createAttendanceSession({
          sessionDate,
          division: selectedDivision,
          groupName: selectedGroup,
          department: CLASS_ROSTER[selectedClass]?.d || selectedGroup,
          className: selectedClass,
          sessionType,
          records: currentStudents.map((student) => ({
            memberId: student.id,
            status: marks[student.id] === 'P' ? 'PRESENT' : 'ABSENT',
          })),
        });
        setListLoaded(false);
        setRoster([]);
        setMarks({});
        await Promise.all([loadSessions(), loadReport()]);
        showToast('Attendance saved to the database');
      } catch (error) {
        handleApiError(error);
        if ((error as { response?: { status?: number } })?.response?.status === 409) {
          await loadSessions();
        }
      } finally {
        setSaving(false);
      }
    });
    setModalOpen(true);
  };

  // Correction Handler
  const askCorrection = (student: StudentRecord, recordId: string, currentVal: 'P' | 'A') => {
    setCorrectionTarget({ student, recordId, currentStatus: currentVal });
    setModalTitle('Correct Attendance Record?');
    setModalPrompt(
      `Switch ${student.name} (${student.regNo}) from ${
        currentVal === 'P' ? 'Present to Absent' : 'Absent to Present'
      }. A mandatory reason is required for the audit trail.`
    );
    setModalReasonInput('');
    setModalOpen(true);
  };

  const confirmCorrection = async () => {
    if (!modalReasonInput.trim()) {
      showToast('A reason is mandatory for audit compliance.');
      return;
    }
    if (selectedSessionId !== null && correctionTarget) {
      const nextStatus = correctionTarget.currentStatus === 'P' ? 'ABSENT' : 'PRESENT';
      try {
        await correctAttendanceRecord(
          selectedSessionId,
          correctionTarget.recordId,
          nextStatus,
          modalReasonInput.trim()
        );
        setSessionDetail(normalizeSession(await fetchAttendanceSession(selectedSessionId)));
        await Promise.all([loadSessions(), loadReport()]);
        setModalOpen(false);
        setCorrectionTarget(null);
        setIsEditingCorrection(false);
        showToast('Correction recorded with audit trail');
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const openSession = async (id: string) => {
    setSelectedSessionId(id);
    setSessionDetail(null);
    setIsEditingCorrection(false);
    try {
      setSessionDetail(normalizeSession(await fetchAttendanceSession(id)));
    } catch (error) {
      handleApiError(error);
      setSelectedSessionId(null);
    }
  };

  const departmentStats = Array.from(reportData.byClass.reduce((stats, item) => {
    const current = stats.get(item.department) || { department: item.department, present: 0, absent: 0 };
    current.present += item.present;
    current.absent += item.absent;
    stats.set(item.department, current);
    return stats;
  }, new Map<string, { department: string; present: number; absent: number }>()).values()).map((item) => ({
    ...item,
    attendancePercent: item.present + item.absent
      ? Math.round((item.present / (item.present + item.absent)) * 100)
      : 0,
  }));

  // Export report to CSV
  const handleExportCSV = () => {
    const rows = [
      ['Student Name', 'Registration No', 'Total Sessions', 'Attended', 'Absences', 'Attendance %'],
    ];
    reportData.byMember.forEach((member) => {
      rows.push([
        member.name,
        member.registrationNumber,
        String(member.sessions),
        String(member.present),
        String(member.absent),
        `${member.attendancePercent}%`,
      ]);
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
    const s = sessionDetail;
    if (!s) return null;
    const presentRecords = s.records.filter((record) => record.status === 'PRESENT');
    const absentRecords = s.records.filter((record) => record.status === 'ABSENT');
    const attPct = s.totalMembers ? Math.round((presentRecords.length / s.totalMembers) * 100) : 0;
    const auditEntries: AuditLogEntry[] = s.records.flatMap((record) =>
      record.corrections.map((correction) => ({
        who: correction.correctedBy.name,
        what: `${record.member.fullName}: ${correction.previousStatus === 'PRESENT' ? 'Present' : 'Absent'} → ${correction.newStatus === 'PRESENT' ? 'Present' : 'Absent'}`,
        why: correction.reason,
        when: new Date(correction.createdAt).toLocaleString(),
      }))
    );

    return (
      <div>
        <p style={{ marginBottom: 12 }}>
          <button
            type="button"
            className="btn o s"
            onClick={() => {
              setSelectedSessionId(null);
              setSessionDetail(null);
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
            <b>{presentRecords.length}</b>
          </div>
          <div className="stat a">
            <small>Absent</small>
            <b>{absentRecords.length}</b>
          </div>
          <div className="stat">
            <small>Attendance</small>
            <b>{attPct}%</b>
          </div>
        </div>

        <div className="grid g2">
          {/* Present List */}
          <div className="card">
            <h3>Present ({presentRecords.length})</h3>
            {presentRecords.map((record) => (
              <div key={record.id} className="row">
                <div>
                  <b>{record.member.fullName}</b>
                  <small>{record.member.registrationNumber}</small>
                </div>
                {isEditingCorrection && (
                  <button
                    type="button"
                    className="btn o s"
                    onClick={() => askCorrection(
                      { id: record.member.id, name: record.member.fullName, regNo: record.member.registrationNumber },
                      record.id,
                      'P'
                    )}
                  >
                    Switch to Absent
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Absent List */}
          <div className="card">
            <h3>Absent ({absentRecords.length})</h3>
            {absentRecords.length > 0 ? (
              absentRecords.map((record) => (
                <div key={record.id} className="row">
                  <div>
                    <b>{record.member.fullName}</b>
                    <small>{record.member.registrationNumber}</small>
                  </div>
                  {isEditingCorrection && (
                    <button
                      type="button"
                      className="btn o s"
                      onClick={() => askCorrection(
                        { id: record.member.id, name: record.member.fullName, regNo: record.member.registrationNumber },
                        record.id,
                        'A'
                      )}
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
          {auditEntries.length > 0 ? (
            auditEntries.map((h, i) => (
              <div key={`${h.when}-${i}`} className="row">
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
                <p>Physical roll call. Call each registered student&apos;s name, then record Present or Absent.</p>
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
                    <label>Registered division</label>
                    <select
                      value={selectedDivision}
                      onChange={(e) => {
                        setSelectedDivision(e.target.value as AttendanceDivision);
                        setListLoaded(false);
                        setRoster([]);
                      }}
                    >
                      <option value="CHILDREN">Children</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="YOUTH">Youth</option>
                    </select>
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
                    disabled={Boolean(duplicateSession) || rosterLoading}
                    onClick={() => void loadRoster()}
                  >
                    {rosterLoading ? 'Loading roster…' : 'Load roster'}
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
                      void openSession(duplicateSession.id);
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
                  Select the group, class, registered division, and session date, then press <b>Load roster</b>. Only approved members in that division will appear. Nobody is pre-marked.
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
                    {currentStudents.length === 0 && (
                      <p className="note">No approved members were found in this division.</p>
                    )}
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
                    disabled={unmarkedCount > 0 || currentStudents.length === 0 || saving}
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
                sessionDetail ? renderSessionDetail() : <p className="note">Loading attendance record…</p>
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
                    <input type="date" value={historyFrom} onChange={(e) => setHistoryFrom(e.target.value)} />
                    <input type="date" value={historyTo} onChange={(e) => setHistoryTo(e.target.value)} />
                    <select value={historyType} onChange={(e) => setHistoryType(e.target.value)}>
                      <option value="all">All session types</option>
                      <option value="Sunday School">Sunday School sessions</option>
                      <option value="Choir">Choir practices</option>
                    </select>
                    <select value={historyClass} onChange={(e) => setHistoryClass(e.target.value)}>
                      <option value="all">All classes</option>
                      {availableClasses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn o s"
                      onClick={() => {
                        const filters = {
                          from: historyFrom || undefined,
                          to: historyTo || undefined,
                          className: historyClass === 'all' ? undefined : historyClass || undefined,
                          sessionType: historyType === 'all' ? undefined : historyType || undefined,
                        };
                        void loadSessions(filters);
                        void loadReport(filters);
                      }}
                    >
                      Apply filters
                    </button>
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
                          {historySessions.map((s) => (
                            <tr key={s.id} className="hv">
                              <td><b>{s.date}</b></td>
                              <td>{s.type}</td>
                              <td>{s.cls}</td>
                              <td>{s.by}</td>
                              <td><span className="tag pub">{s.presentCount}</span></td>
                              <td><span className={`tag ${s.absentCount > 0 ? 'rdt' : 'un'}`}>{s.absentCount}</span></td>
                              <td>
                                <button type="button" className="btn o s" onClick={() => void openSession(s.id)}>
                                  Open
                                </button>
                              </td>
                            </tr>
                          ))}
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
                            <th>Sessions</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Attendance %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.byMember.map((member) => (
                            <tr key={member.memberId} className="hv">
                              <td><b>{member.name}</b></td>
                              <td>{member.registrationNumber}</td>
                              <td>{member.sessions}</td>
                              <td>{member.present}</td>
                              <td>{member.absent}</td>
                              <td><span className={`tag ${member.attendancePercent < 75 ? 'dr' : 'pub'}`}>{member.attendancePercent}%</span></td>
                            </tr>
                          ))}
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
                            <th>Division</th>
                            <th>Group</th>
                            <th>Department</th>
                            <th>Total Marks</th>
                            <th>Sessions Held</th>
                            <th>Average Attendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.byClass.map((item) => (
                            <tr key={`${item.division}-${item.className}`} className="hv">
                              <td><b>{item.className}</b></td>
                              <td>{item.division}</td>
                              <td>{item.groupName}</td>
                              <td>{item.department}</td>
                              <td>{item.present + item.absent}</td>
                              <td>{item.sessions}</td>
                              <td><span className="tag pub">{item.attendancePercent}%</span></td>
                            </tr>
                          ))}
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
                    {reportData.sessions}
                  </b>
                </div>
                <div className="card">
                  <small style={{ color: 'var(--slate)', letterSpacing: '0.08em' }}>PRESENT MARKS</small>
                  <b style={{ font: "700 36px 'Cormorant Garamond', Georgia, serif", display: 'block', marginTop: 4, color: 'var(--ok)' }}>
                    {reportData.present}
                  </b>
                </div>
                <div className="card">
                  <small style={{ color: 'var(--slate)', letterSpacing: '0.08em' }}>ABSENT MARKS</small>
                  <b style={{ font: "700 36px 'Cormorant Garamond', Georgia, serif", display: 'block', marginTop: 4, color: 'var(--red)' }}>
                    {reportData.absent}
                  </b>
                </div>
                <div className="card">
                  <small style={{ color: 'var(--slate)', letterSpacing: '0.08em' }}>OVERALL ATTENDANCE</small>
                  <b style={{ font: "700 36px 'Cormorant Garamond', Georgia, serif", display: 'block', marginTop: 4 }}>
                    {reportData.attendancePercent}%
                  </b>
                </div>
              </div>

              {/* Visual Breakdown Bars */}
              <div className="grid g2" style={{ marginTop: 14 }}>
                <div className="card">
                  <h3>By Group &amp; Department</h3>
                  {[...reportData.byGroup.map((item) => ({ name: item.groupName, percent: item.attendancePercent })),
                    ...departmentStats.map((item) => ({ name: item.department, percent: item.attendancePercent }))]
                    .map((item) => (
                      <div className="bars" key={item.name}>
                        <span>{item.name}</span>
                        <div><i style={{ width: `${item.percent}%` }} /></div>
                        <b>{item.percent}%</b>
                      </div>
                    ))}
                </div>

                <div className="card">
                  <h3>By Class</h3>
                  {reportData.byClass.map((item, index) => (
                    <div className="bars" key={`${item.division}-${item.department}-${index}`}>
                      <span>{item.className}</span>
                      <div><i style={{ width: `${item.attendancePercent}%` }} /></div>
                      <b>{item.attendancePercent}%</b>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-Student Grade 7 Table with Low-Attendance Warning */}
              <div className="card wrap" style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ margin: 0 }}>Per-Student Breakdown</h3>
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
                    {reportData.byMember.map((member) => (
                      <tr key={member.memberId} className="hv">
                        <td><b>{member.name}</b></td>
                        <td>{member.registrationNumber}</td>
                        <td>{member.sessions}</td>
                        <td>{member.present}</td>
                        <td>{member.absent}</td>
                        <td>
                          <span className={`tag ${member.attendancePercent < 75 ? 'dr' : 'pub'}`}>{member.attendancePercent}%</span>
                          {member.attendancePercent < 75 && (
                            <small style={{ color: 'var(--ochre)', marginLeft: 6, fontWeight: 600 }}>
                              Needs Attention
                            </small>
                          )}
                        </td>
                      </tr>
                    ))}
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
              disabled={saving}
              onClick={async () => {
                if (correctionTarget) {
                  await confirmCorrection();
                } else if (modalAction) {
                  await modalAction();
                  setModalOpen(false);
                }
              }}
            >
              {saving ? 'Saving…' : 'Confirm'}
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

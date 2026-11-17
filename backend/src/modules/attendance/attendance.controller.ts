import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess, sendError } from '../../utils/response';

/**
 * Record a new attendance session with student roll-call records.
 * Enforces duplicate session detection and class assignment scoping.
 */
export async function recordAttendanceSession(req: Request, res: Response): Promise<void> {
  const admin = req.admin;
  if (!admin) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const { date, sessionType, className, academicYear, notes, records } = req.body;

  // 1. Check class assignment permissions for non-Super Admins
  if (admin.role !== 'SUPER_ADMIN' && admin.assignedClasses) {
    const allowed = admin.assignedClasses
      .split(',')
      .map((c: string) => c.trim().toLowerCase());
    if (allowed.length > 0 && !allowed.includes(className.trim().toLowerCase())) {
      sendError(
        res,
        `You are not authorized to take attendance for class "${className}". Permitted classes: ${admin.assignedClasses}`,
        403
      );
      return;
    }
  }

  // 2. Parse date boundaries to detect duplicates on the same day
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await prisma.attendanceSession.findFirst({
    where: {
      className: className.trim(),
      sessionType: sessionType.trim(),
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      recordedBy: { select: { name: true, email: true } },
    },
  });

  if (existing) {
    sendError(
      res,
      `An attendance session for "${className}" (${sessionType}) on ${targetDate.toISOString().split('T')[0]} has already been finalized by ${existing.recordedBy.name}. Please edit or correct the existing session instead of duplicating.`,
      409
    );
    return;
  }

  // 3. Create session & records in an atomic transaction
  try {
    const session = await prisma.$transaction(async (tx) => {
      const createdSession = await tx.attendanceSession.create({
        data: {
          date: targetDate,
          sessionType: sessionType.trim(),
          className: className.trim(),
          academicYear: academicYear || '2026/2027',
          notes: notes?.trim() || null,
          recordedById: admin.id,
          status: 'FINALIZED',
        },
      });

      // Bulk create attendance records
      const recordData = records.map((r: { memberId: string; status: string; remarks?: string }) => ({
        sessionId: createdSession.id,
        memberId: r.memberId,
        status: r.status,
        remarks: r.remarks?.trim() || null,
      }));

      await tx.attendanceRecord.createMany({
        data: recordData,
      });

      return createdSession;
    });

    const presentCount = records.filter((r: { status: string }) => r.status === 'PRESENT').length;
    const absentCount = records.filter((r: { status: string }) => r.status === 'ABSENT').length;

    sendSuccess(
      res,
      {
        sessionId: session.id,
        date: session.date,
        className: session.className,
        sessionType: session.sessionType,
        totalStudents: records.length,
        presentCount,
        absentCount,
      },
      'Attendance session saved and finalized successfully.',
      201
    );
  } catch (error: any) {
    sendError(res, error.message || 'Failed to save attendance session', 500);
  }
}

/**
 * List past attendance sessions with filters and pagination.
 */
export async function getAttendanceSessions(req: Request, res: Response): Promise<void> {
  const { className, sessionType, startDate, endDate, page = 1, limit = 20 } = req.query as any;

  const where: any = {};
  if (className) where.className = { contains: String(className) };
  if (sessionType) where.sessionType = { contains: String(sessionType) };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(String(startDate));
    if (endDate) where.date.lte = new Date(String(endDate));
  }

  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  const [total, sessions] = await Promise.all([
    prisma.attendanceSession.count({ where }),
    prisma.attendanceSession.findMany({
      where,
      skip,
      take,
      orderBy: { date: 'desc' },
      include: {
        recordedBy: { select: { id: true, name: true, email: true } },
        records: { select: { status: true } },
      },
    }),
  ]);

  const data = sessions.map((s) => {
    const present = s.records.filter((r) => r.status === 'PRESENT').length;
    const absent = s.records.filter((r) => r.status === 'ABSENT').length;
    const total = s.records.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      id: s.id,
      date: s.date,
      sessionType: s.sessionType,
      className: s.className,
      academicYear: s.academicYear,
      recordedBy: s.recordedBy.name,
      totalStudents: total,
      presentCount: present,
      absentCount: absent,
      attendanceRate: rate,
      status: s.status,
      notes: s.notes,
    };
  });

  const totalPages = Math.ceil(total / take);

  sendSuccess(res, data, 'Attendance sessions retrieved', 200, {
    page: Number(page),
    limit: take,
    total,
    totalPages,
    hasNext: Number(page) < totalPages,
    hasPrev: Number(page) > 1,
  });
}

/**
 * Get single attendance session with student roster and audit trail.
 */
export async function getAttendanceSessionById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const session = await prisma.attendanceSession.findUnique({
    where: { id },
    include: {
      recordedBy: { select: { id: true, name: true, email: true, role: true } },
      records: {
        include: {
          member: {
            select: {
              id: true,
              registrationNumber: true,
              fullName: true,
              christianName: true,
              gender: true,
              division: true,
              photoUrl: true,
            },
          },
        },
        orderBy: { member: { fullName: 'asc' } },
      },
      auditLogs: {
        include: {
          changedBy: { select: { id: true, name: true, email: true } },
          member: { select: { fullName: true, registrationNumber: true } },
        },
        orderBy: { timestamp: 'desc' },
      },
    },
  });

  if (!session) {
    sendError(res, 'Attendance session not found', 404);
    return;
  }

  sendSuccess(res, session, 'Attendance session details retrieved');
}

/**
 * Correct an attendance record with mandatory reason and immutable audit log.
 */
export async function correctAttendanceRecord(req: Request, res: Response): Promise<void> {
  const admin = req.admin;
  if (!admin) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const { id: sessionId } = req.params;
  const { memberId, newStatus, reason } = req.body;

  if (!reason || reason.trim().length < 5) {
    sendError(res, 'A clear reason of at least 5 characters is mandatory for audit trail logs', 400);
    return;
  }

  const existingRecord = await prisma.attendanceRecord.findUnique({
    where: {
      sessionId_memberId: {
        sessionId,
        memberId,
      },
    },
  });

  if (!existingRecord) {
    sendError(res, 'Student attendance record not found for this session', 404);
    return;
  }

  if (existingRecord.status === newStatus) {
    sendError(res, `Student is already marked as ${newStatus}`, 400);
    return;
  }

  const previousStatus = existingRecord.status;

  // Execute update and audit log in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.attendanceRecord.update({
      where: { id: existingRecord.id },
      data: { status: newStatus },
    });

    const audit = await tx.attendanceAuditLog.create({
      data: {
        sessionId,
        recordId: existingRecord.id,
        memberId,
        previousStatus,
        newStatus,
        changedById: admin.id,
        reason: reason.trim(),
      },
    });

    return { updated, audit };
  });

  sendSuccess(
    res,
    result,
    `Attendance status updated from ${previousStatus} to ${newStatus}. Audit log entry recorded.`
  );
}

/**
 * Get student roll-call roster for a class/division.
 */
export async function getRosterForAttendance(req: Request, res: Response): Promise<void> {
  const { className, division } = req.query as any;

  const where: any = {
    status: 'APPROVED',
  };

  if (division) {
    where.division = String(division).toUpperCase();
  }

  if (className) {
    where.OR = [
      { assignedClass: { contains: String(className) } },
      { schoolOrOccupation: { contains: String(className) } },
    ];
  }

  const students = await prisma.memberRegistration.findMany({
    where,
    select: {
      id: true,
      registrationNumber: true,
      fullName: true,
      christianName: true,
      gender: true,
      division: true,
      assignedClass: true,
      photoUrl: true,
      phoneNumber: true,
    },
    orderBy: { fullName: 'asc' },
  });

  sendSuccess(res, students, `Found ${students.length} approved students for attendance`);
}

/**
 * Get aggregate attendance analytics for dashboards.
 */
export async function getAttendanceStats(_req: Request, res: Response): Promise<void> {
  const [totalSessions, totalRecords, presentRecords] = await Promise.all([
    prisma.attendanceSession.count(),
    prisma.attendanceRecord.count(),
    prisma.attendanceRecord.count({ where: { status: 'PRESENT' } }),
  ]);

  const overallRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  // Class breakdown
  const sessions = await prisma.attendanceSession.findMany({
    include: {
      records: { select: { status: true } },
    },
    take: 50,
    orderBy: { date: 'desc' },
  });

  const classMap: Record<string, { sessions: number; present: number; total: number }> = {};
  sessions.forEach((s) => {
    if (!classMap[s.className]) {
      classMap[s.className] = { sessions: 0, present: 0, total: 0 };
    }
    classMap[s.className].sessions += 1;
    classMap[s.className].present += s.records.filter((r) => r.status === 'PRESENT').length;
    classMap[s.className].total += s.records.length;
  });

  const classBreakdown = Object.entries(classMap).map(([name, stat]) => ({
    className: name,
    sessionsCount: stat.sessions,
    totalRecords: stat.total,
    presentRecords: stat.present,
    rate: stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0,
  }));

  sendSuccess(res, {
    totalSessions,
    totalRecords,
    presentRecords,
    absentRecords: totalRecords - presentRecords,
    overallRate,
    classBreakdown,
  });
}

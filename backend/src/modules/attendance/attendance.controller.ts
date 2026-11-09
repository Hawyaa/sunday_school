import { AttendanceStatus, Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { sendError, sendSuccess } from '../../utils/response';

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export async function getAttendanceRoster(req: Request, res: Response): Promise<void> {
  const { division, department, search } = req.query as {
    division?: 'CHILDREN' | 'INTERMEDIATE' | 'YOUTH';
    department?: string;
    search?: string;
  };
  const where: Prisma.MemberRegistrationWhereInput = {
    status: 'APPROVED',
    ...(division && { division }),
    ...(department && { preferredDepartment: department }),
    ...(search && {
      OR: [
        { fullName: { contains: search } },
        { registrationNumber: { contains: search } },
      ],
    }),
  };

  const members = await prisma.memberRegistration.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      christianName: true,
      registrationNumber: true,
      division: true,
      preferredDepartment: true,
    },
    orderBy: [{ fullName: 'asc' }, { registrationNumber: 'asc' }],
  });

  sendSuccess(res, members, 'Approved attendance roster retrieved');
}

export async function createAttendanceSession(req: Request, res: Response): Promise<void> {
  const { sessionDate, division, groupName, department, className, sessionType, records } = req.body;
  const memberIds = records.map((record: { memberId: string }) => record.memberId);

  const approvedMembers = await prisma.memberRegistration.findMany({
    where: { id: { in: memberIds }, division, status: 'APPROVED' },
    select: { id: true },
  });
  if (approvedMembers.length !== memberIds.length) {
    sendError(res, 'Every attendance mark must reference an approved member in the selected division', 400);
    return;
  }

  try {
    const session = await prisma.attendanceSession.create({
      data: {
        sessionDate: parseDate(sessionDate),
        division,
        groupName,
        department,
        className,
        sessionType,
        createdById: req.admin!.id,
        records: {
          create: records.map((record: { memberId: string; status: AttendanceStatus }) => ({
            memberId: record.memberId,
            status: record.status,
          })),
        },
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        records: {
          include: {
            member: { select: { id: true, fullName: true, registrationNumber: true } },
          },
        },
      },
    });
    sendSuccess(res, session, 'Attendance session recorded', 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      sendError(res, 'An attendance session already exists for this class, type, division, and date', 409);
      return;
    }
    throw error;
  }
}

export async function getAttendanceSessions(req: Request, res: Response): Promise<void> {
  const { page, limit, from, to, division, className, sessionType } = req.query as unknown as {
    page: number;
    limit: number;
    from?: string;
    to?: string;
    division?: 'CHILDREN' | 'INTERMEDIATE' | 'YOUTH';
    className?: string;
    sessionType?: string;
  };
  const where: Prisma.AttendanceSessionWhereInput = {
    ...(division && { division }),
    ...(className && { className: { contains: className } }),
    ...(sessionType && { sessionType: { contains: sessionType } }),
    ...(from || to ? {
      sessionDate: {
        ...(from && { gte: parseDate(from) }),
        ...(to && { lte: parseDate(to) }),
      },
    } : {}),
  };
  const skip = (page - 1) * limit;
  const [total, sessions] = await Promise.all([
    prisma.attendanceSession.count({ where }),
    prisma.attendanceSession.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ sessionDate: 'desc' }, { createdAt: 'desc' }],
      include: {
        createdBy: { select: { id: true, name: true } },
        records: { select: { status: true } },
      },
    }),
  ]);
  const data = sessions.map(({ records, ...session }) => ({
    ...session,
    totalMembers: records.length,
    presentCount: records.filter((record) => record.status === 'PRESENT').length,
    absentCount: records.filter((record) => record.status === 'ABSENT').length,
  }));
  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, data, 'Attendance sessions retrieved', 200, {
    page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1,
  });
}

export async function getAttendanceSessionById(req: Request, res: Response): Promise<void> {
  const session = await prisma.attendanceSession.findUnique({
    where: { id: req.params.id },
    include: {
      createdBy: { select: { id: true, name: true } },
      records: {
        include: {
          member: { select: { id: true, fullName: true, registrationNumber: true, division: true } },
          corrections: {
            include: { correctedBy: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { member: { fullName: 'asc' } },
      },
    },
  });
  if (!session) {
    sendError(res, 'Attendance session not found', 404);
    return;
  }
  sendSuccess(res, session, 'Attendance session details retrieved');
}

export async function correctAttendanceRecord(req: Request, res: Response): Promise<void> {
  const { status, reason } = req.body as { status: AttendanceStatus; reason: string };
  const record = await prisma.attendanceRecord.findFirst({
    where: { id: req.params.recordId, sessionId: req.params.id },
  });
  if (!record) {
    sendError(res, 'Attendance record not found in this session', 404);
    return;
  }
  if (record.status === status) {
    sendError(res, 'The attendance record already has the requested status', 400);
    return;
  }

  const updated = await prisma.$transaction(async (transaction) => {
    await transaction.attendanceCorrection.create({
      data: {
        attendanceRecordId: record.id,
        previousStatus: record.status,
        newStatus: status,
        reason,
        correctedById: req.admin!.id,
      },
    });
    return transaction.attendanceRecord.update({
      where: { id: record.id },
      data: { status },
      include: {
        member: { select: { id: true, fullName: true, registrationNumber: true } },
        corrections: {
          include: { correctedBy: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  });
  sendSuccess(res, updated, 'Attendance correction saved to the audit trail');
}

export async function getAttendanceReport(req: Request, res: Response): Promise<void> {
  const { from, to, division, className, sessionType } = req.query as {
    from?: string;
    to?: string;
    division?: 'CHILDREN' | 'INTERMEDIATE' | 'YOUTH';
    className?: string;
    sessionType?: string;
  };
  const where: Prisma.AttendanceSessionWhereInput = {
    ...(division && { division }),
    ...(className && { className: { contains: className } }),
    ...(sessionType && { sessionType: { contains: sessionType } }),
    ...(from || to ? {
      sessionDate: {
        ...(from && { gte: parseDate(from) }),
        ...(to && { lte: parseDate(to) }),
      },
    } : {}),
  };
  const sessions = await prisma.attendanceSession.findMany({
    where,
    orderBy: { sessionDate: 'desc' },
    include: {
      records: {
        include: {
          member: { select: { id: true, fullName: true, registrationNumber: true } },
        },
      },
    },
  });
  const totals = { sessions: sessions.length, present: 0, absent: 0 };
  const groups = new Map<string, { sessions: number; present: number; absent: number }>();
  const classes = new Map<string, { division: string; groupName: string; department: string; sessions: number; present: number; absent: number }>();
  const members = new Map<string, { memberId: string; name: string; registrationNumber: string; sessions: number; present: number; absent: number }>();

  for (const session of sessions) {
    const group = groups.get(session.groupName) ?? { sessions: 0, present: 0, absent: 0 };
    group.sessions += 1;
    const classKey = `${session.division}:${session.className}`;
    const classSummary = classes.get(classKey) ?? {
      division: session.division, groupName: session.groupName, department: session.department,
      sessions: 0, present: 0, absent: 0,
    };
    classSummary.sessions += 1;

    for (const record of session.records) {
      const isPresent = record.status === 'PRESENT';
      if (isPresent) {
        totals.present += 1;
        group.present += 1;
        classSummary.present += 1;
      } else {
        totals.absent += 1;
        group.absent += 1;
        classSummary.absent += 1;
      }
      const member = members.get(record.memberId) ?? {
        memberId: record.member.id,
        name: record.member.fullName,
        registrationNumber: record.member.registrationNumber,
        sessions: 0,
        present: 0,
        absent: 0,
      };
      member.sessions += 1;
      if (isPresent) member.present += 1;
      else member.absent += 1;
      members.set(record.memberId, member);
    }
    groups.set(session.groupName, group);
    classes.set(classKey, classSummary);
  }

  const percentage = (present: number, absent: number) => {
    const marked = present + absent;
    return marked ? Math.round((present / marked) * 100) : 0;
  };
  sendSuccess(res, {
    ...totals,
    markedRecords: totals.present + totals.absent,
    attendancePercent: percentage(totals.present, totals.absent),
    byGroup: Array.from(groups, ([groupName, value]) => ({
      groupName, ...value, attendancePercent: percentage(value.present, value.absent),
    })),
    byClass: Array.from(classes.values()).map((value) => ({
      ...value, attendancePercent: percentage(value.present, value.absent),
    })),
    byMember: Array.from(members.values()).map((value) => ({
      ...value, attendancePercent: percentage(value.present, value.absent),
    })).sort((a, b) => a.name.localeCompare(b.name)),
  }, 'Attendance report calculated');
}
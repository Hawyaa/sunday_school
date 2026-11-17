import { z } from 'zod';

export const createAttendanceSessionSchema = z.object({
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  sessionType: z.string().min(2, 'Session type is required'),
  className: z.string().min(1, 'Class name is required'),
  academicYear: z.string().optional(),
  notes: z.string().optional(),
  records: z
    .array(
      z.object({
        memberId: z.string().uuid('Invalid member ID'),
        status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
        remarks: z.string().optional(),
      })
    )
    .min(1, 'At least one student record is required to submit attendance'),
});

export const correctAttendanceRecordSchema = z.object({
  memberId: z.string().uuid('Invalid member ID'),
  newStatus: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  reason: z.string().min(5, 'A clear reason of at least 5 characters is required for audit logs'),
});

export const queryAttendanceSessionsSchema = z.object({
  className: z.string().optional(),
  sessionType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

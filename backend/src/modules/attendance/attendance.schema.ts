import { z } from 'zod';

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format')
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, 'Invalid calendar date');

export const attendanceDivisionSchema = z.enum(['CHILDREN', 'INTERMEDIATE', 'YOUTH']);
export const attendanceStatusSchema = z.enum(['PRESENT', 'ABSENT']);

export const rosterQuerySchema = z.object({
  division: attendanceDivisionSchema.optional(),
  department: z.string().trim().min(1).optional(),
  search: z.string().trim().optional(),
});

export const createAttendanceSessionSchema = z.object({
  sessionDate: dateOnlySchema,
  division: attendanceDivisionSchema,
  groupName: z.string().trim().min(1).max(100),
  department: z.string().trim().min(1).max(100),
  className: z.string().trim().min(1).max(100),
  sessionType: z.string().trim().min(1).max(100),
  records: z.array(z.object({
    memberId: z.string().uuid(),
    status: attendanceStatusSchema,
  })).min(1),
}).superRefine((data, ctx) => {
  const memberIds = data.records.map((record) => record.memberId);
  if (new Set(memberIds).size !== memberIds.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['records'], message: 'A member can only be marked once per session' });
  }
});

const attendanceQueryFields = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  from: dateOnlySchema.optional(),
  to: dateOnlySchema.optional(),
  division: attendanceDivisionSchema.optional(),
  className: z.string().trim().optional(),
  sessionType: z.string().trim().optional(),
};

const validateDateRange = (query: { from?: string; to?: string }, ctx: z.RefinementCtx) => {
  if (query.from && query.to && query.from > query.to) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['from'], message: 'from must be on or before to' });
  }
};

export const attendanceSessionsQuerySchema = z.object(attendanceQueryFields).superRefine(validateDateRange);

export const attendanceReportQuerySchema = z
  .object(attendanceQueryFields)
  .omit({ page: true, limit: true })
  .superRefine(validateDateRange);

export const attendanceCorrectionSchema = z.object({
  status: attendanceStatusSchema,
  reason: z.string().trim().min(5, 'Correction reason must be at least 5 characters').max(2000),
});
import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  correctAttendanceRecord,
  createAttendanceSession,
  getAttendanceReport,
  getAttendanceRoster,
  getAttendanceSessionById,
  getAttendanceSessions,
} from './attendance.controller';
import {
  attendanceCorrectionSchema,
  attendanceReportQuerySchema,
  attendanceSessionsQuerySchema,
  createAttendanceSessionSchema,
  rosterQuerySchema,
} from './attendance.schema';

const attendanceRouter = Router();
attendanceRouter.use(authenticate);

/**
 * @openapi
 * /api/admin/attendance/roster:
 *   get:
 *     tags: [Attendance]
 *     summary: Get approved members for attendance
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: division
 *         schema: { type: string, enum: [CHILDREN, INTERMEDIATE, YOUTH] }
 *       - in: query
 *         name: department
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Approved member roster }
 *       401: { description: Unauthorized }
 */
attendanceRouter.get('/roster', validate({ query: rosterQuerySchema }), getAttendanceRoster);

/**
 * @openapi
 * /api/admin/attendance/sessions:
 *   get:
 *     tags: [Attendance]
 *     summary: List attendance sessions
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: division
 *         schema: { type: string, enum: [CHILDREN, INTERMEDIATE, YOUTH] }
 *       - in: query
 *         name: className
 *         schema: { type: string }
 *       - in: query
 *         name: sessionType
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated sessions with present and absent totals }
 */
attendanceRouter.get('/sessions', validate({ query: attendanceSessionsQuerySchema }), getAttendanceSessions);

/**
 * @openapi
 * /api/admin/attendance/sessions:
 *   post:
 *     tags: [Attendance]
 *     summary: Record an attendance session
 *     description: All marks must reference approved members from the selected division. A duplicate class/session/date combination returns 409.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionDate, division, groupName, department, className, sessionType, records]
 *             properties:
 *               sessionDate: { type: string, format: date, example: '2026-11-08' }
 *               division: { type: string, enum: [CHILDREN, INTERMEDIATE, YOUTH] }
 *               groupName: { type: string, example: 'Sunday School' }
 *               department: { type: string, example: 'Timhirt' }
 *               className: { type: string, example: 'Grade 7' }
 *               sessionType: { type: string, example: 'Sunday School session' }
 *               records:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [memberId, status]
 *                   properties:
 *                     memberId: { type: string, format: uuid }
 *                     status: { type: string, enum: [PRESENT, ABSENT] }
 *     responses:
 *       201: { description: Session recorded }
 *       400: { description: Invalid roster or payload }
 *       409: { description: Duplicate session }
 */
attendanceRouter.post('/sessions', validate({ body: createAttendanceSessionSchema }), createAttendanceSession);

/**
 * @openapi
 * /api/admin/attendance/sessions/{id}:
 *   get:
 *     tags: [Attendance]
 *     summary: Get a session and its correction history
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Session, member marks, and audit history }
 *       404: { description: Session not found }
 */
attendanceRouter.get('/sessions/:id', getAttendanceSessionById);

/**
 * @openapi
 * /api/admin/attendance/sessions/{id}/records/{recordId}:
 *   patch:
 *     tags: [Attendance]
 *     summary: Correct an attendance mark
 *     description: Every change requires a reason and writes an immutable audit record.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status, reason]
 *             properties:
 *               status: { type: string, enum: [PRESENT, ABSENT] }
 *               reason: { type: string, minLength: 5, example: 'Arrived late, verified by class teacher' }
 *     responses:
 *       200: { description: Corrected record with audit history }
 *       400: { description: Invalid correction }
 *       404: { description: Session record not found }
 */
attendanceRouter.patch('/sessions/:id/records/:recordId', validate({ body: attendanceCorrectionSchema }), correctAttendanceRecord);

/**
 * @openapi
 * /api/admin/attendance/reports:
 *   get:
 *     tags: [Attendance]
 *     summary: Calculate attendance analytics
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: division
 *         schema: { type: string, enum: [CHILDREN, INTERMEDIATE, YOUTH] }
 *       - in: query
 *         name: className
 *         schema: { type: string }
 *       - in: query
 *         name: sessionType
 *         schema: { type: string }
 *     responses:
 *       200: { description: Totals and attendance percentages by group, class, and member }
 */
attendanceRouter.get('/reports', validate({ query: attendanceReportQuerySchema }), getAttendanceReport);

export default attendanceRouter;
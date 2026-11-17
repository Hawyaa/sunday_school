import { Router } from 'express';
import {
  recordAttendanceSession,
  getAttendanceSessions,
  getAttendanceSessionById,
  correctAttendanceRecord,
  getRosterForAttendance,
  getAttendanceStats,
} from './attendance.controller';
import { authenticate, authorizeAttendanceTaker } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createAttendanceSessionSchema,
  correctAttendanceRecordSchema,
} from './attendance.schema';

const router = Router();

// All attendance routes require valid JWT authentication and attendance authorization
router.use(authenticate);
router.use(authorizeAttendanceTaker);

/**
 * @route   GET /api/attendance/stats
 * @desc    Aggregate attendance analytics (rates, class breakdowns)
 */
router.get('/stats', getAttendanceStats);

/**
 * @route   GET /api/attendance/roster
 * @desc    Get student list for taking roll-call
 */
router.get('/roster', getRosterForAttendance);

/**
 * @route   GET /api/attendance/sessions
 * @desc    Query past attendance sessions with filters
 */
router.get('/sessions', getAttendanceSessions);

/**
 * @route   POST /api/attendance/sessions
 * @desc    Record and finalize a new roll-call session
 */
router.post(
  '/sessions',
  validate({ body: createAttendanceSessionSchema }),
  recordAttendanceSession
);

/**
 * @route   GET /api/attendance/sessions/:id
 * @desc    Get session details with records and audit trail
 */
router.get('/sessions/:id', getAttendanceSessionById);

/**
 * @route   POST /api/attendance/sessions/:id/correct
 * @desc    Submit record correction with required audit log reason
 */
router.post(
  '/sessions/:id/correct',
  validate({ body: correctAttendanceRecordSchema }),
  correctAttendanceRecord
);

export default router;

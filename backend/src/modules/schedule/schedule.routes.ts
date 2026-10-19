import { Router } from 'express';
import {
  getPublicSchedule,
  getPublicScheduleById,
  getAdminSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from './schedule.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createScheduleSchema, updateScheduleSchema } from './schedule.schema';

export const publicScheduleRouter = Router();
export const adminScheduleRouter = Router();

/**
 * @openapi
 * /api/schedule:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: List Public Schedules
 *     parameters:
 *       - in: query
 *         name: dayOfWeek
 *         schema: { type: string, example: "Sunday" }
 *       - in: query
 *         name: targetGroup
 *         schema: { type: string, example: "Youth" }
 *     responses:
 *       200:
 *         description: List of schedules
 */
publicScheduleRouter.get('/', getPublicSchedule);

/**
 * @openapi
 * /api/schedule/{id}:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: Get Public Schedule Details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Schedule item
 *       404:
 *         description: Not found
 */
publicScheduleRouter.get('/:id', getPublicScheduleById);

adminScheduleRouter.use(authenticate);

/**
 * @openapi
 * /api/admin/schedule:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: List Schedules for Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isPublished
 *         schema: { type: boolean }
 *       - in: query
 *         name: dayOfWeek
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Admin schedule list
 */
adminScheduleRouter.get('/', getAdminSchedules);

/**
 * @openapi
 * /api/admin/schedule:
 *   post:
 *     tags:
 *       - Schedule
 *     summary: Create Schedule Item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - activity
 *               - startTime
 *               - endTime
 *             properties:
 *               title: { type: string, example: "Weekly Sunday School Morning Class" }
 *               activity: { type: string, example: "Hymn practice and Ge'ez instruction" }
 *               dayOfWeek: { type: string, example: "Sunday" }
 *               startTime: { type: string, example: "08:30" }
 *               endTime: { type: string, example: "10:30" }
 *               targetGroup: { type: string, example: "Children and Youth" }
 *               location: { type: string, example: "Room 3" }
 *               isPublished: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Schedule created
 */
adminScheduleRouter.post('/', validate({ body: createScheduleSchema }), createSchedule);

/**
 * @openapi
 * /api/admin/schedule/{id}:
 *   put:
 *     tags:
 *       - Schedule
 *     summary: Update Schedule Item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Schedule updated
 */
adminScheduleRouter.put('/:id', validate({ body: updateScheduleSchema }), updateSchedule);

/**
 * @openapi
 * /api/admin/schedule/{id}:
 *   delete:
 *     tags:
 *       - Schedule
 *     summary: Delete Schedule Item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Schedule deleted
 */
adminScheduleRouter.delete('/:id', deleteSchedule);

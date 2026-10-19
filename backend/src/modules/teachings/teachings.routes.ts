import { Router } from 'express';
import {
  getPublicTeachings,
  getPublicTeachingById,
  getAdminTeachings,
  createTeaching,
  updateTeaching,
  deleteTeaching,
} from './teachings.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createTeachingSchema, updateTeachingSchema } from './teachings.schema';

export const publicTeachingsRouter = Router();
export const adminTeachingsRouter = Router();

/**
 * @openapi
 * /api/teachings:
 *   get:
 *     tags:
 *       - Teachings
 *     summary: List Public Teachings
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of public teachings
 */
publicTeachingsRouter.get('/', getPublicTeachings);

/**
 * @openapi
 * /api/teachings/{id}:
 *   get:
 *     tags:
 *       - Teachings
 *     summary: Get Public Teaching Details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Teaching details
 *       404:
 *         description: Teaching not found
 */
publicTeachingsRouter.get('/:id', getPublicTeachingById);

adminTeachingsRouter.use(authenticate);

/**
 * @openapi
 * /api/admin/teachings:
 *   get:
 *     tags:
 *       - Teachings
 *     summary: List Teachings for Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: isPublished
 *         schema: { type: boolean }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Admin teachings list
 */
adminTeachingsRouter.get('/', getAdminTeachings);

/**
 * @openapi
 * /api/admin/teachings:
 *   post:
 *     tags:
 *       - Teachings
 *     summary: Create New Teaching
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
 *               - content
 *             properties:
 *               title: { type: string, example: "Orthodox Fasting Traditions" }
 *               content: { type: string, example: "Detailed explanation of the holy fasts and their spiritual importance..." }
 *               author: { type: string, example: "Deacon Melaku" }
 *               category: { type: string, example: "Orthodox Doctrine" }
 *               mediaUrl: { type: string, example: "https://youtube.com/watch?v=example" }
 *               isPublished: { type: boolean, example: true }
 *               publishedAt: { type: string, format: date-time, example: "2026-10-10T14:00:00.000Z" }
 *     responses:
 *       201:
 *         description: Teaching created
 */
adminTeachingsRouter.post('/', validate({ body: createTeachingSchema }), createTeaching);

/**
 * @openapi
 * /api/admin/teachings/{id}:
 *   put:
 *     tags:
 *       - Teachings
 *     summary: Update Teaching
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               author: { type: string }
 *               category: { type: string }
 *               mediaUrl: { type: string }
 *               isPublished: { type: boolean }
 *               publishedAt: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Teaching updated
 */
adminTeachingsRouter.put('/:id', validate({ body: updateTeachingSchema }), updateTeaching);

/**
 * @openapi
 * /api/admin/teachings/{id}:
 *   delete:
 *     tags:
 *       - Teachings
 *     summary: Delete Teaching
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Teaching deleted
 */
adminTeachingsRouter.delete('/:id', deleteTeaching);

import { Router } from 'express';
import {
  getPublicMezmurs,
  getPublicMezmurById,
  getAdminMezmurs,
  createMezmur,
  updateMezmur,
  deleteMezmur,
} from './mezmur.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createMezmurSchema, updateMezmurSchema } from './mezmur.schema';

export const publicMezmurRouter = Router();
export const adminMezmurRouter = Router();

/**
 * @openapi
 * /api/mezmur:
 *   get:
 *     tags:
 *       - Mezmur
 *     summary: List Public Mezmurs (Hymns)
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
 *         description: List of hymns
 */
publicMezmurRouter.get('/', getPublicMezmurs);

/**
 * @openapi
 * /api/mezmur/{id}:
 *   get:
 *     tags:
 *       - Mezmur
 *     summary: Get Public Mezmur by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Mezmur details with lyrics
 *       404:
 *         description: Mezmur not found or not published
 */
publicMezmurRouter.get('/:id', getPublicMezmurById);

adminMezmurRouter.use(authenticate);

/**
 * @openapi
 * /api/admin/mezmur:
 *   get:
 *     tags:
 *       - Mezmur
 *     summary: List Mezmurs for Admin
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
 *         description: Admin mezmur list
 */
adminMezmurRouter.get('/', getAdminMezmurs);

/**
 * @openapi
 * /api/admin/mezmur:
 *   post:
 *     tags:
 *       - Mezmur
 *     summary: Create New Mezmur
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
 *               - lyrics
 *             properties:
 *               title: { type: string, example: "Egziabher Birhane Ena Medhanite New" }
 *               originalTitle: { type: string, example: "እግዚአብሔር ብርሃኔና መድኃኒቴ ነው" }
 *               lyrics: { type: string, example: "Egziabher birhane ena medhanite new yemiyasedengittegn man new..." }
 *               category: { type: string, example: "Praise & Thanksgiving" }
 *               artistChoir: { type: string, example: "Hawyaa Sunday School Choir" }
 *               audioUrl: { type: string, example: "/uploads/mezmur.mp3" }
 *               isPublished: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Mezmur created
 */
adminMezmurRouter.post('/', validate({ body: createMezmurSchema }), createMezmur);

/**
 * @openapi
 * /api/admin/mezmur/{id}:
 *   put:
 *     tags:
 *       - Mezmur
 *     summary: Update Mezmur
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
 *               originalTitle: { type: string }
 *               lyrics: { type: string }
 *               category: { type: string }
 *               artistChoir: { type: string }
 *               audioUrl: { type: string }
 *               isPublished: { type: boolean }
 *     responses:
 *       200:
 *         description: Mezmur updated
 */
adminMezmurRouter.put('/:id', validate({ body: updateMezmurSchema }), updateMezmur);

/**
 * @openapi
 * /api/admin/mezmur/{id}:
 *   delete:
 *     tags:
 *       - Mezmur
 *     summary: Delete Mezmur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Mezmur deleted
 */
adminMezmurRouter.delete('/:id', deleteMezmur);

import { Router } from 'express';
import {
  getPublicReports,
  getPublicReportById,
  getAdminReports,
  createReport,
  updateReport,
  deleteReport,
} from './reports.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createReportSchema, updateReportSchema } from './reports.schema';

export const publicReportsRouter = Router();
export const adminReportsRouter = Router();

/**
 * @openapi
 * /api/reports:
 *   get:
 *     tags:
 *       - Reports
 *     summary: List Public Reports
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
 *         description: List of reports
 */
publicReportsRouter.get('/', getPublicReports);

/**
 * @openapi
 * /api/reports/{id}:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get Public Report Details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Report details
 *       404:
 *         description: Report not found or not published
 */
publicReportsRouter.get('/:id', getPublicReportById);

adminReportsRouter.use(authenticate);

/**
 * @openapi
 * /api/admin/reports:
 *   get:
 *     tags:
 *       - Reports
 *     summary: List Admin Reports
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
 *         description: List of reports for admin
 */
adminReportsRouter.get('/', getAdminReports);

/**
 * @openapi
 * /api/admin/reports:
 *   post:
 *     tags:
 *       - Reports
 *     summary: Create Report
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
 *               - reportDate
 *             properties:
 *               title: { type: string, example: "Quarterly Spiritual Service Report" }
 *               summary: { type: string, example: "Q3 progress overview." }
 *               content: { type: string, example: "Full report content detailing church school activities..." }
 *               category: { type: string, example: "Academic" }
 *               fileUrl: { type: string, example: "/uploads/report-q3.pdf" }
 *               reportDate: { type: string, format: date-time, example: "2026-10-01T00:00:00.000Z" }
 *               isPublished: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Report created
 */
adminReportsRouter.post('/', validate({ body: createReportSchema }), createReport);

/**
 * @openapi
 * /api/admin/reports/{id}:
 *   put:
 *     tags:
 *       - Reports
 *     summary: Update Report
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
 *               summary: { type: string }
 *               content: { type: string }
 *               category: { type: string }
 *               fileUrl: { type: string }
 *               reportDate: { type: string, format: date-time }
 *               isPublished: { type: boolean }
 *     responses:
 *       200:
 *         description: Report updated
 */
adminReportsRouter.put('/:id', validate({ body: updateReportSchema }), updateReport);

/**
 * @openapi
 * /api/admin/reports/{id}:
 *   delete:
 *     tags:
 *       - Reports
 *     summary: Delete Report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Report deleted
 */
adminReportsRouter.delete('/:id', deleteReport);

import { Router } from 'express';
import {
  getPublicAnnouncements,
  getPublicAnnouncementById,
  getAdminAnnouncements,
  getAdminAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  togglePinAnnouncement,
  togglePublishAnnouncement,
  toggleArchiveAnnouncement,
  deleteAnnouncement,
} from './announcements.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from './announcements.schema';

export const publicAnnouncementsRouter = Router();
export const adminAnnouncementsRouter = Router();

// ==========================================
// PUBLIC ANNOUNCEMENTS ENDPOINTS
// ==========================================

/**
 * @openapi
 * /api/announcements:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: List Public Announcements
 *     description: Returns only published, non-archived announcements that are already published (`publishedAt <= NOW()`) and have not expired (`expiresAt > NOW()` or null). Pinned items are sorted first.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category (e.g., "Youth", "Events", "General")
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search query matching title, summary, or content
 *     responses:
 *       200:
 *         description: List of visible public announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Announcement' }
 *                 pagination: { $ref: '#/components/schemas/PaginationMeta' }
 */
publicAnnouncementsRouter.get('/', getPublicAnnouncements);

/**
 * @openapi
 * /api/announcements/{id}:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: View Single Public Announcement
 *     description: Returns details of a published announcement if visible and not expired.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Announcement details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Announcement' }
 *       404:
 *         description: Announcement not found or not published
 */
publicAnnouncementsRouter.get('/:id', getPublicAnnouncementById);

// ==========================================
// ADMIN ANNOUNCEMENTS ENDPOINTS (PROTECTED)
// ==========================================

adminAnnouncementsRouter.use(authenticate);

/**
 * @openapi
 * /api/admin/announcements:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: List All Announcements for Administrators
 *     description: Returns all announcements (including drafts, scheduled, archived, and expired) with full administrative filtering.
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
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isPublished
 *         schema: { type: boolean }
 *       - in: query
 *         name: isArchived
 *         schema: { type: boolean }
 *       - in: query
 *         name: isPinned
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of announcements with author metadata
 *       401:
 *         description: Unauthorized
 */
adminAnnouncementsRouter.get('/', getAdminAnnouncements);

/**
 * @openapi
 * /api/admin/announcements/{id}:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: Get Single Announcement Details (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Announcement details with author metadata
 *       404:
 *         description: Announcement not found
 */
adminAnnouncementsRouter.get('/:id', getAdminAnnouncementById);

/**
 * @openapi
 * /api/admin/announcements:
 *   post:
 *     tags:
 *       - Announcements
 *     summary: Create New Announcement
 *     description: Creates an announcement with optional scheduling (`publishedAt`) and expiration (`expiresAt`).
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
 *               title: { type: string, example: "Annual Sunday School Spiritual Conference" }
 *               content: { type: string, example: "Join us this coming weekend for inspiring Orthodox lessons..." }
 *               summary: { type: string, example: "A gathering for youth and families." }
 *               category: { type: string, example: "Events" }
 *               imageUrl: { type: string, example: "/uploads/conference.jpg" }
 *               isPinned: { type: boolean, example: true }
 *               isPublished: { type: boolean, example: true }
 *               publishedAt: { type: string, format: date-time, example: "2026-10-18T10:00:00.000Z" }
 *               expiresAt: { type: string, format: date-time, example: "2026-11-01T23:59:59.000Z" }
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
adminAnnouncementsRouter.post('/', validate({ body: createAnnouncementSchema }), createAnnouncement);

/**
 * @openapi
 * /api/admin/announcements/{id}:
 *   put:
 *     tags:
 *       - Announcements
 *     summary: Update Announcement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               summary: { type: string }
 *               category: { type: string }
 *               imageUrl: { type: string }
 *               isPinned: { type: boolean }
 *               isPublished: { type: boolean }
 *               publishedAt: { type: string, format: date-time }
 *               expiresAt: { type: string, format: date-time }
 *               isArchived: { type: boolean }
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       404:
 *         description: Announcement not found
 */
adminAnnouncementsRouter.put('/:id', validate({ body: updateAnnouncementSchema }), updateAnnouncement);

/**
 * @openapi
 * /api/admin/announcements/{id}/pin:
 *   patch:
 *     tags:
 *       - Announcements
 *     summary: Toggle Pin Status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Pin status toggled
 */
adminAnnouncementsRouter.patch('/:id/pin', togglePinAnnouncement);

/**
 * @openapi
 * /api/admin/announcements/{id}/publish:
 *   patch:
 *     tags:
 *       - Announcements
 *     summary: Toggle Publish Status or Schedule Publication
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
 *               isPublished: { type: boolean, example: true }
 *               publishedAt: { type: string, format: date-time, example: "2026-10-20T08:00:00.000Z" }
 *     responses:
 *       200:
 *         description: Publish status updated
 */
adminAnnouncementsRouter.patch('/:id/publish', togglePublishAnnouncement);

/**
 * @openapi
 * /api/admin/announcements/{id}/archive:
 *   patch:
 *     tags:
 *       - Announcements
 *     summary: Toggle Archive Status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Archive status toggled
 */
adminAnnouncementsRouter.patch('/:id/archive', toggleArchiveAnnouncement);

/**
 * @openapi
 * /api/admin/announcements/{id}:
 *   delete:
 *     tags:
 *       - Announcements
 *     summary: Delete Announcement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Announcement deleted successfully
 *       404:
 *         description: Announcement not found
 */
adminAnnouncementsRouter.delete('/:id', deleteAnnouncement);

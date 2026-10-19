import { Router } from 'express';
import {
  getPublicEvents,
  getPublicEventById,
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from './events.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createEventSchema, updateEventSchema } from './events.schema';

export const publicEventsRouter = Router();
export const adminEventsRouter = Router();

/**
 * @openapi
 * /api/events:
 *   get:
 *     tags:
 *       - Events
 *     summary: List Public Events
 *     description: Returns published upcoming and past events.
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
 *         description: List of events
 */
publicEventsRouter.get('/', getPublicEvents);

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get Public Event Details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found or not published
 */
publicEventsRouter.get('/:id', getPublicEventById);

adminEventsRouter.use(authenticate);

/**
 * @openapi
 * /api/admin/events:
 *   get:
 *     tags:
 *       - Events
 *     summary: List Events for Administrators
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
 *         description: Admin events list
 */
adminEventsRouter.get('/', getAdminEvents);

/**
 * @openapi
 * /api/admin/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create New Event
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
 *               - description
 *               - location
 *               - startDate
 *             properties:
 *               title: { type: string, example: "Feast of the Holy Cross (Meskel) Celebration" }
 *               description: { type: string, example: "Demera ceremony and choir presentation." }
 *               location: { type: string, example: "Main Church Grounds" }
 *               startDate: { type: string, format: date-time, example: "2026-09-27T14:00:00.000Z" }
 *               endDate: { type: string, format: date-time, example: "2026-09-27T19:00:00.000Z" }
 *               category: { type: string, example: "Liturgical Feast" }
 *               imageUrl: { type: string, example: "/uploads/meskel.jpg" }
 *               isPublished: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Event created
 */
adminEventsRouter.post('/', validate({ body: createEventSchema }), createEvent);

/**
 * @openapi
 * /api/admin/events/{id}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Update Event
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
 *               description: { type: string }
 *               location: { type: string }
 *               startDate: { type: string, format: date-time }
 *               endDate: { type: string, format: date-time }
 *               category: { type: string }
 *               imageUrl: { type: string }
 *               isPublished: { type: boolean }
 *     responses:
 *       200:
 *         description: Event updated
 */
adminEventsRouter.put('/:id', validate({ body: updateEventSchema }), updateEvent);

/**
 * @openapi
 * /api/admin/events/{id}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Delete Event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Event deleted
 */
adminEventsRouter.delete('/:id', deleteEvent);

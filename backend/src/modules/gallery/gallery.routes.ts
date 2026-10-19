import { Router } from 'express';
import {
  getPublicAlbums,
  getPublicAlbumById,
  getAdminAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addPhotoToAlbum,
  updatePhoto,
  deletePhoto,
} from './gallery.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createAlbumSchema,
  updateAlbumSchema,
  createPhotoSchema,
  updatePhotoSchema,
} from './gallery.schema';

export const publicGalleryRouter = Router();
export const adminGalleryRouter = Router();

// Public routes
/**
 * @openapi
 * /api/gallery/albums:
 *   get:
 *     tags:
 *       - Gallery Albums
 *     summary: List Public Gallery Albums
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of gallery albums
 */
publicGalleryRouter.get('/albums', getPublicAlbums);

/**
 * @openapi
 * /api/gallery/albums/{id}:
 *   get:
 *     tags:
 *       - Gallery Albums
 *     summary: Get Album with Photos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Album details with associated photos
 *       404:
 *         description: Album not found
 */
publicGalleryRouter.get('/albums/:id', getPublicAlbumById);

// Admin routes
adminGalleryRouter.use(authenticate);

/**
 * @openapi
 * /api/admin/gallery/albums:
 *   get:
 *     tags:
 *       - Gallery Albums
 *     summary: List Albums for Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin album list
 */
adminGalleryRouter.get('/albums', getAdminAlbums);

/**
 * @openapi
 * /api/admin/gallery/albums:
 *   post:
 *     tags:
 *       - Gallery Albums
 *     summary: Create New Album
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
 *             properties:
 *               title: { type: string, example: "Graduation Ceremony 2026" }
 *               description: { type: string, example: "Annual graduation day photos" }
 *               coverImageUrl: { type: string, example: "/uploads/cover.jpg" }
 *               eventDate: { type: string, format: date-time, example: "2026-06-20T10:00:00.000Z" }
 *               isPublished: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Album created
 */
adminGalleryRouter.post('/albums', validate({ body: createAlbumSchema }), createAlbum);

/**
 * @openapi
 * /api/admin/gallery/albums/{id}:
 *   put:
 *     tags:
 *       - Gallery Albums
 *     summary: Update Album
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Album updated
 */
adminGalleryRouter.put('/albums/:id', validate({ body: updateAlbumSchema }), updateAlbum);

/**
 * @openapi
 * /api/admin/gallery/albums/{id}:
 *   delete:
 *     tags:
 *       - Gallery Albums
 *     summary: Delete Album
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Album deleted
 */
adminGalleryRouter.delete('/albums/:id', deleteAlbum);

/**
 * @openapi
 * /api/admin/gallery/albums/{albumId}/photos:
 *   post:
 *     tags:
 *       - Gallery Photos
 *     summary: Add Photo to Album
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *             properties:
 *               imageUrl: { type: string, example: "/uploads/photo-1.jpg" }
 *               title: { type: string, example: "Class photo" }
 *               caption: { type: string, example: "Students with Sunday school teachers" }
 *               sortOrder: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Photo added to album
 */
adminGalleryRouter.post('/albums/:albumId/photos', validate({ body: createPhotoSchema }), addPhotoToAlbum);

/**
 * @openapi
 * /api/admin/gallery/photos/{photoId}:
 *   put:
 *     tags:
 *       - Gallery Photos
 *     summary: Update Photo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Photo updated
 */
adminGalleryRouter.put('/photos/:photoId', validate({ body: updatePhotoSchema }), updatePhoto);

/**
 * @openapi
 * /api/admin/gallery/photos/{photoId}:
 *   delete:
 *     tags:
 *       - Gallery Photos
 *     summary: Delete Photo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Photo deleted
 */
adminGalleryRouter.delete('/photos/:photoId', deletePhoto);

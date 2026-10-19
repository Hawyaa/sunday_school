import { Router } from 'express';
import {
  getProfile,
  changePassword,
  listAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from './admin.controller';
import { authenticate, authorizeRoles } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  changePasswordSchema,
  createAdminSchema,
  updateAdminSchema,
} from './admin.schema';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @openapi
 * /api/admin/me:
 *   get:
 *     tags:
 *       - Admin Profile & Users
 *     summary: Get Current Administrator Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/AdminProfile' }
 *       401:
 *         description: Unauthorized
 */
router.get('/me', getProfile);

/**
 * @openapi
 * /api/admin/change-password:
 *   post:
 *     tags:
 *       - Admin Profile & Users
 *     summary: Change Administrator Password
 *     description: Verifies current password using bcrypt and hashes new password with cost factor 12. Revokes all active refresh tokens.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword: { type: string, example: "CurrentAdminPass123!" }
 *               newPassword: { type: string, example: "NewSecureAdminPass456!" }
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Current password incorrect or validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/change-password', validate({ body: changePasswordSchema }), changePassword);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin Profile & Users
 *     summary: List All Administrators (SUPER_ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of administrators
 *       403:
 *         description: Forbidden - requires SUPER_ADMIN role
 */
router.get('/users', authorizeRoles('SUPER_ADMIN'), listAdmins);

/**
 * @openapi
 * /api/admin/users:
 *   post:
 *     tags:
 *       - Admin Profile & Users
 *     summary: Create New Administrator (SUPER_ADMIN only)
 *     description: Protected admin creation. No public registration is allowed.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email: { type: string, format: email, example: "newadmin@hawyaasundayschool.org" }
 *               password: { type: string, format: password, example: "StrongPass789!" }
 *               name: { type: string, example: "Yohannes Bekele" }
 *               role: { type: string, enum: [SUPER_ADMIN, ADMIN, EDITOR], default: ADMIN }
 *     responses:
 *       201:
 *         description: Administrator created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Administrator email already exists
 */
router.post('/users', authorizeRoles('SUPER_ADMIN'), validate({ body: createAdminSchema }), createAdmin);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   put:
 *     tags:
 *       - Admin Profile & Users
 *     summary: Update Administrator (SUPER_ADMIN only)
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
 *               name: { type: string }
 *               role: { type: string, enum: [SUPER_ADMIN, ADMIN, EDITOR] }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Administrator updated
 *       404:
 *         description: Administrator not found
 */
router.put('/users/:id', authorizeRoles('SUPER_ADMIN'), validate({ body: updateAdminSchema }), updateAdmin);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     tags:
 *       - Admin Profile & Users
 *     summary: Delete Administrator (SUPER_ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Administrator deleted
 *       400:
 *         description: Cannot delete own account
 *       404:
 *         description: Administrator not found
 */
router.delete('/users/:id', authorizeRoles('SUPER_ADMIN'), deleteAdmin);

export default router;

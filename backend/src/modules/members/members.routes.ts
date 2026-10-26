import { Router } from 'express';
import {
  registerMember,
  getAdminMembers,
  getMemberById,
  updateMember,
  updateMemberStatus,
  getMemberStats,
  exportMembersCsv,
  deleteMember,
} from './members.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createMemberRegistrationSchema,
  updateMemberRegistrationSchema,
  updateMemberStatusSchema,
} from './members.schema';

export const publicRegistrationRouter = Router();
export const adminMembersRouter = Router();

/**
 * @openapi
 * /api/registration:
 *   post:
 *     tags:
 *       - Members Registration
 *     summary: Submit Sunday School Member Registration
 *     description: Public registration form submission for children, intermediate, and youth members.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - division
 *               - fullName
 *               - christianName
 *               - gender
 *               - age
 *               - confessionFather
 *               - address
 *               - emergencyContactName
 *               - emergencyContactPhone
 *             properties:
 *               registrationType:
 *                 type: string
 *                 enum: [SHORT_TERM, LONG_TERM]
 *                 default: LONG_TERM
 *               division:
 *                 type: string
 *                 enum: [CHILDREN, INTERMEDIATE, YOUTH]
 *                 example: YOUTH
 *               fullName:
 *                 type: string
 *                 example: "ተስፋዬ ገብረመስቀል"
 *               christianName:
 *                 type: string
 *                 example: "ኃይለ ማርያም"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *                 example: MALE
 *               age:
 *                 type: integer
 *                 example: 22
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *               motherName:
 *                 type: string
 *                 example: "ወለተ ዮሐንስ"
 *               phoneNumber:
 *                 type: string
 *                 example: "+251911223344"
 *               photoUrl:
 *                 type: string
 *                 example: "/uploads/profile.jpg"
 *               schoolOrOccupation:
 *                 type: string
 *                 example: "የኮምፒውተር ሳይንስ ተማሪ"
 *               confessionFather:
 *                 type: string
 *                 example: "ቀሲስ ዘካርያስ"
 *               confessionChurch:
 *                 type: string
 *                 example: "የወሊሶ ደብረ ምጥማቅ ቅ/ማርያም ገዳም"
 *               confessionAddress:
 *                 type: string
 *                 example: "ወሊሶ ቀበሌ 02"
 *               address:
 *                 type: string
 *                 example: "ወሊሶ ቀበሌ 03"
 *               kebele:
 *                 type: string
 *                 example: "03"
 *               houseNumber:
 *                 type: string
 *                 example: "450"
 *               admissionDate:
 *                 type: string
 *                 format: date-time
 *               preferredDepartment:
 *                 type: string
 *                 example: "መዝሙር እና ኪነ-ጥበብ"
 *               talentSkills:
 *                 type: string
 *                 example: "የበገና ድምፅ፣ ግራፊክስ ዲዛይን"
 *               emergencyContactName:
 *                 type: string
 *                 example: "ገብረመስቀል አበበ"
 *               emergencyRelationship:
 *                 type: string
 *                 example: "አባት"
 *               emergencyContactPhone:
 *                 type: string
 *                 example: "+251922334455"
 *               parentName:
 *                 type: string
 *                 example: "ገብረመስቀል አበበ"
 *               parentConsent:
 *                 type: boolean
 *                 example: true
 *               youthCovenantAccepted:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Member registration submitted successfully
 *       400:
 *         description: Validation error
 */
publicRegistrationRouter.post(
  '/',
  validate({ body: createMemberRegistrationSchema }),
  registerMember
);

// Admin-only protected endpoints
adminMembersRouter.use(authenticate);

/**
 * @openapi
 * /api/admin/members/stats:
 *   get:
 *     tags:
 *       - Members Registration
 *     summary: Get Member Registration Statistics
 *     description: Analytics breakdown by division, status, registration type, and gender.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Registration statistics retrieved
 */
adminMembersRouter.get('/stats', getMemberStats);

/**
 * @openapi
 * /api/admin/members/export:
 *   get:
 *     tags:
 *       - Members Registration
 *     summary: Export Member Registrations as CSV
 *     description: Downloads CSV spreadsheet with UTF-8 BOM encoding for Amharic Excel compatibility.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: division
 *         schema: { type: string, enum: [All, CHILDREN, INTERMEDIATE, YOUTH] }
 *       - in: query
 *         name: registrationType
 *         schema: { type: string, enum: [All, SHORT_TERM, LONG_TERM] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, PENDING, APPROVED, REJECTED] }
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
adminMembersRouter.get('/export', exportMembersCsv);

/**
 * @openapi
 * /api/admin/members:
 *   get:
 *     tags:
 *       - Members Registration
 *     summary: List Member Registrations for Admins
 *     description: Returns paginated list of member registrations with search and filtering.
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
 *         name: division
 *         schema: { type: string, enum: [All, CHILDREN, INTERMEDIATE, YOUTH] }
 *       - in: query
 *         name: registrationType
 *         schema: { type: string, enum: [All, SHORT_TERM, LONG_TERM] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, PENDING, APPROVED, REJECTED] }
 *       - in: query
 *         name: gender
 *         schema: { type: string, enum: [All, MALE, FEMALE] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated member registrations
 */
adminMembersRouter.get('/', getAdminMembers);

/**
 * @openapi
 * /api/admin/members/{id}:
 *   get:
 *     tags:
 *       - Members Registration
 *     summary: Get Single Member Registration Details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Member details
 *       404:
 *         description: Record not found
 */
adminMembersRouter.get('/:id', getMemberById);

/**
 * @openapi
 * /api/admin/members/{id}:
 *   put:
 *     tags:
 *       - Members Registration
 *     summary: Update Member Registration Info
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
 *     responses:
 *       200:
 *         description: Record updated
 *       404:
 *         description: Record not found
 */
adminMembersRouter.put(
  '/:id',
  validate({ body: updateMemberRegistrationSchema }),
  updateMember
);

/**
 * @openapi
 * /api/admin/members/{id}/status:
 *   patch:
 *     tags:
 *       - Members Registration
 *     summary: Approve, Reject, or Change Status of Registration
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *               approvedByName:
 *                 type: string
 *               approverRole:
 *                 type: string
 *               chairmanName:
 *                 type: string
 *               adminNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member status updated
 *       404:
 *         description: Record not found
 */
adminMembersRouter.patch(
  '/:id/status',
  validate({ body: updateMemberStatusSchema }),
  updateMemberStatus
);

/**
 * @openapi
 * /api/admin/members/{id}:
 *   delete:
 *     tags:
 *       - Members Registration
 *     summary: Delete Member Record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Member deleted
 *       404:
 *         description: Record not found
 */
adminMembersRouter.delete('/:id', deleteMember);

import { Router, Request, Response } from 'express';
import { authenticate } from '../../middleware/auth';
import { upload } from '../../middleware/upload';
import { sendSuccess, sendError } from '../../utils/response';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /api/upload:
 *   post:
 *     tags:
 *       - Uploads
 *     summary: Upload File or Media
 *     description: Uploads an image, document, or audio file to local storage. Supported formats include JPEG, PNG, WEBP, GIF, PDF, MP3, WAV up to 15MB.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file binary to upload
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "File uploaded successfully" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     url: { type: string, example: "/uploads/file-1718900000-123456789.jpg" }
 *                     filename: { type: string, example: "file-1718900000-123456789.jpg" }
 *                     originalName: { type: string, example: "conference.jpg" }
 *                     mimetype: { type: string, example: "image/jpeg" }
 *                     size: { type: integer, example: 204856 }
 *       400:
 *         description: Unsupported file type or file too large
 *       401:
 *         description: Unauthorized
 */
router.post('/', upload.single('file'), (req: Request, res: Response): void => {
  if (!req.file) {
    sendError(res, 'No file was uploaded', 400);
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  sendSuccess(
    res,
    {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
    'File uploaded successfully',
    201
  );
});

export default router;

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './docs/swagger';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import adminRoutes from './modules/admin/admin.routes';
import {
  publicAnnouncementsRouter,
  adminAnnouncementsRouter,
} from './modules/announcements/announcements.routes';
import {
  publicEventsRouter,
  adminEventsRouter,
} from './modules/events/events.routes';
import {
  publicReportsRouter,
  adminReportsRouter,
} from './modules/reports/reports.routes';
import {
  publicMezmurRouter,
  adminMezmurRouter,
} from './modules/mezmur/mezmur.routes';
import {
  publicTeachingsRouter,
  adminTeachingsRouter,
} from './modules/teachings/teachings.routes';
import {
  publicGalleryRouter,
  adminGalleryRouter,
} from './modules/gallery/gallery.routes';
import {
  publicScheduleRouter,
  adminScheduleRouter,
} from './modules/schedule/schedule.routes';
import uploadRoutes from './modules/upload/upload.routes';
import {
  publicRegistrationRouter,
  adminMembersRouter,
} from './modules/members/members.routes';

export function createApp(): Application {
  const app = express();

  // Security and base middlewares
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Raw OpenAPI spec in JSON format
  app.get('/api/docs/swagger.json', (_req: Request, res: Response) => {
    res.json(swaggerSpec);
  });
  app.get('/api/docs.json', (_req: Request, res: Response) => {
    res.json(swaggerSpec);
  });

  // Swagger UI Interactive API Documentation at /api/docs
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Sunday School',
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount API modules
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/announcements', publicAnnouncementsRouter);
  app.use('/api/admin/announcements', adminAnnouncementsRouter);
  app.use('/api/events', publicEventsRouter);
  app.use('/api/admin/events', adminEventsRouter);
  app.use('/api/reports', publicReportsRouter);
  app.use('/api/admin/reports', adminReportsRouter);
  app.use('/api/mezmur', publicMezmurRouter);
  app.use('/api/admin/mezmur', adminMezmurRouter);
  app.use('/api/teachings', publicTeachingsRouter);
  app.use('/api/admin/teachings', adminTeachingsRouter);
  app.use('/api/gallery', publicGalleryRouter);
  app.use('/api/admin/gallery', adminGalleryRouter);
  app.use('/api/schedule', publicScheduleRouter);
  app.use('/api/admin/schedule', adminScheduleRouter);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/registration', publicRegistrationRouter);
  app.use('/api/admin/members', adminMembersRouter);

  // 404 handler for unknown routes
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();

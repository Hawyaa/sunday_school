import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../config/env';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Sunday School',
    version: '1.0.0',
    description: `Official backend REST API for Hawyaa Sunday School.
Provides public content consumption endpoints and protected administrative management endpoints.

### Authentication
Protected endpoints require a valid JWT Bearer token in the \`Authorization\` header:
\`Authorization: Bearer <ACCESS_TOKEN>\`

Obtain access and refresh tokens via \`POST /api/auth/login\`.`,
    contact: {
      name: 'Hawyaa Sunday School IT Ministry',
      url: 'https://github.com/Hawyaa/sunday_school',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token to authenticate administrative requests',
      },
    },
    schemas: {
      StandardResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Invalid request or authorization failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Invalid email address' },
              },
            },
          },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 45 },
          totalPages: { type: 'integer', example: 5 },
          hasNext: { type: 'boolean', example: true },
          hasPrev: { type: 'boolean', example: false },
        },
      },
      AdminProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a07ed597-5ae6-4935-954b-d3196cbddd5a' },
          email: { type: 'string', format: 'email', example: 'admin@hawyaasundayschool.org' },
          name: { type: 'string', example: 'System Administrator' },
          role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'], example: 'SUPER_ADMIN' },
          isActive: { type: 'boolean', example: true },
          lastLoginAt: { type: 'string', format: 'date-time', nullable: true, example: '2026-10-18T16:00:00.000Z' },
          createdAt: { type: 'string', format: 'date-time', example: '2026-10-18T15:00:00.000Z' },
        },
      },
      Announcement: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'c1b48b77-3e11-40ef-9076-eb34cfa7fa98' },
          title: { type: 'string', example: 'Annual Sunday School Spiritual Conference' },
          summary: { type: 'string', nullable: true, example: 'A weekend gathering focused on Orthodox Christian living and biblical study.' },
          content: { type: 'string', example: 'We warmly invite all youth, children, and parents to join us for our annual spiritual revival conference...' },
          category: { type: 'string', example: 'Events' },
          imageUrl: { type: 'string', nullable: true, example: '/uploads/conference-banner.jpg' },
          isPinned: { type: 'boolean', example: true },
          isPublished: { type: 'boolean', example: true },
          publishedAt: { type: 'string', format: 'date-time', nullable: true, example: '2026-10-18T10:00:00.000Z' },
          expiresAt: { type: 'string', format: 'date-time', nullable: true, example: '2026-11-01T23:59:59.000Z' },
          isArchived: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time', example: '2026-10-18T09:00:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2026-10-18T09:30:00.000Z' },
          createdBy: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
      },
      Event: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'e7a18b77-3e11-40ef-9076-eb34cfa7fa12' },
          title: { type: 'string', example: 'Feast of the Holy Cross (Meskel) Celebration' },
          description: { type: 'string', example: 'Demera lighting ceremony and hymn presentations by the Sunday School choir.' },
          location: { type: 'string', example: 'St. Mary Church Grounds, Main Hall' },
          startDate: { type: 'string', format: 'date-time', example: '2026-09-27T14:00:00.000Z' },
          endDate: { type: 'string', format: 'date-time', nullable: true, example: '2026-09-27T19:00:00.000Z' },
          category: { type: 'string', example: 'Liturgical Feast' },
          imageUrl: { type: 'string', nullable: true, example: '/uploads/meskel-2026.jpg' },
          isPublished: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time', example: '2026-09-01T10:00:00.000Z' },
        },
      },
      Report: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'f8b18b77-3e11-40ef-9076-eb34cfa7fa34' },
          title: { type: 'string', example: 'Q3 Sunday School Academic & Spiritual Progress Report' },
          summary: { type: 'string', nullable: true, example: 'Overview of attendance, curriculum milestones, and community service projects.' },
          content: { type: 'string', example: 'Detailed quarterly analysis covering all 5 classes and 200 enrolled students...' },
          category: { type: 'string', example: 'Academic' },
          fileUrl: { type: 'string', nullable: true, example: '/uploads/q3-report-2026.pdf' },
          reportDate: { type: 'string', format: 'date-time', example: '2026-10-01T00:00:00.000Z' },
          isPublished: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time', example: '2026-10-02T10:00:00.000Z' },
        },
      },
      Mezmur: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'm9a18b77-3e11-40ef-9076-eb34cfa7fa56' },
          title: { type: 'string', example: 'Egziabher Birhane Ena Medhanite New' },
          originalTitle: { type: 'string', nullable: true, example: 'እግዚአብሔር ብርሃኔና መድኃኒቴ ነው' },
          lyrics: { type: 'string', example: 'Egziabher birhane ena medhanite new yemiyasedengittegn man new...\n(Psalm 27:1)' },
          category: { type: 'string', example: 'Praise & Thanksgiving' },
          artistChoir: { type: 'string', nullable: true, example: 'Hawyaa Sunday School Choir' },
          audioUrl: { type: 'string', nullable: true, example: '/uploads/mezmur-01.mp3' },
          isPublished: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time', example: '2026-08-15T12:00:00.000Z' },
        },
      },
      Teaching: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 't4a18b77-3e11-40ef-9076-eb34cfa7fa78' },
          title: { type: 'string', example: 'Understanding the Orthodox Divine Liturgy (Kidase)' },
          content: { type: 'string', example: 'An in-depth explanation of the sacred symbols, vestments, and liturgical responses...' },
          author: { type: 'string', nullable: true, example: 'Deacon Melaku' },
          category: { type: 'string', example: 'Liturgical Theology' },
          mediaUrl: { type: 'string', nullable: true, example: 'https://youtube.com/watch?v=example' },
          isPublished: { type: 'boolean', example: true },
          publishedAt: { type: 'string', format: 'date-time', example: '2026-10-10T14:00:00.000Z' },
          createdAt: { type: 'string', format: 'date-time', example: '2026-10-10T10:00:00.000Z' },
        },
      },
      GalleryAlbum: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'g5a18b77-3e11-40ef-9076-eb34cfa7fa90' },
          title: { type: 'string', example: 'Graduation Ceremony 2026' },
          description: { type: 'string', nullable: true, example: 'Photos from the graduating class of high school Sunday School scholars.' },
          coverImageUrl: { type: 'string', nullable: true, example: '/uploads/grad-cover.jpg' },
          eventDate: { type: 'string', format: 'date-time', nullable: true, example: '2026-06-20T10:00:00.000Z' },
          isPublished: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time', example: '2026-06-21T08:00:00.000Z' },
          photosCount: { type: 'integer', example: 24 },
        },
      },
      GalleryPhoto: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'p6a18b77-3e11-40ef-9076-eb34cfa7fa11' },
          albumId: { type: 'string', format: 'uuid', example: 'g5a18b77-3e11-40ef-9076-eb34cfa7fa90' },
          title: { type: 'string', nullable: true, example: 'Certificate Presentation' },
          imageUrl: { type: 'string', example: '/uploads/cert-presentation.jpg' },
          caption: { type: 'string', nullable: true, example: 'Abba presents the certificate of completion.' },
          sortOrder: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time', example: '2026-06-21T09:00:00.000Z' },
        },
      },
      Schedule: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 's7a18b77-3e11-40ef-9076-eb34cfa7fa22' },
          title: { type: 'string', example: 'Weekly Sunday School Morning Class' },
          activity: { type: 'string', example: 'Biblical teaching, hymn practice, and Ge\'ez language instruction' },
          dayOfWeek: { type: 'string', nullable: true, example: 'Sunday' },
          specificDate: { type: 'string', format: 'date-time', nullable: true, example: null },
          startTime: { type: 'string', example: '08:30' },
          endTime: { type: 'string', example: '10:30' },
          targetGroup: { type: 'string', nullable: true, example: 'Children and Youth' },
          location: { type: 'string', nullable: true, example: 'Sunday School Building, Rooms 1-4' },
          isPublished: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time', example: '2026-01-10T10:00:00.000Z' },
        },
      },
    },
  },
  tags: [
    { name: 'Authentication', description: 'Admin login, token rotation, and logout' },
    { name: 'Admin Profile & Users', description: 'Administrator profile and account management' },
    { name: 'Announcements', description: 'Public & Admin announcement endpoints (scheduled, pinned, expired)' },
    { name: 'Events', description: 'Church and Sunday school upcoming/past events' },
    { name: 'Reports', description: 'Ministry and committee progress reports' },
    { name: 'Mezmur', description: 'Spiritual songs, lyrics, and audio recordings' },
    { name: 'Teachings', description: 'Orthodox educational lessons and articles' },
    { name: 'Gallery Albums', description: 'Photo albums from events and celebrations' },
    { name: 'Gallery Photos', description: 'Photos belonging to gallery albums' },
    { name: 'Schedule', description: 'Weekly recurring and special occasion schedules' },
    { name: 'Uploads', description: 'File and media upload handler' },
  ],
};

const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [
    './src/modules/**/*.routes.ts',
    './src/modules/**/*.ts',
    './src/routes/*.ts',
    './dist/modules/**/*.routes.js',
    './dist/modules/**/*.js',
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

#  Sunday School — Backend API

Modern, secure, and type-safe REST API backend for the **Hawyaa Sunday School** platform, built with **Node.js**, **Express.js**, **TypeScript**, **MySQL**, and **Prisma ORM**.

---

## 🛠 Tech Stack

- **Runtime & Language:** Node.js (v24+) & TypeScript (v5+)
- **Web Framework:** Express.js
- **Database & ORM:** MySQL & Prisma ORM
- **Password Security:** `bcrypt` with cost factor 12
- **Authentication:** JWT Access Tokens (15m) + Secure Refresh Token rotation with token reuse detection
- **Documentation:** Swagger UI & OpenAPI 3.0+ at `/api/docs`
- **Validation & Safety:** Zod runtime validation
- **File Uploads:** Multer with file type & size limits
- **Testing:** Jest, ts-jest & Supertest

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** (v18 or later, recommended v22+)
- **MySQL Server** (running locally via MAMP or native MySQL on port 3306 / 8889)

### 2. Environment Configuration

Copy `.env.example` to `.env` and verify database credentials:

```bash
cp .env.example .env
```

Ensure `DATABASE_URL` in `.env` points to your MySQL instance:

```env
DATABASE_URL="mysql://<user>:<password>@localhost:<port>/sunday_school"
```

Configure initial administrator credentials:

```env
ADMIN_INITIAL_EMAIL="admin@hawyaasundayschool.org"
ADMIN_INITIAL_PASSWORD="SecureAdminPassword123!"
ADMIN_INITIAL_NAME="System Administrator"
ADMIN_INITIAL_ROLE="SUPER_ADMIN"
```

### 3. Database Migration & Seed

Run database migrations to initialize tables in MySQL:

```bash
npx prisma migrate dev --name init
```

Seed the initial administrator account (hashes password with bcrypt cost 12):

```bash
npm run db:seed
```

### 4. Running the Application

```bash
# Development mode with hot-reloading
npm run dev

# Build production TypeScript output
npm run build

# Start production server
npm start
```

Server runs by default on `http://localhost:5000`.

---

## 📖 Interactive API Documentation (Swagger UI)

Interactive OpenAPI 3.0 documentation is available at:

```
http://localhost:5000/api/docs
```

Raw OpenAPI JSON specification:
```
http://localhost:5000/api/docs/swagger.json
```

Use Swagger UI's **Authorize** button with the Bearer access token received from `POST /api/auth/login` to interactively test all protected administrator endpoints.

---

## 🔐 Authentication & Security

- **Bcrypt (Cost 12):** All administrator passwords are hashed with `bcrypt.hash(password, 12)`. Plaintext passwords and hashes are never exposed in API responses or logs. Double-hashing prevention is enforced.
- **No Public Registration:** Administrator accounts can only be created via the initial seed script or by an existing `SUPER_ADMIN`.
- **JWT Authentication:** Short-lived access tokens (15 minutes).
- **Refresh Token Rotation & Revocation:** Cryptographically hashed refresh tokens stored in database with automatic rotation upon use and instant revocation of all active sessions if a compromised/reused token is detected.
- **Rate Limiting:** Protects the login endpoint against brute force attempts.

---

## 📦 Content Modules & API Endpoints

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/login` | Administrator login (rate-limited) | Public |
| `POST` | `/api/auth/refresh` | Rotate refresh token & issue new access token | Public |
| `POST` | `/api/auth/logout` | Revoke active refresh token | Public |

### 2. Admin Management (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/me` | Current administrator profile | Admin |
| `POST` | `/api/admin/change-password` | Update admin password (bcrypt cost 12) | Admin |
| `GET` | `/api/admin/users` | List all administrators (paginated) | SUPER_ADMIN |
| `POST` | `/api/admin/users` | Create administrator | SUPER_ADMIN |
| `PUT` | `/api/admin/users/:id` | Update administrator details/role | SUPER_ADMIN |
| `DELETE` | `/api/admin/users/:id` | Delete administrator | SUPER_ADMIN |

### 3. Announcements (`/api/announcements` & `/api/admin/announcements`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/announcements` | List published, non-archived, non-expired announcements (pinned first) | Public |
| `GET` | `/api/announcements/:id` | View published announcement details | Public |
| `GET` | `/api/admin/announcements` | List all announcements with status filters | Admin |
| `GET` | `/api/admin/announcements/:id` | Get single announcement | Admin |
| `POST` | `/api/admin/announcements` | Create announcement (scheduled & expiration support) | Admin |
| `PUT` | `/api/admin/announcements/:id` | Update announcement | Admin |
| `PATCH` | `/api/admin/announcements/:id/pin` | Toggle pin status | Admin |
| `PATCH` | `/api/admin/announcements/:id/publish` | Toggle publish status / set schedule | Admin |
| `PATCH` | `/api/admin/announcements/:id/archive` | Toggle archive status | Admin |
| `DELETE` | `/api/admin/announcements/:id` | Delete announcement | Admin |

### 4. Events (`/api/events` & `/api/admin/events`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/events` | List published church & school events | Public |
| `GET` | `/api/events/:id` | Event details | Public |
| `GET` | `/api/admin/events` | List all events | Admin |
| `POST` | `/api/admin/events` | Create event | Admin |
| `PUT` | `/api/admin/events/:id` | Update event | Admin |
| `DELETE` | `/api/admin/events/:id` | Delete event | Admin |

### 5. Reports (`/api/reports` & `/api/admin/reports`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/reports` | List published reports & summaries | Public |
| `GET` | `/api/reports/:id` | Report details | Public |
| `GET` | `/api/admin/reports` | List all reports | Admin |
| `POST` | `/api/admin/reports` | Create report | Admin |
| `PUT` | `/api/admin/reports/:id` | Update report | Admin |
| `DELETE` | `/api/admin/reports/:id` | Delete report | Admin |

### 6. Mezmur (Hymns) (`/api/mezmur` & `/api/admin/mezmur`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/mezmur` | List published hymns & lyrics | Public |
| `GET` | `/api/mezmur/:id` | Hymn details & lyrics | Public |
| `GET` | `/api/admin/mezmur` | List all hymns | Admin |
| `POST` | `/api/admin/mezmur` | Create hymn entry | Admin |
| `PUT` | `/api/admin/mezmur/:id` | Update hymn entry | Admin |
| `DELETE` | `/api/admin/mezmur/:id` | Delete hymn entry | Admin |

### 7. Teachings (`/api/teachings` & `/api/admin/teachings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/teachings` | List published spiritual lessons | Public |
| `GET` | `/api/teachings/:id` | Teaching lesson details | Public |
| `GET` | `/api/admin/teachings` | List all teachings | Admin |
| `POST` | `/api/admin/teachings` | Create teaching lesson | Admin |
| `PUT` | `/api/admin/teachings/:id` | Update teaching lesson | Admin |
| `DELETE` | `/api/admin/teachings/:id` | Delete teaching lesson | Admin |

### 8. Gallery Albums & Photos (`/api/gallery` & `/api/admin/gallery`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/gallery/albums` | List published albums with photo counts | Public |
| `GET` | `/api/gallery/albums/:id` | Get album and its photos in display order | Public |
| `GET` | `/api/admin/gallery/albums` | List all albums | Admin |
| `POST` | `/api/admin/gallery/albums` | Create album | Admin |
| `PUT` | `/api/admin/gallery/albums/:id` | Update album | Admin |
| `DELETE` | `/api/admin/gallery/albums/:id` | Delete album & cascaded photos | Admin |
| `POST` | `/api/admin/gallery/albums/:albumId/photos` | Add photo to album | Admin |
| `PUT` | `/api/admin/gallery/photos/:photoId` | Update photo details/order | Admin |
| `DELETE` | `/api/admin/gallery/photos/:photoId` | Delete photo | Admin |

### 9. Schedule (`/api/schedule` & `/api/admin/schedule`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/schedule` | List active weekly/recurring schedules | Public |
| `GET` | `/api/schedule/:id` | Schedule item details | Public |
| `GET` | `/api/admin/schedule` | List all schedules | Admin |
| `POST` | `/api/admin/schedule` | Create schedule item | Admin |
| `PUT` | `/api/admin/schedule/:id` | Update schedule item | Admin |
| `DELETE` | `/api/admin/schedule/:id` | Delete schedule item | Admin |

### 10. File Uploads (`/api/upload`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/upload` | Upload images, documents, or audio files | Admin |

---

## 🧪 Testing

Run all automated unit and integration tests:

```bash
npm test
```

Run test suite with code coverage:

```bash
npm run test:coverage
```

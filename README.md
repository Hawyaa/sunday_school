# Hawyaa Sunday School

Official repository for the **Hawyaa Sunday School** platform.

---

## 📁 Repository Structure

```text
sunday_school/
└── backend/     # Backend REST API (Node.js, Express, TypeScript, Prisma, MySQL)
```

---

## 🚀 Backend Quickstart

All backend source code, database models, migrations, and documentation reside in the [`backend/`](backend/) directory.

```bash
cd backend

# 1. Install dependencies (if not already installed)
npm install

# 2. Configure environment
# Copy .env.example to .env and configure your MySQL DATABASE_URL
cp .env.example .env

# 3. Run database migrations & seed initial admin
npx prisma migrate dev
npm run db:seed

# 4. Start development server
npm run dev
```

Interactive Swagger documentation is available at:
```
http://localhost:5000/api/docs
```

For detailed documentation of all endpoints, authentication flows, and automated test execution, see [`backend/README.md`](backend/README.md).

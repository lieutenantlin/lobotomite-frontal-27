# lobotomite-frontal-27

Microplastics monitoring platform built for DataHacks 2026. The repository is split into:

- `frontend/`: a Next.js dashboard for researchers and admins
- `backend/`: a Fastify API backed by PostgreSQL via Prisma

The product theme in the codebase is "Aqua Graph": devices ingest sample measurements, the API stores them, and the frontend visualizes them in dashboards, tables, and a map.

## Tech stack

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/Base UI component primitives
- TanStack Query for client-side data fetching and caching
- React Hook Form + Zod for form handling and validation
- Recharts for dashboard charts
- Leaflet + React Leaflet for map rendering

### Backend

- Node.js 20
- Fastify 4
- TypeScript
- Prisma ORM
- PostgreSQL 16
- Zod for request validation
- JWT + `bcrypt` for authentication
- Optional S3-backed object storage, with a local filesystem provider for development
- Vitest for backend tests

### Infrastructure

- Docker Compose for local Postgres, API, and frontend orchestration
- Multi-stage Docker builds for the backend and frontend services

## Architecture

### Backend flow

1. Edge devices send sample payloads to `/ingest/sample` or `/ingest/batch`.
2. The API validates payloads with Zod.
3. Prisma persists `Device`, `Sample`, `SampleTag`, `User`, and `AuditLog` records in PostgreSQL.
4. Image references are stored as object keys; download URLs are resolved through the configured storage provider.
5. Authenticated users access samples, devices, stats, and admin operations through JWT-protected routes.

### Frontend flow

1. Users authenticate against `POST /auth/login`.
2. The JWT is stored in browser local storage.
3. TanStack Query fetches API data from the client and caches responses.
4. Protected pages under `src/app/(app)` are wrapped in an auth guard and shared app shell.
5. Dashboard, sample, device, map, and admin screens are rendered from API data.

## Repository layout

```text
.
├── backend/
│   ├── prisma/             # Prisma schema and seed script
│   ├── src/
│   │   ├── middleware/     # JWT auth and role guards
│   │   ├── routes/         # Fastify route modules
│   │   ├── services/       # Domain logic for samples, devices, auth, audit
│   │   ├── storage/        # Local and S3 storage providers
│   │   └── tests/          # Vitest route tests
│   └── Dockerfile
├── frontend/
│   ├── src/app/            # Next.js App Router pages and layouts
│   ├── src/components/     # App shell, auth, map, dashboard, and UI components
│   └── src/lib/            # API client, auth helpers, types, formatting utils
└── docker-compose.yml
```

## Local development

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d db
```

### 2. Run the backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

The backend listens on `http://localhost:3001` by default.

### 3. Run the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default and targets `http://localhost:3001` unless `NEXT_PUBLIC_API_BASE_URL` is set.

## Docker workflow

The provided [`docker-compose.yml`](/home/mori/Dev/datahacks-2026/lobotomite-frontal-27/docker-compose.yml) now starts:

- `db`: Postgres 16 with a persistent named volume
- `api`: the Fastify backend on `http://localhost:3001`
- `frontend`: the Next.js app on `http://localhost:3000`

Start the full stack from the repository root:

```bash
docker compose up --build
```

Start it in the background:

```bash
docker compose up -d --build
```

Stop it:

```bash
docker compose down
```

Persist the database and uploaded files:

```bash
docker compose down
docker volume ls
```

Important detail: the frontend is a browser app, so its `NEXT_PUBLIC_API_BASE_URL` must point to a host-reachable address. In this compose setup it is intentionally set to `http://localhost:3001`, not `http://api:3001`, because the user's browser cannot resolve Docker's internal service DNS.

If you need database schema and seed data after the containers are up, run:

```bash
cd backend
npm install
npm run db:push
npm run db:seed
```

## Seed credentials

The seed script creates:

- `admin@example.com` / `admin1234`
- `researcher@example.com` / `researcher1234`

## Current API/frontend alignment notes

The frontend client contains fallback logic for a few endpoints that are not fully aligned with the backend route surface yet. Examples include:

- dashboard stats falling back to derived client-side calculations
- map markers falling back to the paginated samples list
- admin audit log handling both `/admin/audit-log` and `/admin/audit-logs`

That means the application is resilient during development, but the docs should be read as describing the current implementation, not a finished public API contract.

## Additional documentation

- [backend/README.md](/home/mori/Dev/datahacks-2026/lobotomite-frontal-27/backend/README.md)
- [frontend/README.md](/home/mori/Dev/datahacks-2026/lobotomite-frontal-27/frontend/README.md)

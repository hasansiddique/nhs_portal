# NHS Appointment Management System

Monorepo containing a **web app** (React + Vite) and **API** (tRPC + Express + Prisma + PostgreSQL) for managing NHS-style appointments.

## Architecture

- **apps/web** – React SPA (Vite), NHS-themed UI: home, book appointment, my appointments, staff dashboard.
- **apps/api** – Node server: tRPC at `/trpc`, Prisma ORM, PostgreSQL.
- **libs/client/api** – tRPC React client and typed hooks (uses `AppRouter` from API).
- **libs/client/ui**, **libs/client/utils** – Shared UI and utilities (existing).

## Prisma schema (PostgreSQL)

- **User** – Auth (email, passwordHash, role: PATIENT | PRACTITIONER | ADMIN).
- **Patient** – Links to User; NHS number, DOB, address, GP surgery.
- **Practitioner** – Links to User; title, GMC number, speciality.
- **Location** – Surgery/clinic name and address.
- **Slot** – Practitioner + Location + startAt/endAt (availability).
- **Appointment** – Patient + Slot, status (SCHEDULED | COMPLETED | CANCELLED | NO_SHOW), reason, notes.

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Database

Create a PostgreSQL database and set:

```bash
# apps/api/.env (or root .env)
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nhs_appointments?schema=public"
```

Run migrations and generate Prisma client:

```bash
pnpm prisma:generate
pnpm exec prisma migrate dev --schema=apps/api/prisma/schema.prisma --name init
```

### 3. Run the API

```bash
pnpm start:api
# or: nx serve api
```

API runs at **http://localhost:4000**. tRPC endpoint: **http://localhost:4000/trpc**. REST auth endpoints (see below) are at **http://localhost:4000/auth/***.

### 4. Run the web app

```bash
pnpm start:web
# or: nx serve web
```

Web runs at **http://localhost:4500**. Set **VITE_API_URL** so the web app can call the API (auth and tRPC):

```bash
# .env or .env.local at repo root (or in apps/web)
VITE_API_URL=http://localhost:4000
```

If unset, the app may use a different base URL; auth (login/signup/forgot password) and tRPC need this to point at your API.

## Scripts

| Script              | Command              | Description                    |
|---------------------|----------------------|--------------------------------|
| `pnpm start:web`    | `nx serve web`       | Start web app (port 4500)     |
| `pnpm start:api`   | `nx serve api`       | Start API (port 4000)         |
| `pnpm build:web`   | `nx build web`       | Build web app                 |
| `pnpm build:api`   | `nx build api`       | Build API                     |
| `pnpm prisma:generate` | `nx run api:prisma-generate` | Generate Prisma client |
| `pnpm prisma:migrate`  | `nx run api:prisma-migrate`  | Run migrations (dev)   |

## tRPC procedures

- **auth** – signIn, me
- **patients** – list, byId, create
- **practitioners** – list, byId
- **locations** – list, byId
- **slots** – available (query), create (protected)
- **appointments** – list, byId, create (protected), updateStatus (protected)

## REST Auth API

The API exposes REST endpoints used by the existing sign-in/sign-up/forgot-password UI:

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | `username` (email), `password` | Returns `{ token, user }`. Use email as username. |
| POST | `/auth/signup` | `email`, `username`, `password` | Creates user (bcrypt hash). |
| POST | `/auth/forgot-password` | `email`, `redirect_url` | Stores reset token (no email sent by default). |
| POST | `/auth/verify-reset-token` | `reset_token` | Returns `{ status: true }` if valid. |
| POST | `/auth/reset-password` | `reset_token`, `password` | Updates password, clears token. |
| POST | `/auth/refresh-token` | `user_id`, `email` | Returns `{ newToken }`. |
| POST | `/check-email` | `email` | Returns `{ status, message }` for signup validation. |
| POST | `/check-username` | `username` | Returns `{ status, message }` for signup validation. |

Set **JWT_SECRET** in `apps/api/.env` (or root `.env`); default is a dev-only value.

## Notes

- **Auth**: Login/signup use the REST auth above; JWT is returned and stored (cookie + localStorage). Protected tRPC procedures can read `ctx.user` if you pass the token (e.g. in a header) and resolve it in `createContext`.
- **Booking**: The “Book appointment” page uses a placeholder `patientId`; in production this should come from the logged-in patient or staff selection.
- **Seed data**: Add a seed script in `apps/api/prisma/seed.ts` and run with `prisma db seed` to create sample users, practitioners, locations, and slots.

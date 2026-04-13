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

## Demo accounts (after `pnpm prisma:seed`)

All use password **`Demo2026!`** (seed also sets this on the first demo doctor account).

| Role | Email | What they can do in the app |
|------|--------|------------------------------|
| **Admin** | `admin@nhs-demo.local` | Full directory, booked list, calendar, **Add patient** / **Add doctor** (dashboard), all locations in the location filter. |
| **Doctor** | `sarah.mitchell@nhs-demo.local` | Own appointments, patients at their clinics, calendar (+Add) with **patient** selection and status/notes updates on an event. |
| **Patient** | `patient@nhs-demo.local` | **My appointments**, **Book appointment**; location filter is fixed to their registered clinic; they can only cancel their own future appointments from the calendar detail panel. |

Other seeded clinicians keep email `*.@nhs-demo.local` with password **`SeedPractitioner!`** unless overwritten by the seed step above.

## Roles and access

- **JWT** includes `role`, and when applicable `patientId` / `practitionerId` for faster checks.
- **Patients** see only their appointments and book only for themselves; dashboard sidebar is limited to my appointments + book + settings.
- **Practitioners** see appointments where they are the clinician; patient lists are limited to clinics they work at; they cannot open the admin “add user” flows.
- **Admins** see global lists (optionally filtered by location) and can register new patients or clinicians via the dashboard.

## tRPC procedures (high level)

- **auth** – signIn, me
- **patients** – list, byId (authenticated, scoped by role); **adminRegister** (admin); **create** (admin, legacy user-linked create)
- **practitioners** – list, byId (authenticated); **adminRegister** (admin)
- **locations** – list, byId
- **slots** – available (public); **create** (admin or practitioner at own locations)
- **appointments** – list, byId, create, updateStatus (authenticated; rules per role); **createFromCalendar** (admin or practitioner)

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

- **Auth**: Login uses REST `/auth/login`; JWT is stored with a `Bearer` prefix (cookie + localStorage `user` payload includes `role`, `patientId`, `practitionerId`, `homeLocationId`, `workLocationIds` where applicable). tRPC sends `Authorization: Bearer <token>`.
- **Booking**: Staff choose a **patient** in the calendar drawer; patients book without that field (always self).
- **Seed**: `apps/api/prisma/seed.ts` — run with `pnpm prisma:seed` (see root `package.json`) after migrations.

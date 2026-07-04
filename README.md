# Chavous Transportation LLC — Website & Admin Dashboard

Full-stack Next.js site for a continental-US freight trucking company: marketing
pages, a driver application (with generated PDF + email), a load-booking quote
form, and an authenticated admin dashboard for editing site content, reviewing
submissions, and viewing basic analytics.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma + Postgres
(Supabase) · NextAuth (credentials) · Resend · pdf-lib · react-hook-form + zod ·
recharts · react-simple-maps

## First-time setup

1. **Node version.** This project needs Node 18.18+ / 20+. If your system Node
   is older, install one with Homebrew and run commands through it:
   ```bash
   brew install node@20
   export PATH="/opt/homebrew/opt/node@20/bin:$PATH"   # add to your shell profile, or use nvm/.nvmrc
   ```

2. **Install dependencies** (uses `--legacy-peer-deps` because `react-simple-maps`
   hasn't published React 19 peer ranges yet — it works fine at runtime):
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment variables.** Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` / `DIRECT_URL` — your Supabase Postgres connection strings
     (Project Settings → Database → Connection string). Use the **direct**
     connection for both to start; switch `DATABASE_URL` to the pooled
     (`:6543`, `?pgbouncer=true`) connection string if you deploy to a
     serverless platform.
   - `RESEND_API_KEY` / `EMAIL_FROM` / `NOTIFY_EMAIL` — sign up at
     [resend.com](https://resend.com) for a free API key. Until this is set,
     the site still works — emails are skipped with a console warning.
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`.
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — used once by the seed script to create
     your first admin login.

4. **Push the database schema and seed it:**
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```
   This creates all tables, an admin user (from `ADMIN_EMAIL`/`ADMIN_PASSWORD`),
   the default company profile, and the five starter services.

5. **Run it:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` for the public site and
   `http://localhost:3000/admin/login` for the dashboard.

## Regenerating the driver application PDF template

`public/forms/driver-application-template.pdf` is a fillable PDF built by
`scripts/generate-application-template.ts`. If you change the fields a driver
application collects, update `lib/schemas.ts`, `lib/pdf-fields.ts`, the
generator script, and `lib/pdf.ts` together, then rebuild the template:

```bash
npm run pdf:template
```

## Project layout

- `app/(site)/` — public marketing pages (home, about, services, coverage,
  contact, quote, apply) sharing the public navbar/footer layout.
- `app/admin/` — `login/` (unauthenticated) and `(dashboard)/` (auth-gated via
  `middleware.ts` + a server-side session check in its layout).
- `actions/` — server actions for form submissions and admin CRUD.
- `lib/` — Prisma client, auth config, email, PDF filling, analytics queries,
  content fetchers with graceful DB-down fallbacks.
- `prisma/schema.prisma` — data model; `prisma/seed.ts` — seed script.

## Notes

- The driver application intentionally does not collect a full SSN — that's
  handled during in-person/paper onboarding, not stored in the web database.
- The cheetah logo (`components/Logo.tsx`) is a placeholder geometric mark.
  Swap in the real logo asset there when it's available.

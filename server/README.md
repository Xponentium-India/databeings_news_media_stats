# databeings — admin backend

Custom **Node + Express + PostgreSQL** API powering the `/admin` panel:

- **Google login** (Google Identity Services → ID token verified server-side)
- **40-minute sessions** — signed, httpOnly cookie with a hard 40-min expiry (never refreshed)
- **Login-count tracking** — `app_user.login_count` increments on every sign-in; every login is also recorded in `login_event`
- **Image uploads** — admin uploads report images (Multer → `server/uploads/`), surfaced on the public News Media Stats page

This is a **separate app** from the React frontend and deploys to its own host.

---

## 1. Prerequisites

- Node 18+ and a running **PostgreSQL** server.

## 2. Install + configure

```bash
cd server
npm install
cp .env.example .env        # then edit .env (see below)
```

Key `.env` values:

| Var | What |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `GOOGLE_CLIENT_ID` | OAuth Web client ID (must match frontend `VITE_GOOGLE_CLIENT_ID`) |
| `JWT_SECRET` | random string — `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `SESSION_MINUTES` | session cap (≤ 40) |
| `ADMIN_EMAILS` | comma-separated emails allowed into `/admin` |
| `ALLOW_DEV_LOGIN` | `true` only for local testing (skips Google). **Never `true` in prod.** |
| `NODE_ENV` | `production` when deployed (enables Secure cookies, disables dev-login) |

## 3. Create the database + tables

```bash
createdb databeings                 # or point DATABASE_URL at an existing DB
npm run db:setup                    # applies db/schema.sql
```

## 4. Run

```bash
npm run dev                         # http://localhost:4000  (auto-restarts)
```

Run the frontend in another terminal (`npm run dev` in the project root). In dev,
Vite proxies `/api` and `/uploads` to `:4000`, so cookies are same-origin.

---

## Setting up Google sign-in (one time)

1. Go to **Google Cloud Console → APIs & Services → Credentials**.
2. Configure the **OAuth consent screen** (External; add your email as a test user).
3. **Create credentials → OAuth client ID → Web application.**
4. Add **Authorized JavaScript origins**:
   - `http://localhost:5173` (dev)
   - your production site origin (e.g. `https://thedatabeings.com`)
5. Copy the **Client ID** into:
   - `server/.env` → `GOOGLE_CLIENT_ID`
   - frontend `.env.local` → `VITE_GOOGLE_CLIENT_ID`
6. Put the admin's Google email in `server/.env` → `ADMIN_EMAILS`.

> The Google button uses ID-token sign-in (no redirect URI / client secret needed).

---

## API reference

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET`  | `/api/health` | – | liveness |
| `POST` | `/api/auth/google` | – | `{ credential }` → verify + start session |
| `POST` | `/api/auth/dev-login` | dev only | `{ email }` → start session (skips Google) |
| `GET`  | `/api/auth/me` | cookie | current user + session expiry |
| `POST` | `/api/auth/logout` | cookie | clear session |
| `GET`  | `/api/stats` | – | list report images (`?language=&period=&year=&month_or_week=`) |
| `POST` | `/api/admin/stats` | admin | multipart upload (`language, period, year, month_or_week, image`) |
| `DELETE` | `/api/admin/stats/:id` | admin | delete a report image |

---

## Deploying

The backend needs a host that runs a **persistent Node process** (Render, Railway,
Fly.io, a VPS…) plus a Postgres database.

1. Provision Postgres, set `DATABASE_URL`, run `npm run db:setup` once.
2. Set all env vars; `NODE_ENV=production`, `ALLOW_DEV_LOGIN` unset, real `JWT_SECRET`.
3. Set `CLIENT_ORIGIN` to the deployed frontend origin (for CORS + cookies).
4. In the frontend, set `VITE_API_BASE` to this backend's URL and rebuild.
5. Add the production origin to the Google OAuth "Authorized JavaScript origins".

> `server/uploads/` is local disk. On hosts with ephemeral disks, mount a persistent
> volume for it, or switch to S3-compatible storage later.

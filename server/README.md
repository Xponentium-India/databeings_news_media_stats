# databeings — admin backend

Custom **Node + Express + PostgreSQL** API powering the `/admin` panel:

- **Open Google login** (Google Identity Services → ID token verified server-side). Any
  Google account may sign in; set `ALLOWED_EMAIL_DOMAIN` to restrict to one workspace.
- **40-minute sessions** — signed httpOnly cookie + a `databeing_sessions` row; logout
  revokes the session server-side. Hard 40-min cap, never refreshed.
- **Per-account tracking** — `databeing_users.login_count` increments on every sign-in.
- **Image uploads** — file goes to storage (local disk **or** S3/Cloudflare R2); the DB
  stores **only the link** in `databeing_stat_images.image_path`.

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
| `ALLOWED_EMAIL_DOMAIN` | empty = any Google account; set (e.g. `xponentium.com`) to restrict |
| `STORAGE_DRIVER` | `local` (server disk) or `s3` (AWS S3 / Cloudflare R2) |
| `ALLOW_DEV_LOGIN` | `true` only for local testing (skips Google). **Never `true` in prod.** |
| `NODE_ENV` | `production` when deployed (Secure + SameSite=None cookies, no dev-login) |

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

> Login is open to any Google account by default. To limit it to your workspace,
> set `ALLOWED_EMAIL_DOMAIN=xponentium.com`. The Google button uses ID-token sign-in
> (no redirect URI / client secret needed).

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

## Image storage — Cloudflare R2 (recommended)

The DB only ever stores a **link**; the file goes to storage. In dev it's local disk;
in production point it at your R2 bucket (S3-compatible — no code change):

1. **R2 → create a bucket** (e.g. `assets`, which you already have).
2. **R2 → Manage R2 API Tokens → Create** an Object **Read & Write** token. Note the
   Access Key ID + Secret.
3. **Make objects publicly readable** so `<img>` can load them: in the bucket's
   **Settings**, either enable the **r2.dev public URL** or (better, since the site is
   on Cloudflare) attach a **custom domain** like `cdn.thedatabeings.com`.
4. Set these env vars on the backend:

   ```
   STORAGE_DRIVER=s3
   S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   S3_REGION=auto
   S3_BUCKET=assets
   S3_ACCESS_KEY_ID=<r2 access key id>
   S3_SECRET_ACCESS_KEY=<r2 secret>
   S3_PUBLIC_BASE=https://cdn.thedatabeings.com   # the PUBLIC url from step 3
   ```

> `S3_ENDPOINT` is the **private** S3 API (used to upload). `S3_PUBLIC_BASE` is the
> **public** URL stored in the DB and shown to visitors — they must be different.
> Find your Account ID + S3 API endpoint under **R2 → Account Details**.

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

# databeings_server

-- databeings admin schema (PostgreSQL)
-- All tables prefixed with databeing_ to avoid confusion.
-- Apply:  psql "$DATABASE_URL" -f server/db/schema.sql   (or: npm run db:setup)

-- 1. Users — one row per Google account. Open login: ANY Google account is
--    tracked here on first sign-in. Only is_admin=true may use the admin panel.
create table if not exists databeing_users (
  id             bigint generated always as identity primary key,
  google_sub     text not null unique,            -- Google's stable account id ("sub")
  email          text not null,
  name           text,
  picture_url    text,
  is_admin       boolean not null default false,  -- gate: only true may access /admin
  login_count    integer not null default 0,      -- how many times this account logged in
  first_login_at timestamptz,
  last_login_at  timestamptz,
  created_at     timestamptz not null default now()
);

-- Existing DB? add the column:
--   alter table databeing_users add column if not exists is_admin boolean not null default false;
-- Grant admin access to an account (after they have logged in once):
--   update databeing_users set is_admin = true where email = 'you@xponentium.com';

-- 2. Sessions — one row per login/session. Drives the 40-minute window and lets
--    logout revoke a session server-side. jti = the session id stored in the cookie.
create table if not exists databeing_sessions (
  id           bigint generated always as identity primary key,
  user_id      bigint not null references databeing_users(id) on delete cascade,
  jti          text not null unique,              -- session id (matches the JWT id)
  issued_at    timestamptz not null default now(),
  expires_at   timestamptz not null,              -- issued_at + session minutes (<= 40)
  revoked_at   timestamptz,                        -- set on logout / forced sign-out
  ip_address   inet,
  user_agent   text
);
create index if not exists databeing_sessions_user_idx on databeing_sessions (user_id);

-- 3. Stat report images — the columns from the brief
--    (Language, Weekly/Monthly, Year, Month or week, image Path).
--    image_path stores ONLY a link: /uploads/... (local) or a bucket URL (S3/R2).
create table if not exists databeing_stat_images (
  id            bigint generated always as identity primary key,
  language      text     not null,                          -- 'Hindi', 'English'
  period        text     not null check (period in ('Weekly','Monthly')),
  year          smallint not null,                          -- 2025
  month_or_week text     not null,                          -- 'Jan' | 'Week1'
  report_type   text     not null default 'news_report',        -- 'news_report', 'youtube_report', etc.
  image_path    text     not null,                          -- link/URL only
  uploaded_by   bigint   references databeing_users(id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (language, period, year, month_or_week, report_type)      -- one image per slot+type
);
create index if not exists databeing_stat_images_filter_idx
  on databeing_stat_images (language, period, year, report_type);

-- ------------------------------------------------------------------
-- Supabase note: if you create these tables via the Supabase SQL editor
-- they are owned by `supabase_admin`, and the `postgres` role your backend
-- connects as won't have write access. Run ONCE in the SQL editor to fix:
--
--   alter table public.databeing_users        owner to postgres;
--   alter table public.databeing_sessions      owner to postgres;
--   alter table public.databeing_stat_images   owner to postgres;
--
-- (Self-hosted Supabase on a direct port may not support SSL — set DATABASE_SSL=false.)
-- ------------------------------------------------------------------

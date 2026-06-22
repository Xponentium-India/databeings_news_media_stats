-- databeings admin schema (PostgreSQL)
-- All tables prefixed with databeing_ to avoid confusion.
-- Apply:  psql "$DATABASE_URL" -f server/db/schema.sql   (or: npm run db:setup)

-- 1. Users — one row per Google account. Open login: ANY Google account is
--    tracked here on first sign-in. login_count tracks how many times they log in.
create table if not exists databeing_users (
  id             bigint generated always as identity primary key,
  google_sub     text not null unique,            -- Google's stable account id ("sub")
  email          text not null,
  name           text,
  picture_url    text,
  login_count    integer not null default 0,      -- how many times this account logged in
  first_login_at timestamptz,
  last_login_at  timestamptz,
  created_at     timestamptz not null default now()
);

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
  image_path    text     not null,                          -- link/URL only
  uploaded_by   bigint   references databeing_users(id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (language, period, year, month_or_week)            -- one image per slot
);
create index if not exists databeing_stat_images_filter_idx
  on databeing_stat_images (language, period, year);

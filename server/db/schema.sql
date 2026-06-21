-- databeings admin schema (PostgreSQL)
-- Run once:  psql "$DATABASE_URL" -f server/db/schema.sql

-- 1. Admin accounts (one row per Google account)
create table if not exists app_user (
  id            bigint generated always as identity primary key,
  google_sub    text unique,                    -- Google's stable user id ("sub")
  email         text not null unique,
  name          text,
  picture_url   text,
  is_admin      boolean not null default false, -- only true users may reach /admin
  login_count   integer not null default 0,     -- how many times they've logged in
  last_login_at timestamptz,
  created_at    timestamptz not null default now()
);

-- 2. Login events: audit trail + drives the 40-minute session window
create table if not exists login_event (
  id           bigint generated always as identity primary key,
  user_id      bigint not null references app_user(id) on delete cascade,
  logged_in_at timestamptz not null default now(),
  expires_at   timestamptz not null,            -- = logged_in_at + session minutes
  ip_address   inet,
  user_agent   text
);
create index if not exists login_event_user_idx on login_event (user_id);

-- 3. Stat report images (from the admin upload form)
create table if not exists stat_image (
  id            bigint generated always as identity primary key,
  language      text     not null,                          -- 'Hindi', 'English'
  period        text     not null check (period in ('Weekly','Monthly')),
  year          smallint not null,                          -- 2025
  month_or_week text     not null,                          -- 'Jan' (monthly) | 'Week1' (weekly)
  image_path    text     not null,                          -- e.g. /uploads/1718900000-image1.png
  uploaded_by   bigint   references app_user(id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (language, period, year, month_or_week)            -- one image per slot (re-upload replaces)
);
create index if not exists stat_image_filter_idx on stat_image (language, period, year);

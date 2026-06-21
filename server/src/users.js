import { query } from "./db.js";
import { config } from "./config.js";

/**
 * Upsert the user on login, increment their login_count, stamp last_login_at,
 * and grant is_admin if their email is in ADMIN_EMAILS. Returns the user row.
 */
export async function upsertUserOnLogin({ sub, email, name, picture }) {
  const normalized = email.toLowerCase();
  const isAdmin = config.adminEmails.includes(normalized);

  const { rows } = await query(
    `insert into app_user (google_sub, email, name, picture_url, is_admin, login_count, last_login_at)
       values ($1, $2, $3, $4, $5, 1, now())
     on conflict (email) do update
       set google_sub  = coalesce(excluded.google_sub, app_user.google_sub),
           name         = excluded.name,
           picture_url  = excluded.picture_url,
           -- once an admin, stays an admin; also (re)grant if now in the allow-list
           is_admin     = app_user.is_admin or excluded.is_admin,
           login_count  = app_user.login_count + 1,
           last_login_at = now()
     returning *`,
    [sub || null, normalized, name || null, picture || null, isAdmin]
  );
  return rows[0];
}

/** Record a login event whose expires_at enforces the session window. */
export async function recordLoginEvent(userId, expiresAt, ip, userAgent) {
  await query(
    `insert into login_event (user_id, expires_at, ip_address, user_agent)
     values ($1, $2, $3, $4)`,
    [userId, expiresAt, ip || null, userAgent || null]
  );
}

export async function getUserById(id) {
  const { rows } = await query(`select * from app_user where id = $1`, [id]);
  return rows[0] || null;
}

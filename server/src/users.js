import { query } from "./db.js";

/**
 * Upsert the user on login (open login — any Google account), increment their
 * login_count and stamp login times. Identity is the Google "sub". Returns the row.
 */
export async function upsertUserOnLogin({ sub, email, name, picture }) {
  const { rows } = await query(
    `insert into databeing_users
       (google_sub, email, name, picture_url, login_count, first_login_at, last_login_at)
     values ($1, $2, $3, $4, 1, now(), now())
     on conflict (google_sub) do update
       set email        = excluded.email,
           name         = excluded.name,
           picture_url  = excluded.picture_url,
           login_count  = databeing_users.login_count + 1,
           last_login_at = now()
     returning *`,
    [sub, email.toLowerCase(), name || null, picture || null]
  );
  return rows[0];
}

export async function getUserById(id) {
  const { rows } = await query(`select * from databeing_users where id = $1`, [
    id,
  ]);
  return rows[0] || null;
}

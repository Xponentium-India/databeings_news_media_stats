import { query } from "./db.js";
import { config } from "./config.js";

/**
 * Upsert the user on login (open login — any Google account is tracked), increment
 * login_count and stamp login times. Promotes to is_admin if the email is in
 * ADMIN_EMAILS; login never DEMOTES (admin can only be removed via SQL). Returns the row.
 */
export async function upsertUserOnLogin({ sub, email, name, picture }) {
  const promote = config.adminEmails.includes(email.toLowerCase());
  const { rows } = await query(
    `insert into databeing_users
       (google_sub, email, name, picture_url, is_admin, login_count, first_login_at, last_login_at)
     values ($1, $2, $3, $4, $5, 1, now(), now())
     on conflict (google_sub) do update
       set email        = excluded.email,
           name         = excluded.name,
           picture_url  = excluded.picture_url,
           is_admin     = databeing_users.is_admin or excluded.is_admin,
           login_count  = databeing_users.login_count + 1,
           last_login_at = now()
     returning *`,
    [sub, email.toLowerCase(), name || null, picture || null, promote]
  );
  return rows[0];
}

export async function getUserById(id) {
  const { rows } = await query(`select * from databeing_users where id = $1`, [
    id,
  ]);
  return rows[0] || null;
}

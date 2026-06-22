import { query } from "./db.js";

/** Record a session (one per login). jti matches the JWT id stored in the cookie. */
export async function createSessionRecord(userId, jti, expiresAt, ip, userAgent) {
  await query(
    `insert into databeing_sessions (user_id, jti, expires_at, ip_address, user_agent)
     values ($1, $2, $3, $4, $5)`,
    [userId, jti, expiresAt, ip || null, userAgent || null]
  );
}

/** Return the session if it is still active (not revoked, not past expiry). */
export async function getActiveSession(jti) {
  const { rows } = await query(
    `select * from databeing_sessions
      where jti = $1 and revoked_at is null and expires_at > now()`,
    [jti]
  );
  return rows[0] || null;
}

/** Revoke a session (logout / forced sign-out). */
export async function revokeSession(jti) {
  await query(
    `update databeing_sessions set revoked_at = now()
      where jti = $1 and revoked_at is null`,
    [jti]
  );
}

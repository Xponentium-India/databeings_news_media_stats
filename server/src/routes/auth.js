import { Router } from "express";
import { config } from "../config.js";
import {
  verifyGoogleCredential,
  issueSession,
  clearSession,
  readSession,
} from "../auth.js";
import { upsertUserOnLogin, getUserById } from "../users.js";
import { createSessionRecord, getActiveSession, revokeSession } from "../sessions.js";

export const authRouter = Router();

const clientIp = (req) =>
  (req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "")
    .replace("::ffff:", "")
    .trim() || null;

/** Session length per role: admins 40 min, normal visitors 30 min. */
const sessionMinutesFor = (user) =>
  user.is_admin ? config.sessionMinutes : config.visitorSessionMinutes;

async function startSession(req, res, user) {
  const minutes = sessionMinutesFor(user);
  const { jti, expiresAt } = issueSession(res, user, minutes);
  await createSessionRecord(user.id, jti, expiresAt, clientIp(req), req.headers["user-agent"]);
  return expiresAt;
}

/**
 * POST /api/auth/google { credential } — open Google sign-in (any account).
 * Every signed-in account gets a backend-tracked session: 40 min for admins,
 * 30 min for normal visitors. The admin panel is still gated by is_admin downstream.
 */
authRouter.post("/google", async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: "Missing credential" });

    const profile = await verifyGoogleCredential(credential);
    const user = await upsertUserOnLogin(profile); // tracks every login (count++)

    const expiresAt = await startSession(req, res, user);
    res.json({ user: publicUser(user), expiresAt });
  } catch (err) {
    console.error("[auth/google]", err.message);
    res.status(err.status || 401).json({ error: err.message || "Google sign-in failed" });
  }
});

/**
 * POST /api/auth/dev-login { email } — LOCAL ONLY shortcut for testing without
 * real Google credentials. Disabled unless ALLOW_DEV_LOGIN=true and not prod.
 */
authRouter.post("/dev-login", async (req, res) => {
  if (!config.allowDevLogin) return res.status(404).json({ error: "Not found" });
  try {
    const email = (req.body?.email || "dev@example.com").trim();
    if (!email) return res.status(400).json({ error: "Provide an email" });

    const user = await upsertUserOnLogin({
      sub: `dev:${email.toLowerCase()}`, // stable id so dev logins don't duplicate
      email,
      name: email.split("@")[0],
      picture: null,
    });
    // any account may get a (visitor) session; admin panel access still needs is_admin
    const expiresAt = await startSession(req, res, user);
    res.json({ user: publicUser(user), expiresAt, dev: true });
  } catch (err) {
    console.error("[auth/dev-login]", err.message);
    res.status(500).json({ error: "Dev login failed" });
  }
});

/** GET /api/auth/me — current session/user (admin or normal visitor), or { user: null }. */
authRouter.get("/me", async (req, res) => {
  const session = readSession(req);
  if (!session) return res.json({ user: null });
  const active = await getActiveSession(session.jti);
  if (!active) return res.json({ user: null });
  const user = await getUserById(session.uid);
  if (!user) return res.json({ user: null });
  res.json({
    user: publicUser(user),
    expiresAt: new Date(session.exp * 1000).toISOString(),
  });
});

/** POST /api/auth/logout — revoke this session server-side + clear cookie. */
authRouter.post("/logout", async (req, res) => {
  const session = readSession(req);
  if (session?.jti) await revokeSession(session.jti);
  clearSession(res);
  res.json({ ok: true });
});

function publicUser(u) {
  return {
    id: String(u.id),
    email: u.email,
    name: u.name,
    pictureUrl: u.picture_url,
    isAdmin: u.is_admin,
    loginCount: u.login_count,
    lastLoginAt: u.last_login_at,
  };
}

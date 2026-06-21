import { Router } from "express";
import { config } from "../config.js";
import {
  verifyGoogleCredential,
  issueSession,
  clearSession,
  readSession,
} from "../auth.js";
import { upsertUserOnLogin, recordLoginEvent, getUserById } from "../users.js";

export const authRouter = Router();

const clientIp = (req) =>
  (req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "")
    .replace("::ffff:", "")
    .trim() || null;

/** POST /api/auth/google { credential } — real Google sign-in. */
authRouter.post("/google", async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: "Missing credential" });

    const profile = await verifyGoogleCredential(credential);
    const user = await upsertUserOnLogin(profile);

    if (!user.is_admin) {
      return res
        .status(403)
        .json({ error: "This Google account is not an authorized admin." });
    }

    const expiresAt = issueSession(res, user);
    await recordLoginEvent(user.id, expiresAt, clientIp(req), req.headers["user-agent"]);

    res.json({ user: publicUser(user), expiresAt });
  } catch (err) {
    console.error("[auth/google]", err.message);
    res.status(401).json({ error: "Google sign-in failed" });
  }
});

/**
 * POST /api/auth/dev-login { email } — LOCAL ONLY shortcut for testing without
 * real Google credentials. Disabled unless ALLOW_DEV_LOGIN=true and not prod.
 */
authRouter.post("/dev-login", async (req, res) => {
  if (!config.allowDevLogin) {
    return res.status(404).json({ error: "Not found" });
  }
  try {
    const email = (req.body?.email || config.adminEmails[0] || "").trim();
    if (!email) return res.status(400).json({ error: "Provide an email" });

    const user = await upsertUserOnLogin({
      sub: null,
      email,
      name: email.split("@")[0],
      picture: null,
    });
    if (!user.is_admin) {
      return res
        .status(403)
        .json({ error: `${email} is not in ADMIN_EMAILS` });
    }
    const expiresAt = issueSession(res, user);
    await recordLoginEvent(user.id, expiresAt, clientIp(req), req.headers["user-agent"]);
    res.json({ user: publicUser(user), expiresAt, dev: true });
  } catch (err) {
    console.error("[auth/dev-login]", err.message);
    res.status(500).json({ error: "Dev login failed" });
  }
});

/** GET /api/auth/me — current session/user, or { user: null }. */
authRouter.get("/me", async (req, res) => {
  const session = readSession(req);
  if (!session) return res.json({ user: null });
  const user = await getUserById(session.uid);
  if (!user || !user.is_admin) return res.json({ user: null });
  res.json({
    user: publicUser(user),
    // exp is in seconds; surface it so the client can show a countdown
    expiresAt: new Date(session.exp * 1000).toISOString(),
  });
});

/** POST /api/auth/logout */
authRouter.post("/logout", (req, res) => {
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

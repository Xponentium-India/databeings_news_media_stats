import net from "node:net";
import { Router } from "express";
import { config } from "../config.js";
import {
  verifyGoogleCredential,
  issueSession,
  clearSession,
  readSession,
  getSessionUser,
} from "../auth.js";
import { upsertUserOnLogin } from "../users.js";
import { createSessionRecord, revokeSession } from "../sessions.js";
import { asyncRoute } from "../asyncRoute.js";

export const authRouter = Router();

// req.ip honours the 'trust proxy' setting, so X-Forwarded-For is only believed
// from the configured proxy hops instead of from any client
const clientIp = (req) => {
  const ip = (req.ip || "").replace(/^::ffff:/, "");
  return net.isIP(ip) ? ip : null;
};

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
authRouter.post(
  "/google",
  asyncRoute(async (req, res) => {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: "Missing credential" });

    let profile;
    try {
      profile = await verifyGoogleCredential(credential);
    } catch (err) {
      console.error("[auth/google]", err.message);
      // domain restriction (403) has a safe message; token errors stay generic
      return err.status
        ? res.status(err.status).json({ error: err.message })
        : res.status(401).json({ error: "Google sign-in failed" });
    }
    const user = await upsertUserOnLogin(profile); // tracks every login (count++)

    const expiresAt = await startSession(req, res, user);
    res.json({ user: publicUser(user), expiresAt });
  })
);

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
authRouter.get(
  "/me",
  asyncRoute(async (req, res) => {
    const current = await getSessionUser(req);
    if (!current) return res.json({ user: null });
    res.json({
      user: publicUser(current.user),
      expiresAt: new Date(current.payload.exp * 1000).toISOString(),
    });
  })
);

/** POST /api/auth/logout — revoke this session server-side + clear cookie. */
authRouter.post(
  "/logout",
  asyncRoute(async (req, res) => {
    const session = readSession(req);
    if (session?.jti) await revokeSession(session.jti);
    clearSession(res);
    res.json({ ok: true });
  })
);

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

import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { config, COOKIE_NAME } from "./config.js";
import { getActiveSession } from "./sessions.js";
import { getUserById } from "./users.js";

const googleClient = new OAuth2Client(config.googleClientId);

/** Verify a Google Identity Services credential (ID token). Throws if invalid. */
export async function verifyGoogleCredential(credential) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.googleClientId,
  });
  const p = ticket.getPayload();
  if (!p?.email || !p.email_verified) {
    throw new Error("Google account email not verified");
  }
  // optional single-domain restriction (open by default)
  if (config.allowedDomain && !p.email.toLowerCase().endsWith(`@${config.allowedDomain}`)) {
    const e = new Error(`Only @${config.allowedDomain} accounts are allowed`);
    e.status = 403;
    throw e;
  }
  return { sub: p.sub, email: p.email, name: p.name, picture: p.picture };
}

/**
 * Issue a session cookie with a fresh jti. exp is a hard cap (sessionMinutes)
 * and is never refreshed, so a session can't outlive the cap. Returns { jti, expiresAt }.
 */
export function issueSession(res, user) {
  const jti = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + config.sessionMinutes * 60_000);
  const token = jwt.sign({ uid: String(user.id), email: user.email }, config.jwtSecret, {
    expiresIn: `${config.sessionMinutes}m`,
    jwtid: jti,
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    // cross-site cookies (frontend & API on different domains) need None+Secure
    sameSite: config.isProd ? "none" : "lax",
    secure: config.isProd,
    maxAge: config.sessionMinutes * 60_000,
    path: "/",
  });

  return { jti, expiresAt };
}

export function clearSession(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

/** Read + verify the session cookie. Returns the decoded payload or null. */
export function readSession(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, config.jwtSecret); // throws once past the exp
  } catch {
    return null;
  }
}

/**
 * Middleware: require an active session belonging to an is_admin user.
 * Re-checks is_admin in the DB each request, so revoking admin takes effect at once.
 */
export async function requireAdmin(req, res, next) {
  try {
    const payload = readSession(req);
    if (!payload) {
      return res.status(401).json({ error: "Session expired or not signed in" });
    }
    const session = await getActiveSession(payload.jti);
    if (!session) {
      return res.status(401).json({ error: "Session revoked or expired" });
    }
    const user = await getUserById(payload.uid);
    if (!user || !user.is_admin) {
      return res.status(403).json({ error: "Not authorized for admin" });
    }
    req.session = payload;
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

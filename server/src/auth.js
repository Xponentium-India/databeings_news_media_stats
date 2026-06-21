import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { config, COOKIE_NAME } from "./config.js";

const googleClient = new OAuth2Client(config.googleClientId);

/**
 * Verify a Google Identity Services credential (ID token) and return a
 * normalized profile. Throws if invalid.
 */
export async function verifyGoogleCredential(credential) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.googleClientId,
  });
  const p = ticket.getPayload();
  if (!p?.email || !p.email_verified) {
    throw new Error("Google account email not verified");
  }
  return { sub: p.sub, email: p.email, name: p.name, picture: p.picture };
}

/**
 * Sign a session cookie. exp is a hard cap (sessionMinutes); we do NOT refresh
 * it, so a session can never live longer than the cap.
 */
export function issueSession(res, user) {
  const expiresAt = new Date(Date.now() + config.sessionMinutes * 60_000);
  const token = jwt.sign(
    { uid: String(user.id), email: user.email, isAdmin: user.is_admin },
    config.jwtSecret,
    { expiresIn: `${config.sessionMinutes}m` }
  );

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.isProd,
    maxAge: config.sessionMinutes * 60_000,
    path: "/",
  });

  return expiresAt;
}

export function clearSession(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

/** Read + verify the session cookie. Returns the decoded payload or null. */
export function readSession(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, config.jwtSecret); // throws once past the 40-min exp
  } catch {
    return null;
  }
}

/** Express middleware: require a valid (non-expired) admin session. */
export function requireAdmin(req, res, next) {
  const session = readSession(req);
  if (!session) {
    return res.status(401).json({ error: "Session expired or not signed in" });
  }
  if (!session.isAdmin) {
    return res.status(403).json({ error: "Not authorized for admin" });
  }
  req.session = session;
  next();
}

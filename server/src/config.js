import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

export const config = {
  isProd,
  port: Number(process.env.PORT) || 4000,
  databaseUrl:
    process.env.DATABASE_URL || "postgres://localhost:5432/databeings",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  jwtSecret: process.env.JWT_SECRET || "dev-insecure-secret-change-me",
  // hard cap, never more than 40 minutes
  sessionMinutes: Math.min(Number(process.env.SESSION_MINUTES) || 40, 40),
  adminEmails: (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  // dev-login is never allowed in production
  allowDevLogin: !isProd && process.env.ALLOW_DEV_LOGIN === "true",
};

export const COOKIE_NAME = "db_session";

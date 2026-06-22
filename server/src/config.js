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
  // dev-login is never allowed in production
  allowDevLogin: !isProd && process.env.ALLOW_DEV_LOGIN === "true",
  // OPEN LOGIN: empty = any Google account may sign in. Set e.g. "xponentium.com"
  // to restrict to one workspace domain. (Optional, off by default.)
  allowedDomain: (process.env.ALLOWED_EMAIL_DOMAIN || "").toLowerCase().trim(),

  // image storage: 'local' (server disk) or 's3' (S3-compatible: AWS S3 / Cloudflare R2)
  storage: {
    driver: (process.env.STORAGE_DRIVER || "local").toLowerCase(),
    // if set, local links become absolute (e.g. https://api.example.com)
    publicBase: (process.env.PUBLIC_BASE || "").replace(/\/$/, ""),
    s3: {
      endpoint: process.env.S3_ENDPOINT || "", // R2: https://<acct>.r2.cloudflarestorage.com
      region: process.env.S3_REGION || "auto",
      bucket: process.env.S3_BUCKET || "",
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
      // public base URL where the bucket is served (CDN / public bucket)
      publicBase: (process.env.S3_PUBLIC_BASE || "").replace(/\/$/, ""),
    },
  },
};

export const COOKIE_NAME = "db_session";

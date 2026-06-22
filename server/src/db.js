import pg from "pg";
import { config } from "./config.js";

// SSL: explicit DATABASE_SSL wins; otherwise auto — off for localhost, on for remote.
// (Some self-hosted Postgres/Supabase listen without SSL — set DATABASE_SSL=false.)
const isLocal = /@?(localhost|127\.0\.0\.1)[:/]/.test(config.databaseUrl);
const ssl =
  config.dbSsl === "true"
    ? { rejectUnauthorized: false }
    : config.dbSsl === "false"
      ? false
      : isLocal
        ? false
        : { rejectUnauthorized: false };

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl,
});

pool.on("error", (err) => {
  console.error("[db] unexpected pool error:", err.message);
});

/** Thin query helper. */
export const query = (text, params) => pool.query(text, params);

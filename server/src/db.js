import pg from "pg";
import { config } from "./config.js";

// Local Postgres needs no SSL; hosted Postgres (Supabase, Render, …) requires it.
const isLocal = /@?(localhost|127\.0\.0\.1)[:/]/.test(config.databaseUrl);

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("[db] unexpected pool error:", err.message);
});

/** Thin query helper. */
export const query = (text, params) => pool.query(text, params);

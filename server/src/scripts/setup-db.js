// Applies server/db/schema.sql to DATABASE_URL.
// Usage: npm run db:setup
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(
  path.resolve(__dirname, "../../db/schema.sql"),
  "utf8"
);

try {
  await pool.query(schema);
  console.log("[db:setup] schema applied ✓");
} catch (err) {
  console.error("[db:setup] failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

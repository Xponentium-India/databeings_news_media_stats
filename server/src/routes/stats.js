import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const PERIODS = new Set(["Weekly", "Monthly"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

export const statsRouter = Router();

/** GET /api/stats — public list, optional filters. */
statsRouter.get("/", async (req, res) => {
  const { language, period, year, month_or_week } = req.query;
  const where = [];
  const params = [];
  const add = (sql, val) => {
    params.push(val);
    where.push(`${sql} $${params.length}`);
  };
  if (language) add("language =", language);
  if (period) add("period =", period);
  if (year) add("year =", Number(year));
  if (month_or_week) add("month_or_week =", month_or_week);

  const { rows } = await query(
    `select id, language, period, year, month_or_week, image_path, created_at
       from stat_image
       ${where.length ? "where " + where.join(" and ") : ""}
       order by year desc, created_at desc`,
    params
  );
  res.json({ items: rows.map(serialize) });
});

/** POST /api/admin/stats — upload an image + metadata (admin only). */
statsRouter.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { language, period, year, month_or_week } = req.body || {};
    if (!language || !period || !year || !month_or_week || !req.file) {
      cleanup(req.file);
      return res
        .status(400)
        .json({ error: "language, period, year, month_or_week and image are required" });
    }
    if (!PERIODS.has(period)) {
      cleanup(req.file);
      return res.status(400).json({ error: "period must be Weekly or Monthly" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    // Upsert on the unique slot; if replacing, delete the old file afterward.
    const existing = await query(
      `select image_path from stat_image
        where language=$1 and period=$2 and year=$3 and month_or_week=$4`,
      [language, period, Number(year), month_or_week]
    );

    const { rows } = await query(
      `insert into stat_image (language, period, year, month_or_week, image_path, uploaded_by)
         values ($1,$2,$3,$4,$5,$6)
       on conflict (language, period, year, month_or_week) do update
         set image_path = excluded.image_path,
             uploaded_by = excluded.uploaded_by,
             created_at = now()
       returning *`,
      [language, period, Number(year), month_or_week, imagePath, req.session.uid]
    );

    const oldPath = existing.rows[0]?.image_path;
    if (oldPath && oldPath !== imagePath) removeUpload(oldPath);

    res.status(201).json({ item: serialize(rows[0]) });
  } catch (err) {
    cleanup(req.file);
    console.error("[stats POST]", err.message);
    res.status(500).json({ error: "Upload failed" });
  }
});

/** DELETE /api/admin/stats/:id (admin only). */
statsRouter.delete("/:id", requireAdmin, async (req, res) => {
  const { rows } = await query(
    `delete from stat_image where id = $1 returning image_path`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  removeUpload(rows[0].image_path);
  res.json({ ok: true });
});

function serialize(r) {
  return {
    id: String(r.id),
    language: r.language,
    period: r.period,
    year: r.year,
    monthOrWeek: r.month_or_week,
    imagePath: r.image_path,
    createdAt: r.created_at,
  };
}

function removeUpload(imagePath) {
  if (!imagePath?.startsWith("/uploads/")) return;
  fs.promises
    .unlink(path.join(UPLOAD_DIR, path.basename(imagePath)))
    .catch(() => {});
}

function cleanup(file) {
  if (file?.path) fs.promises.unlink(file.path).catch(() => {});
}

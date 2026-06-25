import { Router } from "express";
import multer from "multer";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";
import { saveImage, deleteImage } from "../storage.js";

const PERIODS = new Set(["Weekly", "Monthly"]);

// keep the file in memory so the storage layer can send it to disk OR S3/R2
const upload = multer({
  storage: multer.memoryStorage(),
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
       from databeing_stat_images
       ${where.length ? "where " + where.join(" and ") : ""}
       order by year desc, created_at desc`,
    params
  );
  res.json({ items: rows.map(serialize) });
});

/** POST /api/admin/stats — upload an image + metadata (any signed-in user). */
statsRouter.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const { language, period, year, month_or_week } = req.body || {};
    if (!language || !period || !year || !month_or_week || !req.file) {
      return res
        .status(400)
        .json({ error: "language, period, year, month_or_week and image are required" });
    }
    if (!PERIODS.has(period)) {
      return res.status(400).json({ error: "period must be Weekly or Monthly" });
    }

    // upload to storage first — DB stores only the returned link
    const imagePath = await saveImage(req.file);

    const existing = await query(
      `select image_path from databeing_stat_images
        where language=$1 and period=$2 and year=$3 and month_or_week=$4`,
      [language, period, Number(year), month_or_week]
    );

    const { rows } = await query(
      `insert into databeing_stat_images
         (language, period, year, month_or_week, image_path, uploaded_by)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (language, period, year, month_or_week) do update
         set image_path = excluded.image_path,
             uploaded_by = excluded.uploaded_by,
             created_at = now()
       returning *`,
      [language, period, Number(year), month_or_week, imagePath, req.session.uid]
    );

    const oldPath = existing.rows[0]?.image_path;
    if (oldPath && oldPath !== imagePath) deleteImage(oldPath);

    res.status(201).json({ item: serialize(rows[0]) });
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/admin/stats/:id (any signed-in user). */
statsRouter.delete("/:id", requireAdmin, async (req, res) => {
  const { rows } = await query(
    `delete from databeing_stat_images where id = $1 returning image_path`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  deleteImage(rows[0].image_path);
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

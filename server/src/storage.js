import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.resolve(__dirname, "../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const useS3 = config.storage.driver === "s3";

function makeKey(originalname) {
  const ext = (path.extname(originalname) || ".png").toLowerCase();
  return `stats/${Date.now()}-${crypto.randomBytes(5).toString("hex")}${ext}`;
}

/* ---------- local disk driver ---------- */
function saveLocal(file) {
  const name = makeKey(file.originalname).replace("stats/", "");
  fs.writeFileSync(path.join(UPLOAD_DIR, name), file.buffer);
  const rel = `/uploads/${name}`;
  return config.storage.publicBase ? `${config.storage.publicBase}${rel}` : rel;
}

function deleteLocal(link) {
  const name = link.split("/uploads/")[1];
  if (!name) return;
  fs.promises.unlink(path.join(UPLOAD_DIR, name)).catch(() => {});
}

/* ---------- S3 / R2 driver (loaded only when used) ---------- */
let s3Client = null;
async function s3() {
  if (s3Client) return s3Client;
  const { S3Client } = await import("@aws-sdk/client-s3");
  const c = config.storage.s3;
  s3Client = new S3Client({
    region: c.region,
    endpoint: c.endpoint || undefined,
    forcePathStyle: Boolean(c.endpoint), // needed for R2 / MinIO
    credentials: { accessKeyId: c.accessKeyId, secretAccessKey: c.secretAccessKey },
  });
  return s3Client;
}

async function saveS3(file) {
  const { PutObjectCommand } = await import("@aws-sdk/client-s3");
  const c = config.storage.s3;
  const key = makeKey(file.originalname);
  const client = await s3();
  await client.send(
    new PutObjectCommand({
      Bucket: c.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  const base = c.publicBase || `${c.endpoint}/${c.bucket}`;
  return `${base}/${key}`;
}

async function deleteS3(link) {
  const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
  const c = config.storage.s3;
  const base = c.publicBase || `${c.endpoint}/${c.bucket}`;
  const key = link.startsWith(base) ? link.slice(base.length + 1) : null;
  if (!key) return;
  const client = await s3();
  await client.send(new DeleteObjectCommand({ Bucket: c.bucket, Key: key })).catch(() => {});
}

/* ---------- public API: DB only ever stores the returned link ---------- */

/** Save an uploaded image and return a link (URL/path) to store in the DB. */
export async function saveImage(file) {
  return useS3 ? saveS3(file) : saveLocal(file);
}

/** Best-effort delete of a previously stored image by its link. */
export async function deleteImage(link) {
  if (!link) return;
  if (useS3) return deleteS3(link);
  return deleteLocal(link);
}

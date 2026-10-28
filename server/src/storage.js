import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.resolve(__dirname, "../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const useS3 = config.storage.driver === "s3";

/* Image types we accept, identified by their leading bytes. */
const IMAGE_TYPES = [
  { mime: "image/png", ext: ".png", match: (b) => b.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex")) },
  { mime: "image/jpeg", ext: ".jpg", match: (b) => b.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex")) },
  { mime: "image/gif", ext: ".gif", match: (b) => /^GIF8[79]a$/.test(b.toString("latin1", 0, 6)) },
  { mime: "image/webp", ext: ".webp", match: (b) => b.toString("latin1", 0, 4) === "RIFF" && b.toString("latin1", 8, 12) === "WEBP" },
];

/**
 * Identify an upload from its content, not its client-supplied name or mimetype —
 * otherwise an .html/.svg file sent as image/png would be served back as a page.
 * Returns { mime, ext } or null.
 */
export function detectImageType(buffer) {
  return IMAGE_TYPES.find((t) => t.match(buffer)) || null;
}

function makeKey(ext) {
  return `stats/${Date.now()}-${crypto.randomBytes(5).toString("hex")}${ext}`;
}

/* ---------- local disk driver ---------- */
function saveLocal(buffer, type) {
  const name = makeKey(type.ext).replace("stats/", "");
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);
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

async function saveS3(buffer, type) {
  const { PutObjectCommand } = await import("@aws-sdk/client-s3");
  const c = config.storage.s3;
  const key = makeKey(type.ext);
  const client = await s3();
  await client.send(
    new PutObjectCommand({
      Bucket: c.bucket,
      Key: key,
      Body: buffer,
      ContentType: type.mime,
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

/**
 * Save an uploaded image and return a link (URL/path) to store in the DB.
 * `type` comes from detectImageType(buffer).
 */
export async function saveImage(buffer, type) {
  return useS3 ? saveS3(buffer, type) : saveLocal(buffer, type);
}

/** Best-effort delete of a previously stored image by its link. */
export async function deleteImage(link) {
  if (!link) return;
  if (useS3) return deleteS3(link);
  return deleteLocal(link);
}

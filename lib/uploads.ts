import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function extensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mime] ?? "jpg";
}

/**
 * Save an appraisal image.
 * On Vercel: uploads to Vercel Blob Storage, returns the full blob URL.
 * Local: writes to public/uploads/appraisals/, returns a relative path.
 *
 * Components across the app use imagePath as <img src={imagePath}>,
 * which works with both full URLs (blob) and relative paths (seed data).
 */
export async function saveAppraisalImage(
  id: string,
  file: File,
): Promise<string> {
  const ext = extensionFromMime(file.type);
  const filename = `${id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.VERCEL) {
    // Upload to Vercel Blob Storage — returns a public URL
    const blob = await put(`uploads/appraisals/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  // Local: write to disk
  const uploadDir = path.join(process.cwd(), "public", "uploads", "appraisals");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/appraisals/${filename}`;
}

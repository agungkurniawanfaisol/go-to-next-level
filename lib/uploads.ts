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
 * On Vercel:
 *   - Tries Vercel Blob Storage first (requires BLOB_READ_WRITE_TOKEN).
 *   - Falls back to /tmp/ if Blob fails (e.g. missing token, transient error).
 * Local: writes to public/uploads/appraisals/.
 *
 * Returns the path/URL that can be used as <img src={imagePath}>.
 */
export async function saveAppraisalImage(
  id: string,
  file: File,
): Promise<string> {
  const ext = extensionFromMime(file.type);
  const filename = `${id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.VERCEL) {
    // Try Blob Storage first
    try {
      const blob = await put(`uploads/appraisals/${filename}`, buffer, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return blob.url;
    } catch (err) {
      console.warn("[uploads] Blob upload failed, falling back to /tmp/:", err);
    }

    // Fallback: write to /tmp/ (ephemeral but works without Blob token)
    const tmpDir = "/tmp/uploads/appraisals";
    await mkdir(tmpDir, { recursive: true });
    await writeFile(path.join(tmpDir, filename), buffer);
    return `/uploads/appraisals/${filename}`;
  }

  // Local: write to disk
  const uploadDir = path.join(process.cwd(), "public", "uploads", "appraisals");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/appraisals/${filename}`;
}

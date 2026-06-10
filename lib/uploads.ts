import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * On Vercel serverless, only /tmp/ is writable.
 * The upload route reads from the same location.
 */
function getUploadDir(): string {
  // Vercel sets VERCEL=1 env
  if (process.env.VERCEL) {
    return path.join("/tmp", "uploads", "appraisals");
  }
  return path.join(process.cwd(), "public", "uploads", "appraisals");
}

function getPublicPath(filename: string): string {
  return `/uploads/appraisals/${filename}`;
}

function extensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mime] ?? "jpg";
}

export async function saveAppraisalImage(
  id: string,
  file: File,
): Promise<string> {
  const uploadDir = getUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const ext = extensionFromMime(file.type);
  const filename = `${id}.${ext}`;
  const diskPath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(diskPath, buffer);

  return getPublicPath(filename);
}

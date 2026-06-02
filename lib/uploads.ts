import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "appraisals");

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
  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = extensionFromMime(file.type);
  const filename = `${id}.${ext}`;
  const diskPath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(diskPath, buffer);

  return `/uploads/appraisals/${filename}`;
}

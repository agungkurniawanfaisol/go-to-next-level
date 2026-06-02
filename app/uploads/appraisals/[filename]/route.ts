import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

type RouteParams = { params: Promise<{ filename: string }> };

/**
 * Serves appraisal images.
 * Priority:
 *   1. /tmp/uploads/appraisals/  (Vercel serverless fallback — Blob failure or unavailable)
 *   2. public/uploads/appraisals/ (seed data deployed as static assets via git)
 *
 * On Vercel, images uploaded via Blob use the full blob URL as src,
 * so they never reach this handler. This handler only serves:
 *   - Fallback images (written to /tmp/ when Blob fails)
 *   - Seed data images (deployed as static files)
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { filename } = await params;

  if (!/^[\w-]+\.(png|jpe?g|webp|gif)$/i.test(filename)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mime = MIME[ext];
  if (!mime) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 1 — On Vercel, try /tmp/ first (fallback from Blob)
  if (process.env.VERCEL) {
    try {
      const buffer = await readFile(path.join("/tmp", "uploads", "appraisals", filename));
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": mime,
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch {
      // Not in /tmp/, fall through to disk
    }
  }

  // 2 — Try disk (seed data / local)
  try {
    const buffer = await readFile(
      path.join(process.cwd(), "public", "uploads", "appraisals", filename),
    );
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

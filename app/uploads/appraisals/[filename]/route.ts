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
 * Serves seed data images from disk (deployed as static assets via git).
 * User-uploaded images from appraisal are stored in Vercel Blob and use
 * their full blob URL directly as src — they never reach this handler.
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

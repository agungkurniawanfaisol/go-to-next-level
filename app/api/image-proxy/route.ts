import { NextRequest, NextResponse } from "next/server";

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "mysql",
  "app",
]);

function isPrivateIp(hostname: string): boolean {
  if (/^10\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true;
  return false;
}

function isAllowedUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (BLOCKED_HOSTS.has(url.hostname)) return null;
    if (isPrivateIp(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const url = isAllowedUrl(raw);
  if (!url) {
    return NextResponse.json({ error: "URL tidak diizinkan" }, { status: 400 });
  }

  try {
    const upstream = await fetch(url.toString(), {
      headers: { Accept: "image/*" },
      next: { revalidate: 3600 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Gagal mengambil gambar" },
        { status: upstream.status },
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal proxy gambar" },
      { status: 502 },
    );
  }
}

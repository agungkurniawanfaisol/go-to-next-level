/**
 * Gambar cross-origin (Unsplash, dll.) mencemari canvas → toDataURL gagal.
 * Proxy via API same-origin agar canvas bisa diekspor.
 */
export function isCrossOriginImageSrc(src: string): boolean {
  if (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.startsWith("/")
  ) {
    return false;
  }

  try {
    const imgUrl = new URL(src);
    if (typeof window === "undefined") return true;
    return imgUrl.origin !== window.location.origin;
  } catch {
    return false;
  }
}

export function resolveCanvasImageSrc(src: string): string {
  if (!isCrossOriginImageSrc(src)) return src;
  return `/api/image-proxy?url=${encodeURIComponent(src)}`;
}

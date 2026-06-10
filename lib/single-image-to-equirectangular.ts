import { resolveCanvasImageSrc } from "@/lib/panorama-source";

const DEFAULT_WIDTH = 2048;
const DEFAULT_HEIGHT = 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Wajib sebelum src agar canvas tidak tainted (blob/data/same-origin OK)
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal memuat gambar"));
    img.src = src;
  });
}

/**
 * Satu foto → panorama equirectangular (satu gambar membungkus 360° horizontal).
 * Cross-origin otomatis di-proxy ke same-origin sebelum draw canvas.
 */
export async function singleImageToEquirectangular(
  imageSrc: string,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
): Promise<string> {
  const canvasSrc = resolveCanvasImageSrc(imageSrc);
  const img = await loadImage(canvasSrc);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#e8e2d8");
  bg.addColorStop(0.5, "#f5f2ec");
  bg.addColorStop(1, "#e8e2d8");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const drawHeight = height * 0.88;
  const drawWidth = width;
  const y = (height - drawHeight) / 2;

  ctx.drawImage(img, 0, y, drawWidth, drawHeight);

  try {
    return canvas.toDataURL("image/jpeg", 0.92);
  } catch {
    throw new Error("Canvas tainted — gagal ekspor panorama");
  }
}

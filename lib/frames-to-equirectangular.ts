const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 512;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal memuat frame"));
    img.src = src;
  });
}

/**
 * Menyusun frame turntable menjadi panorama equirectangular (2:1) untuk Pannellum.
 */
export async function framesToEquirectangular(
  frames: string[],
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
): Promise<string> {
  if (frames.length === 0) {
    throw new Error("Tidak ada frame untuk panorama");
  }

  const images = await Promise.all(frames.map(loadImage));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");

  ctx.fillStyle = "#f0ebe3";
  ctx.fillRect(0, 0, width, height);

  const sliceWidth = width / images.length;

  images.forEach((img, i) => {
    const scale = Math.min(sliceWidth / img.width, height / img.height) * 0.92;
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = i * sliceWidth + (sliceWidth - drawW) / 2;
    const y = (height - drawH) / 2;
    ctx.drawImage(img, x, y, drawW, drawH);
  });

  return canvas.toDataURL("image/jpeg", 0.92);
}

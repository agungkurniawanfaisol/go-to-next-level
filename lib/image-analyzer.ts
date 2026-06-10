/**
 * Image Analyzer — client-side pixel analysis untuk CNN simulator
 *
 * Mengekstrak fitur visual dari gambar upload:
 * - Rata-rata brightness
 * - Variansi warna (color richness)
 * - Rasio warna hangat/dingin (warm/cool)
 * - Deteksi tepi sederhana (texture complexity)
 * - Saturation rata-rata
 *
 * SEMUA ANALISIS BERJALAN DI BROWSER — bukan model CNN sesungguhnya.
 * Ini adalah visual feature extractor untuk demo yang realistis.
 */

export type ImageFeatures = {
  /** Rata-rata brightness 0–255 */
  avgBrightness: number;
  /** Variansi warna (semakin tinggi => warna semakin kaya) */
  colorVariance: number;
  /** Rasio warm/cool — > 1 berarti dominan warna hangat */
  warmCoolRatio: number;
  /** Edge density 0–1 — texture complexity */
  edgeDensity: number;
  /** Saturation rata-rata 0–1 */
  avgSaturation: number;
  /** Warna dominan (R, G, B) */
  dominantColor: [number, number, number];
};

async function loadImageBitmap(src: string): Promise<ImageBitmap> {
  const response = await fetch(src);
  const blob = await response.blob();
  // Resize width only — height adjusts proportionally, avoids distortion
  return createImageBitmap(blob, { resizeWidth: 128, resizeQuality: "low" });
}

function toGrayscale(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function hslSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const lightness = (max + min) / 2;
  if (max === min) return 0;
  return (max - min) / (1 - Math.abs(2 * lightness - 1));
}

function isWarm(r: number, g: number, b: number): boolean {
  // Warm color heuristic: red > blue + green offset
  return r > (g + b) / 2;
}

function simpleEdgeMagnitude(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
): number {
  const idx = (y * width + x) * 4;
  const center = toGrayscale(data[idx], data[idx + 1], data[idx + 2]);

  // Sobel-like simple edge detection
  const left = x > 0
    ? toGrayscale(data[idx - 4], data[idx - 3], data[idx - 2])
    : center;
  const right = x < width - 1
    ? toGrayscale(data[idx + 4], data[idx + 3], data[idx + 2])
    : center;
  const top = y > 0
    ? toGrayscale(data[idx - width * 4], data[idx - width * 4 + 1], data[idx - width * 4 + 2])
    : center;
  const bottom = y < height - 1
    ? toGrayscale(data[idx + width * 4], data[idx + width * 4 + 1], data[idx + width * 4 + 2])
    : center;

  const gx = Math.abs(right - left);
  const gy = Math.abs(bottom - top);
  return Math.min(255, Math.sqrt(gx * gx + gy * gy));
}

export async function analyzeImage(imageSrc: string): Promise<ImageFeatures> {
  const bitmap = await loadImageBitmap(imageSrc);
  const width = bitmap.width;
  const height = bitmap.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D tidak tersedia");

  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let totalBrightness = 0;
  let totalVarianceR = 0;
  let totalVarianceG = 0;
  let totalVarianceB = 0;
  let warmCount = 0;
  let coolCount = 0;
  let totalSaturation = 0;
  let totalEdge = 0;
  let pixelCount = 0;

  const colorAccumulator = { r: 0, g: 0, b: 0 };

  // Sample every-other pixel for speed
  const step = 2;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      totalBrightness += toGrayscale(r, g, b);
      totalSaturation += hslSaturation(r, g, b);
      totalEdge += simpleEdgeMagnitude(data, width, height, x, y);

      colorAccumulator.r += r;
      colorAccumulator.g += g;
      colorAccumulator.b += b;

      if (isWarm(r, g, b)) warmCount++;
      else coolCount++;

      pixelCount++;
    }
  }

  // Second pass for variance
  const avgR = colorAccumulator.r / pixelCount;
  const avgG = colorAccumulator.g / pixelCount;
  const avgB = colorAccumulator.b / pixelCount;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      totalVarianceR += (data[idx] - avgR) ** 2;
      totalVarianceG += (data[idx + 1] - avgG) ** 2;
      totalVarianceB += (data[idx + 2] - avgB) ** 2;
    }
  }

  const avgBrightness = totalBrightness / pixelCount;
  const avgSaturation = totalSaturation / pixelCount;
  const edgeDensity = Math.min(1, totalEdge / pixelCount / 128);
  const warmCoolRatio = coolCount > 0 ? warmCount / coolCount : warmCount;
  const colorVariance = Math.sqrt(
    (totalVarianceR + totalVarianceG + totalVarianceB) / (pixelCount * 3),
  );

  bitmap.close();

  return {
    avgBrightness,
    colorVariance,
    warmCoolRatio,
    edgeDensity,
    avgSaturation,
    dominantColor: [Math.round(avgR), Math.round(avgG), Math.round(avgB)],
  };
}

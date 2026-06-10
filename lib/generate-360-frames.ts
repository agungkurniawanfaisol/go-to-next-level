const FRAME_COUNT = 8;
const CANVAS_SIZE = 400;

/**
 * Generates 8 turntable-style frames from a single photo (prototype 360°).
 */
export function generate360FramesFromImage(
  imageSrc: string,
  frameCount: number = FRAME_COUNT,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Cegah tainted canvas untuk gambar cross-origin (Unsplash, dll.)
    if (
      imageSrc.startsWith("http://") ||
      imageSrc.startsWith("https://") ||
      imageSrc.startsWith("/")
    ) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      const frames: string[] = [];
      const aspect = img.width / img.height;
      const baseHeight = CANVAS_SIZE * 0.82;
      const baseWidth = baseHeight * aspect;

      for (let i = 0; i < frameCount; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        ctx.fillStyle = "#f0ebe3";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const angle = (i / frameCount) * Math.PI * 2;
        const scaleX = Math.max(0.32, Math.abs(Math.cos(angle)));
        const drawWidth = Math.min(baseWidth * scaleX, CANVAS_SIZE * 0.95);
        const drawHeight = baseHeight;
        const x = (CANVAS_SIZE - drawWidth) / 2;
        const y = (CANVAS_SIZE - drawHeight) / 2;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        frames.push(canvas.toDataURL("image/jpeg", 0.9));
      }

      resolve(frames.length > 0 ? frames : [imageSrc]);
    };
    img.onerror = () => reject(new Error("Gagal memuat gambar untuk 360°"));
    img.src = imageSrc;
  });
}

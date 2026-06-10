"use client";

type PreviewGuidePanelProps = {
  mode: "scanning" | "result";
  viewerReady?: boolean;
};

export function PreviewGuidePanel({
  mode,
  viewerReady = false,
}: PreviewGuidePanelProps) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-forest">
        {mode === "scanning" ? "Computer Vision" : "360° Pannellum"}
      </p>

      {mode === "scanning" && (
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Model CNN mengekstrak fitur visual, mengklasifikasi peran barang, lalu
          menghitung nilai swap.
        </p>
      )}

      {mode === "result" && !viewerReady && (
        <p className="mt-3 text-sm text-ink/60">
          Satu foto → panorama 360° untuk Pannellum…
        </p>
      )}

      {mode === "result" && viewerReady && (
        <>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            <strong className="text-ink">Drag / geser</strong> — satu foto
            membungkus 360° (react-pannellum), putar mulus tanpa potongan 8
            frame.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-ink/55">
            <li>• Upload sekali → panorama dari 1 foto</li>
            <li>• Drag memutar 360° kontinu</li>
            <li>• Hasil CNN di bawah preview</li>
          </ul>
        </>
      )}
    </div>
  );
}

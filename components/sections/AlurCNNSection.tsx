import { EcoSwapPointsDisplay } from "@/components/ai-appraisal/EcoSwapPointsDisplay";
import { SectionShell } from "./SectionShell";

const pipeline = [
  {
    label: "Input Image",
    detail: "Preprocessing & normalisasi gambar upload",
  },
  {
    label: "Feature Extraction",
    detail: "Convolution layers mendeteksi pola tekstil & motif",
  },
  {
    label: "CNN Classification",
    detail: "Model memprediksi kategori heritage & kondisi",
  },
  {
    label: "Role Output",
    detail: "Skor confidence, role, dan EcoSwap Points",
  },
];

export function AlurCNNSection() {
  return (
    <SectionShell
      id="alur-cnn"
      eyebrow="Alur CNN"
      title="Bagaimana AI Membaca Warisan Budaya"
      description="Pipeline computer vision yang mengubah foto barang menjadi insight budaya dan nilai swap."
      className="bg-cream-muted/40"
    >
      <div className="relative mx-auto max-w-4xl">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald/35 to-transparent lg:block"
        />
        <ol className="grid gap-6 lg:grid-cols-4">
          {pipeline.map((item, index) => (
            <li
              key={item.label}
              className="glass-panel relative rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
            >
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-emerald/40 bg-emerald/10 text-sm font-bold text-emerald">
                {index + 1}
              </span>
              <h3 className="mt-4 font-semibold text-ink">{item.label}</h3>
              <p className="mt-2 text-sm text-ink/65">{item.detail}</p>
              {item.label === "Role Output" && (
                <div className="mt-4 text-left">
                  <EcoSwapPointsDisplay points={520} size="sm" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl border border-forest/25 bg-forest p-6 font-mono text-sm shadow-elevated">
        <p className="text-emerald-light">$ ecoswap-cnn --infer batik.jpg</p>
        <p className="mt-2 text-ivory/60">
          → Detecting features... OK
          <br />
          → Running CNN Model... OK
          <br />
          → Classifying Role...{" "}
          <span className="text-gold-light">High Heritage Value</span>
          <br />
          → EcoSwap Points...{" "}
          <span className="text-gold-light">+520 PTS</span>
        </p>
      </div>
    </SectionShell>
  );
}

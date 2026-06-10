import { SectionShell } from "@/components/sections/SectionShell";
import type { BarterProposalView } from "@/lib/api/barter-proposals";
import { formatDateShortId } from "@/lib/format-date-id";

type ShowcaseCasesSectionProps = {
  cases: BarterProposalView[];
};

export function ShowcaseCasesSection({ cases }: ShowcaseCasesSectionProps) {
  return (
    <SectionShell
      id="showcase-cases"
      eyebrow="3 Kasus Nyata"
      title="Outcome yang Bisa Dilihat Juri"
      description="Contoh barter yang sudah selesai lengkap dengan poin dan hasil akhirnya."
      className="bg-gradient-to-b from-ivory via-forest/5 to-ivory dark:from-[#0f0e0c] dark:via-[#1f3d32]/8 dark:to-[#0f0e0c]"
    >
      {cases.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((item) => (
            <article
              key={item.id}
              className="glass-panel rounded-2xl border border-ink/8 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-forest">
                Kasus barter sukses
              </p>
              <p className="mt-3 text-sm font-semibold text-ink">
                {item.offered.detectedObject}
              </p>
              <p className="mt-1 text-xs text-ink/55">ditukar dengan</p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {item.requested.detectedObject}
              </p>

              <div className="mt-4 rounded-lg border border-gold/20 bg-gold/8 p-3 text-xs text-ink/70">
                +{item.offered.ecoSwapPoints.toLocaleString("id-ID")} ↔ +
                {item.requested.ecoSwapPoints.toLocaleString("id-ID")} PTS
              </div>

              <p className="mt-3 text-xs text-ink/45">
                Selesai:{" "}
                {item.completedAt ? formatDateShortId(item.completedAt) : "-"}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink/15 p-8 text-center text-sm text-ink/55">
          Belum ada kasus barter selesai untuk ditampilkan.
        </div>
      )}
    </SectionShell>
  );
}


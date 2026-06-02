import { SectionShell } from "@/components/sections/SectionShell";
import type { LandingTimelineEvent } from "@/lib/api/landing-highlights";
import { formatDateTimeId } from "@/lib/format-date-id";

type ImpactTimelineSectionProps = {
  events: LandingTimelineEvent[];
};

export function ImpactTimelineSection({ events }: ImpactTimelineSectionProps) {
  return (
    <SectionShell
      id="impact-timeline"
      eyebrow="Live Timeline"
      title="Aktivitas EcoSwap Hari Ini"
      description="Feed aktivitas terbaru untuk menunjukkan bahwa platform benar-benar aktif dan berjalan."
      className="bg-gradient-to-b from-ivory via-emerald/5 to-ivory"
    >
      <div className="rounded-2xl border border-ink/8 bg-surface/90 p-5 shadow-card sm:p-6">
        {events.length > 0 ? (
          <ol className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="flex gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    event.type === "barter_completed" ? "bg-emerald" : "bg-gold"
                  }`}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{event.title}</p>
                  <p className="mt-1 text-sm text-ink/65">{event.detail}</p>
                  <p className="mt-1 text-xs text-ink/45">
                    {formatDateTimeId(event.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-ink/55">
            Belum ada aktivitas terbaru. Mulai dari upload appraisal pertama.
          </p>
        )}
      </div>
    </SectionShell>
  );
}


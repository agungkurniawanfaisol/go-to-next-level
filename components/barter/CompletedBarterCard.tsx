import Link from "next/link";
import { BarterParticipants } from "@/components/barter/BarterParticipants";
import { BarterTradePair } from "@/components/barter/BarterTradePair";
import type { BarterProposalView } from "@/lib/api/barter-proposals";
import { formatDateId } from "@/lib/format-date-id";

type CompletedBarterCardProps = {
  proposal: BarterProposalView;
};

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return formatDateId(d);
}

export function CompletedBarterCard({ proposal }: CompletedBarterCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-ink/8 bg-surface/90 shadow-sm transition-shadow hover:shadow-card">
      <div className="border-b border-ink/8 bg-forest/5 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-forest/15 px-2.5 py-0.5 text-xs font-semibold text-forest">
            Barter selesai
          </span>
          <time
            dateTime={proposal.completedAt?.toISOString()}
            className="text-xs text-ink/50"
          >
            {formatDate(proposal.completedAt)}
          </time>
        </div>
        <div className="mt-4">
          <BarterParticipants proposal={proposal} compact />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <BarterTradePair
          offered={proposal.offered}
          requested={proposal.requested}
          compact
        />

        {proposal.message && (
          <p className="mt-4 line-clamp-2 text-sm italic text-ink/65">
            &ldquo;{proposal.message}&rdquo;
          </p>
        )}

        <Link
          href={`/barter/riwayat/${proposal.id}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-forest/30 bg-forest px-4 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light sm:w-auto"
        >
          Lihat detail pertukaran
        </Link>
      </div>
    </article>
  );
}

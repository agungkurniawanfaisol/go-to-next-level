import type { BarterProposalView } from "@/lib/api/barter-proposals";

type BarterParticipantsProps = {
  proposal: BarterProposalView;
  compact?: boolean;
};

function Avatar({ name, compact }: { name: string; compact?: boolean }) {
  const size = compact ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-forest/15 font-display font-bold text-forest ${size}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function PersonBlock({
  label,
  name,
  sub,
  compact,
}: {
  label: string;
  name: string;
  sub?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Avatar name={name} compact={compact} />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
          {label}
        </p>
        <p
          className={`truncate font-semibold text-ink ${compact ? "text-sm" : "text-base"}`}
        >
          {name}
        </p>
        {sub && (
          <p className="truncate text-xs text-ink/50">{sub}</p>
        )}
      </div>
    </div>
  );
}

export function BarterParticipants({
  proposal,
  compact = false,
}: BarterParticipantsProps) {
  const recipientName =
    proposal.recipientUser?.name ??
    proposal.requested.ownerName ??
    "Anggota";

  const recipientSub =
    proposal.recipientUser?.email ??
    proposal.requested.ownerCity ??
    undefined;

  return (
    <div
      className={`flex items-center gap-3 ${compact ? "flex-col sm:flex-row" : "flex-col md:flex-row"}`}
    >
      <PersonBlock
        label="Menukar (menawarkan)"
        name={proposal.proposer.name}
        sub={proposal.offered.ownerCity ?? undefined}
        compact={compact}
      />
      <div
        className={`flex shrink-0 items-center justify-center text-emerald ${compact ? "rotate-90 sm:rotate-0" : "rotate-90 md:rotate-0"}`}
        aria-hidden
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      </div>
      <PersonBlock
        label="Lawannya"
        name={recipientName}
        sub={recipientSub}
        compact={compact}
      />
    </div>
  );
}

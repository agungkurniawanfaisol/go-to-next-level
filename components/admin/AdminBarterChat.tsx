"use client";

import type { BarterMessageView } from "@/lib/api/barter-messages";
import { formatDateId, formatDateTimeId } from "@/lib/format-date-id";

type AdminBarterChatProps = {
  messages: BarterMessageView[];
  proposerId: string;
  proposerName: string;
  recipientId: string;
  recipientName: string;
};

function ChatBubble({
  message,
  isProposer,
  senderName,
}: {
  message: BarterMessageView;
  isProposer: boolean;
  senderName: string;
}) {
  return (
    <div
      className={`flex ${isProposer ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isProposer
            ? "rounded-bl-sm bg-ivory/95 border border-ink/8 text-ink shadow-sm"
            : "rounded-br-sm bg-gradient-to-br from-emerald to-forest text-ivory shadow-sm"
        }`}
      >
        {/* Sender name — only shown if not the primary person on this side */}
        <p
          className={`mb-0.5 text-[11px] font-semibold tracking-wide ${
            isProposer ? "text-ink/50" : "text-ivory/70"
          }`}
        >
          {senderName}
        </p>
        <p className="text-sm leading-relaxed">{message.message}</p>
        <p
          className={`mt-1 text-[10px] ${
            isProposer ? "text-ink/40" : "text-ivory/50"
          }`}
        >
          {formatDateTimeId(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function SystemDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-ink/8" />
      <span className="text-[11px] font-medium uppercase tracking-wider text-ink/40">
        {label}
      </span>
      <div className="h-px flex-1 bg-ink/8" />
    </div>
  );
}

export function AdminBarterChat({
  messages,
  proposerId,
  proposerName,
  recipientId,
  recipientName,
}: AdminBarterChatProps) {
  // Group messages by date
  const grouped: { date: string; msgs: BarterMessageView[] }[] = [];
  let currentDate = "";

  for (const msg of messages) {
    const dateStr = formatDateId(msg.createdAt);
    if (dateStr !== currentDate) {
      currentDate = dateStr;
      grouped.push({ date: dateStr, msgs: [] });
    }
    grouped[grouped.length - 1].msgs.push(msg);
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink/5">
          <svg
            className="h-6 w-6 text-ink/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-sm text-ink/50">Belum ada percakapan.</p>
        <p className="mt-1 text-xs text-ink/35">
          Chat akan muncul setelah pengguna saling merespons.
        </p>
      </div>
    );
  }

  // Derive current status from the last message's proximity to events
  // (We just show all messages; the status is shown by the parent component)

  return (
    <div className="space-y-1" role="log" aria-label="Percakapan barter">
      {grouped.map((group) => (
        <div key={group.date}>
          <SystemDivider label={group.date} />
          <div className="space-y-3 px-2 py-2">
            {group.msgs.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isProposer={msg.senderId === proposerId}
                senderName={msg.senderName}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

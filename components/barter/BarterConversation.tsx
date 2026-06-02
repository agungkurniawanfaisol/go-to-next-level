"use client";

import type { BarterMessageView } from "@/lib/api/barter-messages";
import { formatDateId, formatDateTimeId } from "@/lib/format-date-id";

type BarterConversationProps = {
  messages: BarterMessageView[];
  proposerId: string;
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
    <div className={`flex ${isProposer ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isProposer
            ? "rounded-bl-sm border border-ink/8 bg-ivory/95 text-ink shadow-sm"
            : "rounded-br-sm bg-gradient-to-br from-emerald to-forest text-ivory shadow-sm"
        }`}
      >
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

function DateDivider({ label }: { label: string }) {
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

export function BarterConversation({
  messages,
  proposerId,
}: BarterConversationProps) {
  if (messages.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink/50">
        Belum ada percakapan untuk pertukaran ini.
      </p>
    );
  }

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

  return (
    <div className="space-y-1" role="log" aria-label="Percakapan barter">
      {grouped.map((group) => (
        <div key={group.date}>
          <DateDivider label={group.date} />
          <div className="space-y-3 px-1 py-2">
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

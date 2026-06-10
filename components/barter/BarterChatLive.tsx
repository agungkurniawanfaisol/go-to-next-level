"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { sendBarterMessage } from "@/lib/actions/send-message";
import type { BarterMessageView } from "@/lib/api/barter-messages";
import { formatDateId, formatDateTimeId } from "@/lib/format-date-id";

type BarterChatLiveProps = {
  messages: BarterMessageView[];
  proposalId: string;
  currentUserId: string;
  proposerId: string;
  proposerName: string;
  recipientName: string;
};

function ChatBubble({
  message,
  isOwn,
  senderName,
}: {
  message: BarterMessageView;
  isOwn: boolean;
  senderName: string;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isOwn
            ? "rounded-br-sm bg-gradient-to-br from-emerald to-forest text-ivory shadow-sm"
            : "rounded-bl-sm border border-ink/8 bg-surface/90 text-ink shadow-sm"
        }`}
      >
        {!isOwn && (
          <p className="mb-0.5 text-[11px] font-semibold tracking-wide text-ink/50">
            {senderName}
          </p>
        )}
        <p className="text-sm leading-relaxed">{message.message}</p>
        <p
          className={`mt-1 text-[10px] ${
            isOwn ? "text-ivory/60" : "text-ink/40"
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

export function BarterChatLive({
  messages,
  proposalId,
  currentUserId,
  proposerId,
  proposerName,
  recipientName,
}: BarterChatLiveProps) {
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isPending) return;

    setError(null);
    const msg = newMessage;
    setNewMessage("");

    startTransition(async () => {
      const result = await sendBarterMessage(proposalId, msg);
      if (!result.success) {
        setError(result.error ?? "Gagal mengirim pesan.");
        setNewMessage(msg);
      }
    });
  };

  return (
    <div className="flex flex-col">
      {/* Messages area */}
      <div
        className="max-h-[400px] min-h-[200px] space-y-1 overflow-y-auto rounded-xl border border-ink/8 bg-ivory/60 p-4"
        role="log"
        aria-label="Percakapan barter"
      >
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5">
              <svg className="h-5 w-5 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="mt-2 text-sm text-ink/50">Belum ada pesan</p>
            <p className="mt-0.5 text-xs text-ink/35">
              Kirim pesan untuk negosiasi dengan lawan barter.
            </p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.date}>
              <DateDivider label={group.date} />
              <div className="space-y-3 px-1 py-2">
                {group.msgs.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === currentUserId}
                    senderName={
                      msg.senderId === proposerId
                        ? proposerName
                        : recipientName
                    }
                  />
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ketik pesan..."
          disabled={isPending}
          maxLength={2000}
          className="min-w-0 flex-1 rounded-xl border border-ink/15 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-emerald focus:ring-2 focus:ring-emerald/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending || !newMessage.trim()}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
              Kirim
            </span>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Kirim
            </>
          )}
        </button>
      </form>
    </div>
  );
}

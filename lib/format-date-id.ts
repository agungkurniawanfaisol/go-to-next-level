/** Zona waktu tetap agar SSR (Docker UTC) dan browser tidak hydration mismatch */
const TIMEZONE = "Asia/Jakarta";

function toDate(d: Date | string): Date {
  return typeof d === "string" ? new Date(d) : d;
}

export function formatDateId(d: Date | string): string {
  return toDate(d).toLocaleDateString("id-ID", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShortId(d: Date | string): string {
  return toDate(d).toLocaleDateString("id-ID", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTimeId(d: Date | string): string {
  return toDate(d).toLocaleString("id-ID", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

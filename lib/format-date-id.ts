/** Zona waktu tetap agar SSR (Docker UTC) dan browser tidak hydration mismatch */
const TIMEZONE = "Asia/Jakarta";

export function formatDateId(d: Date): string {
  return d.toLocaleDateString("id-ID", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShortId(d: Date): string {
  return d.toLocaleDateString("id-ID", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTimeId(d: Date): string {
  return d.toLocaleString("id-ID", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

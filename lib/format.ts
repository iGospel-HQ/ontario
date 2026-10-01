import { format } from "date-fns";

/** Formats an API date string; returns "" for missing/invalid dates instead of throwing. */
export function formatDate(value: string | null | undefined, pattern = "MMM dd, yyyy") {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : format(date, pattern);
}

/** Seconds to "m:ss". */
export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

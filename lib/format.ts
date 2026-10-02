import { format } from "date-fns";

/** Formats an API date string; returns "" for missing/invalid dates instead of throwing. */
export function formatDate(value: string | null | undefined, pattern = "MMM dd, yyyy") {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : format(date, pattern);
}

/** Seconds to "m:ss", or "h:mm:ss" from an hour up. */
export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return hours > 0 ? `${hours}:${mins.toString().padStart(2, "0")}:${secs}` : `${mins}:${secs}`;
}

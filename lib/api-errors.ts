import { isAxiosError } from "axios";

/** What a failed API call means for a form. */
export interface ApiErrorInfo {
  /** A message for the whole form (detail / non_field_errors), if any. */
  message: string | null;
  /** Messages for single fields, e.g. { email: "An account with this email already exists." }. */
  fields: Record<string, string>;
  /** Machine-readable reason, e.g. "email_not_verified". */
  code: string | null;
  /** The raw response body (for extra values like `email`). */
  data: Record<string, unknown>;
}

const first = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length) return first(value[0]);
  return null;
};

/**
 * Reads Django REST Framework errors in all their shapes:
 *   { detail: "..." }                      -> message
 *   { non_field_errors: ["..."] }          -> message
 *   { email: ["..."], phone: ["..."] }     -> fields
 *   { code: "email_not_verified", ... }    -> code
 * plus network failures and server errors.
 */
export function readApiError(error: unknown, fallback = "Something went wrong. Please try again."): ApiErrorInfo {
  const info: ApiErrorInfo = { message: null, fields: {}, code: null, data: {} };

  if (!isAxiosError(error)) {
    info.message = fallback;
    return info;
  }
  if (!error.response) {
    info.message =
      error.code === "ECONNABORTED"
        ? "This is taking too long. Check your connection and try again."
        : "We couldn't reach iGospel. Check your internet connection and try again.";
    return info;
  }
  if (error.response.status >= 500) {
    info.message = "Something went wrong on our side. Please try again in a moment.";
    return info;
  }

  const data = error.response.data;
  if (!data || typeof data !== "object") {
    info.message = fallback;
    return info;
  }
  info.data = data as Record<string, unknown>;
  for (const [key, value] of Object.entries(info.data)) {
    const text = first(value);
    if (!text) continue;
    if (key === "code") info.code = text;
    else if (key === "detail" || key === "non_field_errors" || key === "message") info.message ??= text;
    else if (key !== "status" && key !== "email_hint") info.fields[key] = text;
  }
  if (!info.message && Object.keys(info.fields).length === 0) info.message = fallback;
  return info;
}

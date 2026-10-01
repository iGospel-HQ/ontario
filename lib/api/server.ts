import "server-only";
import { siteConfig } from "@/lib/site";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

type Query = Record<string, string | number | undefined>;

interface GetOptions {
  query?: Query;
  /** Seconds to cache the response (ISR). Defaults to 5 minutes. */
  revalidate?: number;
}

/**
 * GET a public API resource from a server component. Returns `null` on 404.
 * Sends `X-Skip-Tracking` so server renders aren't counted as post views;
 * the browser reports real views through `PostViewTracker`.
 */
export async function apiGet<T>(path: string, { query, revalidate = 300 }: GetOptions = {}) {
  const url = new URL(`${siteConfig.apiUrl}/${path.replace(/^\/+/, "")}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json", "X-Skip-Tracking": "1" },
    next: { revalidate },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError(res.status, `GET ${url.pathname} failed with ${res.status}`);
  return (await res.json()) as T;
}

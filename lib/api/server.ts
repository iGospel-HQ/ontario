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
  /**
   * Seconds to cache the response (ISR). Defaults to 1 minute: Django refreshes
   * tagged data instantly on save; this is the fallback if that refresh is missed.
   */
  revalidate?: number;
  /** Cache tags; Django refreshes them via /api/revalidate when content changes. */
  tags?: string[];
}

const isBuild = process.env.NEXT_PHASE === "phase-production-build";

/**
 * GET a public API resource from a server component. Returns `null` on 404.
 * Sends `X-Skip-Tracking` so server renders aren't counted as post views;
 * the browser reports real views through `PostTraffic`.
 *
 * If the API is unreachable during `next build`, returns `null` so the deploy
 * still succeeds (ISR fills the pages in later). At runtime it throws instead,
 * which makes ISR keep serving the last good version of the page.
 */
export async function apiGet<T>(path: string, { query, revalidate = 60, tags }: GetOptions = {}) {
  const url = new URL(`${siteConfig.apiUrl}/${path.replace(/^\/+/, "")}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json", "X-Skip-Tracking": "1" },
      next: { revalidate, tags },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    if (isBuild) {
      console.warn(`[api] ${url.pathname} unreachable during build; rendering without data`);
      return null;
    }
    throw error;
  }

  if (res.status === 404) return null;
  if (!res.ok) {
    if (isBuild && res.status >= 500) return null;
    throw new ApiError(res.status, `GET ${url.pathname} failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

/**
 * On-demand cache refresh, called by Django (blog/revalidate.py) after a post,
 * comment, ad, background or music item (track, album, artist, ...) changes: POST {"tags": ["posts", "post:<slug>"]} with the
 * shared secret in the x-revalidate-secret header.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = request.headers.get("x-revalidate-secret") ?? "";
  if (!secret || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags)
    ? body.tags.filter((tag): tag is string => typeof tag === "string" && /^(posts|music|ads|background|post:[\w-]+)$/.test(tag))
    : [];
  if (tags.length === 0) {
    return Response.json({ error: "No valid tags" }, { status: 400 });
  }

  // expire: 0 drops the cached data now, so the next visit renders fresh content.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}

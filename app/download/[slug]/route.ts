import { NextResponse } from "next/server";
import { apiGet } from "@/lib/api/server";
import type { MusicTrack } from "@/types/api";

/**
 * Short download link for captions and shares: /download/<track-slug>.
 * Redirects to the API's counting download endpoint (music/tracking.py), so the
 * download is still recorded against the visitor. Songs that aren't
 * downloadable (or unknown slugs) go to the songs page instead.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = await apiGet<MusicTrack & { is_downloadable?: boolean; download_url?: string | null }>(
    `/music/tracks/${encodeURIComponent(slug)}/`,
    { revalidate: 3600 },
  ).catch(() => null);

  const target = track?.is_downloadable && track.download_url ? track.download_url : new URL("/music/songs", request.url);
  const response = NextResponse.redirect(target, 302);
  response.headers.set("Cache-Control", "no-store"); // every click must reach the counter
  return response;
}

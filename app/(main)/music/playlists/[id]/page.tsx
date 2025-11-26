import type { Metadata } from "next";
import { PlaylistDetailClient } from "@/components/playlist-detail-client";

export const metadata: Metadata = {
  title: "Playlist - iGospel",
  description: "Explore playlist details and tracklist",
};

export default function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PlaylistDetailClient params={params} />;
}

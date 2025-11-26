import type { Metadata } from "next";
import { PlaylistsPageClient } from "@/components/playlists-page-client";

export const metadata: Metadata = {
  title: "Playlists - iGospel",
  description: "Explore curated collections and create your own playlists",
};

export default function PlaylistsPage() {
  return <PlaylistsPageClient />;
}

import { pageMetadata } from "@/lib/seo";
import { PlaylistsPageClient } from "@/components/playlists-page-client";

export const metadata = pageMetadata({
  title: "Playlists",
  description:
    "Explore curated collections and create your own playlists",
  path: "/music/playlists",
});

export default function PlaylistsPage() {
  return <PlaylistsPageClient />;
}

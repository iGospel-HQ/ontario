import { pageMetadata } from "@/lib/seo";
import { MusicPostsPage } from "@/components/music-page-client";

export const metadata = pageMetadata({
  title: "Music",
  description:
    "Explore songs, playlists, albums, and discover your favorite artists",
  path: "/music",
});

export default function MusicPage() {
  return <MusicPostsPage />;
}

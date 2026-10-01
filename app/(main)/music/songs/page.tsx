import { pageMetadata } from "@/lib/seo";
import { SongsPageClient } from "@/components/songs-page-client";

export const metadata = pageMetadata({
  title: "Songs",
  description:
    "Stream unlimited music and discover new tracks",
  path: "/music/songs",
});

export default function SongsPage() {
  return <SongsPageClient />;
}

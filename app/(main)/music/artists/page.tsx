import { pageMetadata } from "@/lib/seo";
import { ArtistsPageClient } from "@/components/artists-page-client";

export const metadata = pageMetadata({
  title: "Artists",
  description:
    "Discover talented creators and musicians on the platform",
  path: "/music/artists",
});

export default function ArtistsPage() {
  return <ArtistsPageClient />;
}

import { pageMetadata } from "@/lib/seo";
import { SearchPageClient } from "@/components/search-page-client";

export const metadata = pageMetadata({
  title: "Search",
  description:
    "Search songs, playlists, artists, and articles",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return <SearchPageClient />;
}

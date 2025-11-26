import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search-page-client";

export const metadata: Metadata = {
  title: "Search - iGospel",
  description: "Search songs, playlists, artists, and articles",
};

export default function SearchPage() {
  return <SearchPageClient />;
}

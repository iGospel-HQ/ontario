import type { Metadata } from "next";
import { ArtistsPageClient } from "@/components/artists-page-client";

export const metadata: Metadata = {
  title: "Artists - iGospel",
  description: "Discover talented creators and musicians on the platform",
};

export default function ArtistsPage() {
  return <ArtistsPageClient />;
}

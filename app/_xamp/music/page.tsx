import type { Metadata } from "next"
import { MusicPageClient } from "@/components/music-page-client"

export const metadata: Metadata = {
  title: "Music - SYNC",
  description: "Explore songs, playlists, albums, and discover your favorite artists",
}

export default function MusicPage() {
  return <MusicPageClient />
}

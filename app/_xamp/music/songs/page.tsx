import type { Metadata } from "next"
import { SongsPageClient } from "@/components/songs-page-client"

export const metadata: Metadata = {
  title: "Songs - SYNC",
  description: "Stream unlimited music and discover new tracks",
}

export default function SongsPage() {
  return <SongsPageClient />
}

"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchSongs } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Play, Pause } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SongsPageClient() {
  const [page, setPage] = useState(1)
  const [genre, setGenre] = useState("all")
  const [playingId, setPlayingId] = useState<string | null>(null)

  const { data } = useQuery({
    queryKey: ["songs", page],
    queryFn: () => fetchSongs(page, 20),
  })

  const filteredSongs = data?.songs.filter((song) => genre === "all" || song.genre === genre) || []

  return (
    <>
      <main className="min-h-screen px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Songs</h1>
            <p className="text-muted-foreground text-lg">Stream unlimited music</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 flex gap-4"
          >
            <div className="flex-1">
              <Input placeholder="Search songs..." className="bg-secondary" />
            </div>
            <div className="w-48">
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                  <SelectItem value="Indie">Indie</SelectItem>
                  <SelectItem value="Pop">Pop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Songs Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary/50 rounded-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold w-12">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Artist</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Genre</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Play</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSongs.map((song, idx) => (
                    <motion.tr
                      key={song.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border hover:bg-secondary transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-muted-foreground">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <Link href={`/music/songs/${song.id}`} className="hover:text-accent font-medium">
                          {song.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm">{song.artist}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{song.duration}</td>
                      <td className="px-6 py-4 text-sm">{song.genre}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setPlayingId(playingId === song.id ? null : song.id)}
                          className="inline-flex items-center justify-center hover:text-accent transition-colors"
                        >
                          {playingId === song.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}

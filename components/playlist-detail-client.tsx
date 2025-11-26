"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchPlaylists } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, Pause } from "lucide-react"
import { useState, use } from "react"
import Link from "next/link"

export function PlaylistDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const { data: playlistsData } = useQuery({
    queryKey: ["playlists", 1],
    queryFn: () => fetchPlaylists(1, 24),
  })

  const playlist = playlistsData?.playlists.find((p) => p.id === id)
  const relatedPlaylists = playlistsData?.playlists.filter((p) => p.id !== id).slice(0, 4)

  if (!playlist) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-96 bg-gradient-to-b from-accent/20 to-background"
        >
          <img
            src={playlist.cover || "/placeholder.svg"}
            alt={playlist.name}
            className="w-full h-full object-cover opacity-40"
          />
        </motion.div>

        <div className="px-4 md:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Playlist Info */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <h1 className="text-4xl font-bold mb-4">{playlist.name}</h1>
              <p className="text-muted-foreground mb-4">{playlist.description}</p>
              <p className="text-sm text-muted-foreground">{playlist.songCount} songs</p>
            </motion.div>

            {/* Play Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-12 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors flex items-center gap-2"
            >
              <Play className="h-5 w-5 fill-current" />
              Play All
            </motion.button>

            {/* Tracklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary/50 rounded-lg overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Artist</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Duration</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Play</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + idx * 0.02 }}
                        className="border-b border-border hover:bg-secondary transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-muted-foreground">{idx + 1}</td>
                        <td className="px-6 py-4 font-medium">Song Title {idx + 1}</td>
                        <td className="px-6 py-4 text-sm">Artist Name</td>
                        <td className="px-6 py-4 text-sm text-right text-muted-foreground">3:45</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setPlayingId(playingId === `track-${idx}` ? null : `track-${idx}`)}
                            className="inline-flex items-center justify-center hover:text-accent transition-colors"
                          >
                            {playingId === `track-${idx}` ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Related Playlists */}
            {relatedPlaylists && relatedPlaylists.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-16 border-t border-border pt-12"
              >
                <h2 className="text-2xl font-bold mb-8">Similar Playlists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedPlaylists.map((p) => (
                    <Link key={p.id} href={`/music/playlists/${p.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative mb-4 overflow-hidden rounded-lg">
                          <img
                            src={p.cover || "/placeholder.svg"}
                            alt={p.name}
                            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="h-10 w-10 text-accent fill-accent" />
                          </div>
                        </div>
                        <h3 className="font-semibold truncate group-hover:text-accent">{p.name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

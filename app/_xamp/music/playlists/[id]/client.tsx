"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchPlaylists } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, Pause } from "lucide-react"
import { useState, use } from "react"

export function PlaylistDetailClient({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const {
    data: playlist,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["playlist", id],
    queryFn: () => fetchPlaylists(id),
  })

  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading playlist</div>

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            {playlist?.coverImage && (
              <img
                src={playlist.coverImage || "/placeholder.svg"}
                alt={playlist.name}
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>
          <div className="md:w-3/4">
            <h1 className="text-4xl font-bold mb-4">{playlist?.name}</h1>
            <p className="text-xl text-gray-600 mb-8">{playlist?.description}</p>
            <div className="space-y-4">
              {playlist?.tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {isPlaying === track.id ? (
                        <Pause className="h-6 w-6 text-blue-500 cursor-pointer" onClick={() => setIsPlaying(null)} />
                      ) : (
                        <Play className="h-6 w-6 text-gray-700 cursor-pointer" onClick={() => setIsPlaying(track.id)} />
                      )}
                      {isPlaying === track.id && (
                        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{track.title}</h3>
                      <p className="text-sm text-gray-500">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

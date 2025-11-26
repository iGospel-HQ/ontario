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
  const [isPlaying, setIsPlaying] = useState(false)

  const {
    data: songs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["songs"],
    queryFn: fetchSongs,
  })

  if (isLoading) return <div>Loading songs...</div>
  if (isError) return <div>Error loading songs.</div>

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Explore Music</h1>
          <Input placeholder="Search for songs, artists, or albums..." className="max-w-sm" />
        </div>

        <div className="flex justify-end mb-6">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="artist">Artist</SelectItem>
              <SelectItem value="album">Album</SelectItem>
              <SelectItem value="date">Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs?.map((song) => (
            <motion.div
              key={song.id}
              className="bg-card rounded-lg shadow-lg overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href={`/music/songs/${song.id}`} className="block">
                <img
                  src={song.albumArtUrl || "/placeholder.svg"}
                  alt={song.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{song.title}</h3>
                  <p className="text-muted-foreground truncate">{song.artist}</p>
                </div>
              </Link>
              <div className="p-4 border-t">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center space-x-2 text-primary hover:text-primary/80"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchPlaylists } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Play } from "lucide-react"
import { Input } from "@/components/ui/input"

export function PlaylistsPageClient() {
  const { data } = useQuery({
    queryKey: ["playlists", 1],
    queryFn: () => fetchPlaylists(1, 24),
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <>
      <main className="min-h-screen px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Playlists</h1>
            <p className="text-muted-foreground text-lg">Explore curated collections</p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-12">
            <Input placeholder="Search playlists..." className="bg-secondary max-w-sm" />
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {data?.playlists.map((playlist) => (
              <motion.div key={playlist.id} variants={itemVariants}>
                <Link href={`/music/playlists/${playlist.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <img
                        src={playlist.cover || "/placeholder.svg"}
                        alt={playlist.name}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-12 w-12 text-accent fill-accent" />
                      </div>
                    </div>
                    <h3 className="font-semibold truncate group-hover:text-accent">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">{playlist.songCount} songs</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </>
  )
}

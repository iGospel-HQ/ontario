"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchPlaylists } from "@/lib/api-client"
import Link from "next/link"
import { Play } from "lucide-react"

export function FeaturedPlaylists() {
  const { data } = useQuery({
    queryKey: ["playlists", 1],
    queryFn: () => fetchPlaylists(1, 4),
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-12 px-4 md:px-8 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Playlists</h2>
        <Link href="/music/playlists" className="text-accent hover:underline text-sm">
          Explore All →
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
    </section>
  )
}

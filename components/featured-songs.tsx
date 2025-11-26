"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchSongs } from "@/lib/api-client"
import Link from "next/link"
import { Play } from "lucide-react"
import { useState } from "react"

export function FeaturedSongs() {
  const { data } = useQuery({
    queryKey: ["songs", 1],
    queryFn: () => fetchSongs(1, 6),
  })

  const [hoveredId, setHoveredId] = useState<string | null>(null)

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
    <section className="py-12 px-4 md:px-8 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Trending Now</h2>
        <Link href="/music/songs" className="text-accent hover:underline text-sm">
          View All →
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {data?.songs.slice(0, 3).map((song) => (
          <motion.div
            key={song.id}
            variants={itemVariants}
            onMouseEnter={() => setHoveredId(song.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Link href={`/music/songs/${song.id}`}>
              <div className="group cursor-pointer">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === song.id ? 1 : 0 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center"
                  >
                    <Play className="h-12 w-12 text-accent fill-accent" />
                  </motion.div>
                </div>
                <h3 className="font-semibold truncate group-hover:text-accent">{song.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

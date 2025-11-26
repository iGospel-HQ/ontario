"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchArtists } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export function ArtistsPageClient() {
  const { data } = useQuery({
    queryKey: ["artists", 1],
    queryFn: () => fetchArtists(1, 24),
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
            <h1 className="text-4xl font-bold mb-4">Artists</h1>
            <p className="text-muted-foreground text-lg">Discover creators and musicians</p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-12">
            <Input placeholder="Search artists..." className="bg-secondary max-w-sm" />
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {data?.artists.map((artist) => (
              <motion.div key={artist.id} variants={itemVariants}>
                <Link href={`/music/artists/${artist.id}`}>
                  <div className="group cursor-pointer text-center">
                    <div className="relative mb-4 overflow-hidden rounded-full w-40 h-40 mx-auto">
                      <img
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-semibold group-hover:text-accent">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground">{(artist.followers / 1000).toFixed(0)}K followers</p>
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

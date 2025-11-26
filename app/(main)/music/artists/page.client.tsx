"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchArtists } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export function ArtistsPageClient() {
  const {
    data: artists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["artists"],
    queryFn: fetchArtists,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-blue-500 rounded-full animate-spin"
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-red-500">
        Error loading artists. Please try again later.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-blue-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center mb-12"
        >
          Explore Our Talented Artists
        </motion.h1>
        <div className="flex justify-center mb-12">
          <Input
            type="text"
            placeholder="Search for artists..."
            className="w-full max-w-lg p-4 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, duration: 0.5 }}
        >
          {artists?.map((artist) => (
            <motion.div
              key={artist.id}
              className="bg-white/10 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
              layout
            >
              <Link href={`/music/artists/${artist.id}`}>
                <div className="flex items-center mb-4">
                  <img
                    src={artist.avatarUrl || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-20 h-20 rounded-full mr-6 border-4 border-blue-500 object-cover shadow-lg"
                  />
                  <h2 className="text-2xl font-semibold">{artist.name}</h2>
                </div>
                <p className="text-gray-300">{artist.bio}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

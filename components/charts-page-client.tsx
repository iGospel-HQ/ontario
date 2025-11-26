"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchCharts } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Play, TrendingUp } from "lucide-react"

export function ChartsPageClient() {
  const { data } = useQuery({
    queryKey: ["charts"],
    queryFn: () => fetchCharts(),
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <>
      <main className="min-h-screen px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-5xl font-bold mb-4">Charts</h1>
            <p className="text-muted-foreground text-lg">The hottest tracks trending right now</p>
          </motion.div>

          {/* Weekly Top 10 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8">Weekly Top 10</h2>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              {data?.weeklyTop10.map((track, idx) => (
                <motion.div
                  key={track.id}
                  variants={itemVariants}
                  className="group flex items-center gap-6 p-6 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
                    <span className="text-2xl font-bold text-accent">#{track.rank}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <Link href={`/music/songs/${track.id}`}>
                      <h3 className="font-semibold text-lg group-hover:text-accent">{track.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>

                  {/* Plays */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-semibold">{(track.plays / 1000000).toFixed(2)}M</p>
                      <p className="text-xs text-muted-foreground">plays</p>
                    </div>
                  </div>

                  {/* Play Button */}
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-6 w-6 text-accent fill-accent" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Trending Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-t border-border pt-16"
          >
            <h2 className="text-3xl font-bold mb-8">Trending Now</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.trendingSongs.map((track, idx) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="p-6 bg-gradient-to-br from-accent/10 to-transparent rounded-lg border border-accent/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-1 text-accent">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-semibold">+{track.trend}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${track.trend}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </>
  )
}

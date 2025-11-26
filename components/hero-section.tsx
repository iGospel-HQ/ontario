"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-background to-background" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          <span className="bg-gradient-to-r from-accent to-foreground bg-clip-text text-transparent">Where Music</span>
          <br />
          <span className="text-foreground">Meets Stories</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore curated playlists, discover emerging artists, and dive into the stories behind the music.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/music">
            <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              Explore Music
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Read Articles
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

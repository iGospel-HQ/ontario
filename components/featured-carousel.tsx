"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const featured = [
  {
    id: 1,
    title: "The Rise of Independent Artists",
    description: "How streaming platforms are changing music distribution",
    image: "/music-artists-studio.jpg",
    link: "/blog",
  },
  {
    id: 2,
    title: "Genre Evolution 2025",
    description: "Exploring the boundaries of modern music",
    image: "/music-production-setup.png",
    link: "/blog",
  },
  {
    id: 3,
    title: "Top Producer Spotlight",
    description: "Behind the scenes with industry leaders",
    image: "/music-producer-studio.png",
    link: "/blog",
  },
]

export function FeaturedCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-12 px-4 md:px-8">
      <h2 className="text-3xl font-bold mb-8">Featured</h2>

      <div className="relative h-96 overflow-hidden rounded-lg group">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={featured[current].image || "/placeholder.svg"}
              alt={featured[current].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-bold mb-2">{featured[current].title}</h3>
              <p className="text-muted-foreground mb-4">{featured[current].description}</p>
              <Link href={featured[current].link} className="text-accent hover:underline">
                Read More →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + featured.length) % featured.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % featured.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-8 w-8" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 transition-all ${i === current ? "w-8 bg-accent" : "w-2 bg-muted"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

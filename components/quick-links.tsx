"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Music, Album, Disc3, Users, TrendingUp } from "lucide-react"
import { ComingSoonWrapper } from "@/components/coming-soon-wrapper" // Adjust path if needed
import { cn } from "@/lib/utils"

const links = [
  { name: "Artists", href: "/music/artists", icon: Users, comingSoon: false }, // Active – no overlay
  { name: "New Releases", href: "/music/songs", icon: Music, comingSoon: true },
  { name: "Albums", href: "/music/albums", icon: Album, comingSoon: true },
  { name: "Top Charts", href: "/charts", icon: TrendingUp, comingSoon: true },
  { name: "Playlists", href: "/music/playlists", icon: Disc3, comingSoon: true },
]

export function QuickLinks() {
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
      <h2 className="text-2xl font-bold mb-8">Quick Access</h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {links.map((link) => {
          const Icon = link.icon

          const content = (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center justify-center flex-col gap-3 p-6 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors group",
                  link.comingSoon && "cursor-not-allowed"
                )}
                aria-disabled={link.comingSoon}
              >
                <Icon className="h-8 w-8 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-center">{link.name}</span>
              </Link>
            </motion.div>
          )

          return link.comingSoon ? (
            <ComingSoonWrapper
              key={link.href}
              text="Coming Soon"
              showLockIcon={true}
              opacity={0.3}
              blur={true}
            >
              {content}
            </ComingSoonWrapper>
          ) : (
            content
          )
        })}
      </motion.div>
    </section>
  )
}
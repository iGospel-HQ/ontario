"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Music, FileText, Disc3, Users, Settings } from "lucide-react"

const stats = [
  { label: "Total Songs", value: "2,456", icon: Music },
  { label: "Total Playlists", value: "342", icon: Disc3 },
  { label: "Blog Posts", value: "156", icon: FileText },
  { label: "Artists", value: "489", icon: Users },
]

const adminLinks = [
  {
    title: "Blog Manager",
    description: "Create, edit, and manage blog posts",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Music Upload",
    description: "Upload and manage songs",
    href: "/admin/music/songs",
    icon: Music,
  },
  {
    title: "Playlists",
    description: "Create and manage playlists",
    href: "/admin/music/playlists",
    icon: Disc3,
  },
  {
    title: "Artists",
    description: "Manage artist profiles",
    href: "/admin/music/artists",
    icon: Users,
  },
]

export default function AdminPage() {
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
    <>
      <Navbar />
      <main className="min-h-screen px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your platform content</p>
            </div>
            <Settings className="h-8 w-8 text-muted-foreground" />
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="p-6 rounded-lg bg-secondary border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Admin Links */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-t border-border pt-12"
          >
            <h2 className="text-2xl font-bold mb-8">Management Tools</h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {adminLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link href={link.href}>
                      <div className="p-6 rounded-lg border border-border hover:border-accent/50 hover:bg-secondary/50 transition-all group cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                            <Icon className="h-6 w-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                              {link.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

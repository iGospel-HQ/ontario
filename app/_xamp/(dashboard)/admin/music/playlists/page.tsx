"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit } from "lucide-react"

const playlists = [
  {
    id: 1,
    name: "Chill Vibes",
    songCount: 24,
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    name: "Workout Mix",
    songCount: 18,
    createdAt: "2025-01-10",
  },
  {
    id: 3,
    name: "Night Drive",
    songCount: 32,
    createdAt: "2025-01-05",
  },
]

export default function PlaylistManagerPage() {
  const [playlists_] = useState(playlists)

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
              <h1 className="text-4xl font-bold">Manage Playlists</h1>
              <p className="text-muted-foreground mt-2">Create and organize playlists</p>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              New Playlist
            </Button>
          </motion.div>

          {/* Create Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary/50 rounded-lg p-8 mb-12 border border-border"
          >
            <h2 className="text-xl font-semibold mb-6">Create New Playlist</h2>
            <div className="space-y-4">
              <Input placeholder="Playlist Name" className="bg-secondary" />
              <textarea
                placeholder="Description"
                className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground"
                rows={3}
              />
              <div className="flex gap-4">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Create</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </motion.div>

          {/* Playlists Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary/50 rounded-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Songs</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {playlists_.map((playlist) => (
                    <motion.tr
                      key={playlist.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border hover:bg-secondary transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{playlist.name}</td>
                      <td className="px-6 py-4 text-sm">{playlist.songCount}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{playlist.createdAt}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-secondary rounded transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-destructive/20 rounded transition-colors text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

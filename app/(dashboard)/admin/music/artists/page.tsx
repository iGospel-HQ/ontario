"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit } from "lucide-react"

const artists = [
  {
    id: 1,
    name: "Artist Name 1",
    followers: "1.2M",
    albums: 5,
  },
  {
    id: 2,
    name: "Artist Name 2",
    followers: "856K",
    albums: 3,
  },
  {
    id: 3,
    name: "Artist Name 3",
    followers: "2.4M",
    albums: 8,
  },
]

export default function ArtistManagerPage() {
  const [artists_] = useState(artists)

  return (
    <>
      <main className="min-h-screen px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold">Manage Artists</h1>
              <p className="text-muted-foreground mt-2">Create and manage artist profiles</p>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              New Artist
            </Button>
          </motion.div>

          {/* Create Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary/50 rounded-lg p-8 mb-12 border border-border"
          >
            <h2 className="text-xl font-semibold mb-6">Create Artist Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input placeholder="Artist Name" className="bg-secondary" />
              <Input placeholder="Genre" className="bg-secondary" />
            </div>
            <textarea
              placeholder="Biography"
              className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground mb-4"
              rows={3}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Profile Image</label>
              <Input type="file" accept="image/*" className="bg-secondary" />
            </div>
            <div className="flex gap-4">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Create</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </motion.div>

          {/* Artists Table */}
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
                    <th className="px-6 py-4 text-left text-sm font-semibold">Followers</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Albums</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artists_.map((artist) => (
                    <motion.tr
                      key={artist.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border hover:bg-secondary transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{artist.name}</td>
                      <td className="px-6 py-4 text-sm">{artist.followers}</td>
                      <td className="px-6 py-4 text-sm">{artist.albums}</td>
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
    </>
  )
}

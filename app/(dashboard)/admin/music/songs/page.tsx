"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit } from "lucide-react"

const songs = [
  {
    id: 1,
    title: "Track Title 1",
    artist: "Artist Name",
    album: "Album Name",
    duration: "3:45",
    genre: "Electronic",
  },
  {
    id: 2,
    title: "Track Title 2",
    artist: "Artist Name",
    album: "Album Name",
    duration: "4:12",
    genre: "Hip-Hop",
  },
  {
    id: 3,
    title: "Track Title 3",
    artist: "Artist Name",
    album: "Album Name",
    duration: "3:28",
    genre: "Indie",
  },
]

export default function SongManagerPage() {
  const [uploadForm, setUploadForm] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
  })

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
              <h1 className="text-4xl font-bold">Music Upload</h1>
              <p className="text-muted-foreground mt-2">Upload and manage songs</p>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Upload Song
            </Button>
          </motion.div>

          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 20 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary/50 rounded-lg p-8 mb-12 border border-border"
          >
            <h2 className="text-xl font-semibold mb-6">Upload New Song</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Song Title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                className="bg-secondary"
              />
              <Input
                placeholder="Artist Name"
                value={uploadForm.artist}
                onChange={(e) => setUploadForm({ ...uploadForm, artist: e.target.value })}
                className="bg-secondary"
              />
              <Input
                placeholder="Album Name"
                value={uploadForm.album}
                onChange={(e) => setUploadForm({ ...uploadForm, album: e.target.value })}
                className="bg-secondary"
              />
              <Input
                placeholder="Genre"
                value={uploadForm.genre}
                onChange={(e) => setUploadForm({ ...uploadForm, genre: e.target.value })}
                className="bg-secondary"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Audio File</label>
              <Input type="file" accept="audio/*" className="bg-secondary" />
            </div>
            <div className="mt-6 flex gap-4">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Upload</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </motion.div>

          {/* Songs Table */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-semibold mb-6">Uploaded Songs</h2>
            <div className="bg-secondary/50 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Artist</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Album</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Genre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song) => (
                      <motion.tr
                        key={song.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border hover:bg-secondary transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">{song.title}</td>
                        <td className="px-6 py-4 text-sm">{song.artist}</td>
                        <td className="px-6 py-4 text-sm">{song.album}</td>
                        <td className="px-6 py-4 text-sm">{song.genre}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{song.duration}</td>
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
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}

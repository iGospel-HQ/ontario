"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit } from "lucide-react"
import { format } from "date-fns"

const blogPosts = [
  {
    id: 1,
    title: "The Evolution of Music Streaming",
    category: "Music",
    author: "Editorial Team",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "published",
  },
  {
    id: 2,
    title: "Top Producer Interview",
    category: "Culture",
    author: "Editorial Team",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "published",
  },
  {
    id: 3,
    title: "Genre Evolution 2025",
    category: "Trends",
    author: "Editorial Team",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "draft",
  },
]

export default function BlogManagerPage() {
  const [posts] = useState(blogPosts)

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
              <h1 className="text-4xl font-bold">Blog Manager</h1>
              <p className="text-muted-foreground mt-2">Create and manage blog posts</p>
            </div>
            <Link href="/admin/blog/create">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </motion.div>

          {/* Posts Table */}
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
                    <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Author</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border hover:bg-secondary transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{post.title}</td>
                      <td className="px-6 py-4 text-sm">{post.category}</td>
                      <td className="px-6 py-4 text-sm">{post.author}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{format(post.date, "MMM d, yyyy")}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            post.status === "published" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
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

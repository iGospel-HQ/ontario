"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchBlogPosts } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BlogPageClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: ()=> fetchBlogPosts(),
  })

  const filteredPosts = data?.posts?.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading posts</p>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Sync Insights
        </motion.h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 bg-gray-800 border-gray-700 focus:ring-purple-500 focus:border-purple-500"
          />
          <Select>
            <SelectTrigger className="w-full md:w-1/4 bg-gray-800 border-gray-700 focus:ring-purple-500 focus:border-purple-500">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts?.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <Link href={`/blog/${post.slug}`}>
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-400">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{format(new Date(post.date), "MMMM dd, yyyy")}</span>
                    <span>{post.author}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

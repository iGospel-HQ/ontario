"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchBlogPost } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { format } from "date-fns"
import { Share2, ChevronRight } from "lucide-react"
import { use } from "react"

export function BlogDetailClient({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const { data: post } = useQuery({
    queryKey: ["posts", slug],
    queryFn: () => fetchBlogPost(slug),
  })

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="flex flex-col items-center justify-center min-h-screen p-8">
          <h1 className="text-4xl font-bold mb-4">Loading Post...</h1>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="container mx-auto max-w-4xl py-16">
          <div className="flex items-center space-x-2 text-gray-500 mb-4">
            <Link href="/blog">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
            <div className="flex items-center space-x-4 mb-8 text-gray-600">
              <span>By {post.author}</span>
              <span>|</span>
              <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
            </div>

            <div
              className="prose prose-lg max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 flex justify-end">
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-100">
                <Share2 className="h-5 w-5" />
                <span>Share Post</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

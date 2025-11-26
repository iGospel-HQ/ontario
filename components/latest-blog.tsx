"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { fetchBlogPosts } from "@/lib/api-client"
import Link from "next/link"
import { format } from "date-fns"

export function LatestBlog() {
  const { data } = useQuery({
    queryKey: ["blog-posts", 1],
    queryFn: () => fetchBlogPosts(1, 3),
  })

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <section className="py-12 px-4 md:px-8 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Latest Stories</h2>
        <Link href="/blog" className="text-accent hover:underline text-sm">
          Read All →
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {data?.posts.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <Link href={`/blog/${post.slug}`}>
              <article className="group cursor-pointer">
                <div className="relative mb-4 overflow-hidden rounded-lg h-48">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-accent/20 text-accent rounded">{post.category}</span>
                    <span className="text-muted-foreground">{format(new Date(post.date), "MMM d")}</span>
                  </div>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-accent transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

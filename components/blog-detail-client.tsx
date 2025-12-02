"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchBlogPost, fetchBlogPosts } from "@/lib/api-client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { format } from "date-fns";
import { Share2, ChevronRight } from "lucide-react";
import { use } from "react";
import { BlogSidebar } from "./blog-side-section";

export function BlogDetailClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data: post } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPost(slug),
  });

  const { data: allPosts } = useQuery({
    queryKey: ["blog-posts-related", 1],
    queryFn: () => fetchBlogPosts(1, 6),
  });

  const { data } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => fetchBlogPosts(),
  });

  // Latest posts for sidebar
  const latestPosts = [...(data?.posts || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const relatedPosts =
    allPosts?.posts.filter((p) => p.slug !== slug).slice(0, 3) || [];

  return (
    <main className=" min-h-screen ">
      {/* Hero Image */}
      {post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-96 md:h-[500px] overflow-hidden"
        >
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </motion.div>
      )}
      <div className="grid lg:grid-cols-5 gap-10">
        <div className="px-4 lg:col-span-3 md:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
            >
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{post?.category}</span>
            </motion.div>

            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {post?.title}
              </h1>

              <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{post?.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {post && format(new Date(post.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-invert max-w-none mb-12"
            >
              <div className="text-lg text-muted-foreground leading-relaxed">
                {post?.content && (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>
            </motion.div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border-t border-border pt-12"
              >
                <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((article) => (
                    <Link key={article.id} href={`/blog/${article.slug}`}>
                      <div className="group cursor-pointer">
                        <div className="relative mb-4 overflow-hidden rounded-lg h-40">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-semibold line-clamp-2 group-hover:text-accent">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {format(new Date(article.date), "MMM d")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <BlogSidebar latestPosts={latestPosts} />
        </div>
      </div>
    </main>
  );
}

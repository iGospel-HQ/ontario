// app/blog/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, User } from "lucide-react";

import { fetchBlogPosts } from "@/lib/api-client";
import { BlogSidebar } from "./blog-side-section";

export function BlogPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const { data, isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => fetchBlogPosts(),
  });

  const allPosts = data?.posts || [];

  // Filter & Sort
  const filteredPosts = allPosts
    .filter((post) =>
      [post.title, post.excerpt, post.content, post.author]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  // Latest posts for sidebar
  const latestPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      {/* Hero */}
      <section className="relative h-96 bg-gradient-to-br from-red-950 via-black to-orange-950 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            Gospel{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Insights
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Deep truths. Real worship. African fire.
          </p>
        </motion.div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search & Sort */}
          <div className="mx-auto mb-12 flex items-center flex-col md:flex-row gap-4 md:gap-8">
            <div className="relative w-9/12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
              <Input
                placeholder="Search articles, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 border-accent text-lg"
              />
            </div>
            <div className="flex justify-center mt-4">
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-3/12 h-14 focus:border-red-600 text-lg">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest First</SelectItem>
                  <SelectItem value="title">Title A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Layout: Main + Sidebar */}
          <div className="grid lg:grid-cols-7 gap-10">
            {/* Main Blog Posts */}
            <div className="lg:col-span-5 space-y-8">
              {isLoading ? (
                <div className="grid gap-8 md:grid-cols-2">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-gray-900 border-gray-800">
                      <Skeleton className="h-56 w-full rounded-t-lg" />
                      <CardContent className="p-6 space-y-3">
                        <Skeleton className="h-6 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl text-gray-400">
                    No articles found. Try another search.
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2">
                  {filteredPosts.map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <Card className=" hover:border-red-700 transition-all duration-300 overflow-hidden group h-full pt-0">
                          <div className="relative h-56">
                            <Image
                              src={post.imageUrl || "/placeholder-gospel.jpg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                              {post.category || "Gospel"}
                            </span>
                          </div>
                          <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-3 group-hover:text-red-400 transition line-clamp-2">
                              {post.title}
                            </h2>
                            <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(post.date), "MMM dd, yyyy")}
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {post.author}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <BlogSidebar latestPosts={latestPosts} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

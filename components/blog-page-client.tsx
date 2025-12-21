// app/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Search, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

import api from "@/lib/api-client";
import { BlogSidebar } from "./blog-side-section";

export function BlogPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 20; // Adjust based on your preference

  const { data, isPending, isError } = useQuery({
    queryKey: ["blogPosts", page, searchQuery, sortBy],
    queryFn: async () => {
      let url = `/blog/posts/?page=${page}`;
      
      // Add search query if present
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      // // Sorting (API must support ordering)
      // if (sortBy === "date") {
      //   url += "&ordering=-publish_date";
      // } else if (sortBy === "title") {
      //   url += "&ordering=title";
      // }

      const res = await api.get(url);
      return res.data;
    },
  });

  const { data: postData } = useQuery({
    queryKey: ["latest_post_all_blogs"],
    queryFn: async () => {
      const res = await api.get("/blog/homepage/");
      return res.data;
    },
  });

  // Update total pages when data changes
  useEffect(() => {
    if (data?.count) {
      setTotalPages(Math.ceil(data.count / pageSize));
    }
  }, [data]);

  const posts = data?.results || [];

  // Latest posts for sidebar
  const latestPosts = postData?.latest_posts || [];

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-96 bg-gradient-to-br from-accent/20 via-background to-accent/10 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-background/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4">
            Gospel{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">
              Insights
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Deep truths. Real worship. African fire.
          </p>
        </motion.div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="py-16 text-foreground bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search & Sort */}
          <div className="mx-auto mb-12 flex items-center flex-col md:flex-row gap-4">
            <div className="relative w-9/12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
              <Input
                placeholder="Search articles, authors, topics..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to page 1 on new search
                }}
                className="pl-12 h-14 border-border text-foreground bg-card"
              />
            </div>

            {/* <div className="flex justify-center mt-4 w-3/12">
              <Select value={sortBy} onValueChange={(v: any) => {
                setSortBy(v);
                setPage(1); // Reset to page 1 on sort change
              }}>
                <SelectTrigger className="h-14 w-full text-foreground border-border bg-card">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="date">Latest First</SelectItem>
                  <SelectItem value="title">Title A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {/* Layout: Main + Sidebar */}
          <div className="grid 2xl:grid-cols-7 gap-10">
            {/* Main Blog Posts */}
            <div className="2xl:col-span-5 space-y-8">
              {isPending ? (
                <div className="grid gap-8 md:grid-cols-2">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-card border-border">
                      <Skeleton className="h-56 w-full rounded-t-lg bg-muted" />
                      <CardContent className="p-6 space-y-3">
                        <Skeleton className="h-6 w-4/5 bg-muted" />
                        <Skeleton className="h-4 w-full bg-muted" />
                        <Skeleton className="h-4 w-3/4 bg-muted" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : isError ? (
                <div className="text-center py-20">
                  <p className="text-2xl text-red-600">
                    Failed to load posts. Please try again.
                  </p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl text-muted-foreground">
                    No articles found. Try another search.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-8 md:grid-cols-2">
                    {posts.map((post: any, i: number) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <Card className="hover:border-accent transition-all duration-300 overflow-hidden group h-full pt-0 bg-card border-border">
                            <div className="relative h-56">
                              <Image
                                src={post.featured_image || "/placeholder.svg"}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                              <span className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold">
                                {post.genres?.[0]?.name || "Gospel"}
                              </span>
                            </div>
                            <CardContent className="p-6">
                              <h2 className="text-xl font-bold mb-3 group-hover:text-accent transition line-clamp-2">
                                {post.title}
                              </h2>
                              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(post.publish_date), "MMM dd, yyyy")}
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  {post.author_name}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.article>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-12">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>

                      <span className="text-sm font-medium">
                        Page {page} of {totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="2xl:col-span-2">
              <BlogSidebar latestPosts={latestPosts} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
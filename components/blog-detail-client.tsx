"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/api-client";
import { useAudioPlayer } from "@/store/use-audio-player";
import { format } from "date-fns";
import { Share2, ChevronRight, Play, Pause } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import BlogSkeleton from "./blogpage-loader";
import { BlogSidebar } from "./blog-side-section";
import { CommentSection } from "./blogpost-comment-section";
import { TelegramCTA } from "./telegram-cta";
import { BlogStats } from "./blog-stats";

export function BlogDetailClient({ slug }: { slug: string }) {
  const playTrack = useAudioPlayer((s) => s.playTrack);
  const togglePlay = useAudioPlayer((s) => s.togglePlay);
  const currentTrack = useAudioPlayer((s) => s.currentTrack);
  const isPlaying = useAudioPlayer((s) => s.isPlaying);

  const { data: post, isPending } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const res = await api.get(`/blog/posts/${slug}/`);
      return res.data;
    },
  });

  const { data: homeData } = useQuery({
    queryKey: ["homepage-data"],
    queryFn: async () => {
      const res = await api.get("/blog/homepage/");
      return res.data;
    },
  });

  if (isPending) return <BlogSkeleton />;
  if (!post) return <div className="p-8 text-center">Post not found.</div>;

  const latestPosts = homeData?.latest_posts || [];
  const headerAd = post?.ads?.content_ads.find((ad: any) => ad.position === "header");
  const inPostAd = post?.ads?.content_ads.find((ad: any) => ad.position === "in_post");
  const sidebarAd = post?.ads?.content_ads.filter((ad: any) => ad.position === "sidebar");

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title;

  return (
    <main className="min-h-screen">
      {/* Header Ad - Full width on all screens */}
      {headerAd && (
        <a href={headerAd.link} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={headerAd.image}
            alt={headerAd.title}
            className="w-full h-24 md:h-32 object-cover"
          />
        </a>
      )}

      {/* Main Grid: Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Main Content Area */}
          <article className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {post.title}
              </h1>

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/blog" className="hover:text-foreground">Blog</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">
                  {post.genres?.[0]?.name || "Uncategorized"}
                </span>
              </nav>

              {/* Author, Date, Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{post.author_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(post.publish_date), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <BlogStats
                totalVisitors={post.total_visitors}
                totalViews={post.total_views}
                todayVisitors={post.today_visitors}
                todayViews={post.today_views}
              />

              {/* Featured Image */}
              <div className="relative aspect-video sm:aspect-[16/9] md:aspect-[2/1] overflow-hidden rounded-xl">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Social Share Buttons - Mobile Friendly */}
              <div className="flex justify-center gap-3 py-4">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                  aria-label="Share on Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12.06C22 6.53 17.52 2 12 2S2 6.53 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.83c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46H15.6c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34v7.03A10 10 0 0 0 22 12.06z" />
                  </svg>
                </a>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " - " + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                  aria-label="Share on WhatsApp"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.148-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M20.52 3.48A11.958 11.958 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.11.547 4.173 1.584 5.98L0 24l6.208-1.584A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.19-1.242-6.188-3.48-8.52zM12 22.08c-1.993 0-3.93-.53-5.616-1.545l-.402-.239-3.684.94.98-3.59-.261-.413A9.969 9.969 0 0 1 2.04 12C2.04 6.627 6.627 2.04 12 2.04c2.664 0 5.184 1.04 7.07 2.93A9.926 9.926 0 0 1 21.96 12c0 5.373-4.588 10.04-9.96 10.04z" />
                  </svg>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                  aria-label="Share on X"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26L23.25 21.75h-6.484l-5.062-6.617-5.806 6.617H2.59l7.73-8.81L1.125 2.25H7.75l4.537 5.993zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Post Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none dark:prose-invert"
            >

              <TelegramCTA />
              <div
                className="post-content text-base sm:text-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <TelegramCTA />

              {/* In-Post Ad */}
              {inPostAd && (
                <a href={inPostAd.link} target="_blank" rel="noopener noreferrer" className="block my-8">
                  <img
                    src={inPostAd.image}
                    alt={inPostAd.title}
                    className="w-full h-28 rounded-lg"
                  />
                </a>
              )}
            </motion.div>

            {/* Tracks Player Section */}
            {post.tracks?.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Play Tracks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {post.tracks.map((track: any, i: number) => (
                      <div
                        key={track.id}
                        className={cn(
                          "flex items-center gap-4 p-4 cursor-pointer transition-colors",
                          currentTrack?.id === track.id ? "bg-accent/10" : "hover:bg-muted/50"
                        )}
                        onClick={() => {
                          if (currentTrack?.id === track.id) {
                            togglePlay();
                          } else {
                            playTrack({
                              id: track.id,
                              title: track.title,
                              artist: track.artist_name,
                              cover: track.image,
                              audioUrl: track.mp3_file,
                            });
                          }
                        }}
                      >
                        <span className="text-lg font-bold text-muted-foreground w-6 text-center">
                          {i + 1}
                        </span>
                        <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={track.image}
                            alt={track.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{track.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {track.artist_name}
                            {track.genre_name && ` • ${track.genre_name}`}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground hidden sm:block">
                          {track.duration}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentTrack?.id === track.id) {
                              togglePlay();
                            } else {
                              playTrack({
                                id: track.id,
                                title: track.title,
                                artist: track.artist_name,
                                cover: track.image,
                                audioUrl: track.mp3_file,
                              });
                            }
                          }}
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <CommentSection comments={post.comments} postId={post.id} slug={slug} />
          </article>

          {/* Sidebar - Hidden on mobile, appears on lg+ */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <BlogSidebar latestPosts={latestPosts} ads={sidebarAd} />
            </div>
          </aside>
        </div>

        {/* Mobile Sidebar - Shown only on <lg screens */}
        <div className="lg:hidden mt-12 border-t pt-8">
          <BlogSidebar latestPosts={latestPosts} ads={sidebarAd} />
        </div>
      </div>
    </main>
  );
}
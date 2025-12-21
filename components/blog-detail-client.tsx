// app/blog/[slug]/page.tsx (or wherever BlogDetailClient is used)
"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/api-client";
import { useAudioPlayer } from "@/store/use-audio-player";
import { format } from "date-fns";
import { Share2, ChevronRight, Play, Pause, Download } from "lucide-react";
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
  const {
    playTrack,
    togglePlay,
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    seek,
  } = useAudioPlayer();

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
  const headerAd = post?.ads?.content_ads.find(
    (ad: any) => ad.position === "header"
  );
  const inPostAd = post?.ads?.content_ads.find(
    (ad: any) => ad.position === "in_post"
  );
  const sidebarAd = post?.ads?.content_ads.filter(
    (ad: any) => ad.position === "sidebar"
  );

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen">
      {/* Header Ad */}
      {headerAd && (
        <a
          href={headerAd.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={headerAd.image}
            alt={headerAd.title}
            className="w-full h-24 md:h-32 object-cover"
          />
        </a>
      )}

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2 space-y-8">
            {/* Top Section */}
            <div className="space-y-6">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <span className="text-muted-foreground">›</span>
                <span className="text-foreground">{post.title}</span>
              </nav>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                {post.title}
              </h1>

              <div className="flex items-center gap-4">
                <p className="font-semibold text-gray-800">
                  {post.author_name}
                </p>
                <span className="text-gray-500">•</span>
                <p className="text-sm text-gray-500">
                  {format(new Date(post.publish_date), "MMMM d, yyyy")}
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {/* Facebook, X, WhatsApp, LinkedIn icons as before */}
                {/* ... (keep your existing social share icons) */}
              </div>

              {/* Featured Image */}
              <div className="relative aspect-[1/1] overflow-hidden rounded-xl">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

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
              <BlogStats
                totalVisitors={post.total_visitors}
                totalViews={post.total_views}
                todayVisitors={post.today_visitors}
                todayViews={post.today_views}
              />
              <TelegramCTA />

              {inPostAd && (
                <a
                  href={inPostAd.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block my-8"
                >
                  <img
                    src={inPostAd.image}
                    alt={inPostAd.title}
                    className="w-full h-28 rounded-lg"
                  />
                </a>
              )}
            </motion.div>

            {/* Tracks Player Section – Updated with real progress & download */}
            {post.tracks?.length > 0 && (
              <Card className="overflow-hidden  border-0 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-black">
                    Listen Now
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {post.tracks.map((track: any, i: number) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const isCurrentPlaying = isCurrent && isPlaying;
                    const trackProgress = isCurrent ? progress : 0;
                    const trackCurrentTime = isCurrent
                      ? useAudioPlayer.getState().currentTime
                      : 0;
                    const trackDuration = isCurrent
                      ? useAudioPlayer.getState().duration
                      : 0;

                    return (
                      <div
                        key={track.id}
                        className={cn(
                          "px-6 py-5 cursor-pointer transition-all bg-black"
                        )}
                        onClick={() => {
                          if (isCurrent) {
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
                        <div className="flex items-center gap-5 text-white">
                          {/* Play/Pause Button */}
                          <button
                            className="flex-shrink-0 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isCurrent) togglePlay();
                              else
                                playTrack({
                                  id: track.id,
                                  title: track.title,
                                  artist: track.artist_name,
                                  cover: track.image,
                                  audioUrl: track.mp3_file,
                                });
                            }}
                          >
                            {isCurrentPlaying ? (
                              <Pause className="w-6 h-6 text-black fill-black" />
                            ) : (
                              <Play className="w-6 h-6 text-black fill-black ml-1" />
                            )}
                          </button>

                          {/* Waveform + Progress Bar */}
                          <div className="flex-1 relative h-16">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full h-px bg-white/20" />
                              <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-12 flex items-center gap-px"
                                style={{
                                  width: `100%`,
                                  transition: "width 0.2s ease-out",
                                }}
                              >
                                {Array.from({ length: 80 }).map((_, idx) => (
                                  <div
                                    key={idx}
                                    className="w-1 bg-red-500 transition-all duration-1000 ease-in-out"
                                    style={{
                                      height: isCurrentPlaying
                                        ? `${
                                            Math.sin(
                                              (Date.now() / 1000 + idx * 0.3) *
                                                2
                                            ) *
                                              40 +
                                            60
                                          }%`
                                        : "50%",
                                      opacity: isCurrentPlaying ? 1 : 0.4,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Time Display */}
                          <div className="flex items-center gap-4 text-sm font-medium">
                            <span className="text-white/70">
                              {formatTime(trackCurrentTime)}
                            </span>
                            <span className="text-white/50">/</span>
                            <span className="text-white/90">
                              {track.duration || "4:04"}
                            </span>
                          </div>
                        </div>

                        {/* Track Info & Download */}
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white text-lg">
                              {track.title}
                            </p>
                            <p className="text-white/70">{track.artist_name}</p>
                          </div>

                          {track.is_downloadable && track.download_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(track.download_url, "_blank");
                              }}
                            >
                              <Download className="w-5 h-5 mr-2" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <CommentSection
              comments={post.comments}
              postId={post.id}
              slug={slug}
            />
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <BlogSidebar latestPosts={latestPosts} ads={sidebarAd} />
            </div>
          </aside>
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden mt-12 border-t pt-8">
          <BlogSidebar latestPosts={latestPosts} ads={sidebarAd} />
        </div>
      </div>
    </main>
  );
}

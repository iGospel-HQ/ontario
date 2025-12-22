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
            {/* Top Section – Matches the screenshot exactly */}
            <div className="space-y-6">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <span className="text-muted-foreground">›</span>
                <span className="text-foreground">{post.title}</span>
              </nav>

              {/* Category Badge */}
              {/* <div className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded">
                GOSPEL MUSIC
              </div> */}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                {post.title}
              </h1>

              {/* Author & Date */}
              <div className="flex items-center gap-4">
                <p className="font-semibold text-gray-800">
                  {post.author_name}
                </p>
                <span className="text-gray-500">•</span>
                <p className="text-sm text-gray-500">
                  {format(new Date(post.publish_date), "MMMM d, yyyy")}
                </p>
              </div>

              {/* Social Icons – Exact layout & colors from screenshot */}
              <div className="flex items-center gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded hover:bg-blue-700 transition ml-3"
                  aria-label="Share on Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12.06C22 6.53 17.52 2 12 2S2 6.53 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.83c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46H15.6c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34v7.03A10 10 0 0 0 22 12.06z" />
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    shareTitle
                  )}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-black text-white rounded hover:bg-gray-800 transition ml-3"
                  aria-label="Share on X"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26L23.25 21.75h-6.484l-5.062-6.617-5.806 6.617H2.59l7.73-8.81L1.125 2.25H7.75l4.537 5.993zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* <a
                  href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
                    shareUrl
                  )}&media=${encodeURIComponent(
                    post.featured_image
                  )}&description=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded hover:bg-red-700 transition ml-3"
                  aria-label="Share on Pinterest"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6 0 1.18.34 2.28.93 3.21l-1.17 4.48 4.48-1.17c.93.59 2.03.93 3.21.93 3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 9.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                  </svg>
                </a> */}
                <a
                  href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-11 h-11 transition ml-3"
                  aria-label="Share on WhatsApp"
                >
                  <img
                    src="/whatsapp-icon.png"
                    alt="whatsapp"
                    className="h-full w-full"
                  />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-18 h-18 transition -mr-3"
                >
                  <img
                    src="/linkedin-icon.png"
                    alt="linkedin"
                    className="w-full"
                  />
                </a>
              </div>

              {/* Featured Image – Full width below social icons */}
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
                              className="text-white cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()

                                const link = document.createElement("a")
                                link.href = track.download_url
                                link.download = "" // browser uses filename from server
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
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

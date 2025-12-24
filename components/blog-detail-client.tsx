// app/blog/[slug]/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/api-client";
import { useAudioPlayer } from "@/store/use-audio-player";
import { format } from "date-fns";
import {
  Share2,
  ChevronRight,
  Play,
  Pause,
  Download,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
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
  } = useAudioPlayer();

  const [supportOpen, setSupportOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

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

  const supportStatus = post.support_status || { support: false };
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSupport = async () => {
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);
    try {
      const payload: any = {
        creator_id: supportStatus.creator_id,
        amount: Number(amount),
        email: email.trim() || "igospelmediaconnect@gmail.com",
      };

      const res = await api.post("/transaction/payment/initiate/", payload);
      const { payment_url } = res.data;

      if (payment_url) {
        setSupportOpen(false);
        setEmail("");
        setAmount("");
        window.open(payment_url, "_blank");
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SupportButton = () => (
    <Button
      onClick={() => setSupportOpen(true)}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 w-full"
      size="lg"
    >
      <Heart className="w-5 h-5" />
      {supportStatus.message || "Support This Blog"}
    </Button>
  );

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
                {/* Your social icons */}
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

            {/* Support Button – Before Content */}
            {/* {supportStatus.support && ( */}
            <div className="flex justify-center my-10">
              <SupportButton />
            </div>
            {/* // )} */}

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

            {/* Support Button – After Content */}
            {/* {supportStatus.support && ( */}
            <div className="flex justify-center my-12">
              <SupportButton />
            </div>
            {/* )}   */}

            {/* Tracks Player Section */}
            {post.tracks?.length > 0 && (
              <Card className="overflow-hidden border-0 shadow-2xl">
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
                    const trackCurrentTime = isCurrent ? currentTime : 0;
                    const trackDuration = isCurrent ? duration : 0;

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

                          <div className="flex-1 relative h-16">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full h-px bg-white/20" />
                              <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-12 flex items-end gap-px"
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
                                e.stopPropagation();
                                const link = document.createElement("a");
                                link.href = track.download_url;
                                link.download = "";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
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

      {/* Support Dialog */}
      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Support This Blog</DialogTitle>
            <DialogDescription className="text-base">
              Your support helps us continue sharing powerful gospel content.
              <br />
              <span className="font-medium mt-3 text-sm block">
                You can remain anonymous by leaving the email field empty.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                className="border-"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email{" "}
                <span className="text-muted-foreground text-sm">
                  (Optional - for receipt)
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com (optional)"
                className="border-"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSupportOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSupport}
              disabled={loading || !amount || Number(amount) < 100}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

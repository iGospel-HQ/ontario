"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api, { fetchBlogPost, fetchBlogPosts } from "@/lib/api-client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { format } from "date-fns";
import { Share2, ChevronRight, Play, Pause } from "lucide-react";
import { use } from "react";
import { BlogSidebar } from "./blog-side-section";
import BlogSkeleton from "./blogpage-loader";
import { useAudioPlayer } from "@/store/use-audio-player";
import { CommentSection } from "./blogpost-comment-section";
import { TelegramCTA } from "./telegram-cta";
import { BlogStats } from "./blog-stats";

export function BlogDetailClient({ slug }: { slug: string }) {
  const playTrack = useAudioPlayer((s) => s.playTrack);
  const togglePlay = useAudioPlayer((s) => s.togglePlay);
  const currentTrack = useAudioPlayer((s) => s.currentTrack);

  const { data: post, isPending } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const res = await api.get(`/blog/posts/${slug}/`);
      return res.data;
    },
  });

  // const { data: allPosts } = useQuery({
  //   queryKey: ["blog-posts-related", 1],
  //   queryFn: () => fetchBlogPosts(1, 6),
  // });

  const { data } = useQuery({
    queryKey: ["latest_post", slug],
    queryFn: async () => {
      const res = await api.get("/blog/homepage/");
      return res.data;
    },
  });

  if (isPending) {
    return <BlogSkeleton />;
  }

  // Latest posts for sidebar
  const latestPosts = data?.latest_posts || [];
  const artists = post?.artists.map((artist: any) => artist.name).join(", ");
  const comments = post?.comments;
  const headerAd = post?.ads?.content_ads.find(
    (ad: any) => ad.position === "header"
  );
  const sidebarAd = post?.ads?.content_ads.find(
    (ad: any) => ad.position === "sidebar"
  );

  // const relatedPosts =
  //   allPosts?.posts.filter((p) => p.slug !== slug).slice(0, 3) || [];

  return (
    <main className=" min-h-screen ">
      <a href={headerAd.link}>
        <img
          src={headerAd.image}
          alt={headerAd.title}
          className="w-full md:h-[100px] object-cover"
        />
      </a>
      <div className="grid 2xl:grid-cols-5 gap-10">
        <div className="px-4 2xl:col-span-3 md:px-4 py-12">
          {/* Hero Image */}
          {post && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative   mb-5"
            >
              <h1 className="text-4xl md:text-5xl font-bold my-8">
                {post?.title}
              </h1>
              <div className="flex justify-end my-3 border-t p-3 items-center gap-3">
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.href : ""
                  )}`}
                  target="_blank"
                  className="p-2 bg-background/70 backdrop-blur-sm rounded-full hover:bg-accent hover:text-accent-foreground transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 12.06C22 6.53 17.52 2 12 2S2 6.53 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.83c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46H15.6c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34v7.03A10 10 0 0 0 22 12.06z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    post?.title +
                      " - " +
                      (typeof window !== "undefined"
                        ? window.location.href
                        : "")
                  )}`}
                  target="_blank"
                  className="p-2 bg-background/70 backdrop-blur-sm rounded-full hover:bg-accent hover:text-accent-foreground transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.148-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M20.52 3.48A11.958 11.958 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.11.547 4.173 1.584 5.98L0 24l6.208-1.584A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.19-1.242-6.188-3.48-8.52zM12 22.08c-1.993 0-3.93-.53-5.616-1.545l-.402-.239-3.684.94.98-3.59-.261-.413A9.969 9.969 0 0 1 2.04 12C2.04 6.627 6.627 2.04 12 2.04c2.664 0 5.184 1.04 7.07 2.93A9.926 9.926 0 0 1 21.96 12c0 5.373-4.588 10.04-9.96 10.04z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post?.title
                  )}&url=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.href : ""
                  )}`}
                  target="_blank"
                  className="p-2 bg-background/70 backdrop-blur-sm rounded-full hover:bg-accent hover:text-accent-foreground transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26L23.25 21.75h-6.484l-5.062-6.617-5.806 6.617H2.59l7.73-8.81L1.125 2.25H7.75l4.537 5.993zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
              <img
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                className="w-full md:h-[400px] object-cover"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/50 to-transparent" /> */}
            </motion.div>
          )}
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
              <span className="text-foreground">{post?.genres[0].name}</span>
            </motion.div>

            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{post?.author_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {post &&
                        format(new Date(post.publish_date), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              <BlogStats
                totalVisitors={post.total_visitors}
                totalViews={post.total_views}
                todayVisitors={post.today_visitors}
                todayViews={post.today_views}
              />

              <TelegramCTA />
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
                  <div
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}
                <TelegramCTA />
              </div>
            </motion.div>

            <div className="my-8 p-6 bg-secondary rounded-lg">
              {/* Section Label */}
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🎵 Play Tracks
                <span className="text-xs text-muted-foreground font-normal">
                  ({post.tracks.length} tracks)
                </span>
              </h2>

              {post.tracks.map((song: any, i: number) => (
                <div
                  key={i}
                  className="
        flex items-center gap-4 
        hover:bg-accent/20 
        p-2 -m-2 rounded 
        transition 
        group 
        cursor-pointer 
        border-b border-border/40 last:border-none
        relative
      "
                  onClick={() => {
                    if (currentTrack?.id === song.id) {
                      togglePlay();
                    } else {
                      playTrack({
                        id: song.id,
                        title: song.title,
                        artist: song.artist,
                        cover: song.image || "/placeholder.svg",
                        audioUrl: song.mp3_file,
                      });
                    }
                  }}
                >
                  {/* Play Button */}
                  <button
                    className="
          relative w-8 h-8 
          bg-primary text-primary-foreground 
          rounded-full 
          flex items-center justify-center 
          transition 
          group-hover:scale-110 
          group-hover:bg-primary/90
          shadow-sm
        "
                  >
                    {currentTrack?.id === song.id ? (
                      <Pause className="w-3.5 h-3.5" fill="white" />
                    ) : (
                      <Play className="w-3.5 h-3.5" fill="white" />
                    )}
                  </button>

                  {/* Title + Artist */}
                  <div className="flex-1">
                    <p className="font-semibold text-sm truncate group-hover:text-primary transition">
                      {song.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {song.artist}
                    </p>
                  </div>

                  {/* Duration */}
                  <span className="text-xs text-muted-foreground">
                    {song.duration}
                  </span>

                  {/* Hover Hint */}
                  <span
                    className="
          opacity-0 
          text-[10px] font-medium 
          text-primary 
          group-hover:opacity-100 
          transition 
          absolute right-3
        "
                  >
                    Play →
                  </span>
                </div>
              ))}
            </div>

            <CommentSection comments={comments} postId={post?.id} slug={slug} />

            {/* Related Articles */}
            {/* {relatedPosts.length > 0 && (
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
            )} */}
          </div>
        </div>
        <div className="2xl:col-span-2 mt-15">
          <BlogSidebar latestPosts={latestPosts} />
        </div>
      </div>
    </main>
  );
}

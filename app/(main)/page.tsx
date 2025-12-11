"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { QuickLinks } from "@/components/quick-links";
import { FeaturedSongs } from "@/components/featured-songs";
import { FeaturedPlaylists } from "@/components/featured-playlists";
import { LatestBlog } from "@/components/latest-blog";
import { FeaturedCarousel } from "@/components/featured-carousel";
import HomeInfoSection from "@/components/hero-info-section";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { HomePageSkeleton } from "@/components/homepage-loader";



export default function HomePage() {
  const { data , error, isPending, isRefetching } = useQuery({
    queryKey: ["homepage-data"],
    queryFn: async () => {
     const res = await api.get("/blog/homepage/")
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  if (isPending && !isRefetching) {
    return <HomePageSkeleton />;
  }

  const latestPosts = data?.latest_posts || [];
  const featuredPosts = data?.featured_posts || [];
  const randomPosts = data?.random_posts || [];
  const trendingPosts = data?.trending_posts || [];
  const playlists = data?.igospel_playlist || [];
  return (
    <>
      <main className="min-h-screen">
        <HeroSection post={featuredPosts[0]}/>
        {/* <FeaturedCarousel /> */}
        <QuickLinks />
        <HomeInfoSection latestPosts={latestPosts} featuredPosts={featuredPosts} randomPosts={randomPosts} playlists={playlists} />
        {/* <FeaturedPlaylists /> */}
        <FeaturedSongs />
        {/* <LatestBlog /> */}
      </main>
    </>
  );
}

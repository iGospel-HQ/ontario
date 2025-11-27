import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { QuickLinks } from "@/components/quick-links";
import { FeaturedSongs } from "@/components/featured-songs";
import { FeaturedPlaylists } from "@/components/featured-playlists";
import { LatestBlog } from "@/components/latest-blog";
import { FeaturedCarousel } from "@/components/featured-carousel";

export const metadata: Metadata = {
  title: "iGospel - Blog & Music Platform",
  description:
    "Discover curated music, artists, and editorial content all in one place",
};

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen">
        <HeroSection />
        <FeaturedCarousel />
        <QuickLinks />
        <FeaturedPlaylists />
        <FeaturedSongs />
        <LatestBlog />
      </main>
    </>
  );
}

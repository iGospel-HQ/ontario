import type React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { AudioPlayer } from "@/components/audio-player";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: {
    default: "iGospel - Blog & Music Platform",
    template: `%s - ${siteConfig.name}`,
  },
  description:
    "Discover curated music, artists, and editorial content all in one place",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        backgroundImage: "url(/bg-back.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-14  px-0 md:px-8">
        <div className="hidden md:block lg:col-span-2 2xl:col-span-3"></div>
        <main id="main-content" className="lg:col-span-10 2xl:col-span-8 bg-white lg:px-5">
          {children}
        </main>
        <div className="hidden md:block lg:col-span-2 2xl:col-span-3"></div>
        <AudioPlayer />
      </div>
      <Footer />
    </div>
  );
}

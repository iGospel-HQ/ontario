"use client";

import type React from "react";

import { AudioPlayer } from "@/components/audio-player";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-14  px-0 md:px-8">
        <div className="hidden md:block lg:col-span-2 2xl:col-span-3"></div>
        <div className="lg:col-span-10 2xl:col-span-8 bg-white lg:px-5">
          {children}
        </div>
        <div className="hidden md:block lg:col-span-2 2xl:col-span-3"></div>
        <AudioPlayer />
      </div>
      <Footer />
    </>
  );
}

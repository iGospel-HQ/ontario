"use client";

import type React from "react";

import { useState } from "react";
import { AudioPlayer } from "@/components/audio-player";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [playerOpen, setPlayerOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-12  px-4 md:px-8">
        <div className="lg:col-span-2"></div>
        <div onClick={() => {}} className="md:col-span-8 bg-white px-5">
          {children}
        </div>
        <div className="lg:col-span-2"></div>
        <AudioPlayer isOpen={playerOpen} onClose={() => setPlayerOpen(false)} />
      </div>
      <Footer />
    </>
  );
}

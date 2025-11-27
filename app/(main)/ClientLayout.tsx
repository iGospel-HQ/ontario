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
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div onClick={() => {}} className="cursor-pointer">
          {children}
        </div>
        <AudioPlayer isOpen={playerOpen} onClose={() => setPlayerOpen(false)} />
      </div>
      <Footer />
    </>
  );
}

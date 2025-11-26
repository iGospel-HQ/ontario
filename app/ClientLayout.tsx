"use client"

import type React from "react"

import { useState } from "react"
import { ReactQueryProvider } from "@/lib/react-query"
import { AudioPlayer } from "@/components/audio-player"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [playerOpen, setPlayerOpen] = useState(false)

  return (
    <ReactQueryProvider>
      <Navbar/>
      <div onClick={() => {}} className="cursor-pointer">
        {children}
      </div>
      <AudioPlayer isOpen={playerOpen} onClose={() => setPlayerOpen(false)} />
      <Footer/>
    </ReactQueryProvider>
  )
}

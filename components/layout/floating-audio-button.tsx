"use client"

import { motion } from "framer-motion"
import { PlayCircle, PauseCircle, ListMusic } from "lucide-react"
import { useAudioPlayer } from "@/store/use-audio-player"

export function FloatingAudioButtons() {
  const { isOpen, currentTrack, isPlaying, togglePlay, openPlayer } = useAudioPlayer()

  // Only show when player is hidden and a track exists
  if (isOpen || !currentTrack) return null

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3">

      {/* PLAY / PAUSE */}
      <motion.button
        onClick={togglePlay}
        whileTap={{ scale: 0.9 }}
        className="
          p-4 rounded-full shadow-lg
          bg-accent text-accent-foreground
          hover:bg-accent/90 transition-colors
        "
      >
        {isPlaying ? (
          <PauseCircle className="w-7 h-7" />
        ) : (
          <PlayCircle className="w-7 h-7" />
        )}
      </motion.button>

      {/* OPEN PLAYER WITHOUT RESTARTING MUSIC */}
      <motion.button
        onClick={openPlayer}
        whileTap={{ scale: 0.9 }}
        className="
          p-4 rounded-full shadow-lg
          bg-primary text-primary-foreground
          hover:bg-primary/90 transition-colors
        "
      >
        <ListMusic className="w-6 h-6" />
      </motion.button>

    </div>
  )
}

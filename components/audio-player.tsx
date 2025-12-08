"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react"
import { useAudioPlayer } from "@/store/use-audio-player"

export function AudioPlayer() {
  const {
    isOpen,
    currentTrack,
    audioRef,
    isPlaying,
    togglePlay,
    closePlayer,
  } = useAudioPlayer()

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  // --- PROGRESS + DURATION LISTENERS ---
  useEffect(() => {
    if (!audioRef) return

    const updateProgress = () => {
      setProgress((audioRef.currentTime / audioRef.duration) * 100 || 0)
    }

    const updateDuration = () => {
      setDuration(audioRef.duration)
    }

    audioRef.addEventListener("timeupdate", updateProgress)
    audioRef.addEventListener("loadedmetadata", updateDuration)

    return () => {
      audioRef.removeEventListener("timeupdate", updateProgress)
      audioRef.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [audioRef])

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number.parseFloat(e.target.value)
    if (audioRef) {
      audioRef.currentTime = (newProgress / 100) * duration
      setProgress(newProgress)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef) audioRef.volume = newVolume
    if (newVolume > 0) setIsMuted(false)
  }

  const toggleMute = () => {
    if (!audioRef) return

    if (isMuted) {
      audioRef.volume = volume
      setIsMuted(false)
    } else {
      audioRef.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen || !currentTrack) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">

          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1 bg-muted rounded-full cursor-pointer appearance-none"
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${progress}%, var(--muted) ${progress}%, var(--muted) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{formatTime((progress / 100) * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between gap-4">

            {/* Song Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img
                src={currentTrack.cover || "/placeholder.svg"}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="truncate">
                <p className="font-medium truncate text-sm">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <button className="hover:text-accent transition-colors">
                <SkipBack className="h-5 w-5" />
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </motion.button>

              <button className="hover:text-accent transition-colors">
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 md:w-32">
              <button onClick={toggleMute} className="hover:text-accent transition-colors">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-muted rounded-full cursor-pointer appearance-none hidden md:block"
              />
            </div>

            <button onClick={closePlayer} className="hover:text-accent transition-colors hidden md:block">
              <Maximize2 className="h-4 w-4" />
            </button>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

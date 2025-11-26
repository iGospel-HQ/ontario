"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2 } from "lucide-react"

interface AudioPlayerProps {
  isOpen: boolean
  onClose: () => void
}

export function AudioPlayer({ isOpen, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSong = {
    title: "Sample Track",
    artist: "Artist Name",
    album: "Album Name",
    cover: "/abstract-soundscape.png",
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    const updateDuration = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("loadedmetadata", updateDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number.parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * duration
      setProgress(newProgress)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume > 0) setIsMuted(false)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-border"
        >
          <audio ref={audioRef} src="/dummy/track.mp3" crossOrigin="anonymous" />

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
                  src={currentSong.cover || "/placeholder.svg"}
                  alt={currentSong.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="truncate">
                  <p className="font-medium truncate text-sm">{currentSong.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
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
                  {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
                </motion.button>
                <button className="hover:text-accent transition-colors">
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>

              {/* Volume Control */}
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
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${
                      (isMuted ? 0 : volume) * 100
                    }%, var(--muted) ${(isMuted ? 0 : volume) * 100}%, var(--muted) 100%)`,
                  }}
                />
              </div>

              {/* Fullscreen Button */}
              <button onClick={onClose} className="hover:text-accent transition-colors hidden md:block">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

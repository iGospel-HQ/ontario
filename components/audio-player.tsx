// app/components/AudioPlayer.tsx
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useAudioPlayer } from "@/store/use-audio-player";

export function AudioPlayer() {
  const {
    isOpen,
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    closePlayer,
  } = useAudioPlayer();

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen || !currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 shadow-2xl z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 relative">
          {/* Close Button – Top Right Corner */}
          <button
            onClick={closePlayer}
            className="absolute -top-3 right-4 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-1.5 shadow-lg transition"
            aria-label="Close player"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Progress Bar */}
          <div className="mb-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => {
                const newProgress = Number(e.target.value);
                seek((newProgress / 100) * duration);
              }}
              className="w-full h-1 bg-gray-700 rounded-full cursor-pointer appearance-none"
              style={{
                background: `linear-gradient(to right, #ef4444 ${progress}%, #374151 ${progress}%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls – Smaller & Responsive */}
          <div className="flex items-center justify-between gap-3">
            {/* Track Info – Compact */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={currentTrack.cover || "/placeholder.svg"}
                alt={currentTrack.title}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="truncate">
                <p className="font-semibold text-white text-sm truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Playback Controls – Smaller buttons */}
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-white transition hidden sm:block">
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <button className="text-gray-400 hover:text-white transition hidden sm:block">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume & Close */}
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 md:w-24 h-1 bg-gray-700 rounded-full cursor-pointer hidden sm:block"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
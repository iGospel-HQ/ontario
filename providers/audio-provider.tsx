"use client";

import { useEffect, useRef } from "react";
import { useAudioPlayer } from "@/store/use-audio-player";

export function AudioProvider() {
  const { setAudioRef, audioRef, updateProgress } = useAudioPlayer();
  const audioElement = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioElement.current) {
      setAudioRef(audioElement.current);
    }
  }, []);

  return (
    <audio
      ref={setAudioRef}
      onTimeUpdate={() => {
        const audio = audioRef;
        if (audio) updateProgress(audio.currentTime, audio.duration);
      }}
      onLoadedMetadata={() => {
        const audio = audioRef;
        if (audio) updateProgress(audio.currentTime, audio.duration);
      }}
    />
  );
}

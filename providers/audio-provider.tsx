"use client";

import { useEffect, useRef } from "react";
import { useAudioPlayer } from "@/store/use-audio-player";

export function AudioProvider() {
  const { setAudioRef } = useAudioPlayer();
  const audioElement = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioElement.current) {
      setAudioRef(audioElement.current);
    }
  }, []);

  return <audio ref={audioElement} preload="auto" />;
}

"use client";

import { useAudioPlayer } from "@/store/use-audio-player";

/** The single <audio> element behind the global player; registered via ref callback. */
export function AudioProvider() {
  const { setAudioRef, audioRef, updateProgress } = useAudioPlayer();

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
      onEnded={() => useAudioPlayer.setState({ isPlaying: false })}
    />
  );
}

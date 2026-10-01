"use client";

import { Pause, Play } from "lucide-react";
import { useAudioPlayer, type Track } from "@/store/use-audio-player";
import { cn } from "@/lib/utils";
import type { MusicTrack } from "@/types/api";

export function toPlayerTrack(track: MusicTrack): Track {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist_name,
    cover: track.image || track.album_cover || "/placeholder.svg",
    audioUrl: track.mp3_file,
  };
}

/** Play/pause toggle wired to the global audio player. */
export function TrackPlayButton({
  track,
  className,
  iconClassName = "h-5 w-5",
}: {
  track: MusicTrack;
  className?: string;
  iconClassName?: string;
}) {
  const playTrack = useAudioPlayer((s) => s.playTrack);
  const togglePlay = useAudioPlayer((s) => s.togglePlay);
  const isCurrent = useAudioPlayer((s) => s.currentTrack?.id === track.id);
  const isPlaying = useAudioPlayer((s) => s.isPlaying);
  const playing = isCurrent && isPlaying;

  return (
    <button
      type="button"
      onClick={() => (isCurrent ? togglePlay() : playTrack(toPlayerTrack(track)))}
      aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
      className={cn(
        "inline-flex items-center justify-center hover:text-accent transition-colors",
        className,
      )}
    >
      {playing ? <Pause className={iconClassName} /> : <Play className={iconClassName} />}
    </button>
  );
}

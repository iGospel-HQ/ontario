"use client";

import { Play } from "lucide-react";
import { useAudioPlayer } from "@/store/use-audio-player";
import type { MusicTrack } from "@/types/api";
import { toPlayerTrack } from "@/components/music/track-play-button";

/** Starts the first track of a playlist (the player has no queue yet). */
export function PlayAllButton({ tracks }: { tracks: MusicTrack[] }) {
  const playTrack = useAudioPlayer((s) => s.playTrack);

  return (
    <button
      type="button"
      disabled={tracks.length === 0}
      onClick={() => tracks[0] && playTrack(toPlayerTrack(tracks[0]))}
      className="mb-12 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      <Play className="h-5 w-5 fill-current" />
      Play All
    </button>
  );
}

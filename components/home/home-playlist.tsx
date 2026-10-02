"use client";

import { Pause, Play } from "lucide-react";
import { useAudioPlayer } from "@/store/use-audio-player";
import { cn } from "@/lib/utils";
import type { HomepageTrack } from "@/types/api";

/** Sidebar "Playlist" widget: the official iGospel playlist, playable inline. */
export function HomePlaylist({ tracks }: { tracks: HomepageTrack[] }) {
  const playTrack = useAudioPlayer((s) => s.playTrack);
  const togglePlay = useAudioPlayer((s) => s.togglePlay);
  const currentTrack = useAudioPlayer((s) => s.currentTrack);

  return (
    <section>
      <h2 className="widget-title">
        <span>iGospel Playlist</span>
      </h2>
      <div className="max-h-96 space-y-1 overflow-y-auto border border-rule p-3">
        {tracks.map((song, i) => {
          const isCurrent = currentTrack?.id === song.id;
          const toggle = () => {
            if (isCurrent) {
              togglePlay();
            } else {
              playTrack({
                id: song.id,
                title: song.title,
                artist: song.artist,
                cover: song.image || "/placeholder.svg",
                audioUrl: song.mp3_file,
              });
            }
          };

          return (
            <div
              key={song.id}
              className={cn(
                "group flex cursor-pointer items-center gap-3 p-2 transition-colors",
                isCurrent ? "bg-shade" : "hover:bg-shade",
              )}
              onClick={toggle}
            >
              <div className="w-6 text-center font-heading text-lg font-bold text-meta/60">{i + 1}</div>
              <button
                className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-topbar"
                aria-label={isCurrent ? `Pause ${song.title}` : `Play ${song.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle();
                }}
              >
                {isCurrent ? (
                  <Pause className="w-5 h-5 text-white" fill="white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={cn("truncate text-sm font-bold", isCurrent ? "text-accent" : "text-text group-hover:text-accent")}>
                  {song.title}
                </p>
                <p className="truncate text-xs text-meta">{song.artist}</p>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">{song.duration}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

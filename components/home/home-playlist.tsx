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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <h2 className="bg-accent text-white px-5 py-3 font-bold text-lg">Playlist</h2>
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
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
                "flex items-center gap-4 p-2 -m-2 rounded transition group cursor-pointer",
                isCurrent ? "bg-gray-100" : "hover:bg-gray-100",
              )}
              onClick={toggle}
            >
              <div className="text-lg font-black text-gray-300 w-6 text-center">{i + 1}</div>
              <button
                className="relative w-10 h-10 bg-accent rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors"
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
                <p className="font-semibold text-sm truncate">{song.title}</p>
                <p className="text-xs text-gray-600 truncate">{song.artist}</p>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">{song.duration}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

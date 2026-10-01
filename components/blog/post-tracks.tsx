"use client";

import { Download, Pause, Play } from "lucide-react";
import { useAudioPlayer } from "@/store/use-audio-player";
import { formatTime } from "@/lib/format";
import type { PostTrack } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** "Listen Now" player list for the tracks attached to a post. */
export function PostTracks({ tracks }: { tracks: PostTrack[] }) {
  const playTrack = useAudioPlayer((s) => s.playTrack);
  const togglePlay = useAudioPlayer((s) => s.togglePlay);
  const currentTrack = useAudioPlayer((s) => s.currentTrack);
  const isPlaying = useAudioPlayer((s) => s.isPlaying);
  const currentTime = useAudioPlayer((s) => s.currentTime);

  if (tracks.length === 0) return null;

  const play = (track: PostTrack) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack({
        id: track.id,
        title: track.title,
        artist: track.artist_name ?? "",
        cover: track.image ?? "",
        audioUrl: track.mp3_file,
      });
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-black">Listen Now</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {tracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.id}
              className="px-6 py-5 cursor-pointer transition-all bg-black"
              onClick={() => play(track)}
            >
              <div className="flex items-center gap-5 text-white">
                <button
                  className="flex-shrink-0 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                  aria-label={isCurrentPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    play(track);
                  }}
                >
                  {isCurrentPlaying ? (
                    <Pause className="w-6 h-6 text-black fill-black" />
                  ) : (
                    <Play className="w-6 h-6 text-black fill-black ml-1" />
                  )}
                </button>

                <div className="flex-1 relative h-16" aria-hidden="true">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-white/20" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-full flex items-end gap-px">
                      {Array.from({ length: 80 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-red-500 transition-all duration-1000 ease-in-out"
                          style={{
                            height: isCurrentPlaying
                              ? `${Math.sin((currentTime + idx * 0.3) * 2) * 40 + 60}%`
                              : "50%",
                            opacity: isCurrentPlaying ? 1 : 0.4,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="text-white/70">{formatTime(isCurrent ? currentTime : 0)}</span>
                  <span className="text-white/50">/</span>
                  <span className="text-white/90">{track.duration || "4:04"}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-lg">{track.title}</p>
                  <p className="text-white/70">{track.artist_name}</p>
                </div>

                {track.is_downloadable && track.download_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white cursor-pointer"
                    asChild
                  >
                    <a
                      href={track.download_url}
                      download
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

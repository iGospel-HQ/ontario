"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Download, Pause, Play } from "lucide-react";
import { useAudioPlayer } from "@/store/use-audio-player";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SermonItem } from "@/types/api";

/** "00:21:40" -> "21:40", "01:05:00" -> "1:05:00". */
function shortLength(duration: string | null) {
  if (!duration) return null;
  const [h = 0, m = 0, s = 0] = duration.split(":").map(Number);
  const total = h * 3600 + m * 60 + s;
  return total ? formatTime(total) : null;
}

/**
 * Sermons as a list (minister, series and playlist pages). One audio element
 * plays the chosen sermon, so only one plays at a time; starting one pauses
 * any song in the music player. Titles link to the sermon's post.
 */
export function SermonList({
  sermons,
  showMinister = true,
  numbered = false,
  empty = "No sermons here yet.",
}: {
  sermons: SermonItem[];
  showMinister?: boolean;
  numbered?: boolean;
  empty?: string;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const songPlaying = useAudioPlayer((s) => s.isPlaying);
  const toggleSong = useAudioPlayer((s) => s.togglePlay);

  // A song started from the music player stops the sermon.
  useEffect(() => {
    if (songPlaying && playing) audio.current?.pause();
  }, [songPlaying, playing]);

  const toggle = (sermon: SermonItem) => {
    const el = audio.current;
    if (!el || !sermon.mp3_file) return;
    if (current === sermon.id) {
      if (el.paused) el.play().catch(() => {});
      else el.pause();
      return;
    }
    if (songPlaying) toggleSong();
    el.src = sermon.mp3_file;
    setCurrent(sermon.id);
    el.play().catch(() => {});
  };

  const playable = sermons.filter((s) => s.mp3_file);
  if (playable.length === 0) return <p className="py-10 text-center text-muted-foreground">{empty}</p>;
  const now = playable.find((s) => s.id === current);

  return (
    <div>
      <ol className="divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-white">
        {playable.map((sermon, i) => {
          const active = sermon.id === current;
          const length = shortLength(sermon.duration);
          const title = sermon.post_slug ? (
            <Link href={`/blog/${sermon.post_slug}`} className="hover:text-accent">
              {sermon.title}
            </Link>
          ) : (
            sermon.title
          );
          return (
            <li key={sermon.id} className={cn("flex items-center gap-3 p-3 sm:gap-4 sm:p-4", active && "bg-shade")}>
              {numbered && (
                <span className="hidden w-5 shrink-0 text-center text-sm font-bold text-meta sm:block">
                  {sermon.sermon_number ?? i + 1}
                </span>
              )}
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-shade sm:h-16 sm:w-16">
                {sermon.image || sermon.minister_image ? (
                  <Image
                    src={(sermon.image || sermon.minister_image) as string}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <BookOpen className="absolute inset-0 m-auto h-6 w-6 text-accent" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={cn("line-clamp-2 text-[15px] font-semibold leading-snug", active ? "text-accent" : "text-text")}>
                  {title}
                </h3>
                <p className="mt-0.5 truncate text-xs text-meta sm:text-[13px]">
                  {showMinister && (
                    <Link href={`/sermons/ministers/${sermon.minister_slug}`} className="hover:text-accent">
                      {sermon.minister_name}
                    </Link>
                  )}
                  {showMinister && (sermon.series_title || length) && " · "}
                  {sermon.series_title && <span>{sermon.series_title}</span>}
                  {sermon.series_title && length && " · "}
                  {length}
                </p>
              </div>
              {sermon.download_url && (
                <a
                  href={sermon.download_url}
                  download
                  aria-label={`Download ${sermon.title}`}
                  className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-meta hover:bg-shade hover:text-accent sm:inline-flex"
                >
                  <Download className="h-5 w-5" aria-hidden="true" />
                </a>
              )}
              <button
                type="button"
                onClick={() => toggle(sermon)}
                aria-label={`${active && playing ? "Pause" : "Play"} ${sermon.title}`}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-sm hover:opacity-90"
              >
                {active && playing ? (
                  <Pause className="h-5 w-5 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Seek bar and time for the sermon that's playing. */}
      <div className={cn("sticky bottom-[calc(var(--tabbar-h)+var(--miniplayer-h)+0.5rem)] z-30 mt-4", !now && "hidden")}>
        <div className="rounded-xl border border-rule bg-white p-3 shadow-lg">
          {now && <p className="mb-1 truncate px-1 text-sm font-semibold text-text">{now.title}</p>}
          <audio
            ref={audio}
            controls
            preload="none"
            className="h-10 w-full"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
        </div>
      </div>
    </div>
  );
}

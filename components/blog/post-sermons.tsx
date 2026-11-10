"use client";

import Image from "next/image";
import { BookOpen, Download, Mic2 } from "lucide-react";
import { useAudioPlayer } from "@/store/use-audio-player";
import type { PostSermon } from "@/types/api";

/** "00:21:40" -> "21 min", "01:05:00" -> "1 hr 5 min". */
function sermonLength(duration: string | null) {
  if (!duration) return null;
  const [h = 0, m = 0, s = 0] = duration.split(":").map(Number);
  const minutes = Math.round(h * 60 + m + s / 60);
  if (!minutes) return null;
  return minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`;
}

/**
 * "Listen to the Sermon" section of a post: one card per attached sermon with
 * its own audio player (sermons are long, so they don't go through the music
 * mini player) and a download button. Starting a sermon pauses any song.
 */
export function PostSermons({ sermons }: { sermons: PostSermon[] }) {
  const playable = sermons.filter((s) => s.mp3_file);
  if (playable.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="widget-title">
        <span>Listen to the Sermon</span>
      </h2>
      <div className="space-y-6">
        {playable.map((sermon) => (
          <SermonCard key={sermon.id} sermon={sermon} />
        ))}
      </div>
    </section>
  );
}

function SermonCard({ sermon }: { sermon: PostSermon }) {
  const songPlaying = useAudioPlayer((s) => s.isPlaying);
  const toggleSong = useAudioPlayer((s) => s.togglePlay);
  const length = sermonLength(sermon.duration);
  const cover = sermon.image ?? sermon.minister_image;

  return (
    <article className="overflow-hidden rounded-xl border border-rule bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        {cover ? (
          <Image
            src={cover}
            alt=""
            width={0}
            height={0}
            sizes="(min-width: 640px) 220px, 100vw"
            className="h-auto w-full shrink-0 rounded-lg object-cover sm:w-56"
          />
        ) : (
          <div className="flex aspect-video w-full shrink-0 items-center justify-center rounded-lg bg-shade sm:w-56">
            <BookOpen className="h-10 w-10 text-accent" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Sermon</p>
          <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-text">{sermon.title}</h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm font-semibold text-text/70">
            <span className="inline-flex items-center gap-1">
              <Mic2 className="h-3.5 w-3.5" aria-hidden="true" />
              {sermon.minister_name}
            </span>
            {sermon.series_title && <span>· {sermon.series_title}</span>}
            {length && <span>· {length}</span>}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-rule bg-shade px-4 py-4 sm:flex-row sm:items-center sm:px-5">
        <audio
          controls
          preload="none"
          src={sermon.mp3_file ?? undefined}
          className="h-12 w-full min-w-0 sm:flex-1"
          aria-label={`Play the sermon: ${sermon.title}`}
          onPlay={() => songPlaying && toggleSong()}
        />
        {sermon.download_url && (
          <a
            href={sermon.download_url}
            download
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download
          </a>
        )}
      </div>
    </article>
  );
}

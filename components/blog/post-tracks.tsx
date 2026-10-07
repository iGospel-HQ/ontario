"use client";

import Image from "next/image";
import { Download, Music2, Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { useAudioPlayer } from "@/store/use-audio-player";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PostAlbum, PostTrack } from "@/types/api";

const SKIP_SECONDS = 10;

/** Where the download button points: the signed attachment link, else the file itself. */
function downloadHref(track: PostTrack) {
  return track.is_downloadable ? track.download_url || track.mp3_file || null : null;
}

/** An album shown as one player card; tracks without art use the album cover. */
interface Collection {
  kind: "Album";
  title: string;
}

/**
 * "Listen Now" section of a post: one player card for the tracks attached
 * directly, and one per attached album (its full tracklist). Drives the
 * global audio player.
 */
export function PostTracks({ tracks, albums = [] }: { tracks: PostTrack[]; albums?: PostAlbum[] }) {
  // Older APIs send albums without `tracks`; treat that as "no album tracks"
  // rather than crashing the post page.
  const albumTracks = (album: PostAlbum) => album.tracks ?? [];

  // A track attached directly and via one of the albums is shown with the album.
  const albumTrackIds = new Set(albums.flatMap((album) => albumTracks(album).map((t) => t.id)));
  const singles = tracks.filter((t) => !albumTrackIds.has(t.id));
  const albumGroups = albums
    .filter((album) => albumTracks(album).length > 0)
    .map((album) => ({
      album,
      tracks: albumTracks(album).map((t) => ({
        ...t,
        image: t.image ?? album.cover_image,
        artist_name: t.artist_name ?? album.artist_name,
      })),
    }));

  if (singles.length === 0 && albumGroups.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="widget-title">
        <span>Listen Now</span>
      </h2>
      <div className="space-y-6">
        {singles.length > 0 && <TrackCard tracks={singles} />}
        {albumGroups.map(({ album, tracks: albumTracks }) => (
          <TrackCard key={album.id} tracks={albumTracks} collection={{ kind: "Album", title: album.title }} />
        ))}
      </div>
    </section>
  );
}

/** Player card: featured (current or first) track with controls, plus a tracklist when there are several. */
function TrackCard({ tracks, collection }: { tracks: PostTrack[]; collection?: Collection }) {
  const playTrack = useAudioPlayer((s) => s.playTrack);
  const togglePlay = useAudioPlayer((s) => s.togglePlay);
  const seek = useAudioPlayer((s) => s.seek);
  const currentTrack = useAudioPlayer((s) => s.currentTrack);
  const isPlaying = useAudioPlayer((s) => s.isPlaying);
  const currentTime = useAudioPlayer((s) => s.currentTime);
  const duration = useAudioPlayer((s) => s.duration);

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

  // The card shows whichever of this post's tracks is loaded, else the first.
  const featured = tracks.find((t) => t.id === currentTrack?.id) ?? tracks[0];
  const isCurrent = currentTrack?.id === featured.id;
  const isFeaturedPlaying = isCurrent && isPlaying;
  const canSeek = isCurrent && Number.isFinite(duration) && duration > 0;
  const position = canSeek ? currentTime : 0;
  const progress = canSeek ? (position / duration) * 100 : 0;
  const totalLabel = canSeek ? formatTime(duration) : featured.duration || "--:--";
  const featuredDownload = downloadHref(featured);

  const countLabel = tracks.length > 1 ? `${tracks.length} tracks` : "1 track";
  const idleLabel = collection
    ? `${collection.kind} · ${collection.title} · ${countLabel}`
    : tracks.length > 1
      ? countLabel
      : "Single";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-xl">
      {/* Blurred cover as backdrop */}
      {featured.image && (
        <Image
          src={featured.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="scale-125 object-cover opacity-40 blur-3xl"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/90" />

      <div className="relative flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-6">
        <Cover track={featured} playing={isFeaturedPlaying} className="mx-auto size-40 sm:mx-0 sm:size-36" />

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {isCurrent ? (isPlaying ? "Now playing" : "Paused") : idleLabel}
          </p>
          <h3 className="mt-1 truncate text-xl font-bold sm:text-2xl">{featured.title}</h3>
          {featured.artist_name && (
            <p className="truncate text-sm text-white/70">{featured.artist_name}</p>
          )}

          {/* Seek bar */}
          <div className="mt-5">
            <input
              type="range"
              min={0}
              max={canSeek ? duration : 100}
              step={1}
              value={position}
              disabled={!canSeek}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={`Seek ${featured.title}`}
              className="seek-range"
              style={{ "--progress": `${progress}%` } as React.CSSProperties}
            />
            <div className="mt-1.5 flex justify-between text-xs tabular-nums text-white/60">
              <span>{formatTime(position)}</span>
              <span>{totalLabel}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => seek(currentTime - SKIP_SECONDS)}
              disabled={!canSeek}
              aria-label={`Back ${SKIP_SECONDS} seconds`}
              className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <SkipIcon direction="back" />
            </button>

            <button
              type="button"
              onClick={() => play(featured)}
              aria-label={isFeaturedPlaying ? `Pause ${featured.title}` : `Play ${featured.title}`}
              className="flex size-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition hover:scale-105 active:scale-95"
            >
              {isFeaturedPlaying ? (
                <Pause className="size-6 fill-current" />
              ) : (
                <Play className="ml-0.5 size-6 fill-current" />
              )}
            </button>

            <button
              type="button"
              onClick={() => seek(currentTime + SKIP_SECONDS)}
              disabled={!canSeek}
              aria-label={`Forward ${SKIP_SECONDS} seconds`}
              className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <SkipIcon direction="forward" />
            </button>

            {featuredDownload && (
              <a
                href={featuredDownload}
                download
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                <Download className="size-4" />
                Download
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tracklist */}
      {tracks.length > 1 && (
        <ol className="relative border-t border-white/10 px-2 py-2 sm:px-3">
          {tracks.map((track, idx) => {
            const active = currentTrack?.id === track.id;
            const rowPlaying = active && isPlaying;
            const href = downloadHref(track);
            return (
              <li key={track.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => play(track)}
                  aria-label={rowPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  className={cn(
                    "group flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/10",
                    active && "bg-white/5",
                  )}
                >
                  <span className="flex w-6 justify-center text-sm tabular-nums text-white/50">
                    {rowPlaying ? (
                      <Equalizer />
                    ) : (
                      <>
                        <span className="group-hover:hidden">{idx + 1}</span>
                        <Play className="hidden size-4 fill-current text-white group-hover:block" />
                      </>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm font-medium", active ? "text-accent" : "text-white")}>
                      {track.title}
                    </span>
                    {track.artist_name && (
                      <span className="block truncate text-xs text-white/50">{track.artist_name}</span>
                    )}
                  </span>
                  {track.duration && (
                    <span className="text-xs tabular-nums text-white/50">{track.duration}</span>
                  )}
                </button>
                {href && (
                  <a
                    href={href}
                    download
                    aria-label={`Download ${track.title}`}
                    title="Download"
                    className="shrink-0 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    <Download className="size-4" />
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function Cover({ track, playing, className }: { track: PostTrack; playing: boolean; className?: string }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-xl bg-white/10 shadow-2xl", className)}>
      {track.image ? (
        <Image src={track.image} alt={track.title} fill sizes="160px" className="object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Music2 className="size-12 text-white/40" />
        </div>
      )}
      {playing && (
        <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1.5 backdrop-blur">
          <Equalizer />
        </div>
      )}
    </div>
  );
}

/** Circular arrow with the skip length inside, like podcast players. */
function SkipIcon({ direction }: { direction: "back" | "forward" }) {
  const Arrow = direction === "back" ? RotateCcw : RotateCw;
  return (
    <span className="relative flex size-9 items-center justify-center">
      <Arrow className="size-9" strokeWidth={1.5} />
      <span className="absolute pt-0.5 text-[10px] font-bold tabular-nums">{SKIP_SECONDS}</span>
    </span>
  );
}

/** Animated bars shown on the track that is playing. */
function Equalizer() {
  return (
    <span className="eq" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

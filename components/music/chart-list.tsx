import Image from "next/image";
import Link from "next/link";
import { MapPin, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPlayButton } from "@/components/music/track-play-button";
import type { ChartCity, ChartTrack } from "@/types/api";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/** "Everywhere · Lagos · Abuja · ..." links between the site-wide and city charts. */
export function CityChips({ cities, active }: { cities: ChartCity[]; active?: string }) {
  if (cities.length === 0) return null;
  const chip = (selected: boolean) =>
    cn(
      "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      selected
        ? "border-accent bg-accent text-white"
        : "border-border bg-background text-foreground hover:border-accent hover:text-accent",
    );
  return (
    <nav aria-label="Charts by city" className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      <ul className="flex gap-2 md:flex-wrap">
        <li>
          <Link href="/charts" className={chip(!active)} aria-current={!active ? "page" : undefined}>
            Everywhere
          </Link>
        </li>
        {cities.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/charts/${city.slug}`}
              className={chip(active === city.slug)}
              aria-current={active === city.slug ? "page" : undefined}
            >
              <MapPin className="size-3.5" aria-hidden="true" />
              {city.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Ranked tracks with cover, plays in the period and a play button. */
export function ChartList({ tracks, periodLabel }: { tracks: ChartTrack[]; periodLabel: string }) {
  return (
    <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
      {tracks.map((track) => {
        const title = track.post_slug ? (
          <Link href={`/blog/${track.post_slug}`} className="hover:text-accent">
            {track.title}
          </Link>
        ) : (
          track.title
        );
        return (
          <li key={track.id} className="group flex items-center gap-3 bg-background px-3 py-3 sm:gap-4 sm:px-4">
            <span
              className={cn(
                "w-7 shrink-0 text-center text-lg font-bold tabular-nums",
                track.rank <= 3 ? "text-accent" : "text-muted-foreground",
              )}
            >
              {track.rank}
            </span>
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-secondary sm:size-14">
              {track.image ? (
                <Image src={track.image} alt="" fill sizes="56px" className="object-cover" />
              ) : (
                <Music2 className="absolute inset-0 m-auto size-6 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{title}</h3>
              <p className="truncate text-sm text-muted-foreground">{track.artist_name}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-semibold tabular-nums">{compact.format(track.plays)}</p>
              <p className="text-xs text-muted-foreground">
                <span className="sm:hidden">plays</span>
                <span className="hidden sm:inline">{periodLabel}</span>
              </p>
            </div>
            {track.mp3_file && (
              <TrackPlayButton
                track={track}
                className="size-10 shrink-0 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white"
                iconClassName="size-5 fill-current"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

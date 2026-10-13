import Link from "next/link";
import { FileBarChart, TrendingUp } from "lucide-react";
import { getChart, getChartCities, getLatestTracks, getPopularTracks } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { ChartList, CityChips } from "@/components/music/chart-list";
import type { ChartTrack, MusicTrack } from "@/types/api";

export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Top Gospel Songs in Nigeria This Month",
  description:
    "The most played gospel songs on iGospel this month, in Nigeria and city by city: Lagos, Abuja, Port Harcourt and more.",
  path: "/charts",
});

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/** All-time most played, shaped like chart rows (used until this month has plays). */
function allTime(tracks: MusicTrack[]): ChartTrack[] {
  return tracks.slice(0, 20).map((t, i) => ({
    rank: i + 1,
    plays: t.plays_count,
    id: t.id,
    title: t.title,
    slug: t.slug,
    artist_name: t.artist_name,
    artist_slug: t.artist_slug,
    image: t.image || t.album_cover,
    mp3_file: t.mp3_file,
    duration: t.duration,
    post_slug: null,
  }));
}

export default async function ChartsPage() {
  const [chart, cities, popular, latest] = await Promise.all([
    getChart(),
    getChartCities(),
    getPopularTracks(),
    getLatestTracks(),
  ]);
  const monthly = chart?.tracks ?? [];
  const fallback = monthly.length === 0;
  const rows = fallback ? allTime(popular.filter((t) => t.plays_count > 0)) : monthly;
  const trending = latest.slice(0, 6);
  const maxPlays = Math.max(1, ...trending.map((t) => t.plays_count));

  return (
    <>
      <PageHeader title="Charts" description="The most played gospel songs on iGospel, everywhere and city by city" />
      <div className="px-4 md:px-6 py-10">
        <FadeIn as="section" delay={0.1} className="mb-16">
          <CityChips cities={cities} />
          <Link
            href="/charts/report"
            className="mt-6 flex items-center gap-4 rounded-2xl bg-[#0c0c0c] p-5 text-white transition hover:bg-black"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
              <FileBarChart className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Monthly report: Top Gospel Songs in Nigeria</span>
              <span className="block text-sm text-white/60">The month&apos;s top 20, top songs by city, most shared and downloaded</span>
            </span>
            <span className="text-sm font-semibold text-accent">View →</span>
          </Link>
          <h2 className="mb-6 mt-6 text-2xl font-bold sm:text-3xl">
            {fallback ? "Most played of all time" : "Top 20 this month"}
          </h2>
          {rows.length === 0 ? (
            <p className="text-muted-foreground">No chart data yet.</p>
          ) : (
            <ChartList tracks={rows} periodLabel={fallback ? "plays" : "plays this month"} />
          )}
        </FadeIn>

        {/* New releases */}
        <FadeIn as="section" y={40} delay={0.3} className="border-t border-border pt-16">
          <h2 className="text-3xl font-bold mb-8">New Releases</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trending.map((track, idx) => {
              const share = Math.round((track.plays_count / maxPlays) * 100);
              return (
                <FadeIn
                  key={track.id}
                  y={0}
                  delay={0.3 + idx * 0.1}
                  className="p-6 bg-gradient-to-br from-accent/10 to-transparent rounded-lg border border-accent/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">{track.artist_name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-accent">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-semibold">{compact.format(track.plays_count)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </>
  );
}

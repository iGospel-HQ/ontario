import { TrendingUp } from "lucide-react";
import { getLatestTracks, getPopularTracks } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { TrackPlayButton } from "@/components/music/track-play-button";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Charts",
  description: "The hottest tracks trending right now",
  path: "/charts",
});

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export default async function ChartsPage() {
  const [popular, latest] = await Promise.all([getPopularTracks(), getLatestTracks()]);
  const top10 = popular.slice(0, 10);
  const trending = latest.slice(0, 5);
  const maxPlays = Math.max(1, ...popular.map((t) => t.plays_count), ...trending.map((t) => t.plays_count));

  return (
    <>
      <PageHeader title="Charts" description="The hottest tracks trending right now" />
      <div className="px-4 md:px-6 py-10">
        {/* Top 10 by plays */}
        <FadeIn as="section" delay={0.1} className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Top 10</h2>

          {top10.length === 0 && <p className="text-muted-foreground">No chart data yet.</p>}
          <ol className="space-y-4">
            {top10.map((track, idx) => (
              <li key={track.id}>
                <FadeIn
                  y={0}
                  delay={0.1 + idx * 0.1}
                  className="group flex items-center gap-6 p-6 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
                    <span className="text-2xl font-bold text-accent">#{idx + 1}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-accent">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.artist_name}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{compact.format(track.plays_count)}</p>
                    <p className="text-xs text-muted-foreground">plays</p>
                  </div>

                  <TrackPlayButton
                    track={track}
                    className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-accent"
                    iconClassName="h-6 w-6 fill-accent"
                  />
                </FadeIn>
              </li>
            ))}
          </ol>
        </FadeIn>

        {/* New releases */}
        <FadeIn as="section" y={40} delay={0.3} className="border-t border-border pt-16">
          <h2 className="text-3xl font-bold mb-8">Trending Now</h2>

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

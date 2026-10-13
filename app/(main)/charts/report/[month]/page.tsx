import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Download, Headphones, MapPin, Music2, Share2, Users } from "lucide-react";
import { notFoundMetadata } from "@/components/shared/not-found-content";
import { getChartReport } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ChartList } from "@/components/music/chart-list";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHeader } from "@/components/shared/page-header";
import { ShareButtons } from "@/components/shared/share-buttons";
import type { ChartReport, ChartTrack } from "@/types/api";

type Props = { params: Promise<{ month: string }> };

export const revalidate = 3600;

/** Reports are generated on first request, then refreshed hourly (ISR). */
export async function generateStaticParams() {
  return [];
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function title(report: ChartReport) {
  return `Top Gospel Songs in Nigeria: ${report.label}`;
}

function summary(report: ChartReport) {
  const top = report.top_tracks.slice(0, 3).map((t) => `${t.title} by ${t.artist_name}`);
  const lead = top.length ? `${top.join(", ")} lead` : "The most played songs lead";
  return `${lead} the iGospel chart for ${report.label}: the most played gospel songs in Nigeria, the top songs in Lagos, Abuja and other cities, and the most shared and downloaded songs.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month } = await params;
  const report = await getChartReport(month);
  if (!report) return notFoundMetadata;
  return pageMetadata({
    title: title(report),
    description: summary(report),
    path: `/charts/report/${report.month}`,
    image: { url: `/charts/report/${report.month}/og`, width: 1200, height: 630 },
  });
}

const monthLabel = (month: string) =>
  new Date(`${month}-01T12:00:00`).toLocaleDateString("en", { month: "short", year: "numeric" });

export default async function ChartReportPage({ params }: Props) {
  const { month } = await params;
  const report = await getChartReport(month);
  if (!report) notFound();

  const url = absoluteUrl(`/charts/report/${report.month}`);
  const t = report.totals;
  const stats = [
    { icon: Headphones, label: "Plays", value: t.plays },
    { icon: Users, label: "Listeners", value: t.listeners },
    { icon: Music2, label: "Songs played", value: t.songs },
    { icon: MapPin, label: "Cities", value: t.cities },
    { icon: Download, label: "Downloads", value: t.downloads },
    { icon: Share2, label: "Song videos shared", value: t.shares },
  ].filter((s) => s.value > 0);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: title(report),
          url,
          itemListElement: report.top_tracks.slice(0, 10).map((track) => ({
            "@type": "ListItem",
            position: track.rank,
            name: `${track.title} - ${track.artist_name}`,
            ...(track.post_slug ? { url: absoluteUrl(`/blog/${track.post_slug}`) } : {}),
          })),
        }}
      />
      <PageHeader
        title={title(report)}
        description={
          report.is_current
            ? `${report.label} so far, updated every hour from plays on iGospel`
            : `The most played gospel songs on iGospel in ${report.label}`
        }
        crumbs={[{ name: "Charts", href: "/charts" }]}
      />

      <div className="space-y-12 px-4 py-10 md:px-6">
        {/* Other months */}
        {report.months.length > 1 && (
          <nav aria-label="Other months" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <ul className="flex gap-2 md:flex-wrap">
              {report.months.map((m) => (
                <li key={m}>
                  <Link
                    href={`/charts/report/${m}`}
                    aria-current={m === report.month ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      m === report.month
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-background hover:border-accent hover:text-accent",
                    )}
                  >
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {monthLabel(m)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Headline numbers */}
        <section aria-label="This month in numbers" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-border bg-background p-4">
              <Icon className="size-5 text-accent" aria-hidden="true" />
              <p className="mt-3 text-2xl font-bold tabular-nums">{compact.format(value)}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>

        {/* Top 20 */}
        <section>
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Top {report.top_tracks.length} in Nigeria</h2>
          <ChartList tracks={report.top_tracks} periodLabel={`plays in ${report.label}`} />
        </section>

        {/* By city */}
        {report.cities.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Top songs by city</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {report.cities.map((city) => (
                <article key={city.slug} className="rounded-2xl border border-border bg-background p-5">
                  <header className="mb-4 flex items-baseline justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                      <MapPin className="size-4 text-accent" aria-hidden="true" />
                      {city.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">{compact.format(city.plays)} plays</span>
                  </header>
                  <CompactList tracks={city.tracks} unit="plays" />
                  <Link href={`/charts/${city.slug}`} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
                    Live {city.name} chart →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Most shared / downloaded */}
        {(report.most_shared.length > 0 || report.most_downloaded.length > 0) && (
          <section className="grid gap-4 md:grid-cols-2">
            {report.most_shared.length > 0 && (
              <article className="rounded-2xl border border-border bg-background p-5">
                <h2 className="mb-1 text-xl font-bold">Most shared</h2>
                <p className="mb-4 text-xs text-muted-foreground">Song videos shared to WhatsApp Status, Instagram, TikTok…</p>
                <CompactList tracks={report.most_shared} unit="shares" />
              </article>
            )}
            {report.most_downloaded.length > 0 && (
              <article className="rounded-2xl border border-border bg-background p-5">
                <h2 className="mb-4 text-xl font-bold">Most downloaded</h2>
                <CompactList tracks={report.most_downloaded} unit="downloads" />
              </article>
            )}
          </section>
        )}

        <ShareButtons url={url} title={title(report)} heading="Share this chart" className="border-y border-rule py-6" />

        <p className="text-sm text-muted-foreground">
          How it&apos;s counted: a play is 30 seconds or more of listening on iGospel. Cities come from listeners&apos;
          approximate location. Bloggers and journalists are welcome to quote this chart with a link to this page.
        </p>
      </div>
    </>
  );
}

/** Small ranked list: cover, title, artist, count. */
function CompactList({ tracks, unit }: { tracks: ChartTrack[]; unit: string }) {
  return (
    <ol className="space-y-3">
      {tracks.map((track) => {
        const name = track.post_slug ? (
          <Link href={`/blog/${track.post_slug}`} className="hover:text-accent">
            {track.title}
          </Link>
        ) : (
          track.title
        );
        return (
          <li key={track.id} className="flex items-center gap-3">
            <span className={cn("w-5 text-center text-sm font-bold", track.rank === 1 ? "text-accent" : "text-muted-foreground")}>
              {track.rank}
            </span>
            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
              {track.image && <Image src={track.image} alt="" fill sizes="40px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{track.artist_name}</p>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {compact.format(track.plays)} {unit}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

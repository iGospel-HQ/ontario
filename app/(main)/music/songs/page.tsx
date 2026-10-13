import type { Metadata } from "next";
import Link from "next/link";
import { Flame, Search, Sparkles } from "lucide-react";
import { getArtists, getChart, getMusicPosts, POSTS_PAGE_SIZE } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { PagePagination, parsePage } from "@/components/shared/page-pagination";
import { NewestList, SectionHeading, fromSummary } from "@/components/home/home-magazine";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return listingMetadata(
    {
      title: "Songs",
      description: "The latest gospel songs on iGospel: listen, download and share.",
      path: "/music/songs",
    },
    await searchParams,
  );
}

/**
 * Songs: the music posts, newest first (CeeNaija-style list), with search,
 * this month's trending songs and the top artists beside them.
 */
export default async function SongsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const query = typeof params.q === "string" ? params.q.trim() : undefined;

  const [data, chart, artists] = await Promise.all([
    getMusicPosts({ page, q: query }),
    getChart().catch(() => null),
    getArtists({ page: 1 }).catch(() => null),
  ]);
  const posts = data.results.map(fromSummary);
  const allSongs = new Set(posts.map((p) => p.slug)); // every post here has music: play icon on all
  const totalPages = Math.ceil(data.count / POSTS_PAGE_SIZE);
  const trending = (chart?.tracks ?? []).filter((t) => t.post_slug).slice(0, 6);
  const topArtists = [...(artists?.results ?? [])].sort((a, b) => b.track_count - a.track_count).slice(0, 16);

  return (
    <>
      <PageHeader title="Songs" description="The latest gospel songs: listen, download and share" crumbs={[{ name: "Music", href: "/music" }]} />

      <div className="grid grid-cols-1 gap-10 px-4 py-6 sm:py-10 md:px-6 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2" aria-label="Songs">
          {/* Search (on phones above the list; on larger screens it's in the sidebar) */}
          <SongSearch query={query} className="mb-6 lg:hidden" />

          <SectionHeading title={query ? `Results for “${query}”` : "Latest songs"} />
          {posts.length === 0 ? (
            <p className="py-16 text-center text-meta">{query ? "No songs match your search." : "No songs yet."}</p>
          ) : (
            <NewestList stories={posts} musicSlugs={allSongs} />
          )}
          <PagePagination basePath="/music/songs" params={{ q: query }} page={page} totalPages={totalPages} />
        </section>

        <aside className="min-w-0 space-y-8">
          <SongSearch query={query} className="hidden lg:flex" />

          {trending.length > 0 && (
            <section>
              <h2 className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[#0c0c0c] px-3 py-1.5 text-sm font-bold text-white">
                Trending Gospel Songs <Flame className="size-4 text-accent" aria-hidden="true" />
              </h2>
              <ol className="divide-y divide-rule">
                {trending.map((t) => (
                  <li key={t.id}>
                    <Link href={`/blog/${t.post_slug}`} className="block py-3 font-semibold leading-snug hover:text-accent">
                      {t.artist_name} – {t.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {topArtists.length > 0 && (
            <section>
              <h2 className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[#0c0c0c] px-3 py-1.5 text-sm font-bold text-white">
                Top Picks <Sparkles className="size-4 text-accent" aria-hidden="true" />
              </h2>
              <ul className="flex flex-wrap gap-2">
                {topArtists.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/music/artists/${a.slug}`}
                      className="inline-block rounded-full bg-shade px-3.5 py-1.5 text-sm font-medium text-text transition hover:bg-accent hover:text-white"
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

/** A plain search form for this page (keeps the user on /music/songs). */
function SongSearch({ query, className }: { query?: string; className?: string }) {
  return (
    <form action="/music/songs" role="search" className={`flex gap-2 ${className ?? ""}`}>
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search songs</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-meta" aria-hidden="true" />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Find gospel songs, artists…"
          className="h-11 w-full rounded-lg border border-rule bg-white pl-9 pr-3 text-sm outline-none focus:border-accent"
        />
      </label>
      <button type="submit" className="h-11 shrink-0 rounded-lg bg-[#0c0c0c] px-4 text-sm font-semibold text-white hover:bg-accent">
        Search
      </button>
    </form>
  );
}

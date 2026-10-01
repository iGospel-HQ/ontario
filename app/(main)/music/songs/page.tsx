import type { Metadata } from "next";
import { getGenres, getTracks, POSTS_PAGE_SIZE } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/shared/fade-in";
import { PagePagination, parsePage } from "@/components/shared/page-pagination";
import { SearchInput } from "@/components/shared/search-input";
import { GenreSelect } from "@/components/music/genre-select";
import { TrackPlayButton } from "@/components/music/track-play-button";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const metadata = listingMetadata(
    {
      title: "Songs",
      description: "Stream unlimited music and discover new tracks",
      path: "/music/songs",
    },
    params,
  );
  // Genre-filtered views are variations of the main list; keep them out of the index.
  return params.genre ? { ...metadata, robots: { index: false, follow: true } } : metadata;
}

export default async function SongsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const query = typeof params.q === "string" ? params.q.trim() : undefined;
  const genre = typeof params.genre === "string" ? params.genre : undefined;

  const [data, genres] = await Promise.all([
    getTracks({ page, q: query, genre }),
    getGenres().catch(() => []),
  ]);
  const songs = data.results;
  const offset = (page - 1) * POSTS_PAGE_SIZE;

  return (
    <div className="min-h-screen px-4 md:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <FadeIn y={-20} className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Songs</h1>
          <p className="text-muted-foreground text-lg">Stream unlimited music</p>
        </FadeIn>

        <FadeIn y={0} delay={0.2} className="mb-12 flex gap-4">
          <SearchInput
            placeholder="Search songs..."
            showIcon={false}
            className="flex-1"
            inputClassName="bg-secondary"
          />
          <div className="w-48">
            <GenreSelect genres={genres} />
          </div>
        </FadeIn>

        <FadeIn y={0} delay={0.3} className="bg-secondary/50 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold w-12">#</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Artist</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Genre</th>
                  <th scope="col" className="px-6 py-4 text-center text-sm font-semibold">Play</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, idx) => (
                  <tr
                    key={song.id}
                    className="border-b border-border hover:bg-secondary transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground">{offset + idx + 1}</td>
                    <td className="px-6 py-4 font-medium">{song.title}</td>
                    <td className="px-6 py-4 text-sm">{song.artist_name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {song.duration_display || song.duration}
                    </td>
                    <td className="px-6 py-4 text-sm">{song.genre_name}</td>
                    <td className="px-6 py-4 text-center">
                      <TrackPlayButton track={song} />
                    </td>
                  </tr>
                ))}
                {songs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No songs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </FadeIn>

        <PagePagination
          basePath="/music/songs"
          params={{ q: query, genre }}
          page={page}
          totalPages={Math.ceil(data.count / POSTS_PAGE_SIZE)}
        />
      </div>
    </div>
  );
}

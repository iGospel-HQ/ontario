import type { Metadata } from "next";
import { getPlaylists } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/shared/fade-in";
import { SearchInput } from "@/components/shared/search-input";
import { PlaylistCard } from "@/components/music/playlist-card";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return listingMetadata(
    {
      title: "Playlists",
      description: "Explore curated collections and create your own playlists",
      path: "/music/playlists",
    },
    await searchParams,
  );
}

export default async function PlaylistsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : undefined;
  const { results: playlists } = await getPlaylists({ q: query });

  return (
    <div className="min-h-screen px-4 md:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <FadeIn y={-20} className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Playlists</h1>
          <p className="text-muted-foreground text-lg">Explore curated collections</p>
        </FadeIn>

        <FadeIn y={0} delay={0.1} className="mb-12">
          <SearchInput
            placeholder="Search playlists..."
            showIcon={false}
            className="max-w-sm"
            inputClassName="bg-secondary"
          />
        </FadeIn>

        {playlists.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No playlists found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist, i) => (
              <FadeIn key={playlist.id} y={0} delay={i * 0.1}>
                <PlaylistCard playlist={playlist} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

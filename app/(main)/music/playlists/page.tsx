import type { Metadata } from "next";
import { getPlaylists } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
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
    <>
      <PageHeader title="Playlists" description="Explore curated collections" crumbs={[{ name: "Music", href: "/music" }]} />
      <div className="px-4 md:px-6 py-10">
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
    </>
  );
}

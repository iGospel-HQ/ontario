import type { ReactNode } from "react";
import Link from "next/link";
import { Disc3, FileText, Music, Search, Users } from "lucide-react";
import { searchAll } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/seo";
import { Input } from "@/components/ui/input";

export const metadata = pageMetadata({
  title: "Search",
  description: "Search songs, playlists, artists, and articles",
  path: "/search",
  noIndex: true,
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

type Result = { key: string; href: string; icon: ReactNode; name: string; description: string };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  let results: Result[] = [];
  let failed = false;
  if (query) {
    try {
      const found = await searchAll(query);
      results = [
        ...found.tracks.map((t) => ({
          key: `song-${t.id}`,
          href: `/music/songs?q=${encodeURIComponent(t.title)}`,
          icon: <Music className="h-4 w-4" />,
          name: t.title,
          description: `Song • ${t.artist_name}`,
        })),
        ...found.artists.map((a) => ({
          key: `artist-${a.id}`,
          href: `/music/artists/${a.slug}`,
          icon: <Users className="h-4 w-4" />,
          name: a.name,
          description: `Artist • ${a.track_count} tracks`,
        })),
        ...found.playlists.map((p) => ({
          key: `playlist-${p.id}`,
          href: `/music/playlists/${p.slug}`,
          icon: <Disc3 className="h-4 w-4" />,
          name: p.title,
          description: `Playlist • ${p.track_count} songs`,
        })),
        ...found.posts.map((p) => ({
          key: `post-${p.id}`,
          href: `/blog/${p.slug}`,
          icon: <FileText className="h-4 w-4" />,
          name: p.title,
          description: p.excerpt || "Article",
        })),
      ];
    } catch {
      failed = true;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="sr-only">{query ? `Search results for “${query}”` : "Search iGospel"}</h1>

        <form action="/search" role="search" className="flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <Input
              type="search"
              name="q"
              defaultValue={query}
              aria-label="Search for songs, artists, playlists, or articles"
              placeholder="Search for songs, artists, playlists, or articles..."
              className="pr-10"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-90"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        </form>

        {failed && (
          <div className="flex flex-1 items-center justify-center">
            <p>Something went wrong. Please try again.</p>
          </div>
        )}

        {query && !failed && results.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p>No results found for &ldquo;{query}&rdquo;.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent"
            >
              {item.icon}
              <div className="flex-1 space-y-1 min-w-0">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

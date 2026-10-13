import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getArtists } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { pageHref, parsePage } from "@/components/shared/page-pagination";
import { SearchInput } from "@/components/shared/search-input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return listingMetadata(
    {
      title: "Artists",
      description: "Discover talented creators and musicians on the platform",
      path: "/music/artists",
    },
    await searchParams,
  );
}

/** "1 album · 12 songs", "3 songs", or "Artist" when there's nothing yet. */
function artistLine(tracks: number, albums: number) {
  const parts = [];
  if (albums) parts.push(`${albums} ${albums === 1 ? "album" : "albums"}`);
  if (tracks) parts.push(`${tracks} ${tracks === 1 ? "song" : "songs"}`);
  return parts.join(" · ") || "Artist";
}

export default async function ArtistsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const query = typeof params.q === "string" ? params.q.trim() : undefined;
  const data = await getArtists({ page, q: query });
  const artists = data.results;
  const href = (p: number) => pageHref("/music/artists", { q: query }, p);

  return (
    <>
      <PageHeader title="Artists" description="Discover amazing creators, musicians, and performers." crumbs={[{ name: "Music", href: "/music" }]} />
      <div className="px-4 md:px-6 py-6 sm:py-10">
        <FadeIn y={0} className="mb-8 max-w-md sm:mb-10 [&_input]:h-11 [&_input]:rounded-full">
          <SearchInput placeholder="Search artists..." inputClassName="pl-12 border-black/10 bg-white shadow-sm" />
        </FadeIn>

        {artists.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No artists found.</p>
        ) : (
          // Music-app style grid: 3 across on phones, up to 6 on wide screens.
          <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-5 md:grid-cols-5 lg:grid-cols-6 lg:gap-y-8">
            {artists.map((artist, i) => (
              <FadeIn as="li" key={artist.id} y={10} delay={Math.min(i, 12) * 0.03} className="min-w-0">
                <Link href={`/music/artists/${artist.slug}`} className="group block text-center">
                  <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-shade shadow-sm ring-1 ring-black/5 transition group-hover:shadow-lg group-hover:ring-accent/40">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      fill
                      sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h2 className="mt-2.5 truncate text-[13px] font-semibold leading-tight text-text group-hover:text-accent sm:text-[15px]">
                    {artist.name}
                  </h2>
                  <p className="mt-0.5 truncate text-[11px] text-meta sm:text-xs">{artistLine(artist.track_count, artist.album_count)}</p>
                </Link>
              </FadeIn>
            ))}
          </ul>
        )}

        <div className="flex justify-center mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={data.previous ? href(page - 1) : undefined}
                  aria-disabled={!data.previous}
                  className={!data.previous ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={data.next ? href(page + 1) : undefined}
                  aria-disabled={!data.next}
                  className={!data.next ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
    </div>
    </>
  );
}

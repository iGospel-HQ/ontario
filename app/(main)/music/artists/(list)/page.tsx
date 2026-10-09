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
      <div className="px-4 md:px-6 py-10">
        <FadeIn y={0} className="mb-12 max-w-md">
          <SearchInput
            placeholder="Search artists..."
            showIcon={false}
            inputClassName="bg-secondary/50 backdrop-blur border border-border/40"
          />
        </FadeIn>

        {artists.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No artists found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {artists.map((artist, i) => (
              <FadeIn key={artist.id} y={15} delay={i * 0.08}>
                <Link href={`/music/artists/${artist.slug}`}>
                  <div className="group cursor-pointer text-center p-6 rounded-2xl border bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                    <div className="relative mb-5 overflow-hidden rounded-full w-44 h-44 mx-auto shadow-md">
                      <Image
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.name}
                        fill
                        sizes="176px"
                        className="object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h2 className="font-semibold text-xl group-hover:text-primary transition-colors line-clamp-1">
                      {artist.name}
                    </h2>

                    <div className="flex justify-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span>{artist.album_count} Albums</span>
                      <span>{artist.track_count} Tracks</span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
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

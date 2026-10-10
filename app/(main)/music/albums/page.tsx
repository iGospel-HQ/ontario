import type { Metadata } from "next";
import { getAlbumPosts, getHomepage } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { parsePage } from "@/components/shared/page-pagination";
import { PostsListing } from "@/components/blog/posts-listing";
import { SortSelect } from "@/components/blog/sort-select";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return listingMetadata(
    {
      title: "Gospel Albums",
      description:
        "Listen to and download full gospel albums from Nigerian and international artists, with every track in one place on iGospel.",
      path: "/music/albums",
    },
    await searchParams,
  );
}

/** Every album post (a post with an album attached), newest first. */
export default async function AlbumsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const query = typeof params.q === "string" ? params.q.trim() : undefined;
  const sort = params.sort === "title" ? "title" : undefined;

  const [data, homepage] = await Promise.all([
    getAlbumPosts({ page, q: query, sort }).catch(() => null),
    getHomepage().catch(() => null),
  ]);

  return (
    <PostsListing
      heading="Gospel"
      highlight="Albums"
      subtitle="Full albums, every track in one place."
      searchPlaceholder="Search albums, artists..."
      emptyMessage="No albums found. Try another search."
      fallbackGenre="Album"
      basePath="/music/albums"
      data={data}
      page={page}
      query={query}
      extraParams={{ sort }}
      latestPosts={homepage?.latest_posts ?? []}
      controls={<SortSelect />}
    />
  );
}

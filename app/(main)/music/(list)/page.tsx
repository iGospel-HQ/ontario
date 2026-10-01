import type { Metadata } from "next";
import { getHomepage, getMusicPosts } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { parsePage } from "@/components/shared/page-pagination";
import { PostsListing } from "@/components/blog/posts-listing";
import { SortSelect } from "@/components/blog/sort-select";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return listingMetadata(
    {
      title: "Music",
      description: "Explore songs, playlists, albums, and discover your favorite artists",
      path: "/music",
    },
    await searchParams,
  );
}

export default async function MusicPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const query = typeof params.q === "string" ? params.q.trim() : undefined;
  const sort = params.sort === "title" ? "title" : undefined;

  const [data, homepage] = await Promise.all([
    getMusicPosts({ page, q: query, sort }).catch(() => null),
    getHomepage().catch(() => null),
  ]);

  return (
    <PostsListing
      heading="Gospel"
      highlight="Music"
      subtitle="Discover new sounds. Worship through every beat."
      searchPlaceholder="Search music posts, artists, titles..."
      emptyMessage="No music posts found. Try another search."
      fallbackGenre="Music"
      basePath="/music"
      data={data}
      page={page}
      query={query}
      extraParams={{ sort }}
      latestPosts={homepage?.latest_posts ?? []}
      controls={<SortSelect />}
    />
  );
}

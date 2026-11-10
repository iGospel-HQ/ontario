import type { Metadata } from "next";
import { getHomepage, getSermonPosts } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { parsePage } from "@/components/shared/page-pagination";
import { PostsListing } from "@/components/blog/posts-listing";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return listingMetadata(
    {
      title: "Sermons",
      description: "Listen to and download sermons, Bible teachings and Christian talks free on iGospel.",
      path: "/sermons",
    },
    await searchParams,
  );
}

export default async function SermonsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const query = typeof params.q === "string" ? params.q.trim() : undefined;

  const [data, homepage] = await Promise.all([
    getSermonPosts({ page, q: query }).catch(() => null),
    getHomepage().catch(() => null),
  ]);

  return (
    <PostsListing
      heading="Sermons &"
      highlight="Teachings"
      subtitle="Listen, download and share the Word."
      searchPlaceholder="Search sermons, ministers, topics..."
      emptyMessage="No sermons found. Try another search."
      basePath="/sermons"
      data={data}
      page={page}
      query={query}
      latestPosts={homepage?.latest_posts ?? []}
    />
  );
}

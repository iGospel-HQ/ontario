import type { Metadata } from "next";
import { getHomepage, getPosts } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { parsePage } from "@/components/shared/page-pagination";
import { PostsListing } from "@/components/blog/posts-listing";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return listingMetadata(
    {
      title: "Blog",
      description: "Explore stories about music, culture, and the industry",
      path: "/blog",
    },
    await searchParams,
  );
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const query = typeof params.q === "string" ? params.q.trim() : undefined;

  const [data, homepage] = await Promise.all([
    getPosts({ page, q: query }).catch(() => null),
    getHomepage().catch(() => null),
  ]);

  return (
    <PostsListing
      heading="Gospel"
      highlight="Contents"
      subtitle="Deep truths. Real worship. African fire."
      searchPlaceholder="Search articles, authors, topics..."
      emptyMessage="No articles found. Try another search."
      basePath="/blog"
      data={data}
      page={page}
      query={query}
      latestPosts={homepage?.latest_posts ?? []}
    />
  );
}

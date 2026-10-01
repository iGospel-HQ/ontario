import type { ReactNode } from "react";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { PostCard } from "@/components/blog/post-card";
import { PageHeader } from "@/components/shared/page-header";
import { PagePagination } from "@/components/shared/page-pagination";
import { SearchInput } from "@/components/shared/search-input";
import { POSTS_PAGE_SIZE } from "@/lib/api/queries";
import type { HomepagePost, Paginated, PostSummary } from "@/types/api";

/** Archive page shared by /blog and /music: header, searchable post grid, sidebar. */
export function PostsListing({
  heading,
  highlight,
  subtitle,
  searchPlaceholder,
  emptyMessage,
  fallbackGenre,
  basePath,
  data,
  page,
  query,
  extraParams = {},
  latestPosts,
  controls,
}: {
  heading: string;
  highlight: string;
  subtitle: string;
  searchPlaceholder: string;
  emptyMessage: string;
  fallbackGenre?: string;
  basePath: string;
  /** `null` when the API request failed. */
  data: Paginated<PostSummary> | null;
  page: number;
  query?: string;
  extraParams?: Record<string, string | undefined>;
  latestPosts: HomepagePost[];
  controls?: ReactNode;
}) {
  const posts = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / POSTS_PAGE_SIZE) : 1;

  return (
    <>
      <PageHeader title={`${heading} ${highlight}`} description={subtitle} />

      <div className="grid gap-10 px-4 md:px-6 py-10 lg:grid-cols-3">
        <section className="lg:col-span-2" aria-label="Posts">
          <div className="mb-8 flex flex-col sm:flex-row gap-3 [&_input]:h-11 [&_input]:rounded-none">
            <SearchInput
              placeholder={searchPlaceholder}
              className="flex-1"
              inputClassName="pl-12 border-rule bg-white"
            />
            {controls}
          </div>

          {!data ? (
            <p className="py-20 text-center text-xl text-red-600">Failed to load posts. Please try again.</p>
          ) : posts.length === 0 ? (
            <p className="py-20 text-center text-xl text-meta">{emptyMessage}</p>
          ) : (
            <>
              <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
                {posts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} fallbackGenre={fallbackGenre} />
                ))}
              </div>
              <PagePagination
                basePath={basePath}
                params={{ q: query, ...extraParams }}
                page={page}
                totalPages={totalPages}
              />
            </>
          )}
        </section>

        <BlogSidebar latestPosts={latestPosts} />
      </div>
    </>
  );
}

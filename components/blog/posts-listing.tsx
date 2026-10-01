import type { ReactNode } from "react";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { PostCard } from "@/components/blog/post-card";
import { FadeIn } from "@/components/shared/fade-in";
import { PagePagination } from "@/components/shared/page-pagination";
import { SearchInput } from "@/components/shared/search-input";
import { POSTS_PAGE_SIZE } from "@/lib/api/queries";
import type { HomepagePost, Paginated, PostSummary } from "@/types/api";

/** Hero + searchable, paginated post grid + sidebar, shared by /blog and /music. */
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
      {/* Hero */}
      <section className="relative h-96 bg-gradient-to-br from-accent/20 via-background to-accent/10 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-background/60" />
        <FadeIn y={30} className="relative z-10 px-6">
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4">
            {heading}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">
              {highlight}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">{subtitle}</p>
        </FadeIn>
      </section>

      {/* Main Content + Sidebar */}
      <section className="py-16 text-foreground bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto mb-12 flex items-center flex-col md:flex-row gap-4">
            <SearchInput
              placeholder={searchPlaceholder}
              className="w-9/12"
              inputClassName="pl-12 h-14 border-border text-foreground bg-card"
            />
            {controls}
          </div>

          <div className="grid 2xl:grid-cols-7 gap-10">
            <div className="2xl:col-span-5 space-y-8">
              {!data ? (
                <div className="text-center py-20">
                  <p className="text-2xl text-red-600">Failed to load posts. Please try again.</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl text-muted-foreground">{emptyMessage}</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-8 md:grid-cols-2">
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
            </div>

            <div className="2xl:col-span-2">
              <BlogSidebar latestPosts={latestPosts} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

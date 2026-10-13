import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/shared/not-found-content";
import { getPost, getPosts } from "@/lib/api/queries";
import { pageMetadata, toDescription } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { PostCard } from "@/components/blog/post-card";
import { CommentSection } from "@/components/blog/comment-section";
import { PostTracks } from "@/components/blog/post-tracks";
import { FeaturedBadge } from "@/components/blog/featured-badge";
import { PostTraffic } from "@/components/blog/post-traffic";
import { PostEngagement } from "@/components/blog/post-engagement";
import { FadeIn } from "@/components/shared/fade-in";
import { JsonLd } from "@/components/shared/json-ld";
import { ShareButtons } from "@/components/shared/share-buttons";

type Props = { params: Promise<{ slug: string }> };

// Posts are cached and regenerated in the background at most every 10 minutes.
export const revalidate = 60;

/** Pre-render the most recent posts at build time; older ones render on first request. */
export async function generateStaticParams() {
  try {
    const [first, second] = await Promise.all([getPosts({ page: 1 }), getPosts({ page: 2 })]);
    return [...first.results, ...second.results].map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return notFoundMetadata;

  return pageMetadata({
    title: post.meta_title || post.title,
    description: toDescription(post.meta_description, post.excerpt, post.content),
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.featured_image
      ? { url: post.featured_image, width: 1200, height: 1200, alt: post.title }
      : null,
    article: {
      publishedTime: post.publish_date,
      modifiedTime: post.updated_at,
      authors: [post.author_name || siteConfig.name],
    },
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const [post, latest] = await Promise.all([
    getPost(slug),
    getPosts({ page: 1 }).catch(() => null),
  ]);
  if (!post) notFound();

  const latestPosts = (latest?.results ?? []).filter((p) => p.slug !== post.slug);
  const ads = post.ads?.content_ads ?? [];
  const headerAd = ads.find((ad) => ad.position === "header");
  const inPostAd = ads.find((ad) => ad.position === "in_post");
  const sidebarAds = ads.filter((ad) => ad.position === "sidebar");
  const support = post.support_status;
  const url = absoluteUrl(`/blog/${post.slug}`);
  const isMusicPost = (post.tracks?.length ?? 0) > 0 || (post.albums?.length ?? 0) > 0;
  // ~200 words a minute.
  const words = post.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));
  // The editor leaves empty paragraphs (<p><br></p>, <p>&nbsp;</p>) as spacers.
  const content = post.content.replace(/<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "");
  // The intro line under the title, unless the article starts with the same words
  // (excerpts are often made from the opening paragraph).
  const letters = (text: string) => text.replace(/<[^>]+>|&[a-z#0-9]+;/gi, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
  const showExcerpt = Boolean(post.excerpt) && !letters(content).startsWith(letters(post.excerpt).slice(0, 60));

  return (
    <div className="min-h-screen">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: toDescription(post.meta_description, post.excerpt, post.content),
            image: post.featured_image ? [post.featured_image] : undefined,
            datePublished: post.publish_date,
            dateModified: post.updated_at,
            author: { "@type": "Person", name: post.author_name || siteConfig.name },
            publisher: {
              "@type": "Organization",
              name: siteConfig.legalName,
              logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            url,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          },
        ]}
      />

      {/* Header Ad */}
      {headerAd && (
        <a
          href={headerAd.link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="relative block w-full h-24 md:h-32"
        >
          <Image
            src={headerAd.image}
            alt={headerAd.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </a>
      )}

      <div className="px-4 md:px-6 py-8 lg:py-10">
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Main Content */}
          <article className="min-w-0 lg:col-span-2">
            <header>
              <nav aria-label="Breadcrumb" className="entry-meta">
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link href="/" className="hover:text-accent">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-accent">
                      Blog
                    </Link>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li aria-current="page" className="text-text line-clamp-1">
                    {post.title}
                  </li>
                </ol>
              </nav>

              <span className="mt-6 inline-block rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                {post.genres?.[0]?.name || "Gospel"}
              </span>

              <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.15] tracking-tight md:text-[44px]">
                {post.title}
              </h1>

              {showExcerpt && (
                <p className="mt-4 text-lg leading-relaxed text-[#555] md:text-xl">{post.excerpt}</p>
              )}

              {/* Byline */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-rule py-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white"
                  >
                    {(post.author_name || "iGospel").trim().charAt(0).toUpperCase()}
                  </span>
                  <div className="text-[13px] leading-tight">
                    <p className="font-semibold text-text">{post.author_name || "iGospel"}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-meta">
                      <time dateTime={post.publish_date}>{formatDate(post.publish_date, "MMMM d, yyyy")}</time>
                      <span aria-hidden="true">·</span>
                      <span>{readingMinutes} min read</span>
                      <span aria-hidden="true">·</span>
                      <PostTraffic
                        slug={post.slug}
                        variant="inline"
                        initial={{
                          total_visitors: post.total_visitors,
                          total_views: post.total_views,
                          today_visitors: post.today_visitors,
                          today_views: post.today_views,
                        }}
                      />
                      <span aria-hidden="true">·</span>
                      <a href="#comments-heading" className="inline-flex items-center gap-1 hover:text-accent">
                        <MessageCircle className="size-3.5" aria-hidden="true" />
                        {post.comments.length}
                      </a>
                    </p>
                  </div>
                </div>
                <ShareButtons url={url} title={post.meta_title || post.title} variant="compact" />
              </div>
            </header>

            {/* Music posts open with the player (it shows the cover);
                other posts with a wide featured image. */}
            {isMusicPost ? (
              <div className="[&>section]:my-8">
                <PostTracks tracks={post.tracks ?? []} albums={post.albums ?? []} />
              </div>
            ) : (
              post.featured_image && (
                <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-shade">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1280px) 820px, (min-width: 1024px) 66vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )
            )}

            {/* Post Content */}
            <FadeIn delay={0.1}>
              <div className="entry-content mt-8 text-[17px] leading-[1.8]" dangerouslySetInnerHTML={{ __html: content }} />

              {inPostAd && (
                <a
                  href={inPostAd.link}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="relative my-10 block h-28 w-full overflow-hidden rounded-xl"
                >
                  <Image src={inPostAd.image} alt={inPostAd.title} fill sizes="(min-width: 1024px) 66vw, 100vw" />
                </a>
              )}
            </FadeIn>

            <div className="mt-10">
              <PostEngagement
                artistId={post.artists[0]?.id}
                creatorId={support?.creator_id ?? post.creator_id}
                supportLabel={support?.message}
              />
            </div>

            <ShareButtons
              url={url}
              title={post.meta_title || post.title}
              heading="Share this post"
              className="my-10 border-y border-rule py-6"
            />

            {/* Music posts: badge code for the artist to put on their website (backlinks). */}
            {isMusicPost && <FeaturedBadge slug={post.slug} title={post.title} />}

            <CommentSection comments={post.comments} postId={post.id} />
          </article>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-16">
              <BlogSidebar latestPosts={latestPosts} ads={sidebarAds} />
            </div>
          </div>
        </div>

        {/* More posts */}
        {latestPosts.length > 0 && (
          <section className="mt-16 border-t border-rule pt-10" aria-labelledby="more-posts-heading">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 id="more-posts-heading" className="font-serif text-2xl font-bold md:text-3xl">
                More from iGospel
              </h2>
              <Link href="/blog" className="text-sm font-semibold text-accent hover:underline">
                All posts →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.slice(0, 3).map((p, i) => (
                <PostCard key={p.id} post={p} index={i} headingLevel="h3" />
              ))}
            </div>
          </section>
        )}

        {/* Mobile Sidebar */}
        <div className="lg:hidden mt-12 border-t border-rule pt-8">
          <BlogSidebar latestPosts={latestPosts} ads={sidebarAds} />
        </div>
      </div>
    </div>
  );
}

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
import { AdSlot, BannerAd } from "@/components/shared/banner-ad";
import type { AdBanner } from "@/types/api";
import { Fragment } from "react";

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
  // Ads by spot on the page (admin: Blog → Ad banners → Position).
  const at = (position: string) => ads.filter((ad) => ad.position === position);
  const headerAd = at("header")[0];
  const sidebarAds = at("sidebar");
  const support = post.support_status;
  const url = absoluteUrl(`/blog/${post.slug}`);
  const isMusicPost = (post.tracks?.length ?? 0) > 0 || (post.albums?.length ?? 0) > 0;
  // ~200 words a minute.
  const words = post.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));
  // The editor leaves empty paragraphs (<p><br></p>, <p>&nbsp;</p>) as spacers.
  const content = embedYouTube(post.content.replace(/<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, ""));
  const articlePieces = splitAfterParagraphs(content, at("after_paragraph"));
  const engagement = (
    <PostEngagement
      artistId={post.artists[0]?.id}
      creatorId={support?.creator_id ?? post.creator_id}
      supportLabel={support?.message}
    />
  );

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
      {headerAd && <BannerAd ad={headerAd} sizes="100vw" />}

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

              <AdSlot ads={at("before_title")} className="mt-6" />

              <span className="mt-6 inline-block rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                {post.genres?.[0]?.name || "Gospel"}
              </span>

              <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.15] tracking-tight md:text-[44px]">
                {post.title}
              </h1>

              <AdSlot ads={at("after_title")} className="mt-6" />

              {/* Byline */}
              <div className="mt-6 flex flex-col items-start gap-4 border-y border-rule py-4">
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
              <AdSlot ads={at("after_byline")} className="mt-8" />
            </header>

            {/* Featured image: shown whole (album covers carry their title), on a
                blurred copy of itself that fills the wide frame. */}
            {post.featured_image && (
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl bg-[#0c0c0c] sm:aspect-[16/10]">
                <Image
                  src={post.featured_image}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="scale-110 object-cover opacity-60 blur-2xl"
                />
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1280px) 820px, (min-width: 1024px) 66vw, 100vw"
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            )}

            <AdSlot ads={at("after_image")} className="mt-8" />

            {/* Support and Telegram: once before the article, and again after the player. */}
            <div className="mt-8">{engagement}</div>

            <AdSlot ads={at("before_content")} className="mt-8" />

            {/* Post Content */}
            <FadeIn delay={0.1}>
              {/* The article, with any "after paragraph N" ads between its pieces. */}
              {articlePieces.map((piece, i) => (
                <Fragment key={i}>
                  {piece.html.trim() && (
                    <div className="entry-content mt-8 text-[17px] leading-[1.8]" dangerouslySetInnerHTML={{ __html: piece.html }} />
                  )}
                  <AdSlot ads={piece.ads} className="mt-8" />
                </Fragment>
              ))}

              <AdSlot ads={at("in_post")} className="my-10" />
            </FadeIn>

            {isMusicPost && (
              <div className="[&>section]:my-8">
                <PostTracks tracks={post.tracks ?? []} albums={post.albums ?? []} />
              </div>
            )}

            <AdSlot ads={at("after_player")} className="mt-8" />

            <div className="mt-8">{engagement}</div>

            <ShareButtons
              url={url}
              title={post.meta_title || post.title}
              heading="Share this post"
              className="my-10 border-y border-rule py-6"
            />

            {/* Music posts: badge code for the artist to put on their website (backlinks). */}
            {isMusicPost && <FeaturedBadge slug={post.slug} title={post.title} />}

            <AdSlot ads={at("before_comments")} className="mb-10" />

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

/** The 11-character video id of a YouTube watch, youtu.be, shorts or embed link. */
function youTubeId(url: string) {
  const match = url
    .replace(/&amp;/g, "&")
    .match(/^https?:\/\/(?:www\.|m\.|music\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/i);
  return match?.[1] ?? null;
}

/**
 * A paragraph that is only a YouTube link (as text or a link) becomes the
 * video player, so pasting the link on its own line embeds the video.
 */
function embedYouTube(html: string) {
  return html.replace(
    /<p[^>]*>\s*(?:<a\s[^>]*href="([^"]+)"[^>]*>[^<]*<\/a>|(https?:\/\/[^\s<]+))\s*<\/p>/gi,
    (whole, href?: string, bare?: string) => {
      const id = youTubeId(href ?? bare ?? "");
      if (!id) return whole;
      return (
        `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" ` +
        `title="YouTube video" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" ` +
        `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ` +
        `allowfullscreen></iframe></div>`
      );
    },
  );
}

/**
 * The article cut after the paragraphs that "after paragraph N" ads follow:
 * [{html, ads}] where each piece's ads come right after it. N past the last
 * paragraph puts the ad after the last one.
 */
function splitAfterParagraphs(html: string, paragraphAds: AdBanner[]) {
  if (!paragraphAds.length) return [{ html, ads: [] as AdBanner[] }];
  const ends: number[] = [];
  for (const match of html.matchAll(/<\/p>/gi)) ends.push((match.index ?? 0) + match[0].length);
  if (!ends.length) return [{ html, ads: paragraphAds }];
  const byEnd = new Map<number, AdBanner[]>();
  for (const ad of paragraphAds) {
    const n = Math.min(Math.max(ad.paragraph ?? 2, 1), ends.length);
    byEnd.set(ends[n - 1], [...(byEnd.get(ends[n - 1]) ?? []), ad]);
  }
  const pieces: { html: string; ads: AdBanner[] }[] = [];
  let from = 0;
  for (const end of [...byEnd.keys()].sort((a, b) => a - b)) {
    pieces.push({ html: html.slice(from, end), ads: byEnd.get(end) ?? [] });
    from = end;
  }
  pieces.push({ html: html.slice(from), ads: [] });
  return pieces;
}

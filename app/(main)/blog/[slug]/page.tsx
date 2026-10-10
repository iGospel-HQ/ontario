import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/shared/not-found-content";
import { getPost, getPosts } from "@/lib/api/queries";
import { pageMetadata, toDescription } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { CommentSection } from "@/components/blog/comment-section";
import { PostTracks } from "@/components/blog/post-tracks";
import { PostTraffic } from "@/components/blog/post-traffic";
import { SupportButton } from "@/components/blog/support-button";
import { FadeIn } from "@/components/shared/fade-in";
import { JsonLd } from "@/components/shared/json-ld";
import { TelegramCTA } from "@/components/shared/telegram-cta";
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
          <article className="lg:col-span-2 space-y-8">
            <header className="space-y-4">
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

              <span className="cat-label">{post.genres?.[0]?.name || "Gospel"}</span>

              <h1 className="text-3xl md:text-[40px] font-bold leading-tight">{post.title}</h1>

              <p className="entry-meta border-b border-rule pb-4 text-[13px]">
                By <span className="font-semibold text-text">{post.author_name}</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <time dateTime={post.publish_date}>
                  {formatDate(post.publish_date, "MMMM d, yyyy")}
                </time>
                <span className="mx-2" aria-hidden="true">·</span>
                <a href="#comments-heading" className="hover:text-accent">
                  {post.comments.length} Comment{post.comments.length === 1 ? "" : "s"}
                </a>
              </p>

              <ShareButtons url={url} title={post.meta_title || post.title} variant="compact" />

              {/* Featured Image */}
              <div className="relative aspect-[1/1] overflow-hidden bg-shade">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1280px) 820px, (min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </header>

            {/* Support Button – Before Content */}
            <div className="flex justify-center my-10">
              <SupportButton
                artistId={post.artists[0]?.id}
                creatorId={support?.creator_id ?? post.creator_id}
                label={support?.message}
              />
            </div>

            {/* Post Content */}
            <FadeIn delay={0.2}>
              <TelegramCTA />
              <div
                className="entry-content my-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <PostTraffic
                slug={post.slug}
                initial={{
                  total_visitors: post.total_visitors,
                  total_views: post.total_views,
                  today_visitors: post.today_visitors,
                  today_views: post.today_views,
                }}
              />
              <TelegramCTA />

              {inPostAd && (
                <a
                  href={inPostAd.link}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="relative block my-8 w-full h-28"
                >
                  <Image
                    src={inPostAd.image}
                    alt={inPostAd.title}
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                  />
                </a>
              )}
            </FadeIn>

            {/* Support Button – After Content */}
            <div className="flex justify-center my-12">
              <SupportButton
                artistId={post.artists[0]?.id}
                creatorId={support?.creator_id ?? post.creator_id}
                label={support?.message}
              />
            </div>

            <PostTracks tracks={post.tracks ?? []} albums={post.albums ?? []} />

            <ShareButtons
              url={url}
              title={post.meta_title || post.title}
              heading="Share this post"
              className="my-10 border-y border-rule py-6"
            />

            <CommentSection comments={post.comments} postId={post.id} />
          </article>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-16">
              <BlogSidebar latestPosts={latestPosts} ads={sidebarAds} />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden mt-12 border-t border-rule pt-8">
          <BlogSidebar latestPosts={latestPosts} ads={sidebarAds} />
        </div>
      </div>
    </div>
  );
}

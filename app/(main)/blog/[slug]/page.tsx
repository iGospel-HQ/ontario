import type { Metadata } from "next";
import Link from "next/link";
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

type Props = { params: Promise<{ slug: string }> };

// Posts are cached and regenerated in the background at most every 10 minutes.
export const revalidate = 600;

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

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2 space-y-8">
            <header className="space-y-6">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-foreground">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-muted-foreground">
                    ›
                  </li>
                  <li aria-current="page" className="text-foreground">
                    {post.title}
                  </li>
                </ol>
              </nav>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                {post.title}
              </h1>

              <div className="flex items-center gap-4">
                <p className="font-semibold text-gray-800">{post.author_name}</p>
                <span className="text-gray-500" aria-hidden="true">
                  •
                </span>
                <p className="text-sm text-gray-500">
                  <time dateTime={post.publish_date}>
                    {formatDate(post.publish_date, "MMMM d, yyyy")}
                  </time>
                </p>
              </div>

              {/* Featured Image */}
              <div className="relative aspect-[1/1] overflow-hidden rounded-xl">
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
                creatorId={support?.creator_id}
                label={support?.message}
              />
            </div>

            {/* Post Content */}
            <FadeIn delay={0.2} className="prose prose-lg max-w-none dark:prose-invert">
              <TelegramCTA />
              <div
                className="post-content text-base sm:text-lg"
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
                    className="rounded-lg"
                  />
                </a>
              )}
            </FadeIn>

            {/* Support Button – After Content */}
            <div className="flex justify-center my-12">
              <SupportButton
                artistId={post.artists[0]?.id}
                creatorId={support?.creator_id}
                label={support?.message}
              />
            </div>

            <PostTracks tracks={post.tracks ?? []} />

            <CommentSection comments={post.comments} postId={post.id} />
          </article>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <BlogSidebar latestPosts={latestPosts} ads={sidebarAds} />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden mt-12 border-t pt-8">
          <BlogSidebar latestPosts={latestPosts} ads={sidebarAds} />
        </div>
      </div>
    </div>
  );
}

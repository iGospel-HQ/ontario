import Link from "next/link";
import Image from "next/image";
import { AudioLines } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { HomepagePost, HomepageTrack } from "@/types/api";
import { HomePlaylist } from "@/components/home/home-playlist";

const DATE = "MMMM d, yyyy";

function PostMeta({ post, className = "" }: { post: HomepagePost; className?: string }) {
  return (
    <p className={`entry-meta ${className}`}>
      By <span className="font-semibold text-text">{post.author}</span>
      <span className="mx-1.5" aria-hidden="true">·</span>
      <time dateTime={post.publish_date}>{formatDate(post.publish_date, DATE)}</time>
    </p>
  );
}

export function HomeInfoSection({
  latestPosts,
  featuredPosts,
  randomPosts,
  playlist,
}: {
  latestPosts: HomepagePost[];
  featuredPosts: HomepagePost[];
  randomPosts: HomepagePost[];
  playlist: HomepageTrack[];
}) {
  return (
    <>
      {/* Featured Posts: magazine tiles with overlaid titles */}
      <section className="px-4 md:px-6 pb-10">
        <h2 className="section-title">
          <span>Featured Posts</span>
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group relative block h-64 overflow-hidden sm:h-72">
              <Image
                src={post.featured_image || "/placeholder.svg"}
                alt=""
                fill
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <article className="absolute bottom-0 p-5 text-white">
                <span className="cat-label mb-2">{post.category || "Gospel"}</span>
                <h3 className="text-lg sm:text-xl font-bold leading-snug line-clamp-3 transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-2 text-[12px] text-white/75">
                  {post.author} · {formatDate(post.publish_date, DATE)}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Main content + sidebar */}
      <div className="grid gap-10 px-4 md:px-6 pb-12 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          {/* Latest Posts: card grid */}
          <section>
            <h2 className="section-title">
              <span>Latest Posts</span>
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              {latestPosts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-shade" tabIndex={-1} aria-hidden="true">
                    <Image
                      src={post.featured_image || "/placeholder.svg"}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <h3 className="entry-title mt-4 text-xl font-bold leading-snug line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <PostMeta post={post} className="mt-2" />
                  <p className="mt-3 text-[14px] leading-relaxed text-[#555] line-clamp-3">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="read-more mt-3 inline-block">
                    Read More &raquo;<span className="sr-only">: {post.title}</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* Other Posts: list with thumbnails */}
          <section>
            <h2 className="section-title">
              <span>Other Posts</span>
            </h2>
            <div className="divide-y divide-rule">
              {randomPosts.map((post) => (
                <article key={post.id} className="group flex flex-col gap-5 py-6 first:pt-0 sm:flex-row">
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] w-full flex-shrink-0 overflow-hidden bg-shade sm:w-56" tabIndex={-1} aria-hidden="true">
                    <Image
                      src={post.featured_image || "/placeholder.svg"}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 224px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="min-w-0">
                    <h3 className="entry-title text-xl font-bold leading-snug line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <PostMeta post={post} className="mt-2" />
                    <p className="mt-3 text-[14px] leading-relaxed text-[#555] line-clamp-2">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-10">
          <HomePlaylist tracks={playlist} />

          {/* Album Spotlight */}
          <section>
            <h2 className="widget-title">
              <span>Album Spotlight</span>
            </h2>
            <div className="group relative overflow-hidden">
              <Image
                src="https://picsum.photos/seed/sovereign/600/600"
                alt="SOVEREIGN GOD Album"
                width={600}
                height={600}
                sizes="(min-width: 1024px) 380px, 100vw"
                className="h-96 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-1 text-2xl font-bold">SOVEREIGN GOD</h3>
                <p className="mb-5 text-white/80">Pastor Emmanuel Iren</p>
                <button className="flex items-center gap-2 bg-accent px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors hover:bg-white hover:text-accent">
                  <AudioLines className="h-4 w-4" />
                  Stream Album
                </button>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

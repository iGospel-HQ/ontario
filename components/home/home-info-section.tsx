import Link from "next/link";
import Image from "next/image";
import { AudioLines, User } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { HomepagePost, HomepageTrack } from "@/types/api";
import { HomePlaylist } from "@/components/home/home-playlist";

const DATE = "MMM d, yyyy";

function PostMeta({ post }: { post: HomepagePost }) {
  return (
    <div className="flex items-center gap-2 my-3">
      <p className="text-xs text-gray-600">
        <time dateTime={post.publish_date}>{formatDate(post.publish_date, DATE)}</time>
      </p>
      |
      <div className="flex items-center gap-2 text-xs">
        <User className="w-4 h-4" />
        {post.author}
      </div>
    </div>
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
      {/* Featured Posts */}
      <section className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Featured Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                  <Image
                    src={post.featured_image || "/placeholder.svg"}
                    alt={post.title}
                    width={600}
                    height={400}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <span className="text-xs uppercase tracking-wider opacity-90 mb-2 block">
                      {post.author} • {formatDate(post.publish_date, DATE)}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold leading-tight line-clamp-3 group-hover:text-red-400 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Latest Posts */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Latest Posts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
                  >
                    <Image
                      src={post.featured_image || "/placeholder.svg"}
                      alt={post.title}
                      width={600}
                      height={400}
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-48 sm:h-56 object-cover"
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-red-600 hover:text-black transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <PostMeta post={post} />
                      <p className="text-gray-700 mt-3 line-clamp-3 flex-1">{post.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Other Posts */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Other Posts</h2>
              <div className="grid grid-cols-1 gap-6">
                {randomPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row"
                  >
                    <Image
                      src={post.featured_image || "/placeholder.svg"}
                      alt={post.title}
                      width={600}
                      height={400}
                      sizes="(min-width: 640px) 192px, 100vw"
                      className="w-full sm:w-48 h-48 object-cover"
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-red-600 hover:text-black transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <PostMeta post={post} />
                      <p className="text-gray-700 mt-3 line-clamp-3 flex-1">{post.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <HomePlaylist tracks={playlist} />

            {/* Album Spotlight */}
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://picsum.photos/seed/sovereign/600/600"
                alt="SOVEREIGN GOD Album"
                width={600}
                height={600}
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl sm:text-3xl font-black mb-2">SOVEREIGN GOD</h3>
                <p className="text-base sm:text-lg mb-6">Pastor Emmanuel Iren</p>
                <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors text-sm sm:text-base">
                  <AudioLines className="w-5 h-5" />
                  Stream Album
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

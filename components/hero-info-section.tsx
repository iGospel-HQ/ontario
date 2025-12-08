// app/page.tsx  (or components/Homepage.tsx)
import Link from "next/link";
import Image from "next/image";
import { Play, AudioLines } from "lucide-react";
import { useAudioPlayer } from "@/store/use-audio-player";

export default function HomeInfoSection({
  latestPosts,
  featuredPosts,
  randomPosts,
  playlists,
}: Record<string, Array<any>>) {
  const playTrack = useAudioPlayer((s) => s.playTrack);

  return (
    <>
      {/* HERO: 3 Featured Posts */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post: any, i) => (
              <Link key={i} href={`/blog/${post.slug}`} className="group">
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <span className="text-xs uppercase tracking-wider opacity-90 mb-2 block">
                      {post.author} •{" "}
                      {new Date(post.publish_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <h3 className="text-lg font-bold leading-tight line-clamp-3 group-hover:text-red-400 transition">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT + SIDEBAR */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-5 place-items-start gap-5">
          {/* LEFT: Latest Posts */}
          <div className="lg:col-span-3 space-y-12">
            <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
            <div className="grid md:grid-cols-2 gap-5 h-fit">
              {latestPosts.map((post, i) => (
                <article
                  key={i}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition"
                >
                  {/* Image at the top */}
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-red-600 hover:text-black transition line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {new Date(post.publish_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600 mt-2">
                      <span className="bg-black rounded text-xs text-white p-1">
                        Published By
                      </span>
                      : <span className="text-xs">{post.author}</span>
                    </p>
                    <p className="text-gray-700 mt-3 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <h2 className="text-2xl font-bold mb-4">Other Posts</h2>
            <div className="grid gap-5 h-fit">
              {randomPosts.map((post, i) => (
                <article
                  key={i}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition"
                >
                  {/* Image at the top */}
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-red-600 hover:text-black transition line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {new Date(post.publish_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600 mt-2">
                      <span className="bg-black rounded text-xs text-white p-1">
                        Published By
                      </span>
                      : <span className="text-xs">{post.author}</span>
                    </p>
                    <p className="text-gray-700 mt-3 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="space-y-8 lg:col-span-2">
            {/* Trending Songs Chart */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-accent text-white px-5 py-3 font-bold text-lg">
                Trending Gospel Songs
              </div>
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {playlists.map((song, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 hover:bg-gray-50 p-2 -m-2 rounded transition group cursor-pointer "
                    onClick={() =>
                      playTrack({
                        id: song.id,
                        title: song.title,
                        artist: song.artist,
                        cover: song.image || "/placeholder.svg",
                        audioUrl: song.mp3_file,
                      })
                    }
                  >
                    <div className="text-md font-black text-gray-300">
                      {i + 1}
                    </div>
                    <button className="relative w-6 h-6 bg-accent rounded-full flex items-center justify-center group-hover:bg-red-700 transition">
                      <Play className="w-3 h-3 text-white" fill="white" />
                    </button>
                    <div className="flex-1">
                      <p className="font-semibold text-sm truncate">
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-600">{song.artist}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {song.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promoted Album Spotlight */}
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://picsum.photos/seed/sovereign/600/600"
                alt="SOVEREIGN GOD Album"
                width={600}
                height={600}
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-3xl font-black mb-2">SOVEREIGN GOD</h3>
                <p className="text-lg mb-4">Pastor Emmanuel Iren</p>
                <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition">
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

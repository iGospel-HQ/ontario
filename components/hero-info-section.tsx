// app/page.tsx (or components/Homepage.tsx)
import Link from "next/link";
import Image from "next/image";
import { Play, Pause, AudioLines, User } from "lucide-react";
import { useAudioPlayer } from "@/store/use-audio-player";
import { cn } from "@/lib/utils";

export default function HomeInfoSection({
  latestPosts,
  featuredPosts,
  randomPosts,
  playlists,
}: Record<string, Array<any>>) {
  const playTrack = useAudioPlayer((s) => s.playTrack);
  const togglePlay = useAudioPlayer((s) => s.togglePlay);
  const currentTrack = useAudioPlayer((s) => s.currentTrack);

  return (
    <>
      {/* HERO: Featured Posts */}
      <section className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Featured Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post: any, i: number) => (
              <Link key={i} href={`/blog/${post.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={i < 3} // Optimize LCP for first few images
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <span className="text-xs uppercase tracking-wider opacity-90 mb-2 block">
                      {post.author} •{" "}
                      {new Date(post.publish_date).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold leading-tight line-clamp-3 group-hover:text-red-400 transition-colors">
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
      <section className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          {/* MAIN CONTENT: Latest + Other Posts */}
          <div className="lg:col-span-2 space-y-12">
            {/* Latest Posts */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                Latest Posts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestPosts.map((post: any, i: number) => (
                  <article
                    key={i}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
                  >
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full h-48 sm:h-56 object-cover"
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-red-600 hover:text-black transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {new Date(post.publish_date).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-sm my-3">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <p className="text-gray-700 mt-3 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Other Posts */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                Other Posts
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {randomPosts.map((post: any, i: number) => (
                  <article
                    key={i}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row"
                  >
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full sm:w-48 h-48 object-cover"
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-red-600 hover:text-black transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {new Date(post.publish_date).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-sm my-3">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <p className="text-gray-700 mt-3 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR - Stacks below on mobile/tablet, side on lg+ */}
          <aside className="space-y-8">
            {/* Playlist */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-accent text-white px-5 py-3 font-bold text-lg">
                Playlist
              </div>
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {playlists.map((song: any, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-4 p-2 -m-2 rounded transition group cursor-pointer",
                      currentTrack?.id === song.id
                        ? "bg-gray-100"
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => {
                      if (currentTrack?.id === song.id) {
                        togglePlay();
                      } else {
                        playTrack({
                          id: song.id,
                          title: song.title,
                          artist: song.artist,
                          cover: song.image || "/placeholder.svg",
                          audioUrl: song.mp3_file,
                        });
                      }
                    }}
                  >
                    <div className="text-lg font-black text-gray-300 w-6 text-center">
                      {i + 1}
                    </div>
                    <button className="relative w-10 h-10 bg-accent rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      {currentTrack?.id === song.id ? (
                        <Pause className="w-5 h-5 text-white" fill="white" />
                      ) : (
                        <Play
                          className="w-5 h-5 text-white ml-0.5"
                          fill="white"
                        />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {song.artist}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 hidden sm:block">
                      {song.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Album Spotlight */}
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://picsum.photos/seed/sovereign/600/600"
                alt="SOVEREIGN GOD Album"
                width={600}
                height={600}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl sm:text-3xl font-black mb-2">
                  SOVEREIGN GOD
                </h3>
                <p className="text-base sm:text-lg mb-6">
                  Pastor Emmanuel Iren
                </p>
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

// app/page.tsx  (or components/Homepage.tsx)
import Link from "next/link";
import Image from "next/image";
import { Play, Search, Music, Download, AudioLines } from "lucide-react";

export default function HomeInfoSection() {
  const featured = [
    {
      title:
        "Ugandan Gospel Music Minister, Israel Ssali Releases New Single “Holy One”",
      author: "Gospel Force",
      date: "November 20, 2025",
      image: "https://picsum.photos/300",
    },
    {
      title: "Gospel Force Releases New Single “Oluwa Ti Segun”",
      author: "Gospel Force",
      date: "November 14, 2025",
      image: "https://picsum.photos/300",
    },
    {
      title: "Joe Praize Releases “Thank You Jesus” Official Video Out Now",
      author: "Gospel Force",
      date: "November 13, 2025",
      image: "https://picsum.photos/300",
    },
  ];

  const latestPosts = [
    {
      title:
        "The God In Me – John Cando Ft. Steven Sax & Unlimited Favour Voices",
      date: "Nov 12",
      author: "Just That tesingguy"
    },
    {
      title: "UK Based Nigerian Gospel Minister, John Doe Releases New Single",
      date: "Nov 10",
      author: "Just That tesingguy"
    },
    {
      title: "UK Based Nigerian Gospel Minister, John Doe Releases New Single",
      date: "Nov 10",
      author: "Just That tesingguy"
    },
    {
      title: "UK Based Nigerian Gospel Minister, John Doe Releases New Single",
      date: "Nov 10",
      author: "Just That tesingguy"
    },
    {
      title: "UK Based Nigerian Gospel Minister, John Doe Releases New Single",
      date: "Nov 10",
      author: "Just That tesingguy"
    },
    {
      title:
        "The God In Me – John Cando Ft. Steven Sax & Unlimited Favour Voices",
      date: "Nov 12",
      author: "Just That tesingguy"
    },
    {
      title: "UK Based Nigerian Gospel Minister, John Doe Releases New Single",
      date: "Nov 10",
      author: "Just That tesingguy"
    },
    {
      title: "UK Based Nigerian Gospel Minister, John Doe Releases New Single",
      date: "Nov 10",
      author: "Just That tesingguy"
    },
    {
      title: "UK Based Nigerian Gospel Minister, John Doe Releases New Single",
      date: "Nov 10",
      author: "Just That tesingguy"
    },
    {
      title: "UK Based Nigerian Gospel Minister, John Doe Releases New Single",
      date: "Nov 10",
      author: "Just That tesingguy"
    },
    // Add more...
  ];

  const trendingSongs = [
    {
      rank: 1,
      title: "Oluwa Ti Segun",
      artist: "Gospel Force",
      duration: "4:21",
    },
    { rank: 2, title: "Holy One", artist: "Israel Ssali", duration: "5:12" },
    {
      rank: 3,
      title: "Thank You Jesus",
      artist: "Joe Praize",
      duration: "6:03",
    },
    {
      rank: 4,
      title: "Sovereign God",
      artist: "Pastor John",
      duration: "7:15",
    },
    {
      rank: 5,
      title: "You Are Holy",
      artist: "Mercy Chinwo",
      duration: "5:44",
    },
    {
      rank: 6,
      title: "You Are Holy",
      artist: "Mercy Chinwo",
      duration: "5:44",
    },
    {
      rank: 7,
      title: "You Are Holy",
      artist: "Mercy Chinwo",
      duration: "5:44",
    },
  ];

  return (
    <>
      {/* HERO: 3 Featured Posts */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((post, i) => (
              <Link key={i} href="#" className="group">
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition">
                  <Image
                    src={post.image+ `?random=${i}`}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <span className="text-xs uppercase tracking-wider opacity-90 mb-2 block">
                      {post.author} • {post.date}
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
        <div className="grid lg:grid-cols-5 gap-14">
          {/* LEFT: Latest Posts */}
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-12 h-fit">
            {latestPosts.map((post, i) => (
              <article
                key={i}
                className=""
              >
                {/* <div className="w-32 h-32 flex-shrink-0 bg-gray-200 border-2 border-dashed rounded-xl" /> */}
                {/* <div className=""> */}
                  <h3 className="text-xl font-bold hover:text-red-600 transition line-clamp-2">
                    <Link href="#">{post.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">{post.date}</p>
                  <p className="text-sm text-gray-600 mt-2">Publish By: {post.author}</p>
                  <p className="text-gray-700 mt-3 line-clamp-3">
                    Lorem ipsum dolor sit amet, consec tetur adipiscing elit.
                    Sed do eiusmod tempor...
                  </p>
                {/* </div> */}
              </article>
            ))}
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="space-y-8 lg:col-span-2">
            {/* Search */}
            {/* <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              />
            </div> */}

            {/* Trending Songs Chart */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-accent text-white px-5 py-3 font-bold text-lg">
                Trending Gospel Songs
              </div>
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {trendingSongs.map((song) => (
                  <div
                    key={song.rank}
                    className="flex items-center gap-4 hover:bg-gray-50 p-2 -m-2 rounded transition group"
                  >
                    <div className="text-md font-black text-gray-300">
                      {song.rank}
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
                src="https://picsum.photos/seed/picsum/600/600"
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

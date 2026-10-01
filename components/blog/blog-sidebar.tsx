import Link from "next/link";
import Image from "next/image";
import { Music } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { AdBanner } from "@/types/api";

type SidebarPost = {
  id: string;
  slug: string;
  title: string;
  featured_image?: string | null;
  publish_date: string;
};

type BlogSidebarProps = {
  latestPosts: SidebarPost[];
  relatedPosts?: SidebarPost[];
  ads?: AdBanner[];
};

export function BlogSidebar({ latestPosts, relatedPosts = [], ads }: BlogSidebarProps) {
  const postsToShow = relatedPosts.length > 0 ? relatedPosts : latestPosts;

  return (
    <aside className="space-y-8">
      {/* Latest Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            <h2 className="flex items-center gap-2">
              <Music className="w-5 h-5 text-red-500" />
              {relatedPosts.length > 0 ? "Related Articles" : "Latest Posts"}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {postsToShow.slice(0, 5).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex gap-4 group hover:bg-gray-100/50 p-3 -m-3 rounded-lg transition"
            >
              <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  sizes="80px"
                  className="object-cover group-hover:scale-110 transition"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  <time dateTime={post.publish_date}>{formatDate(post.publish_date)}</time>
                </p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-800/50">
        <CardHeader>
          <CardTitle className="text-lg">Stay in the Fire</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300 mb-4">
            Get fresh gospel insights delivered weekly.
          </p>
          <button className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-sm hover:from-red-700 hover:to-orange-700 transition">
            Subscribe Now
          </button>
        </CardContent>
      </Card>

      {ads && ads.length > 0 && (
        <div className="grid gap-5">
          {ads.map((ad) => (
            <a
              href={ad.link}
              key={ad.id}
              title={ad.title}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="relative block h-[400px]"
            >
              <Image src={ad.image} alt={ad.title} fill sizes="(min-width: 1024px) 33vw, 100vw" />
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}

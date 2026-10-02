import Link from "next/link";
import Image from "next/image";
import { Send } from "lucide-react";
import { siteConfig } from "@/lib/site";
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

/** WordPress-style sidebar widgets: recent posts, subscribe box, ads. */
export function BlogSidebar({ latestPosts, relatedPosts = [], ads }: BlogSidebarProps) {
  const postsToShow = relatedPosts.length > 0 ? relatedPosts : latestPosts;

  return (
    <aside className="space-y-10">
      {/* Recent posts */}
      <section>
        <h2 className="widget-title">
          <span>{relatedPosts.length > 0 ? "Related Articles" : "Latest Posts"}</span>
        </h2>
        <ul className="divide-y divide-rule">
          {postsToShow.slice(0, 5).map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group flex gap-3 py-3 first:pt-0">
                <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden bg-shade">
                  <Image
                    src={post.featured_image || "/placeholder.svg"}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="entry-title text-[14px] font-bold leading-snug line-clamp-2 transition-colors">
                    {post.title}
                  </h3>
                  <p className="entry-meta mt-1">
                    <time dateTime={post.publish_date}>{formatDate(post.publish_date, "MMMM d, yyyy")}</time>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Subscribe */}
      <section>
        <h2 className="widget-title">
          <span>Stay in the Fire</span>
        </h2>
        <div className="border border-rule bg-shade p-5">
          <p className="mb-4 text-sm text-[#555]">Get fresh gospel insights delivered weekly.</p>
          <a
            href={siteConfig.social.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 bg-accent py-3 text-[13px] font-bold uppercase tracking-wider text-white hover:bg-topbar"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Subscribe Now
          </a>
        </div>
      </section>

      {ads && ads.length > 0 && (
        <section className="grid gap-5">
          <h2 className="sr-only">Sponsored</h2>
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
        </section>
      )}
    </aside>
  );
}

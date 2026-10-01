import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/shared/fade-in";
import { formatDate } from "@/lib/format";
import type { PostSummary } from "@/types/api";

/** Blog-style post teaser: thumbnail with category label, title, meta, excerpt, "Read More". */
export function PostCard({
  post,
  index = 0,
  fallbackGenre = "Gospel",
  headingLevel: Heading = "h2",
}: {
  post: PostSummary;
  index?: number;
  fallbackGenre?: string;
  headingLevel?: "h2" | "h3";
}) {
  const href = `/blog/${post.slug}`;

  return (
    <FadeIn as="article" delay={Math.min(index, 6) * 0.06} className="group">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-shade" tabIndex={-1} aria-hidden="true">
        <Image
          src={post.featured_image || "/placeholder.svg"}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="cat-label absolute bottom-0 left-0">
          {post.genres?.[0]?.name || fallbackGenre}
        </span>
      </Link>

      <Heading className="entry-title mt-4 text-xl font-bold leading-snug line-clamp-3">
        <Link href={href}>{post.title}</Link>
      </Heading>

      <p className="entry-meta mt-2">
        By <span className="font-semibold text-text">{post.author_name}</span>
        <span className="mx-1.5" aria-hidden="true">·</span>
        <time dateTime={post.publish_date}>{formatDate(post.publish_date, "MMMM d, yyyy")}</time>
      </p>

      <p className="mt-3 text-[14px] leading-relaxed text-[#555] line-clamp-3">{post.excerpt}</p>

      <Link href={href} className="read-more mt-3 inline-block">
        Read More &raquo;<span className="sr-only">: {post.title}</span>
      </Link>
    </FadeIn>
  );
}

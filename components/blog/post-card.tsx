import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PostSummary } from "@/types/api";

/** Author initial in a small circle. */
function Avatar({ name, className }: { name?: string; className?: string }) {
  const initial = (name || "iGospel").trim().charAt(0).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent",
        className,
      )}
    >
      {initial}
    </span>
  );
}

/** "By X · date" with an avatar. */
function Byline({ post, className }: { post: PostSummary; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-[13px] text-meta", className)}>
      <Avatar name={post.author_name} />
      <span className="truncate font-medium text-text">{post.author_name || "iGospel"}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.publish_date} className="shrink-0">
        {formatDate(post.publish_date, "MMM d, yyyy")}
      </time>
    </div>
  );
}

/** Post teaser card: image with category pill, title, short excerpt, byline. */
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
    <FadeIn
      as="article"
      delay={Math.min(index, 6) * 0.06}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-shade">
        <Image
          src={post.featured_image || "/placeholder.svg"}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          {post.genres?.[0]?.name || fallbackGenre}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Heading className="entry-title text-lg font-bold leading-snug line-clamp-2">
          {/* The whole card is clickable through this link. */}
          <Link href={href} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </Heading>
        {post.excerpt && <p className="mt-2 text-[14px] leading-relaxed text-[#555] line-clamp-2">{post.excerpt}</p>}
        <Byline post={post} className="mt-auto pt-4" />
      </div>
    </FadeIn>
  );
}

/** The newest post, large: wide image beside (or above, on phones) title and excerpt. */
export function FeaturedPostCard({ post, fallbackGenre = "Gospel" }: { post: PostSummary; fallbackGenre?: string }) {
  const href = `/blog/${post.slug}`;
  return (
    <FadeIn
      as="article"
      className="group relative grid overflow-hidden rounded-3xl bg-[#0c0c0c] text-white shadow-xl md:grid-cols-[1.15fr_1fr]"
    >
      <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[320px]">
        <Image
          src={post.featured_image || "/placeholder.svg"}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 460px, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="relative flex flex-col justify-center p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-accent/25 blur-3xl" />
        <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Latest · {post.genres?.[0]?.name || fallbackGenre}
        </p>
        <h2 className="relative mt-3 font-serif text-2xl font-bold leading-tight md:text-3xl">
          <Link href={href} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="relative mt-3 text-[15px] leading-relaxed text-white/70 line-clamp-3">{post.excerpt}</p>}
        <div className="relative mt-6 flex items-center justify-between gap-3">
          <span className="text-[13px] text-white/60">
            {post.author_name || "iGospel"} ·{" "}
            <time dateTime={post.publish_date}>{formatDate(post.publish_date, "MMM d, yyyy")}</time>
          </span>
          <span className="flex size-10 items-center justify-center rounded-full bg-accent transition group-hover:scale-110">
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </FadeIn>
  );
}

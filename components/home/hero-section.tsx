import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import { FadeIn } from "@/components/shared/fade-in";
import type { HomepagePost } from "@/types/api";

/** Magazine-style featured banner for the lead post (the homepage LCP element). */
export function HeroSection({ post }: { post?: HomepagePost }) {
  if (!post) return null;
  const href = `/blog/${post.slug}`;

  return (
    <section className="relative text-white">
      <FadeIn y={0} duration={0.7}>
        <div className="group relative h-96 md:h-[480px] overflow-hidden">
          <Image
            src={post.featured_image || "/abstract-soundscape.png"}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className="cat-label mb-3">Brand New</span>
            <h2 className="max-w-3xl text-3xl md:text-5xl font-bold leading-tight">
              <Link href={href} className="hover:text-accent">
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 max-w-2xl text-base md:text-lg text-white/80 line-clamp-2">{post.excerpt}</p>
            <p className="mt-3 text-[13px] text-white/70">
              By <span className="font-semibold text-white">{post.author}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <time dateTime={post.publish_date}>{formatDate(post.publish_date, "MMMM d, yyyy")}</time>
            </p>
            <Link
              href={href}
              className="mt-5 inline-block bg-accent px-6 py-3 text-[13px] font-bold uppercase tracking-wider transition-colors hover:bg-white hover:text-accent"
            >
              View<span className="sr-only"> {post.title}</span> &raquo;
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

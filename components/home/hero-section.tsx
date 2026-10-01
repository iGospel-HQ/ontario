import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import type { HomepagePost } from "@/types/api";

/** Full-width banner for the featured post (the homepage LCP element). */
export function HeroSection({ post }: { post?: HomepagePost }) {
  if (!post) return null;

  return (
    <section className="relative bg-background text-white">
      <FadeIn y={0} duration={0.7}>
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <Image
            src={post.featured_image || "/abstract-soundscape.png"}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-6xl mx-auto">
            <p className="text-red-400 text-sm uppercase tracking-wider mb-2">Brand New</p>
            <h2 className="text-5xl md:text-7xl font-black mb-2">{post.title}</h2>
            <p className="text-2xl md:text-4xl font-bold text-gray-200 mb-3 truncate">
              {post.excerpt}
            </p>
            <p className="text-lg md:text-xl text-gray-300 mb-6">{post.author}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="flex items-center w-fit gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-7 py-3.5 rounded-full font-bold uppercase text-sm tracking-wider transition"
            >
              <ArrowRight className="w-5 h-5" />
              View<span className="sr-only"> {post.title}</span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

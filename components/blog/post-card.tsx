import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/shared/fade-in";
import { formatDate } from "@/lib/format";
import type { PostSummary } from "@/types/api";

/** Post teaser card used by the blog, music and artist listings. */
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
  return (
    <FadeIn as="article" delay={index * 0.1}>
      <Link href={`/blog/${post.slug}`}>
        <Card className="hover:border-accent transition-all duration-300 overflow-hidden group h-full pt-0 bg-card border-border">
          <div className="relative h-56">
            <Image
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <span className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold">
              {post.genres?.[0]?.name || fallbackGenre}
            </span>
          </div>
          <CardContent className="p-6">
            <Heading className="text-xl font-bold mb-3 group-hover:text-accent transition line-clamp-2">
              {post.title}
            </Heading>
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publish_date}>{formatDate(post.publish_date)}</time>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author_name}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </FadeIn>
  );
}

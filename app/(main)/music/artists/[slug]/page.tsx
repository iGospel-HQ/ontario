import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArtist, getArtistPosts } from "@/lib/api/queries";
import { pageMetadata, toDescription } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { PostCard } from "@/components/blog/post-card";
import { JsonLd } from "@/components/shared/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 600;

/** Artist pages are generated on first request, then cached and revalidated (ISR). */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtist(slug);
  if (!artist) return { title: "Artist not found", robots: { index: false } };

  return pageMetadata({
    title: artist.name,
    description: toDescription(
      artist.bio,
      `Discover ${artist.name} on iGospel: news, songs and gospel music features.`,
    ),
    path: `/music/artists/${artist.slug}`,
    type: "profile",
    image: artist.image ? { url: artist.image, alt: artist.name } : null,
  });
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const [artist, posts] = await Promise.all([getArtist(slug), getArtistPosts(slug)]);
  if (!artist) notFound();

  const url = absoluteUrl(`/music/artists/${artist.slug}`);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: artist.name,
            description: artist.bio || undefined,
            image: artist.image || undefined,
            url,
            sameAs: artist.website ? [artist.website] : undefined,
            genre: "Gospel",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              {
                "@type": "ListItem",
                position: 2,
                name: "Artists",
                item: absoluteUrl("/music/artists"),
              },
              { "@type": "ListItem", position: 3, name: artist.name, item: url },
            ],
          },
        ]}
      />

      {/* Artist Header */}
      <header className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
          <Image
            src={artist.image || "/placeholder.svg"}
            alt={artist.name}
            fill
            sizes="224px"
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{artist.name}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            {artist.bio || "No bio available."}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
            {artist.website && (
              <Button variant="outline" asChild>
                <a href={artist.website} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              </Button>
            )}
            <Badge variant="secondary" className="text-base px-4 py-1">
              {artist.followers_count} Followers
            </Badge>
            <Button variant={artist.is_following ? "secondary" : "default"} size="lg">
              {artist.is_following ? "Following" : "Follow"}
            </Button>
          </div>
          <p className="text-base text-gray-600">
            {artist.album_count} Albums • {artist.track_count} Tracks
          </p>
        </div>
      </header>

      {/* Blog Posts Featuring This Artist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            <h2>Blog Posts Featuring {artist.name}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} headingLevel="h3" />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">
              No blog posts found featuring this artist.
            </p>
          )}
        </CardContent>
      </Card>

      {artist.latest_album && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl">
              <h2>Latest Album</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Album details coming soon...</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

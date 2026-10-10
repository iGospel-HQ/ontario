import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/shared/not-found-content";
import { getPlaylist, getPlaylists } from "@/lib/api/queries";
import { htmlToText, pageMetadata, toDescription } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { FadeIn } from "@/components/shared/fade-in";
import { JsonLd } from "@/components/shared/json-ld";
import { PlayAllButton } from "@/components/music/play-all-button";
import { PlaylistCard } from "@/components/music/playlist-card";
import { TrackPlayButton } from "@/components/music/track-play-button";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

/** Playlist pages are generated on first request, then cached and revalidated (ISR). */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const playlist = await getPlaylist(slug);
  if (!playlist) return notFoundMetadata;

  return pageMetadata({
    title: playlist.title,
    description: toDescription(
      playlist.description,
      `${playlist.title}: a gospel playlist with ${playlist.track_count} songs on iGospel.`,
    ),
    path: `/music/playlists/${playlist.slug}`,
    type: "music.playlist",
    image: playlist.cover_image ? { url: playlist.cover_image, alt: playlist.title } : null,
  });
}

export default async function PlaylistDetailPage({ params }: Props) {
  const { slug } = await params;
  const [playlist, others] = await Promise.all([
    getPlaylist(slug),
    getPlaylists().catch(() => null),
  ]);
  if (!playlist) notFound();

  const tracks = playlist.tracks ?? [];
  const related = (others?.results ?? []).filter((p) => p.id !== playlist.id).slice(0, 4);
  const url = absoluteUrl(`/music/playlists/${playlist.slug}`);

  return (
    <div className="min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MusicPlaylist",
          name: playlist.title,
          description: playlist.description ? htmlToText(playlist.description) : undefined,
          url,
          image: playlist.cover_image || undefined,
          numTracks: tracks.length,
          track: tracks.map((track) => ({
            "@type": "MusicRecording",
            name: track.title,
            byArtist: { "@type": "MusicGroup", name: track.artist_name },
          })),
        }}
      />

      {/* Hero */}
      <FadeIn y={0} className="relative h-96 bg-gradient-to-b from-accent/20 to-background">
        <Image
          src={playlist.cover_image || "/placeholder.svg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
      </FadeIn>

      <div className="px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <FadeIn y={-20} className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{playlist.title}</h1>
            {/* Rich text from the admin editor, cleaned by the API (music/richtext.py). */}
            {playlist.description && (
              <div
                className="entry-content mb-4 text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: playlist.description }}
              />
            )}
            <p className="text-sm text-muted-foreground">{playlist.track_count} songs</p>
          </FadeIn>

          <PlayAllButton tracks={tracks} />

          <FadeIn y={0} delay={0.2} className="bg-secondary/50 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">#</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold">Artist</th>
                    <th scope="col" className="px-6 py-4 text-right text-sm font-semibold">Duration</th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold">Play</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, idx) => (
                    <tr
                      key={track.id}
                      className="border-b border-border hover:bg-secondary transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-muted-foreground">{idx + 1}</td>
                      <td className="px-6 py-4 font-medium">{track.title}</td>
                      <td className="px-6 py-4 text-sm">{track.artist_name}</td>
                      <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                        {track.duration_display || track.duration}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <TrackPlayButton track={track} iconClassName="h-4 w-4" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>

          {related.length > 0 && (
            <FadeIn as="section" y={40} delay={0.4} className="mt-16 border-t border-border pt-12">
              <h2 className="text-2xl font-bold mb-8">Similar Playlists</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <PlaylistCard key={p.id} playlist={p} showCount={false} headingLevel="h3" />
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}

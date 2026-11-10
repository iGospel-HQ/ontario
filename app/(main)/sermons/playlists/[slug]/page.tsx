import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ListMusic } from "lucide-react";
import { notFoundMetadata } from "@/components/shared/not-found-content";
import { getSermonPlaylist } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { SermonList } from "@/components/sermons/sermon-list";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const playlist = await getSermonPlaylist(slug);
  if (!playlist) return notFoundMetadata;
  return pageMetadata({
    title: `${playlist.title} – Sermon Playlist`,
    description:
      playlist.description || `Listen to ${playlist.sermon_count} sermons in “${playlist.title}” free on iGospel.`,
    path: `/sermons/playlists/${playlist.slug}`,
    image: playlist.cover_image ? { url: playlist.cover_image, alt: playlist.title } : null,
  });
}

export default async function SermonPlaylistPage({ params }: Props) {
  const { slug } = await params;
  const playlist = await getSermonPlaylist(slug);
  if (!playlist) notFound();

  return (
    <>
      <PageHeader
        title={playlist.title}
        crumbs={[
          { name: "Sermons", href: "/sermons" },
          { name: "Playlists", href: "/sermons/playlists" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12 md:px-6">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative aspect-square w-48 shrink-0 overflow-hidden rounded-xl bg-shade shadow-md sm:w-56">
            {playlist.cover_image ? (
              <Image src={playlist.cover_image} alt={playlist.title} fill sizes="224px" className="object-cover" priority />
            ) : (
              <ListMusic className="absolute inset-0 m-auto h-12 w-12 text-accent" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">Sermon playlist</p>
            <p className="mt-1 text-sm text-meta">
              {playlist.sermon_count} {playlist.sermon_count === 1 ? "sermon" : "sermons"}
            </p>
            {playlist.description && <p className="mt-3 max-w-xl text-gray-700">{playlist.description}</p>}
          </div>
        </header>

        <SermonList sermons={playlist.sermons} />
      </div>
    </>
  );
}

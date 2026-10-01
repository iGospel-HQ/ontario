import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Playlist } from "@/types/api";

export function PlaylistCard({
  playlist,
  showCount = true,
  headingLevel: Heading = "h2",
}: {
  playlist: Playlist;
  showCount?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <Link href={`/music/playlists/${playlist.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative mb-4 overflow-hidden rounded-lg aspect-square">
          <Image
            src={playlist.cover_image || "/placeholder.svg"}
            alt={playlist.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="h-12 w-12 text-accent fill-accent" />
          </div>
        </div>
        <Heading className="font-semibold truncate group-hover:text-accent">{playlist.title}</Heading>
        {showCount && (
          <p className="text-sm text-muted-foreground">{playlist.track_count} songs</p>
        )}
      </div>
    </Link>
  );
}

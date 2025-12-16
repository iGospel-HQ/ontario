"use client"
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useAudioPlayer } from '@/store/use-audio-player';
import { cn } from '@/lib/utils';
import api from '@/lib/api-client';

// Type definition based on provided artist data
interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  image: string;
  website: string;
  album_count: number;
  track_count: number;
  followers_count: number;
  is_following: boolean;
  top_tracks: Array<{
    id: string;
    title: string;
    slug: string;
    artist_name: string;
    duration: string;
    mp3_file: string;
    image: string;
    genre_name: string | null;
  }>;
  latest_album: any | null; // Expand if needed
  created_at: string;
}

// Fetch function
const fetchArtist = async (slug: string): Promise<Artist> => {
  const response = await api.get(`/music/artists/${slug}/`); // Replace with actual API endpoint
  return response.data;
};

export default function ArtistPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: artist, isLoading, error } = useQuery({
    queryKey: ['artist', slug],
    queryFn: () => fetchArtist(slug),
  });

  const playTrack = useAudioPlayer((s) => s.playTrack);
  const togglePlay = useAudioPlayer((s) => s.togglePlay);
  const currentTrack = useAudioPlayer((s) => s.currentTrack);
  const isPlaying = useAudioPlayer((s) => s.isPlaying);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-600">Error loading artist: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <Skeleton className="w-48 h-48 rounded-full" />
          <div className="space-y-4 w-full">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600">Artist not found.</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Artist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
        <div className="relative w-48 h-48 flex-shrink-0">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{artist.name}</h1>
          <p className="text-gray-600 mb-4">{artist.bio || 'No bio available.'}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
            {artist.website && (
              <Button variant="outline" asChild>
                <Link href={artist.website} target="_blank" rel="noopener noreferrer">
                  Website
                </Link>
              </Button>
            )}
            <Badge variant="secondary">{artist.followers_count} Followers</Badge>
            <Button variant={artist.is_following ? 'secondary' : 'default'}>
              {artist.is_following ? 'Following' : 'Follow'}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            {artist.album_count} Albums • {artist.track_count} Tracks
          </p>
        </div>
      </div>

      {/* Top Tracks */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tracks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {artist.top_tracks.map((track, i) => (
              <div
                key={track.id}
                className={cn(
                  'flex items-center gap-4 p-4 cursor-pointer transition-colors',
                  currentTrack?.id === track.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                )}
                
              >
                <div className="text-lg font-bold text-gray-300 w-6 text-center">
                  {i + 1}
                </div>
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={track.image}
                    alt={track.title}
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{track.title}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {track.artist_name} {track.genre_name ? `• ${track.genre_name}` : ''}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{track.duration}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => {
                  if (currentTrack?.id === track.id) {
                    togglePlay();
                  } else {
                    playTrack({
                      id: track.id,
                      title: track.title,
                      artist: track.artist_name,
                      cover: track.image,
                      audioUrl: track.mp3_file,
                    });
                  }
                }}
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
          {artist.top_tracks.length === 0 && (
            <p className="p-4 text-center text-gray-600">No tracks available.</p>
          )}
        </CardContent>
      </Card>

      {/* Latest Album - If available */}
      {artist.latest_album && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Latest Album</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Render album details here */}
            <p>Coming soon...</p> {/* Placeholder; expand based on data */}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
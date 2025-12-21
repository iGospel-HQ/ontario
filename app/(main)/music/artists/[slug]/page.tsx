"use client";

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useAudioPlayer } from '@/store/use-audio-player';
import { cn } from '@/lib/utils';
import api from '@/lib/api-client';

// Type definition for Artist
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
  latest_album: any | null;
  created_at: string;
}

// Type definition for Blog Post (simplified)
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author_name: string;
  excerpt: string;
  featured_image: string;
  publish_date: string;
  genres?: Array<{ name: string }>;
}

const fetchArtist = async (slug: string): Promise<Artist> => {
  const response = await api.get(`/music/artists/${slug}/`);
  return response.data;
};

const fetchArtistPosts = async (slug: string): Promise<BlogPost[]> => {
  const response = await api.get(`/music/artists/${slug}/posts/`);
  return response.data;
};

export default function ArtistPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: artist, isLoading: artistLoading, error: artistError } = useQuery({
    queryKey: ['artist', slug],
    queryFn: () => fetchArtist(slug),
  });

  const { data: posts = [], isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['artist-posts', slug],
    queryFn: () => fetchArtistPosts(slug),
  });

  const playTrack = useAudioPlayer((s) => s.playTrack);
  const togglePlay = useAudioPlayer((s) => s.togglePlay);
  const currentTrack = useAudioPlayer((s) => s.currentTrack);
  const isPlaying = useAudioPlayer((s) => s.isPlaying);

  const isLoading = artistLoading || postsLoading;
  const error = artistError || postsError;

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
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
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
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{artist.name}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6">{artist.bio || 'No bio available.'}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
            {artist.website && (
              <Button variant="outline" asChild>
                <Link href={artist.website} target="_blank" rel="noopener noreferrer">
                  Website
                </Link>
              </Button>
            )}
            <Badge variant="secondary" className="text-base px-4 py-1">
              {artist.followers_count} Followers
            </Badge>
            <Button variant={artist.is_following ? 'secondary' : 'default'} size="lg">
              {artist.is_following ? 'Following' : 'Follow'}
            </Button>
          </div>
          <p className="text-base text-gray-600">
            {artist.album_count} Albums • {artist.track_count} Tracks
          </p>
        </div>
      </div>

      {/* Top Tracks */}
      {/* <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Top Tracks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {artist.top_tracks.map((track, i) => (
              <div
                key={track.id}
                className={cn(
                  'flex items-center gap-4 p-4 cursor-pointer transition-colors',
                  currentTrack?.id === track.id ? 'bg-accent/10' : 'hover:bg-muted/50'
                )}
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
                <span className="text-sm text-gray-500 hidden sm:block">
                  {track.duration}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
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
      </Card> */}

      {/* Blog Posts Featuring This Artist – Grid Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Blog Posts Featuring {artist.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="hover:border-accent transition-all duration-300 overflow-hidden group h-full pt-0 bg-card border-border">
                      <div className="relative h-56">
                        <Image
                          src={post.featured_image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <span className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold">
                          {post.genres?.[0]?.name || "Gospel"}
                        </span>
                      </div>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-3 group-hover:text-accent transition line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.publish_date), "MMM dd, yyyy")}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {post.author_name}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">
              No blog posts found featuring this artist.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Latest Album (if available) */}
      {artist.latest_album && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl">Latest Album</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Album details coming soon...</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
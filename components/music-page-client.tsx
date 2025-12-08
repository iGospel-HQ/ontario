"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api-client"; // your api instance
import { Skeleton } from "@/components/ui/skeleton";
import { Music2 } from "lucide-react";

export function MusicPageClient() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["music-genres"],
    queryFn: async () => {
      const res = await api.get("/music/genres/");
      return res.data;
    },
  });

  return (
    <main className="max-w-6xl mx-auto py-20 px-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold"
        >
          Music Genres
        </motion.h1>
        <p className="text-muted-foreground mt-2">
          Explore genres, discover music, and dive deeper into your sound.
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-xl p-5 shadow-sm flex flex-col space-y-3"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-center text-red-500 mt-10">
          Failed to load genres. Please try again.
        </p>
      )}

      {/* Genres Grid */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((genre: any) => (
            <Link
              key={genre.id}
              href={`/music/genres/${genre.slug}`}
              className="group border rounded-xl p-5 shadow-sm transition hover:bg-muted/40"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-accent">
                  <Music2 className="w-6 h-6 text-primary" />
                </div>

                <h2 className="text-xl font-semibold group-hover:underline">
                  {genre.name}
                </h2>
              </div>

              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {genre.description || "No description available."}
              </p>

              <div className="flex items-center gap-4 mt-4 text-sm font-medium">
                <span>{genre.album_count} Albums</span>
                <span>{genre.track_count} Tracks</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

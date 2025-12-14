"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams, useRouter } from "next/navigation";

export function ArtistsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || 1);

  const fetchArtists = async () => {
    const res = await api.get(`/music/artists/?page=${page}`);
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["artists", page],
    queryFn: fetchArtists,
  });

  const artists = data?.results ?? [];
  const hasNext = Boolean(data?.next);
  const hasPrev = Boolean(data?.previous);

  const goToPage = (p: number) => {
    window.location.href = `/music/artists?page=${p}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <main className="min-h-screen px-4 md:px-10 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <h1 className="text-5xl font-bold tracking-tight">Artists</h1>
          <p className="text-muted-foreground text-lg mt-2">
            Discover amazing creators, musicians, and performers.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 max-w-md">
          <Input
            placeholder="Search artists..."
            className="bg-secondary/50 backdrop-blur border border-border/40"
          />
        </motion.div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-center space-y-4">
                <Skeleton className="w-40 h-40 rounded-full mx-auto" />
                <Skeleton className="h-5 w-32 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Artists Grid */}
        {!isLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {artists.map((artist: any) => (
              <motion.div key={artist.id} variants={itemVariants}>
                <Link href={`/music/artists/${artist.slug}`}>
                  <div className="group cursor-pointer text-center p-6 rounded-2xl border bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                    <div className="relative mb-5 overflow-hidden rounded-full w-44 h-44 mx-auto shadow-md">
                      <img
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.name}
                        className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h3 className="font-semibold text-xl group-hover:text-primary transition-colors line-clamp-1">
                      {artist.name}
                    </h3>

                    <p className="text-sm mt-1 text-muted-foreground">
                      {Math.floor(artist.followers_count / 1000)}K followers
                    </p>

                    <div className="flex justify-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span>{artist.album_count} Albums</span>
                      <span>{artist.track_count} Tracks</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <Pagination>
            <PaginationContent>

              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(page - 1)}
                  className={!hasPrev ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* Current Page Indicator */}
              <PaginationItem>
                <PaginationLink isActive>
                  {page}
                </PaginationLink>
              </PaginationItem>

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => goToPage(page + 1)}
                  className={!hasNext ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}

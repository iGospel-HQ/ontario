// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import api from "@/lib/api-client"; // your api instance
// import { Skeleton } from "@/components/ui/skeleton";
// import { Music2 } from "lucide-react";

// export function MusicPageClient() {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["music-genres"],
//     queryFn: async () => {
//       const res = await api.get("/music/genres/");
//       return res.data;
//     },
//   });

//   return (
//     <main className="max-w-6xl mx-auto py-20 px-6">
//       {/* Page Header */}
//       <div className="text-center mb-12">
//         <motion.h1
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-4xl font-bold"
//         >
//           Music Genres
//         </motion.h1>
//         <p className="text-muted-foreground mt-2">
//           Explore genres, discover music, and dive deeper into your sound.
//         </p>
//       </div>

//       {/* Loading Skeleton */}
//       {isLoading && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div
//               key={i}
//               className="border rounded-xl p-5 shadow-sm flex flex-col space-y-3"
//             >
//               <Skeleton className="h-10 w-10 rounded-full" />
//               <Skeleton className="h-4 w-32" />
//               <Skeleton className="h-4 w-10/12" />
//               <Skeleton className="h-4 w-1/2" />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Error */}
//       {isError && (
//         <p className="text-center text-red-500 mt-10">
//           Failed to load genres. Please try again.
//         </p>
//       )}

//       {/* Genres Grid */}
//       {!isLoading && data && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {data.map((genre: any) => (
//             <Link
//               key={genre.id}
//               href={`/music/genres/${genre.slug}`}
//               className="group border rounded-xl p-5 shadow-sm transition hover:bg-muted/40"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="p-3 rounded-full bg-accent">
//                   <Music2 className="w-6 h-6 text-primary" />
//                 </div>

//                 <h2 className="text-xl font-semibold group-hover:underline">
//                   {genre.name}
//                 </h2>
//               </div>

//               <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
//                 {genre.description || "No description available."}
//               </p>

//               <div className="flex items-center gap-4 mt-4 text-sm font-medium">
//                 <span>{genre.album_count} Albums</span>
//                 <span>{genre.track_count} Tracks</span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

"use client";


// app/music/page.tsx
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, UserIcon, MusicIcon } from 'lucide-react'; // Assuming lucide-react for icons
import api from '@/lib/api-client';

// Type definition based on the provided data structure
interface MusicPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  featured: boolean;
  publish_date: string;
  author_name: string;
  artists: Array<{ id: string; name: string; slug: string }>;
  tracks: Array<{
    id: string;
    title: string;
    slug: string;
    mp3_file: string;
    duration: string;
    image: string;
  }>;
  genres: Array<{ id: string; name: string; slug: string }>;
  // Add other fields as needed
}

// Fetch function (assuming API endpoint is /api/music-posts)
const fetchMusicPosts = async (): Promise<MusicPost[]> => {
  const response = await api.get('/blog/posts/music/'); // Replace with your actual API endpoint
  return response.data;
};

export function MusicPostsPage() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['music-posts'],
    queryFn: fetchMusicPosts,
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Music Posts</h1>
        <p className="text-red-600">Error loading music posts: {error.message}</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">All Music Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-96 rounded-lg" />
            ))
          : posts?.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col py-0"
              >
                <div className="relative h-48">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-red-600 transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(post.publish_date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-700 line-clamp-3 mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                {/* <CardFooter className="text-sm text-gray-600 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  {post.author_name}
                  {post.artists.length > 0 && (
                    <span className="ml-auto text-right">
                      feat. {post.artists.map((artist) => artist.name).join(', ')}
                    </span>
                  )}
                </CardFooter> */}
              </Card>
            ))}
      </div>
      {!isLoading && posts?.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No music posts found.</p>
      )}
    </section>
  );
}

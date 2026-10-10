import type { MetadataRoute } from "next";
import { getPosts, getSitemapIndex } from "@/lib/api/queries";
import { absoluteUrl } from "@/lib/site";
import type { SitemapIndex } from "@/types/api";

// Regenerated at most hourly.
export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/music", priority: 0.9, changeFrequency: "daily" },
  { path: "/music/artists", priority: 0.7, changeFrequency: "weekly" },
  { path: "/music/songs", priority: 0.7, changeFrequency: "daily" },
  { path: "/music/albums", priority: 0.7, changeFrequency: "weekly" },
  { path: "/music/playlists", priority: 0.6, changeFrequency: "weekly" },
  { path: "/charts", priority: 0.6, changeFrequency: "daily" },
  { path: "/upload", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "monthly" },
];

/** Uses the API's sitemap index; falls back to paging the post list if it isn't deployed yet. */
async function loadIndex(): Promise<SitemapIndex> {
  const index = await getSitemapIndex().catch(() => null);
  if (index) return index;

  const posts: SitemapIndex["posts"] = [];
  for (let page = 1; page <= 25; page++) {
    const data = await getPosts({ page }).catch(() => null);
    if (!data) break;
    posts.push(...data.results.map((p) => ({ slug: p.slug, updated_at: p.updated_at ?? p.publish_date })));
    if (!data.next) break;
  }
  return { posts, artists: [], playlists: [] };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const index = await loadIndex();

  return [
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      changeFrequency,
      priority,
    })),
    ...index.posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...index.artists.map((artist) => ({
      url: absoluteUrl(`/music/artists/${artist.slug}`),
      lastModified: artist.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...index.playlists.map((playlist) => ({
      url: absoluteUrl(`/music/playlists/${playlist.slug}`),
      lastModified: playlist.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}

import "server-only";
import { cache } from "react";
import { apiGet } from "@/lib/api/server";
import type {
  Artist,
  Genre,
  HomepageData,
  MusicTrack,
  Paginated,
  Playlist,
  PostDetail,
  PostSummary,
  SitemapIndex,
} from "@/types/api";

export const POSTS_PAGE_SIZE = 20;

/**
 * Cache tags, refreshed on demand by Django (blog/revalidate.py) when content
 * changes. Keep in sync with the backend.
 */
export const POSTS_TAG = "posts";
export const postTag = (slug: string) => `post:${slug}`;

const emptyPage = <T>(): Paginated<T> => ({ count: 0, next: null, previous: null, results: [] });

export const getHomepage = cache(() => apiGet<HomepageData>("/blog/homepage/", { tags: [POSTS_TAG] }));

export async function getPosts({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<PostSummary>>("/blog/posts/", {
    query: { view: "summary", page, page_size: POSTS_PAGE_SIZE, search: q },
    tags: [POSTS_TAG],
  });
  return data ?? emptyPage<PostSummary>();
}

export async function getMusicPosts({
  page = 1,
  q,
  sort,
}: { page?: number; q?: string; sort?: "date" | "title" } = {}) {
  const data = await apiGet<Paginated<PostSummary>>("/blog/posts/music/", {
    query: {
      view: "summary",
      page,
      page_size: POSTS_PAGE_SIZE,
      search: q,
      ordering: sort === "title" ? "title" : undefined,
    },
    tags: [POSTS_TAG],
  });
  return data ?? emptyPage<PostSummary>();
}

/** Cached per request so generateMetadata and the page share one fetch. */
export const getPost = cache((slug: string) =>
  apiGet<PostDetail>(`/blog/posts/${encodeURIComponent(slug)}/`, {
    revalidate: 600,
    // Site-wide ads live on every post page, so "posts" refreshes them all.
    tags: [POSTS_TAG, postTag(slug)],
  }),
);

export async function getArtists({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<Artist>>("/music/artists/", { query: { page, search: q } });
  return data ?? emptyPage<Artist>();
}

export const getArtist = cache((slug: string) =>
  apiGet<Artist>(`/music/artists/${encodeURIComponent(slug)}/`, { revalidate: 600 }),
);

export async function getArtistPosts(slug: string) {
  const posts = await apiGet<PostSummary[]>(`/music/artists/${encodeURIComponent(slug)}/posts/`, {
    revalidate: 600,
    tags: [POSTS_TAG],
  });
  return posts ?? [];
}

export async function getTracks({
  page = 1,
  q,
  genre,
}: { page?: number; q?: string; genre?: string } = {}) {
  const data = await apiGet<Paginated<MusicTrack>>("/music/tracks/", {
    query: { page, page_size: POSTS_PAGE_SIZE, search: q, genre, ordering: "-created_at" },
  });
  return data ?? emptyPage<MusicTrack>();
}

export async function getGenres() {
  const data = await apiGet<Paginated<Genre>>("/music/genres/", { revalidate: 3600 });
  return data?.results ?? [];
}

export async function getPopularTracks() {
  return (await apiGet<MusicTrack[]>("/music/popular-tracks/")) ?? [];
}

export async function getLatestTracks() {
  return (await apiGet<MusicTrack[]>("/music/latest-tracks/")) ?? [];
}

export async function getPlaylists({ q }: { q?: string } = {}) {
  const data = await apiGet<Paginated<Playlist>>("/music/playlists/", { query: { search: q } });
  return data ?? emptyPage<Playlist>();
}

export const getPlaylist = cache((slug: string) =>
  apiGet<Playlist>(`/music/playlists/${encodeURIComponent(slug)}/`, { revalidate: 600 }),
);

export async function getSitemapIndex() {
  return apiGet<SitemapIndex>("/blog/sitemap/", { revalidate: 3600, tags: [POSTS_TAG] });
}

/** Fan out to every searchable endpoint; one failing source doesn't fail the page. */
export async function searchAll(q: string) {
  const settle = async <T>(promise: Promise<Paginated<T> | null>) =>
    (await promise.catch(() => null))?.results.slice(0, 8) ?? [];

  const [posts, tracks, artists, playlists] = await Promise.all([
    settle(apiGet<Paginated<PostSummary>>("/blog/posts/", { query: { view: "summary", search: q } })),
    settle(apiGet<Paginated<MusicTrack>>("/music/tracks/", { query: { search: q } })),
    settle(apiGet<Paginated<Artist>>("/music/artists/", { query: { search: q } })),
    settle(apiGet<Paginated<Playlist>>("/music/playlists/", { query: { search: q } })),
  ]);
  return { posts, tracks, artists, playlists };
}

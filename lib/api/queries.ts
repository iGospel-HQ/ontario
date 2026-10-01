import "server-only";
import { cache } from "react";
import { apiGet } from "@/lib/api/server";
import type {
  Artist,
  HomepageData,
  MusicTrack,
  Paginated,
  Playlist,
  PostDetail,
  PostSummary,
  SitemapIndex,
} from "@/types/api";

export const POSTS_PAGE_SIZE = 20;

const emptyPage = <T>(): Paginated<T> => ({ count: 0, next: null, previous: null, results: [] });

export const getHomepage = cache(() => apiGet<HomepageData>("/blog/homepage/"));

export async function getPosts({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<PostSummary>>("/blog/posts/", {
    query: { view: "summary", page, page_size: POSTS_PAGE_SIZE, search: q },
  });
  return data ?? emptyPage<PostSummary>();
}

export async function getMusicPosts({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<PostSummary>>("/blog/posts/music/", {
    query: { view: "summary", page, page_size: POSTS_PAGE_SIZE, search: q },
  });
  return data ?? emptyPage<PostSummary>();
}

/** Cached per request so generateMetadata and the page share one fetch. */
export const getPost = cache((slug: string) =>
  apiGet<PostDetail>(`/blog/posts/${encodeURIComponent(slug)}/`, { revalidate: 600 }),
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
  });
  return posts ?? [];
}

export async function getTracks({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<MusicTrack>>("/music/tracks/", {
    query: { page, page_size: POSTS_PAGE_SIZE, search: q, ordering: "-created_at" },
  });
  return data ?? emptyPage<MusicTrack>();
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
  return apiGet<SitemapIndex>("/blog/sitemap/", { revalidate: 3600 });
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

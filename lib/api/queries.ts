import "server-only";
import { cache } from "react";
import { apiGet } from "@/lib/api/server";
import type {
  AdBanner,
  Artist,
  Chart,
  ChartCity,
  ChartReport,
  BlogBackground,
  Genre,
  HomepageData,
  Minister,
  MinisterDetail,
  MusicTrack,
  Paginated,
  Playlist,
  PostDetail,
  PostSummary,
  SermonPlaylist,
  SermonPlaylistDetail,
  SermonSeries,
  SermonSeriesDetail,
  SitemapIndex,
} from "@/types/api";

export const POSTS_PAGE_SIZE = 20;

/**
 * Cache tags, refreshed on demand by Django (blog/revalidate.py) when content
 * changes. Keep in sync with the backend.
 */
export const POSTS_TAG = "posts";
export const postTag = (slug: string) => `post:${slug}`;
export const BACKGROUND_TAG = "background";
/** Ad banners set to show on the whole site. */
export const ADS_TAG = "ads";
/** Tracks, albums, artists, genres and playlists. */
export const MUSIC_TAG = "music";

const emptyPage = <T>(): Paginated<T> => ({ count: 0, next: null, previous: null, results: [] });

/**
 * List endpoints (popular/latest tracks, artist posts) return a plain array,
 * but Django's SmartAutoPaginationMiddleware wraps a list in
 * { pagination, results } once it grows past 20 items. We request the full
 * list (no_pagination) and still accept either shape, so growth never breaks
 * a page or the build.
 */
const UNPAGINATED = { no_pagination: 1 };
function asList<T>(data: T[] | { results?: T[] } | null): T[] {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

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

/** Sermon posts (a sermon attached, or in the Sermons category), newest first. */
export async function getSermonPosts({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<PostSummary>>("/blog/posts/sermons/", {
    query: { view: "summary", page, page_size: POSTS_PAGE_SIZE, search: q },
    tags: [POSTS_TAG],
  });
  return data ?? emptyPage<PostSummary>();
}

// --- Sermons (ministry app): ministers, series and sermon playlists ---------------
/** Ministry content isn't revalidated on demand yet, so it refreshes every 5 minutes. */
const SERMONS_REVALIDATE = 300;

export async function getMinisters({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<Minister>>("/ministry/ministers/", {
    query: { page, search: q },
    revalidate: SERMONS_REVALIDATE,
  });
  return data ?? emptyPage<Minister>();
}

export const getMinister = cache((slug: string) =>
  apiGet<MinisterDetail>(`/ministry/ministers/${encodeURIComponent(slug)}/`, { revalidate: SERMONS_REVALIDATE }),
);

export async function getSermonSeriesList({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<SermonSeries>>("/ministry/series/", {
    query: { page, search: q },
    revalidate: SERMONS_REVALIDATE,
  });
  return data ?? emptyPage<SermonSeries>();
}

export const getSermonSeries = cache((slug: string) =>
  apiGet<SermonSeriesDetail>(`/ministry/series/${encodeURIComponent(slug)}/`, { revalidate: SERMONS_REVALIDATE }),
);

export async function getSermonPlaylists({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<SermonPlaylist>>("/ministry/playlists/", {
    query: { page, search: q },
    revalidate: SERMONS_REVALIDATE,
  });
  return data ?? emptyPage<SermonPlaylist>();
}

export const getSermonPlaylist = cache((slug: string) =>
  apiGet<SermonPlaylistDetail>(`/ministry/playlists/${encodeURIComponent(slug)}/`, { revalidate: SERMONS_REVALIDATE }),
);

/** Album posts (posts with an album attached), newest first. */
export async function getAlbumPosts({
  page = 1,
  q,
  sort,
}: { page?: number; q?: string; sort?: "date" | "title" } = {}) {
  const data = await apiGet<Paginated<PostSummary>>("/blog/posts/", {
    query: {
      view: "summary",
      type: "album",
      page,
      page_size: POSTS_PAGE_SIZE,
      search: q,
      ordering: sort === "title" ? "title" : undefined,
    },
    tags: [POSTS_TAG],
  });
  return data ?? emptyPage<PostSummary>();
}

/**
 * Ads set to "Whole site": header/footer banners on every page and listing
 * sidebars. Never breaks a page: no ads if the API is unreachable.
 */
export const getSiteWideAds = cache(async () =>
  asList(
    await apiGet<AdBanner[] | { results?: AdBanner[] }>("/blog/ads/site-wide/", {
      query: UNPAGINATED,
      tags: [ADS_TAG],
    }).catch(() => null),
  ),
);

/** Cached per request so generateMetadata and the page share one fetch. */
export const getPost = cache((slug: string) =>
  apiGet<PostDetail>(`/blog/posts/${encodeURIComponent(slug)}/`, {
    revalidate: 60,
    // Site-wide ads live on every post page, so "posts" refreshes them all.
    tags: [POSTS_TAG, postTag(slug)],
  }),
);

export async function getArtists({ page = 1, q }: { page?: number; q?: string } = {}) {
  const data = await apiGet<Paginated<Artist>>("/music/artists/", { query: { page, search: q }, tags: [MUSIC_TAG] });
  return data ?? emptyPage<Artist>();
}

export const getArtist = cache((slug: string) =>
  apiGet<Artist>(`/music/artists/${encodeURIComponent(slug)}/`, { revalidate: 60, tags: [MUSIC_TAG] }),
);

export async function getArtistPosts(slug: string) {
  const posts = await apiGet<PostSummary[] | { results?: PostSummary[] }>(
    `/music/artists/${encodeURIComponent(slug)}/posts/`,
    { query: UNPAGINATED, revalidate: 60, tags: [POSTS_TAG] },
  );
  return asList(posts);
}

export async function getTracks({
  page = 1,
  q,
  genre,
}: { page?: number; q?: string; genre?: string } = {}) {
  const data = await apiGet<Paginated<MusicTrack>>("/music/tracks/", {
    query: { page, page_size: POSTS_PAGE_SIZE, search: q, genre, ordering: "-created_at" },
    tags: [MUSIC_TAG],
  });
  return data ?? emptyPage<MusicTrack>();
}

export async function getGenres() {
  const data = await apiGet<Paginated<Genre>>("/music/genres/", { revalidate: 3600, tags: [MUSIC_TAG] });
  return data?.results ?? [];
}

export async function getPopularTracks() {
  return asList(
    await apiGet<MusicTrack[] | { results?: MusicTrack[] }>("/music/popular-tracks/", {
      query: UNPAGINATED,
      tags: [MUSIC_TAG],
    }),
  );
}

/** Charts change with every play, so they're refreshed on a timer rather than by tag. */
const CHART_REVALIDATE = 600;

export async function getChartCities(days?: number) {
  return asList(
    await apiGet<ChartCity[] | { results?: ChartCity[] }>("/music/charts/cities/", {
      query: { ...UNPAGINATED, days },
      revalidate: CHART_REVALIDATE,
    }),
  );
}

/** Top tracks by plays in the period, site-wide or in one city (null: no plays from that city). */
export const getChart = cache((city?: string, days?: number) =>
  apiGet<Chart>("/music/charts/", { query: { city, days, limit: 20 }, revalidate: CHART_REVALIDATE }),
);

/** The monthly chart report ("2026-10"); without a month, the latest one. null: no report. */
export const getChartReport = cache((month?: string) =>
  apiGet<ChartReport>("/music/charts/report/", { query: { month }, revalidate: 3600 }),
);

/** Today's Bible verse (BibleGateway, KJV; the API caches it for the day). */
export const getVerseOfTheDay = cache(() =>
  apiGet<{ reference: string; text: string; url: string; version: string; date: string }>("/blog/verse-of-the-day/", {
    revalidate: 3600,
  }),
);

export async function getLatestTracks() {
  return asList(
    await apiGet<MusicTrack[] | { results?: MusicTrack[] }>("/music/latest-tracks/", {
      query: UNPAGINATED,
      tags: [MUSIC_TAG],
    }),
  );
}

export async function getPlaylists({ q }: { q?: string } = {}) {
  const data = await apiGet<Paginated<Playlist>>("/music/playlists/", { query: { search: q }, tags: [MUSIC_TAG] });
  return data ?? emptyPage<Playlist>();
}

export const getPlaylist = cache((slug: string) =>
  apiGet<Playlist>(`/music/playlists/${encodeURIComponent(slug)}/`, { revalidate: 60, tags: [MUSIC_TAG] }),
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

/**
 * The admin-scheduled site background, or null (use the default). Re-checked
 * every 5 minutes so time-of-day rotations take effect, and refreshed at once
 * when changed in the admin.
 */
export const getBackground = cache(async () => {
  const data = await apiGet<{ background: BlogBackground | null }>("/blog/background/", {
    revalidate: 300,
    tags: [BACKGROUND_TAG],
  }).catch(() => null);
  return data?.background ?? null;
});

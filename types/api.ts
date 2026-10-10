// Response shapes of the iGospel Django API (https://api.igospel.ng/v1).

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

/** `/blog/posts/?view=summary` and `/blog/posts/music/?view=summary` */
export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  publish_date: string;
  updated_at?: string;
  author_name: string;
  genres?: Genre[];
}

/** Posts embedded in `/blog/homepage/` (HomepagePostSerializer) */
export interface HomepagePost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  publish_date: string;
  updated_at: string;
  author: string;
  category: string | null;
}

/** Tracks embedded in `/blog/homepage/` (HomepageTrackSerializer) */
export interface HomepageTrack {
  id: string;
  title: string;
  artist: string;
  mp3_file: string;
  image: string | null;
  duration: string | null;
}

export interface HomepageData {
  latest_posts: HomepagePost[];
  random_posts: HomepagePost[];
  featured_posts: HomepagePost[];
  trending_posts: HomepagePost[];
  igospel_playlist: HomepageTrack[];
}

export interface PostTrack {
  id: string;
  title: string;
  slug: string;
  mp3_file: string;
  duration: string | null;
  image: string | null;
  is_downloadable: boolean;
  download_url: string | null;
  artist_name?: string;
  track_number?: number | null;
}

export interface AdBanner {
  id: string | number;
  title: string;
  image: string;
  link: string;
  position: "header" | "in_post" | "sidebar" | "footer" | string;
  /** site_wide (every page), all_posts, selected_posts */
  placement?: string;
}

export interface Comment {
  id: string | number;
  name: string | null;
  author_name: string;
  author_avatar: string | null;
  content: string;
  created_at: string;
}

export interface SupportStatus {
  support: boolean;
  /** Profile ID that receives support: the artist's account, else the iGospel account. */
  creator_id?: string | null;
  message?: string;
}

/** Album attached to a post, with its tracks in album order. */
export interface PostAlbum {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  release_date: string | null;
  artist_name?: string;
  /** Missing from older API versions. */
  tracks?: PostTrack[];
}

/** `/blog/posts/<slug>/` (PostSerializer) */
export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  publish_date: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  author_name: string;
  artists: { id: string; name: string; slug: string }[];
  tracks: PostTrack[];
  albums: PostAlbum[];
  genres: Genre[];
  support_status?: SupportStatus;
  creator_id?: string | null;
  comments: Comment[];
  total_views: number;
  total_visitors: number;
  today_views: number;
  today_visitors: number;
  ads?: { content_ads: AdBanner[] };
}

/** `/music/tracks/` (MusicTrackSerializer) */
export interface MusicTrack {
  id: string;
  title: string;
  slug: string;
  artist_name: string;
  artist_slug: string;
  album_title: string | null;
  album_cover: string | null;
  genre_name: string | null;
  duration: string | null;
  duration_display: string | null;
  mp3_file: string;
  image: string | null;
  plays_count: number;
  release_date: string | null;
}

/** `/music/artists/` (MusicArtistSerializer) */
export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  image: string | null;
  website: string;
  album_count: number;
  track_count: number;
  followers_count: number;
  is_following: boolean;
  latest_album: { id: string; title: string; slug: string } | null;
  created_at: string;
}

/** `/music/playlists/` (MusicPlaylistSerializer) */
export interface Playlist {
  id: string;
  title: string;
  slug: string;
  owner_name: string;
  description: string;
  cover_image: string | null;
  track_count: number;
  total_duration: string | null;
  tracks: MusicTrack[];
  created_at: string;
  updated_at: string;
}

/** `/blog/sitemap/` */
export interface SitemapIndex {
  posts: { slug: string; updated_at: string }[];
  artists: { slug: string; created_at: string }[];
  playlists: { slug: string; updated_at: string }[];
}

/** `/blog/background/` (BlogBackgroundSerializer); null when none is scheduled. */
export interface BlogBackground {
  id: number;
  title: string;
  image: string;
  display: "cover" | "natural" | "tile";
  /** Tile only: copies across the screen, each scaled to show the whole image. */
  tile_columns: number | null;
  background_color: string;
  updated_at: string;
}

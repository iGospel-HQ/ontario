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
  plays_count?: number;
  download_count?: number;
  /** "Set as caller tune" codes, in the order MTN, Airtel, Glo, 9mobile. */
  caller_tunes?: CallerTune[];
  /** Bible passages behind the song (KJV text; empty text if the reference wasn't found). */
  scripture?: ScripturePassage[];
  /** Sanitized HTML: the story behind the song. */
  song_story?: string;
  /** Vertical MP4 for WhatsApp Status (60s by default), once generated. */
  status_clip?: string | null;
}

export interface CallerTune {
  network: "mtn" | "airtel" | "glo" | "9mobile" | string;
  network_name: string;
  code: string;
  /** Short code to text the code to; empty when unknown. */
  send_to: string;
}

export interface ScripturePassage {
  reference: string;
  text: string;
  url: string;
}

/** `/music/charts/cities/` */
export interface ChartCity {
  name: string;
  slug: string;
  region: string;
  country_code: string;
  plays: number;
}

/** `/music/charts/` */
export interface ChartTrack {
  rank: number;
  plays: number;
  id: string;
  title: string;
  slug: string;
  artist_name: string;
  artist_slug: string;
  image: string | null;
  mp3_file: string | null;
  duration: string | null;
  post_slug: string | null;
}

/** `/music/charts/report/?month=2026-10` (monthly report) */
export interface ChartReport {
  month: string;
  /** "October 2026" */
  label: string;
  /** The month isn't over yet (numbers so far). */
  is_current: boolean;
  totals: { plays: number; listeners: number; songs: number; cities: number; downloads: number; shares: number };
  top_tracks: ChartTrack[];
  cities: { name: string; slug: string; plays: number; tracks: ChartTrack[] }[];
  /** `plays` holds the number of shares / downloads in these two lists. */
  most_shared: ChartTrack[];
  most_downloaded: ChartTrack[];
  /** Months with a report, newest first ("2026-10", ...). */
  months: string[];
}

export interface Chart {
  city: ChartCity | null;
  days: number;
  tracks: ChartTrack[];
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

/** Counts for today, the selected period, the period before it and all time. */
export interface Windowed {
  today: number;
  period: number;
  previous: number;
  all_time: number;
}

/** `/stats/overview/?period=today|yesterday|7|30|90` (staff only). */
export interface AdminOverview {
  generated_at: string;
  days: number;
  period?: string;
  /** "today", "yesterday", "last 7 days" */
  label?: string;
  /** What changes are measured against: "the same time yesterday", "the previous 7 days" */
  previous_label?: string;
  /** Series rows are per hour (one-day periods; date = ISO datetime) or per day. */
  bucket?: "hour" | "day";
  /** Visits to every page of the site except the dashboard. */
  traffic: {
    views: Windowed;
    visitors: Windowed;
    series: { date: string; views: number; visitors: number }[];
    top_posts: { title: string; slug: string; views: number }[];
    /** Missing from older APIs (post-only traffic). */
    top_pages?: { path: string; label: string; views: number }[];
    /** "Google", "WhatsApp", "Direct & apps"... */
    sources?: { source: string; views: number }[];
    /** { mobile, tablet, desktop, unknown } */
    devices?: Record<string, number>;
    top_countries?: { country: string; views: number }[];
  };
  downloads: Windowed & {
    series: { date: string; downloads: number }[];
    top_tracks: { title: string; artist: string; downloads: number }[];
  };
  /** Song video shares (WhatsApp Status, Stories, TikTok...). Missing from older APIs. */
  shares?: Windowed & {
    series: { date: string; shares: number }[];
    by_platform: { platform: string; shares: number }[];
    top_tracks: { title: string; artist: string; shares: number }[];
    /** Clip sponsors running now, with the videos carrying each and their shares. */
    sponsors?: { name: string; shares: number; videos: number; since: string; songs: string }[];
    /** Older APIs: the single sponsor. */
    sponsor?: { name: string; shares: number; since: string } | null;
  };
  plays: Windowed & {
    series: { date: string; plays: number }[];
    top_tracks: { title: string; artist: string; plays: number }[];
    top_countries: { country: string; plays: number }[];
    unknown_country: number;
  };
  users: Windowed & { active: number; staff: number; series: { date: string; signups: number }[] };
  artists: { total: number; active: number; with_account: number; new_period: number };
  music: {
    tracks: number;
    singles: number;
    album_tracks: number;
    albums: number;
    downloadable: number;
    new_tracks_period: number;
    genres: number;
    playlists: number;
  };
  content: {
    published: number;
    scheduled: number;
    drafts: number;
    published_period: number;
    comments: number;
    comments_pending: number;
    newsletter_subscribers: number;
    contact_messages: number;
    contact_messages_period: number;
  };
  money: {
    donations_total: number;
    donations_period: number;
    donations_previous: number;
    donations_count_period: number;
    commission_total: number;
    pending_withdrawals: number;
    pending_withdrawals_amount: number;
    series: { date: string; donations: number }[];
    recent_donations: { amount: number; creator: string; date: string }[];
  };
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

// API client for fetching dummy data
// In a real app, this would make actual API calls

export async function fetchBlogPosts(page = 1, limit = 10) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    posts: Array.from({ length: limit }).map((_, i) => ({
      id: `blog-${page * limit + i}`,
      slug: `blog-post-${page * limit + i}`,
      title: `The Evolution of Music Streaming: Article ${page * limit + i + 1}`,
      excerpt: "Exploring how music platforms have transformed the way we discover and consume music.",
      category: ["Music", "Technology", "Culture", "Trends"][Math.floor(Math.random() * 4)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      author: "Editorial Team",
      imageUrl: `/placeholder.svg?height=300&width=400&query=music blog article`,
      content: "Full blog content here...",
    })),
    total: 150,
  }
}

export async function fetchBlogPost(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    id: slug,
    slug,
    title: "The Evolution of Music Streaming",
    category: "Music",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Editorial Team",
    image: `/placeholder.svg?height=400&width=800&query=music streaming`,
    content: "<h2>Introduction</h2><p>Music streaming has revolutionized how we access and enjoy music...</p>",
  }
}

export async function fetchSongs(page = 1, limit = 20) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    songs: Array.from({ length: limit }).map((_, i) => ({
      id: `song-${page * limit + i}`,
      title: `Track Title ${page * limit + i + 1}`,
      artist: "Artist Name",
      album: "Album Name",
      duration: "3:45",
      genre: ["Electronic", "Hip-Hop", "Indie", "Pop"][Math.floor(Math.random() * 4)],
      streamUrl: "/dummy/track.mp3",
      cover: `/placeholder.svg?height=200&width=200&query=album cover`,
    })),
    total: 500,
  }
}

export async function fetchPlaylists(page = 1, limit = 12) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    playlists: Array.from({ length: limit }).map((_, i) => ({
      id: `playlist-${i}`,
      name: ["Chill Vibes", "Workout Mix", "Night Drive", "Study Focus", "Party Hits", "Lo-fi Beats"][
        Math.floor(Math.random() * 6)
      ],
      description: "Curated collection of tracks",
      cover: `/placeholder.svg?height=250&width=250&query=playlist cover music`,
      songCount: Math.floor(Math.random() * 50) + 10,
      songs: [],
    })),
    total: 100,
  }
}

export async function fetchArtists(page = 1, limit = 12) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    artists: Array.from({ length: limit }).map((_, i) => ({
      id: `artist-${i}`,
      name: `Artist Name ${i + 1}`,
      bio: "Rising artist in the music industry",
      image: `/placeholder.svg?height=300&width=300&query=artist portrait`,
      followers: Math.floor(Math.random() * 1000000),
    })),
    total: 200,
  }
}

export async function fetchCharts() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    weeklyTop10: Array.from({ length: 10 }).map((_, i) => ({
      id: `chart-${i}`,
      rank: i + 1,
      title: `Top Song ${i + 1}`,
      artist: "Artist Name",
      plays: Math.floor(Math.random() * 1000000) + 100000,
    })),
    trendingSongs: Array.from({ length: 5 }).map((_, i) => ({
      id: `trending-${i}`,
      title: `Trending Song ${i + 1}`,
      artist: "Artist Name",
      trend: Math.floor(Math.random() * 100) + 10,
    })),
  }
}

export async function searchContent(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    songs: Array.from({ length: 5 }).map((_, i) => ({
      type: "song",
      id: `search-song-${i}`,
      title: `${query} Song ${i + 1}`,
      artist: "Artist Name",
    })),
    playlists: Array.from({ length: 3 }).map((_, i) => ({
      type: "playlist",
      id: `search-playlist-${i}`,
      name: `${query} Playlist ${i + 1}`,
      description: "Collection of tracks",
    })),
    artists: Array.from({ length: 3 }).map((_, i) => ({
      type: "artist",
      id: `search-artist-${i}`,
      name: `${query} Artist ${i + 1}`,
    })),
    posts: Array.from({ length: 3 }).map((_, i) => ({
      type: "post",
      id: `search-post-${i}`,
      title: `${query} Article ${i + 1}`,
      excerpt: "Blog post excerpt",
    })),
  }
}

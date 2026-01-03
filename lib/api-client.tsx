// API client for fetching dummy data
// In a real app, this would make actual API calls

import { useAuthStore } from "@/store/use-auth-store";
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.igospels.com.ng/v1",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = "/login";
      // originalRequest._retry = true
      // const refreshed = await refreshAccessToken()
      // if (refreshed) {
      //   return api(originalRequest)
      // }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  getDashboardStats: async () => {
    const response = await api.get("/transaction/dashboard/");
    return response.data;
  },
  getBanks: async () => {
    const response = await api.get("/transaction/payout/banks/");
    return response.data.data;
  },
  getBankDetailsByNumber: async (accountNumber: string, bankCode: string) => {
    const response = await api.post("/transaction/payout/bank-details/", {
      account_number: accountNumber,
      bank_code: bankCode,
    });
    return response.data.data.accountName; // Returns bank account name
  },
  getWalletBankAccounts: async () => {
    const response = await api.get("/wallet/bank-accounts/");
    return response.data;
  },
  addWalletBankAccount: async (data: any) => {
    const response = await api.post("/wallet/bank-accounts/", data);
    return response.data;
  },
  getWalletTransactions: async (page = 1) => {
    const response = await api.get(`/wallet/wallet-transactions/?page=${page}`);
    return response.data;
  },
  getWithdrawalsTransactions: async (page = 1) => {
    const response = await api.get(
      `/wallet/withdrawal-transactions/?page=${page}`
    );
    return response.data;
  },
  publishContent: async (formData: FormData) => {
    const response = await api.post("/content/publish/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  setupTransactionPin: (payload: any) =>
    api.post("/transaction/pin/setup/", payload),

  changeTransactionPin: (payload: any) =>
    api.post("/transaction/pin/change/", payload),

  withdrawFunds: (payload: any) =>
    api.post("/transaction/payout/withdraw/", payload),

  getUserProfile: async () => {
    const response = await api.get("/account/profile/");
    return response.data;
  },
  updateUserProfile: async (data: any) => {
    const response = await api.patch("/account/profile/", data);
    return response.data;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    const response = await api.patch("/account/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data;
  },
  changePassword: async (oldPassword: string, newPassword: string, newPasswordConfirm: string) => {
    const response = await api.post("/account/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm
    });
    return response.data;
  },
};

export async function fetchBlogPosts(page = 1, limit = 10) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    posts: Array.from({ length: limit }).map((_, i) => ({
      id: `blog-${page * limit + i}`,
      slug: `blog-post-${page * limit + i}`,
      title: `The Evolution of Music Streaming: Article ${
        page * limit + i + 1
      }`,
      excerpt:
        "Exploring how music platforms have transformed the way we discover and consume music.",
      category: ["Music", "Technology", "Culture", "Trends"][
        Math.floor(Math.random() * 4)
      ],
      date: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      author: "Editorial Team",
      imageUrl: `/placeholder.svg?height=300&width=400&query=music blog article`,
      content: "Full blog content here...",
    })),
    total: 150,
  };
}

export async function fetchBlogPost(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    id: slug,
    slug,
    title: "The Evolution of Music Streaming",
    category: "Music",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Editorial Team",
    image: `/placeholder.svg?height=400&width=800&query=music streaming`,
    content:
      "<h2>Introduction</h2><p>Music streaming has revolutionized how we access and enjoy music...</p>",
  };
}

export async function fetchSongs(page = 1, limit = 20) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    songs: Array.from({ length: limit }).map((index, i) => ({
      id: `song-${page * limit + i}`,
      title: `Track Title ${page * limit + i + 1}`,
      artist: "Artist Name",
      album: "Album Name",
      duration: "3:45",
      genre: ["Electronic", "Hip-Hop", "Indie", "Pop"][
        Math.floor(Math.random() * 4)
      ],
      streamUrl: "/dummy/track.mp3",
      cover: `https://picsum.photos/300?random=${index}`,
    })),
    total: 500,
  };
}

export async function fetchPlaylists(page = 1, limit = 12) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    playlists: Array.from({ length: limit }).map((_, i) => ({
      id: `playlist-${i}`,
      name: [
        "Chill Vibes",
        "Workout Mix",
        "Night Drive",
        "Study Focus",
        "Party Hits",
        "Lo-fi Beats",
      ][Math.floor(Math.random() * 6)],
      description: "Curated collection of tracks",
      cover: `/placeholder.svg?height=250&width=250&query=playlist cover music`,
      songCount: Math.floor(Math.random() * 50) + 10,
      songs: [],
    })),
    total: 100,
  };
}

export async function fetchArtists(page = 1, limit = 12) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    artists: Array.from({ length: limit }).map((_, i) => ({
      id: `artist-${i}`,
      name: `Artist Name ${i + 1}`,
      bio: "Rising artist in the music industry",
      image: `/placeholder.svg?height=300&width=300&query=artist portrait`,
      followers: Math.floor(Math.random() * 1000000),
    })),
    total: 200,
  };
}

export async function fetchCharts() {
  await new Promise((resolve) => setTimeout(resolve, 300));
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
  };
}

export async function searchContent(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
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
  };
}

export default api;

import { AxiosInstance } from '@/lib/axios';
import { create } from 'zustand'
import type { Album, Song, Stats } from '@/types';
import toast from "react-hot-toast";

interface MusicStore {
    songs: Song[];
    albums: Album[];
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;
    featuredSongs: Song[];
    madeForYouSongs: Song[];
    trendingSongs: Song[];
    stats: Stats;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchSongs: () => Promise<void>; 
    deleteSong: (id: string) => Promise<void>;
    deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    featuredSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists: 0
    },

    deleteSong: async (id) => {
        set({ isLoading: true, error: null });
        try {
           await AxiosInstance.delete(`/api/admin/songs/${id}`);
            set(state => ({
                songs: state.songs.filter(song => song._id !== id)
                
            }))
            toast.success("Song deleted successfully");
        } catch (error: any) {
            console.log("Error in deleteSong", error);
            toast.error("Error deleting song");
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await AxiosInstance.get("/api/songs");
            set({ songs: response.data });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchStats: async () => { 
        set({ isLoading: true, error: null });
        try {
            const response = await AxiosInstance.get("/api/stats");
            set({ stats: response.data });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbums: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await AxiosInstance.get("/api/albums");
                console.log("Fetched albums:", response.data);
            set({ albums: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbumById: async (id) => {
  set({ isLoading: true, error: null });
  try {
    const response = await AxiosInstance.get(`/api/albums/${id}`);
    
    // 🔥 Supports both raw and wrapped album response
    const album = response.data.album ?? response.data;

    console.log("✅ Album fetched in store:", album);
    set({ currentAlbum: album });
  } catch (error: any) {
    console.error("❌ Error fetching album:", error);
    set({ error: error.message });
  } finally {
    set({ isLoading: false });
  }
},

    fetchFeaturedSongs: async () => { 
        set({ isLoading: true, error: null });
        try {
            const response = await AxiosInstance.get("/api/songs/featured");
            set({ featuredSongs: response.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message });
        } finally { 
            set({ isLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => { 
        set({ isLoading: true, error: null });
        try {
            const response = await AxiosInstance.get("/api/songs/made-for-you");
            set({ madeForYouSongs: response.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTrendingSongs: async () => { 
        set({ isLoading: true, error: null });
        try {
            const response = await AxiosInstance.get("/api/songs/trending");
            set({ trendingSongs: response.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message });
        } finally { 
            set({ isLoading: false });
        }
    },

    deleteAlbum: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await AxiosInstance.delete(`/api/albums/${id}`);
            set(state => ({
                albums: state.albums.filter(album => album._id !== id)
            }));
            toast.success("Album deleted successfully");
        } catch (error: any) {
            console.log("Error in deleteAlbum", error);
            toast.error("Error deleting album");
        } finally {
            set({ isLoading: false });
        }
    }
}));

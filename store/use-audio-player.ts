// app/store/use-audio-player.ts
import { create } from "zustand";

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
}

interface AudioPlayerState {
  isOpen: boolean;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0 to 100
  volume: number;
  isMuted: boolean;
  audioRef: HTMLAudioElement | null;

  setAudioRef: (ref: HTMLAudioElement | null) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  openPlayer: () => void;
  closePlayer: () => void;
  updateProgress: (current: number, dur: number) => void;
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => ({
  isOpen: false,
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  progress: 0,
  volume: 1,
  isMuted: false,
  audioRef: null,

  setAudioRef: (ref) => set({ audioRef: ref }),

  playTrack: (track) => {
    const audio = get().audioRef;

    set({
      currentTrack: track,
      isOpen: true,
      isPlaying: true,
      currentTime: 0,
      progress: 0,
    });

    if (audio) {
      audio.src = track.audioUrl;
      audio.currentTime = 0;
      audio.volume = get().volume;
      audio.muted = get().isMuted;
      audio.play().catch((e) => console.error("Playback failed:", e));
    }
  },

  togglePlay: () => {
    const audio = get().audioRef;
    if (!audio) return;

    if (get().isPlaying) {
      audio.pause();
      set({ isPlaying: false });
    } else {
      audio.play().catch((e) => console.error("Playback failed:", e));
      set({ isPlaying: true });
    }
  },

  seek: (time: number) => {
    const audio = get().audioRef;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(time, audio.duration));
    audio.currentTime = newTime;
    set({
      currentTime: newTime,
      progress: (newTime / audio.duration) * 100 || 0,
    });
  },

  setVolume: (vol: number) => {
    const audio = get().audioRef;
    if (audio) audio.volume = vol;
    set({ volume: vol });
  },

  toggleMute: () => {
    const audio = get().audioRef;
    if (!audio) return;

    const newMuted = !get().isMuted;
    audio.muted = newMuted;
    set({ isMuted: newMuted });
  },

  openPlayer: () => set({ isOpen: true }),
  closePlayer: () => {
    set({
      isOpen: false,
    });
  },

  updateProgress: (current: number, dur: number) =>
    set({
      currentTime: current,
      duration: dur,
      progress: dur > 0 ? (current / dur) * 100 : 0,
    }),
}));
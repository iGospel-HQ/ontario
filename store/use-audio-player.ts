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
  audioRef: HTMLAudioElement | null;

  setAudioRef: (ref: HTMLAudioElement) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  openPlayer: () => void;
  closePlayer: () => void;
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => ({
  isOpen: false,
  currentTrack: null,
  isPlaying: false,
  audioRef: null,

  setAudioRef: (ref) => set({ audioRef: ref }),

  playTrack: (track) => {
    const audio = get().audioRef

    set({
      currentTrack: track,
      isOpen: true,
      isPlaying: true,
    })

    if (audio) {
      audio.src = track.audioUrl
      audio.play()
    }
  },

  togglePlay: () => {
    const audio = get().audioRef
    const playing = get().isPlaying

    if (!audio) return

    if (playing) {
      audio.pause()
      set({ isPlaying: false })
    } else {
      audio.play()
      set({ isPlaying: true })
    }
  },

  // NEW: open player UI without restarting audio
  openPlayer: () =>
    set({
      isOpen: true,
    }),

  closePlayer: () => {
//     const audio = get().audioRef
//     if (audio) audio.pause()

    set({
      isOpen: false,
     //  isPlaying: false,
    })
  },
}))


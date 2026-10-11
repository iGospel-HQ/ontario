"use client";

import { useRef } from "react";
import { siteConfig } from "@/lib/site";
import { visitorId } from "@/lib/visitor";
import { useAudioPlayer } from "@/store/use-audio-player";

/** Seconds of real listening that make a play count as a stream (industry norm). */
const STREAM_SECONDS = 30;

/**
 * The single <audio> element behind the global player; registered via ref callback.
 * Also reports a stream once per play session, after STREAM_SECONDS of actual
 * listening (seeking doesn't count) or when a shorter track finishes.
 */
export function AudioProvider() {
  const { setAudioRef, audioRef, updateProgress } = useAudioPlayer();
  const listened = useRef({ session: -1, seconds: 0, lastTime: 0, reported: false });

  const report = () => {
    const { currentTrack, setStreamCount } = useAudioPlayer.getState();
    if (!currentTrack) return;
    listened.current.reported = true;
    // A form body makes this a "simple" CORS request: no preflight, so it works
    // in every browser (Safari and in-app browsers drop preflighted keepalive requests).
    const body = new URLSearchParams();
    const id = visitorId();
    if (id) body.set("visitor_id", id);
    fetch(`${siteConfig.apiUrl}/music/tracks/${encodeURIComponent(currentTrack.id)}/stream/`, {
      method: "POST",
      body,
      keepalive: true,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { plays_count?: number } | null) => {
        if (typeof data?.plays_count === "number") setStreamCount(currentTrack.id, data.plays_count);
      })
      .catch(() => {});
  };

  const trackListening = (audio: HTMLAudioElement, ended = false) => {
    const { playSession } = useAudioPlayer.getState();
    if (listened.current.session !== playSession) {
      listened.current = { session: playSession, seconds: 0, lastTime: audio.currentTime, reported: false };
      return;
    }
    const state = listened.current;
    const delta = audio.currentTime - state.lastTime;
    // Normal playback advances in small steps; bigger jumps are seeks.
    if (!audio.paused && delta > 0 && delta < 2) state.seconds += delta;
    state.lastTime = audio.currentTime;
    if (state.reported) return;
    const needed =
      Number.isFinite(audio.duration) && audio.duration > 0 ? Math.min(STREAM_SECONDS, audio.duration * 0.9) : STREAM_SECONDS;
    if (state.seconds >= needed || (ended && state.seconds >= needed * 0.8)) report();
  };

  return (
    <audio
      ref={setAudioRef}
      onTimeUpdate={() => {
        const audio = audioRef;
        if (audio) {
          updateProgress(audio.currentTime, audio.duration);
          trackListening(audio);
        }
      }}
      onSeeked={() => {
        if (audioRef) listened.current.lastTime = audioRef.currentTime;
      }}
      onLoadedMetadata={() => {
        const audio = audioRef;
        if (audio) updateProgress(audio.currentTime, audio.duration);
      }}
      onEnded={() => {
        if (audioRef) trackListening(audioRef, true);
        useAudioPlayer.setState({ isPlaying: false });
      }}
    />
  );
}

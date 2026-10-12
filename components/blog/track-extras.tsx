"use client";

import { useRef, useState } from "react";
import { BookOpen, Check, CircleFadingPlus, Copy, ExternalLink, Loader2, PhoneCall, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CallerTune, PostTrack } from "@/types/api";

/** Small network badges in each network's own colour. */
const NETWORK_STYLE: Record<string, string> = {
  mtn: "bg-[#ffcb05] text-black",
  airtel: "bg-[#e40000] text-white",
  glo: "bg-[#50b848] text-white",
  "9mobile": "bg-[#006c3a] text-white",
};

/** `sms:` link that opens the messaging app with the code filled in (Android and iOS). */
function smsHref(tune: CallerTune) {
  return `sms:${tune.send_to}?&body=${encodeURIComponent(tune.code)}`;
}

/**
 * "Set as caller tune": the track's code on each network, inside the player
 * card. Texting opens the messaging app; the code can also be copied.
 */
export function CallerTunes({ track }: { track: PostTrack }) {
  const tunes = track.caller_tunes ?? [];
  const [copied, setCopied] = useState<string | null>(null);
  if (tunes.length === 0) return null;

  const copy = async (tune: CallerTune) => {
    try {
      await navigator.clipboard.writeText(tune.code);
      setCopied(tune.network);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): the code is visible anyway.
    }
  };

  return (
    <div className="relative border-t border-white/10 px-5 py-4 sm:px-6">
      <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
        <PhoneCall className="size-3.5" aria-hidden="true" />
        Set &ldquo;{track.title}&rdquo; as your caller tune
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {tunes.map((tune) => (
          <li key={tune.network} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <span
              className={cn(
                "w-16 shrink-0 rounded-md py-1 text-center text-[11px] font-bold uppercase",
                NETWORK_STYLE[tune.network] ?? "bg-white/20 text-white",
              )}
            >
              {tune.network_name}
            </span>
            <span className="min-w-0 flex-1 text-sm leading-tight">
              <span className="block font-mono font-semibold tracking-wide">{tune.code}</span>
              {tune.send_to && <span className="block text-xs text-white/50">Text to {tune.send_to}</span>}
            </span>
            {tune.send_to && (
              <a
                href={smsHref(tune)}
                className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent/85"
              >
                Text
              </a>
            )}
            <button
              type="button"
              onClick={() => copy(tune)}
              aria-label={`Copy ${tune.network_name} code`}
              title="Copy code"
              className="shrink-0 rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              {copied === tune.network ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-white/40">Network charges apply. Codes are set by each network.</p>
    </div>
  );
}

type ClipState = "idle" | "loading" | "ready" | "shared" | "saved";

interface ClipTarget {
  id: string;
  name: string;
  /** Button colours (brand colour of each app). */
  style: string;
  /** Where to post the video in the app, shown after it's shared or downloaded. */
  how: string;
}

/** Apps that take a vertical (9:16) video: Status, Stories, Reels, Shorts. */
const CLIP_TARGETS: ClipTarget[] = [
  { id: "whatsapp", name: "WhatsApp Status", style: "bg-[#25D366] text-white", how: "WhatsApp → Updates → add status → pick the video" },
  {
    id: "instagram",
    name: "Instagram",
    style: "bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
    how: "Instagram → + → Story or Reel → pick the video",
  },
  { id: "tiktok", name: "TikTok", style: "bg-black text-white ring-1 ring-white/20", how: "TikTok → + → Upload → pick the video" },
  { id: "facebook", name: "Facebook", style: "bg-[#1877F2] text-white", how: "Facebook → Create story or Reel → pick the video" },
  { id: "youtube", name: "YouTube Shorts", style: "bg-[#FF0000] text-white", how: "YouTube → + → Short → Upload → pick the video" },
  { id: "snapchat", name: "Snapchat", style: "bg-[#FFFC00] text-black", how: "Snapchat → Memories → Camera Roll → send to Story" },
  { id: "telegram", name: "Telegram", style: "bg-[#229ED9] text-white", how: "Telegram → Stories (or any chat) → pick the video" },
];

const MORE: ClipTarget = { id: "more", name: "More", style: "bg-white/15 text-white", how: "pick an app in the share menu" };

/**
 * "Share this song as a video": the track's short branded vertical video, for
 * WhatsApp Status, Instagram/Facebook Stories and Reels, TikTok, Shorts...
 * Websites can't post into those apps directly: phones get the share sheet
 * with the video attached (the person picks the app), other devices download
 * it. A caption with the post link is copied first, ready to paste.
 */
export function ShareClip({ track }: { track: PostTrack }) {
  const [state, setState] = useState<ClipState>("idle");
  const [target, setTarget] = useState<ClipTarget | null>(null);
  const [captionCopied, setCaptionCopied] = useState(false);
  // The video is fetched once (only when someone taps), then reused.
  const file = useRef<File | null>(null);
  const clip = track.status_clip;
  if (!clip) return null;

  const download = () => {
    const a = document.createElement("a");
    a.href = `${clip}${clip.includes("?") ? "&" : "?"}download=1`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setState("saved");
  };

  const copyCaption = async () => {
    const artist = track.artist_name ? ` by ${track.artist_name}` : "";
    const caption = `🎧 ${track.title}${artist}\nListen & download on iGospel: ${window.location.href.split("#")[0]}`;
    try {
      await navigator.clipboard.writeText(caption);
      setCaptionCopied(true);
    } catch {
      setCaptionCopied(false);
    }
  };

  const loadFile = async () => {
    if (file.current) return file.current;
    const res = await fetch(clip);
    if (!res.ok) throw new Error(String(res.status));
    const name = `${track.artist_name ? `${track.artist_name} - ` : ""}${track.title} (igospel.ng).mp4`;
    file.current = new File([await res.blob()], name.replace(/[\\/:*?"<>|]/g, "-"), { type: "video/mp4" });
    return file.current;
  };

  const share = async (choice: ClipTarget) => {
    if (state === "loading") return;
    setTarget(choice);
    void copyCaption();
    const canShareFiles = typeof navigator !== "undefined" && typeof navigator.canShare === "function";
    if (!canShareFiles) return download();
    const fresh = !file.current;
    setState("loading");
    try {
      const video = await loadFile();
      if (!navigator.canShare({ files: [video] })) return download();
      await navigator.share({ files: [video] });
      setState("shared");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      if (name === "AbortError") setState("idle"); // closed the share sheet
      // Some browsers (Safari) only open the share sheet straight after a tap;
      // the download took too long, so ask for one more tap (the video is ready now).
      else if (name === "NotAllowedError" && fresh && file.current) setState("ready");
      else download();
    }
  };

  const hint = (() => {
    const t = target ?? MORE;
    const caption = captionCopied ? " Caption with the link copied: paste it in your post." : "";
    if (state === "loading") return "Preparing the video…";
    if (state === "ready") return `Video ready: tap ${t.name} again to share it.`;
    if (state === "shared") return `Choose ${t.id === "more" ? "an app" : t.name.replace(" Status", "")} in the share menu, then: ${t.how}.${caption}`;
    if (state === "saved") return `Video saved. ${t.how}.${caption}`;
    return "Vertical video of this song for Status, Stories, Reels, TikTok and Shorts.";
  })();

  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
        Share this song as a video
      </p>
      <div className="flex flex-wrap gap-2">
        {[...CLIP_TARGETS, MORE].map((choice) => {
          const busy = state === "loading" && target?.id === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => share(choice)}
              disabled={state === "loading"}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg shadow-black/20 transition hover:brightness-110 disabled:opacity-60",
                choice.style,
                state === "ready" && target?.id === choice.id && "ring-2 ring-white",
              )}
            >
              {busy ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : choice.id === "whatsapp" ? (
                <CircleFadingPlus className="size-3.5" aria-hidden="true" />
              ) : choice.id === "more" ? (
                <Share2 className="size-3.5" aria-hidden="true" />
              ) : null}
              {choice.name}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-[11px] text-white/50" aria-live="polite">
        {hint}
      </p>
    </div>
  );
}

/**
 * "Behind the song": the story and Bible passages of each track that has
 * them. Rendered in the page HTML (not behind a click) so readers and search
 * engines see it.
 */
export function SongStories({ tracks }: { tracks: PostTrack[] }) {
  const withStory = tracks.filter((t) => t.song_story || (t.scripture ?? []).length > 0);
  if (withStory.length === 0) return null;

  return (
    <section className="mt-8 space-y-6">
      {withStory.map((track) => (
        <article key={track.id} className="rounded-2xl border border-border bg-secondary/40 p-5 sm:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <BookOpen className="size-5 text-accent" aria-hidden="true" />
            Behind &ldquo;{track.title}&rdquo;
          </h3>
          {track.song_story && (
            <div className="entry-content text-gray-700" dangerouslySetInnerHTML={{ __html: track.song_story }} />
          )}
          {(track.scripture ?? []).length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Scripture behind the song
              </p>
              {(track.scripture ?? []).map((passage) => (
                <blockquote key={passage.reference} className="border-l-4 border-accent pl-4">
                  {passage.text && <p className="font-serif italic leading-relaxed text-gray-800">{passage.text}</p>}
                  <footer className="mt-1 text-sm">
                    <a
                      href={passage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                    >
                      {passage.reference} (KJV)
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

"use client";

import { useState } from "react";
import { BookOpen, Check, CircleFadingPlus, Copy, ExternalLink, Loader2, PhoneCall } from "lucide-react";
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

type ClipState = "idle" | "loading" | "saved" | "error";

/**
 * "Post to WhatsApp Status": the track's short branded video (60s by default). Phones get
 * the share sheet (WhatsApp → My status); elsewhere the video downloads, to be
 * posted from WhatsApp's Status tab.
 */
export function StatusClipButton({ track }: { track: PostTrack }) {
  const [state, setState] = useState<ClipState>("idle");
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

  const share = async () => {
    if (state === "loading") return;
    const canShareFiles = typeof navigator !== "undefined" && typeof navigator.canShare === "function";
    if (!canShareFiles) return download();
    setState("loading");
    try {
      const res = await fetch(clip);
      if (!res.ok) throw new Error(String(res.status));
      const name = `${track.artist_name ? `${track.artist_name} - ` : ""}${track.title} (igospel.ng).mp4`;
      const file = new File([await res.blob()], name.replace(/[\\/:*?"<>|]/g, "-"), { type: "video/mp4" });
      if (!navigator.canShare({ files: [file] })) return download();
      await navigator.share({ files: [file] });
      setState("idle");
    } catch (error) {
      // Closing the share sheet isn't an error; anything else falls back to the download.
      if (error instanceof DOMException && error.name === "AbortError") setState("idle");
      else download();
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={share}
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[#1fb857] disabled:opacity-70"
      >
        {state === "loading" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <CircleFadingPlus className="size-4" aria-hidden="true" />
        )}
        {state === "loading" ? "Preparing video…" : "Post to WhatsApp Status"}
      </button>
      <p className="mt-1.5 text-[11px] text-white/50" aria-live="polite">
        {state === "saved"
          ? "Video saved. Open WhatsApp → Status → add it from your gallery."
          : "A short video of this song, ready for your Status."}
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

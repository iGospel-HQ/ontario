"use client";

import { useEffect, useState } from "react";
import { Check, Facebook, Link2, MessageCircle, Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** X (Twitter) logo; lucide only ships the old bird. */
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function shareLinks(url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, icon: MessageCircle, color: "bg-[#25D366]" },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: Facebook, color: "bg-[#1877F2]" },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, icon: XLogo, color: "bg-black" },
    { name: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}`, icon: Send, color: "bg-[#229ED9]" },
  ];
}

/**
 * Share a page on WhatsApp, Facebook, X, Telegram, by copying the link, or
 * (on phones) through the device's own share sheet. "compact" is a row of
 * round icons; "full" adds labels and a heading.
 */
export function ShareButtons({
  url,
  title,
  variant = "full",
  heading = "Share",
  className,
}: {
  /** Absolute URL of the page being shared. */
  url: string;
  title: string;
  variant?: "full" | "compact";
  heading?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  // Only known after mount (no navigator on the server).
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection after hydration
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const compact = variant === "compact";
  const button = cn(
    "inline-flex items-center justify-center gap-2 rounded-full text-white transition hover:opacity-90 active:scale-95",
    compact ? "size-9" : "h-10 px-4 text-sm font-semibold",
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      /* dismissed */
    }
  };

  return (
    <div className={cn(compact ? "flex items-center gap-2" : "space-y-3", className)}>
      {!compact && <p className="text-[13px] font-bold uppercase tracking-wider text-text">{heading}</p>}
      <div className="flex flex-wrap items-center gap-2">
        {shareLinks(url, title).map(({ name, href, icon: Icon, color }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${name}`}
            title={`Share on ${name}`}
            className={cn(button, color)}
          >
            <Icon className="size-4" />
            {!compact && <span>{name}</span>}
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label="Copy link"
          title="Copy link"
          className={cn(button, "bg-neutral-700")}
        >
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
          {!compact && <span>{copied ? "Copied" : "Copy link"}</span>}
        </button>
        {canNativeShare && (
          <button
            type="button"
            onClick={nativeShare}
            aria-label="More sharing options"
            title="More sharing options"
            className={cn(button, "bg-accent")}
          >
            <Share2 className="size-4" />
            {!compact && <span>Share…</span>}
          </button>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Heart, Send } from "lucide-react";
import { SupportButton } from "@/components/blog/support-button";

const TELEGRAM_URL = "https://t.me/igospelministry";

/**
 * Support (gift) and Telegram as two compact cards side by side (also on
 * phones). Shown before the article and again after the player.
 */
export function PostEngagement({
  artistId,
  creatorId,
  supportLabel,
}: {
  artistId?: string;
  creatorId?: string | null;
  supportLabel?: string;
}) {
  // The support message set in the admin ("Support This Blog 💰💵") titles the card,
  // without emoji so it fits; the button keeps a short label for narrow phones.
  const supportTitle = (supportLabel ?? "").replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "").trim();
  return (
    <section aria-label="Support and updates" className="grid grid-cols-2 gap-3">
      <div className="flex min-w-0 flex-col gap-3 rounded-2xl bg-gradient-to-br from-accent to-[#d81e47] p-3 text-white shadow-md shadow-accent/20 sm:p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Heart className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold leading-tight sm:text-base">{supportTitle || "Support gospel music"}</h2>
            <p className="hidden truncate text-xs text-white/80 sm:block">Every gift keeps new songs coming</p>
          </div>
        </div>
        <SupportButton
          artistId={artistId}
          creatorId={creatorId}
          label="Support now"
          className="inline-flex h-9 w-full min-w-0 items-center justify-center gap-1.5 truncate rounded-full bg-white px-3 text-xs font-semibold text-accent shadow-sm hover:bg-white/90 sm:w-auto sm:self-start sm:text-sm"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-3 rounded-2xl bg-[#e9f6fd] p-3 text-[#0b3b57] sm:p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2AABEE] text-white">
            <Send className="size-4 rotate-45" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold leading-tight sm:text-base">Get new songs first</h2>
            <p className="hidden truncate text-xs text-[#0b3b57]/75 sm:block">New releases on Telegram as they drop</p>
          </div>
        </div>
        <Link
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#2AABEE] px-3 text-xs font-semibold text-white hover:bg-[#229ED9] sm:w-auto sm:self-start sm:text-sm"
        >
          <Send className="size-3.5" aria-hidden="true" /> Join on Telegram
        </Link>
      </div>
    </section>
  );
}

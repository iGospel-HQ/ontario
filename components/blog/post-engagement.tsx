import Link from "next/link";
import { Heart, Send } from "lucide-react";
import { SupportButton } from "@/components/blog/support-button";

const TELEGRAM_URL = "https://t.me/igospelministry";

/**
 * After the article: support (gift) and Telegram side by side, once, instead
 * of full-width banners before and after the content.
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
  return (
    <section aria-label="Support and updates" className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col rounded-2xl bg-gradient-to-br from-accent to-[#d81e47] p-6 text-white shadow-lg shadow-accent/20">
        <span className="flex size-10 items-center justify-center rounded-full bg-white/20">
          <Heart className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-bold">Enjoyed this?</h2>
        <p className="mt-1 flex-1 text-sm text-white/85">
          Your gift, big or small, keeps gospel music and stories like this coming.
        </p>
        <div className="mt-5">
          <SupportButton
            artistId={artistId}
            creatorId={creatorId}
            label={supportLabel || "Support with a gift"}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-accent shadow-sm hover:bg-white/90"
          />
        </div>
      </div>

      <div className="flex flex-col rounded-2xl bg-[#e9f6fd] p-6 text-[#0b3b57]">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#2AABEE] text-white">
          <Send className="size-5 rotate-45" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-bold">Get new songs first</h2>
        <p className="mt-1 flex-1 text-sm text-[#0b3b57]/80">
          Join our Telegram channel for new releases and gospel news as soon as they drop.
        </p>
        <div className="mt-5">
          <Link
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2AABEE] px-5 text-sm font-semibold text-white hover:bg-[#229ED9]"
          >
            <Send className="size-4" aria-hidden="true" /> Join on Telegram
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link"
import { Send } from "lucide-react"

export function TelegramCTA() {
  return (
    <Link
      href="https://t.me/igospelministry"
      target="_blank"
      className="
        group
        flex items-center justify-center gap-3
        w-full
        mx-auto my-3
        px-6 py-4
        rounded-lg
        bg-[#2AABEE]
        text-white
        font-semibold
        text-sm md:text-base
        shadow-md
        hover:bg-[#229ED9]
        transition-all
        hover:scale-[1.02]
        active:scale-[0.98]
      "
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
        <Send className="w-5 h-5 text-white rotate-45 group-hover:translate-x-0.5 transition" />
      </span>

      <span className="tracking-wide">
        JOIN US ON TELEGRAM FOR QUICK UPDATES
      </span>
    </Link>
  )
}

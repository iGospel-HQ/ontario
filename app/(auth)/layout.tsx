import Image from "next/image";
import Link from "next/link";
import { BookOpen, Headphones, MapPin, Share2 } from "lucide-react";
import logo from "@/public/logo.png";

const FEATURES = [
  { icon: Headphones, text: "Listen to and download the latest gospel songs, free" },
  { icon: BookOpen, text: "Read the story and scripture behind the songs" },
  { icon: MapPin, text: "See the top gospel songs in your city" },
  { icon: Share2, text: "Share songs as videos to your WhatsApp Status" },
];

/**
 * Login, sign-up, verify and password pages: a dark iGospel panel beside the
 * form on large screens; on phones, a dark bar with the logo above the form.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f6] lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Brand panel (large screens) */}
      <aside className="relative hidden overflow-hidden bg-[#0c0c0c] text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -right-32 size-[420px] rounded-full bg-accent/15 blur-3xl" />

        <Link href="/" className="relative w-fit" aria-label="iGospel home">
          <Image src={logo} alt="iGospel" width={170} height={42} className="h-10 w-auto" priority />
        </Link>

        <div className="relative max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Welcome to iGospel</p>
          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight xl:text-5xl">
            Nigeria&apos;s home of gospel music
          </h2>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-[15px] text-white/80">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/50">© {new Date().getFullYear()} iGospel Media Connect</p>
      </aside>

      {/* Form side */}
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-center bg-[#0c0c0c] px-4 py-4 lg:hidden">
          <Link href="/" aria-label="iGospel home">
            <Image src={logo} alt="iGospel" width={150} height={37} className="h-9 w-auto" priority />
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-14">{children}</main>

        <footer className="pb-8 text-center text-sm text-gray-500">
          <nav className="flex justify-center gap-5">
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-accent">
              Contact
            </Link>
          </nav>
          <p className="mt-2 lg:hidden">© {new Date().getFullYear()} iGospel Media Connect</p>
        </footer>
      </div>
    </div>
  );
}

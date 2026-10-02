import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { topBarLinks } from "@/lib/navigation";
import logo from "@/public/logo.png";
import { MainMenu } from "@/components/layout/main-menu";
import { SocialIcons } from "@/components/layout/social-icons";
import { TodayDate } from "@/components/layout/today-date";

/** Classic blog header: top bar, branding row with search, primary menu (md and up). */
export function SiteHeader() {
  return (
    <>
      <header className="hidden md:block">
        {/* Top bar */}
        <div className="bg-topbar text-[12px] text-white/75">
          <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-9">
            <TodayDate />
            <div className="flex items-center gap-5">
              <ul className="hidden sm:flex items-center gap-4">
                {topBarLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <SocialIcons className="gap-3" iconClassName="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-black">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-6 py-6">
            <Link href="/" className="block" title={`${siteConfig.name} — ${siteConfig.tagline}`}>
              <Image
                src={logo}
                alt={`${siteConfig.name} home`}
                width={194}
                height={48}
                className="h-10 md:h-12 w-auto"
                priority
              />
              <span className="mt-1.5 block text-[11px] uppercase tracking-[0.2em] text-white/60">
                {siteConfig.tagline}
              </span>
            </Link>

            <form action="/search" role="search" className="hidden sm:flex w-full max-w-xs">
              <input
                type="search"
                name="q"
                placeholder="Search songs, artists, posts..."
                aria-label="Search the site"
                className="w-full bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-accent"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-accent px-3 text-white hover:bg-white hover:text-accent"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <MainMenu />
    </>
  );
}

import Link from "next/link";
import { Music, Album, Disc3, Users, TrendingUp, Search } from "lucide-react";
import { ComingSoonWrapper } from "@/components/shared/coming-soon-wrapper";
import { cn } from "@/lib/utils";

const links = [
  { name: "Artists", href: "/music/artists", icon: Users, comingSoon: false },
  { name: "New Releases", href: "/music/songs", icon: Music, comingSoon: false },
  { name: "Albums", href: "/music/albums", icon: Album, comingSoon: false },
  { name: "Top Charts", href: "/charts", icon: TrendingUp, comingSoon: false },
  { name: "Playlists", href: "/music/playlists", icon: Disc3, comingSoon: false },
];

/** Shortcuts under the homepage hero: round icons on phones, tiles on larger screens. */
export function QuickLinks() {
  return (
    <section className="sm:px-4 sm:py-10 md:px-6">
      <h2 className="section-title hidden sm:block">
        <span>Quick Access</span>
      </h2>

      {/* Phones: one row of round icons */}
      <nav aria-label="Quick access" className="border-b border-rule bg-white sm:hidden">
        <ul className="grid grid-cols-5 divide-x divide-rule">
          {links
            .filter((link) => !link.comingSoon)
            .map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link href={link.href} className="flex flex-col items-center gap-1.5 px-0.5 py-3 text-center active:bg-shade">
                    <span className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-[9.5px] font-bold uppercase leading-tight tracking-wide text-text">{link.name}</span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Phones: search right under the tabs */}
      <form action="/search" role="search" className="flex gap-2 border-b border-rule bg-white px-4 py-3 sm:hidden">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-meta" aria-hidden="true" />
          <input
            type="search"
            name="q"
            placeholder="Find gospel songs, artists…"
            className="h-11 w-full rounded-lg border border-rule bg-shade pl-9 pr-3 text-sm outline-none focus:border-accent"
          />
        </label>
        <button type="submit" className="h-11 shrink-0 rounded-lg bg-accent px-4 text-sm font-semibold text-white">
          Search
        </button>
      </form>

      <div className="hidden grid-cols-2 gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-5">
        {links.map((link) => {
          const Icon = link.icon;
          const tile = (
            <Link
              href={link.href}
              aria-disabled={link.comingSoon}
              className={cn(
                "group flex flex-col items-center justify-center gap-3 border border-rule bg-white px-4 py-6 transition-colors hover:border-accent hover:bg-accent",
                link.comingSoon && "cursor-not-allowed",
              )}
            >
              <Icon className="h-7 w-7 text-accent transition-colors group-hover:text-white" />
              <span className="text-center text-[12px] font-bold uppercase tracking-wider text-text transition-colors group-hover:text-white">
                {link.name}
              </span>
            </Link>
          );

          return link.comingSoon ? (
            <ComingSoonWrapper key={link.href} text="Coming Soon" showLockIcon opacity={0.3} blur>
              {tile}
            </ComingSoonWrapper>
          ) : (
            <div key={link.href}>{tile}</div>
          );
        })}
      </div>
    </section>
  );
}

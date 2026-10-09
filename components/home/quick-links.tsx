import Link from "next/link";
import { Music, Disc3, Users, TrendingUp } from "lucide-react";
import { ComingSoonWrapper } from "@/components/shared/coming-soon-wrapper";
import { cn } from "@/lib/utils";

const links = [
  { name: "Artists", href: "/music/artists", icon: Users, comingSoon: false },
  { name: "New Releases", href: "/music/songs", icon: Music, comingSoon: false },
  // Albums (icon: Album): add back once a /music/albums page exists. Hidden
  // meanwhile: "coming soon" tiles read as an unfinished site to AdSense reviewers.
  { name: "Top Charts", href: "/charts", icon: TrendingUp, comingSoon: false },
  { name: "Playlists", href: "/music/playlists", icon: Disc3, comingSoon: false },
];

/** Row of shortcut tiles under the homepage hero. */
export function QuickLinks() {
  return (
    <section className="px-4 md:px-6 py-10">
      <h2 className="section-title">
        <span>Quick Access</span>
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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

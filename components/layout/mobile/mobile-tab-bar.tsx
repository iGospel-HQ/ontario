"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  FileText,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  Mail,
  Menu,
  Mic2,
  Music2,
  Disc3,
  Newspaper,
  ListMusic,
  Rss,
  Shield,
  TrendingUp,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/site";
import { isActive } from "@/lib/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SocialIcons } from "@/components/layout/social-icons";

export const MOBILE_TABS: { name: string; href: string; icon: LucideIcon }[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/blog", icon: Newspaper },
  { name: "Music", href: "/music", icon: Music2 },
  { name: "Charts", href: "/charts", icon: TrendingUp },
];

type SheetLink = { name: string; href: string; icon: LucideIcon };

const SHEET_GROUPS: { title: string; links: SheetLink[] }[] = [
  {
    title: "Music",
    links: [
      { name: "Songs", href: "/music/songs", icon: Music2 },
      { name: "Artists", href: "/music/artists", icon: Mic2 },
      { name: "Albums", href: "/music/albums", icon: Disc3 },
      { name: "Playlists", href: "/music/playlists", icon: ListMusic },
    ],
  },
  {
    title: "iGospel",
    links: [
      { name: "About", href: "/about", icon: Info },
      { name: "Contact", href: "/contact", icon: Mail },
      { name: "RSS Feed", href: "/feed.xml", icon: Rss },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy", icon: Shield },
      { name: "Terms of Use", href: "/terms", icon: FileText },
    ],
  },
];

/**
 * Phone bottom navigation (hidden from md up). Also renders an in-flow spacer
 * so page content never ends up under the bar or the mini player.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [moreOpen, setMoreOpen] = useState(false);

  // "Music" covers its sub-pages, except Charts which has its own tab.
  const activeTab = [...MOBILE_TABS].reverse().find((tab) => isActive(pathname, tab.href))?.href;
  const moreActive = !activeTab && pathname !== "/search";

  return (
    <>
      <div aria-hidden="true" className="mobile-nav-spacer md:hidden" />

      <nav
        aria-label="App"
        className="mobile-tabbar fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl md:hidden"
      >
        <ul className="grid h-[60px] grid-cols-5">
          {MOBILE_TABS.map((tab) => (
            <li key={tab.href}>
              <TabItem
                href={tab.href}
                label={tab.name}
                icon={tab.icon}
                active={activeTab === tab.href}
              />
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className={cn("tab-item", moreActive && "tab-item-active")}
            >
              <span className="tab-icon">
                <Menu className="size-[22px]" />
              </span>
              More
            </button>
          </li>
        </ul>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85dvh] gap-0 overflow-y-auto rounded-t-3xl border-0 px-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 md:hidden"
        >
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-black/15" aria-hidden="true" />
          <SheetTitle className="sr-only">More</SheetTitle>

          {/* Account / upload shortcuts */}
          <div className="grid grid-cols-2 gap-3 px-4">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              onClick={() => setMoreOpen(false)}
              className="flex flex-col gap-3 rounded-2xl bg-neutral-950 p-4 text-white active:scale-[0.98]"
            >
              {isAuthenticated ? <LayoutDashboard className="size-5" /> : <LogIn className="size-5" />}
              <span className="text-sm font-semibold">{isAuthenticated ? "Dashboard" : "Log in / Sign up"}</span>
            </Link>
            <Link
              href="/upload"
              onClick={() => setMoreOpen(false)}
              className="flex flex-col gap-3 rounded-2xl bg-accent p-4 text-white active:scale-[0.98]"
            >
              <Upload className="size-5" />
              <span className="text-sm font-semibold">Upload Music</span>
            </Link>
          </div>

          {SHEET_GROUPS.map((group) => (
            <div key={group.title} className="mt-6 px-4">
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-meta">{group.title}</p>
              <ul className="overflow-hidden rounded-2xl bg-shade">
                {group.links.map(({ name, href, icon: Icon }) => (
                  <li key={href} className="border-b border-black/5 last:border-0">
                    <Link
                      href={href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium active:bg-black/5",
                        isActive(pathname, href) ? "text-accent" : "text-text",
                      )}
                    >
                      <Icon className="size-[18px] text-meta" aria-hidden="true" />
                      {name}
                      <ChevronRight className="ml-auto size-4 text-black/25" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-8 flex flex-col items-center gap-3 px-4 text-xs text-meta">
            <SocialIcons className="gap-5 text-text/70" iconClassName="size-5" />
            <p>
              &copy; {new Date().getFullYear()} {siteConfig.name}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function TabItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: LucideIcon; active: boolean }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cn("tab-item", active && "tab-item-active")}>
      <span className="tab-icon">
        <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 2} />
      </span>
      {label}
    </Link>
  );
}

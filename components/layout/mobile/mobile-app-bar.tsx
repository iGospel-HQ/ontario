"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Search, UserRound } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { useAuthStore } from "@/store/use-auth-store";
import { MOBILE_TABS } from "./mobile-tab-bar";
import logo from "@/public/logo.png";

/** App-style top bar for phones: back button on inner pages, logo, search and account. */
export function MobileAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isTabRoot = MOBILE_TABS.some((tab) => tab.href === pathname);

  const goBack = () => {
    // Opened directly (no history in this tab): go home instead of leaving the site.
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-black/95 pt-[env(safe-area-inset-top)] text-white backdrop-blur-md md:hidden">
      <div className="flex h-14 items-center gap-1 px-2">
        {!isTabRoot && (
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="flex size-10 items-center justify-center rounded-full active:bg-white/15"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        <Link href="/" className={isTabRoot ? "px-2" : undefined} aria-label={`${siteConfig.name} home`}>
          <Image src={logo} alt="" width={130} height={32} className="h-8 w-auto" priority />
        </Link>

        <div className="ml-auto flex items-center">
          <Link
            href="/search"
            aria-label="Search"
            className="flex size-10 items-center justify-center rounded-full active:bg-white/15"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            aria-label={isAuthenticated ? "Dashboard" : "Log in"}
            className="flex size-10 items-center justify-center rounded-full active:bg-white/15"
          >
            <UserRound className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

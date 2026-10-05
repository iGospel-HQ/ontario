"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const urlKey = (pathname: string, search: string) => `${pathname}?${new URLSearchParams(search).toString()}`;

/**
 * Thin accent bar at the top of the screen from the moment an internal link
 * is clicked until the new page is shown, so a click never looks ignored.
 */
export function NavigationProgress() {
  const current = urlKey(usePathname(), useSearchParams().toString());
  // URL we were on when a link was clicked; the bar shows until the URL changes.
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const active = pendingFrom === current;

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const from = urlKey(window.location.pathname, window.location.search);
      // Same page (or just a #hash jump): nothing to wait for.
      if (urlKey(url.pathname, url.search) === from) return;
      setPendingFrom(from);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`nav-progress pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]${active ? " nav-progress-active" : ""}`}
    />
  );
}

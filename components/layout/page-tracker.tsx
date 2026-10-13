"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { visitorId } from "@/lib/visitor";

/** Areas that aren't counted as site traffic. */
const SKIPPED = ["/dashboard"];

/**
 * Counts a visit to every page of the site (except the dashboard) for the
 * admin dashboard's traffic numbers: on the first load and on every page
 * change. The referrer is sent once, for the visit that came from outside
 * (Google, WhatsApp, Facebook...). A form body keeps it a simple CORS request,
 * like the play counter, so it works in every browser.
 */
export function PageTracker() {
  const pathname = usePathname();
  const firstVisit = useRef(true);

  useEffect(() => {
    if (!pathname || SKIPPED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;
    const body = new URLSearchParams({ path: pathname });
    const id = visitorId();
    if (id) body.set("visitor_id", id);
    if (firstVisit.current && document.referrer) body.set("referrer", document.referrer);
    firstVisit.current = false;
    fetch(`${siteConfig.apiUrl}/blog/track/`, { method: "POST", body, keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}

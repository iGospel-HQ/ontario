"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { BlogStats, type TrafficStats } from "@/components/blog/blog-stats";

const VISITOR_KEY = "igospel_visitor_id";

/** Anonymous per-browser id so readers sharing an IP count as separate visitors. */
function visitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return undefined; // storage blocked: the API falls back to the IP address
  }
}

/**
 * Reports this page view and shows the post's traffic stats. The page is
 * cached, so it starts from the server-rendered numbers and switches to the
 * fresh ones the API returns after recording the view.
 */
export function PostTraffic({ slug, initial }: { slug: string; initial: TrafficStats }) {
  const [stats, setStats] = useState(initial);

  useEffect(() => {
    // Not aborted on unmount: a reader leaving quickly should still be counted.
    let active = true;
    fetch(`${siteConfig.apiUrl}/blog/posts/${encodeURIComponent(slug)}/track/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_id: visitorId() }),
      keepalive: true,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((fresh: TrafficStats | null) => {
        if (active && fresh && typeof fresh.total_views === "number") setStats(fresh);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [slug]);

  return <BlogStats stats={stats} />;
}

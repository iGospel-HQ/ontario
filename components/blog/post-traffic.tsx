"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { BlogStats, type TrafficStats } from "@/components/blog/blog-stats";
import { visitorId } from "@/lib/visitor";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/**
 * Reports this page view and shows the post's traffic stats. The page is
 * cached, so it starts from the server-rendered numbers and switches to the
 * fresh ones the API returns after recording the view.
 * variant "inline": just "1.2K views" (for the byline); "full": the stats panel.
 */
export function PostTraffic({
  slug,
  initial,
  variant = "full",
}: {
  slug: string;
  initial: TrafficStats;
  variant?: "full" | "inline";
}) {
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

  if (variant === "inline") {
    const views = stats.total_views ?? 0;
    return (
      <span className="inline-flex items-center gap-1" title={`${views.toLocaleString("en")} views`}>
        <Eye className="size-3.5" aria-hidden="true" />
        {compact.format(views)} {views === 1 ? "view" : "views"}
      </span>
    );
  }
  return <BlogStats stats={stats} />;
}

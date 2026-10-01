"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

/**
 * Reports a post view from the browser. Posts are rendered and cached on the
 * server, so the API can no longer count views when the post is fetched.
 */
export function PostViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`${siteConfig.apiUrl}/blog/posts/${encodeURIComponent(slug)}/track/`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}

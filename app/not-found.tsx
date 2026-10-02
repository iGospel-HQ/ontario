import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { NotFoundContent, notFoundMetadata } from "@/components/shared/not-found-content";

export const metadata: Metadata = notFoundMetadata;

/** Unmatched URLs: rendered outside the (main) layout, so it brings its own frame. */
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}

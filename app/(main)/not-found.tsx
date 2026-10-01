import type { Metadata } from "next";
import { NotFoundContent, notFoundMetadata } from "@/components/shared/not-found-content";

export const metadata: Metadata = notFoundMetadata;

/** notFound() from a page inside the site layout (unknown post, artist, playlist). */
export default function NotFound() {
  return <NotFoundContent />;
}

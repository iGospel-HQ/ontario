import type { Metadata } from "next";
import { BlogDetailClient } from "@/components/blog-detail-client";

export const metadata: Metadata = {
  title: "Article - iGospel",
  description: "Read the full article on iGospel",
};

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <BlogDetailClient params={params} />;
}

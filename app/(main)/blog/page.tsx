import { pageMetadata } from "@/lib/seo";
import { BlogPageClient } from "@/components/blog-page-client";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Explore stories about music, culture, and the industry",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogPageClient />;
}

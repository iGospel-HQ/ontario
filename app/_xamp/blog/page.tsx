import type { Metadata } from "next"
import { BlogPageClient } from "@/components/blog-page-client"

export const metadata: Metadata = {
  title: "Blog - SYNC",
  description: "Explore stories about music, culture, and the industry",
}

export default function BlogPage() {
  return <BlogPageClient />
}

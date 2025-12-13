import type { Metadata } from "next";
import { BlogDetailClient } from "@/components/blog-detail-client";

/**
 * Fetch blog data (SERVER-SIDE)
 * Replace URL with your API or DB call
 */
async function getBlog(slug: string) {
  const res = await fetch(
    `https://api.igospels.com.ng/v1/blog/posts/${slug}/`,
    {
      cache: "no-store", // important for fresh SEO
    }
  );

  if (!res.ok) return null;
  return res.json();
}

/**
 * Dynamic SEO Metadata
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const {slug} = await params 
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Article not found - iGospel",
      description: "This article could not be found.",
    };
  }

  const title = blog.title;
  const description = blog.excerpt || blog.content?.slice(0, 160);
  const image = blog.featured_image;

  const url = `/blog/${blog.slug}`;

  return {
    title: `${title} - iGospel`,
    description,

    openGraph: {
      title,
      description,
      url,
      siteName: "iGospel",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: blog.publish_date,
      authors: [blog.author_name || "iGospel"],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@iGospel",
    },

    alternates: {
      canonical: url,
    },
  };
}

/**
 * Page Component
 */
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug} = await params
  return <BlogDetailClient slug={slug} />;
}

import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path of the canonical URL, e.g. "/blog/my-post". */
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string } | null;
  type?: "website" | "article" | "profile" | "music.playlist";
  noIndex?: boolean;
  /** Use the title as-is instead of applying the "%s - iGospel" template. */
  absoluteTitle?: boolean;
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[] };
}

/**
 * Complete per-page metadata. Next merges `openGraph`/`twitter` shallowly,
 * so every page sets the full set here rather than relying on the layout.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex,
  absoluteTitle,
  article,
}: PageMetadataInput): Metadata {
  const images = [image ? { alt: title, ...image } : { ...siteConfig.ogImage, alt: siteConfig.name }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: type === "music.playlist" ? "music.playlist" : type,
      images,
      ...(type === "article" ? article : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Plain-text excerpt for meta descriptions (~155 chars). */
export function toDescription(...candidates: (string | null | undefined)[]) {
  const text = candidates
    .find((value) => value && value.trim())
    ?.replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return siteConfig.description;
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}...` : text;
}

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * Metadata for paginated/searchable listings: page N gets its own canonical
 * (`?page=N`), and search-result views are kept out of the index.
 */
export function listingMetadata(
  base: Omit<PageMetadataInput, "noIndex">,
  searchParams: SearchParams,
): Metadata {
  const page = Number(first(searchParams.page));
  const hasQuery = Boolean(first(searchParams.q)?.trim());
  const paged = Number.isInteger(page) && page > 1;

  return pageMetadata({
    ...base,
    title: paged ? `${base.title} - Page ${page}` : base.title,
    path: paged ? `${base.path}?page=${page}` : base.path,
    noIndex: hasQuery,
  });
}

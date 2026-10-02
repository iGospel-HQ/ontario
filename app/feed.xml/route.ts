import { getPosts } from "@/lib/api/queries";
import { absoluteUrl, siteConfig } from "@/lib/site";

// Regenerated at most hourly.
export const revalidate = 3600;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** RSS 2.0 feed of the latest blog posts. */
export async function GET() {
  const [first, second] = await Promise.all([
    getPosts({ page: 1 }).catch(() => null),
    getPosts({ page: 2 }).catch(() => null),
  ]);
  const posts = [...(first?.results ?? []), ...(second?.results ?? [])];

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publish_date).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(post.author_name || siteConfig.name)}</dc:creator>
      <description>${escapeXml(post.excerpt ?? "")}</description>${
        post.featured_image
          ? `\n      <enclosure url="${escapeXml(post.featured_image)}" type="image/jpeg" length="0" />`
          : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

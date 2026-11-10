import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/shared/not-found-content";
import { getMinister } from "@/lib/api/queries";
import { htmlToText, pageMetadata, toDescription } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHeader } from "@/components/shared/page-header";
import { SermonList } from "@/components/sermons/sermon-list";
import { CoverCard } from "@/components/sermons/cover-card";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

/** Minister pages are generated on first request, then cached and revalidated (ISR). */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const minister = await getMinister(slug);
  if (!minister) return notFoundMetadata;
  return pageMetadata({
    title: `${minister.name} Sermons`,
    description: toDescription(minister.bio, `Listen to and download sermons by ${minister.name} free on iGospel.`),
    path: `/sermons/ministers/${minister.slug}`,
    type: "profile",
    image: minister.image ? { url: minister.image, alt: minister.name } : null,
  });
}

export default async function MinisterPage({ params }: Props) {
  const { slug } = await params;
  const minister = await getMinister(slug);
  if (!minister) notFound();
  const links = (
    [
      ["Website", minister.website],
      ["Instagram", minister.instagram],
      ["Facebook", minister.facebook],
      ["X", minister.twitter],
      ["TikTok", minister.tiktok],
    ] as const
  ).filter(([, href]) => href);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: minister.name,
          description: minister.bio ? htmlToText(minister.bio) : undefined,
          image: minister.image || undefined,
          url: absoluteUrl(`/sermons/ministers/${minister.slug}`),
          sameAs: links.length ? links.map(([, href]) => href) : undefined,
        }}
      />
      <PageHeader
        title={minister.name}
        crumbs={[
          { name: "Sermons", href: "/sermons" },
          { name: "Ministers", href: "/sermons/ministers" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12 md:px-6">
        <header className="mb-10 flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full bg-shade md:h-48 md:w-48">
            <Image
              src={minister.image || "/placeholder.svg"}
              alt={minister.name}
              fill
              sizes="192px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0 text-center md:text-left">
            <p className="text-sm font-semibold text-meta">
              {minister.sermon_count} {minister.sermon_count === 1 ? "sermon" : "sermons"}
              {minister.series_count > 0 && ` · ${minister.series_count} series`}
            </p>
            {/* Rich text from the admin, cleaned by the API (music/richtext.py). */}
            {minister.bio && (
              <div className="entry-content mt-3 text-gray-700" dangerouslySetInnerHTML={{ __html: minister.bio }} />
            )}
            {links.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {links.map(([name, href]) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-rule px-4 py-1.5 text-sm font-semibold hover:border-accent hover:text-accent"
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </header>

        <section>
          <h2 className="widget-title">
            <span>Sermons</span>
          </h2>
          <SermonList sermons={minister.sermons} showMinister={false} />
        </section>

        {minister.series.length > 0 && (
          <section className="mt-12">
            <h2 className="widget-title">
              <span>Series</span>
            </h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {minister.series.map((series) => (
                <CoverCard
                  key={series.id}
                  href={`/sermons/series/${series.slug}`}
                  title={series.title}
                  subtitle={`${series.sermon_count} ${series.sermon_count === 1 ? "sermon" : "sermons"}`}
                  image={series.cover_image}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

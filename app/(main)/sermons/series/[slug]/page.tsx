import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { notFoundMetadata } from "@/components/shared/not-found-content";
import { getSermonSeries } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { SermonList } from "@/components/sermons/sermon-list";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSermonSeries(slug);
  if (!series) return notFoundMetadata;
  return pageMetadata({
    title: `${series.title} – ${series.minister_name}`,
    description: `Listen to and download all ${series.sermon_count} parts of “${series.title}” by ${series.minister_name} free on iGospel.`,
    path: `/sermons/series/${series.slug}`,
    image: series.cover_image ? { url: series.cover_image, alt: series.title } : null,
  });
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const series = await getSermonSeries(slug);
  if (!series) notFound();
  const cover = series.cover_image || series.minister_image;

  return (
    <>
      <PageHeader
        title={series.title}
        crumbs={[
          { name: "Sermons", href: "/sermons" },
          { name: "Series", href: "/sermons/series" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12 md:px-6">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative aspect-square w-48 shrink-0 overflow-hidden rounded-xl bg-shade shadow-md sm:w-56">
            {cover ? (
              <Image src={cover} alt={series.title} fill sizes="224px" className="object-cover" priority />
            ) : (
              <BookOpen className="absolute inset-0 m-auto h-12 w-12 text-accent" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">Sermon series</p>
            <p className="mt-2 text-lg font-semibold">
              <Link href={`/sermons/ministers/${series.minister_slug}`} className="hover:text-accent">
                {series.minister_name}
              </Link>
            </p>
            <p className="mt-1 text-sm text-meta">
              {series.sermon_count} {series.sermon_count === 1 ? "sermon" : "sermons"}
              {series.release_date && ` · ${formatDate(series.release_date)}`}
            </p>
          </div>
        </header>

        <SermonList sermons={series.sermons} showMinister={false} numbered />
      </div>
    </>
  );
}

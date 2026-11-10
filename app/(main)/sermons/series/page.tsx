import type { Metadata } from "next";
import { getSermonSeriesList } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { PagePagination, parsePage } from "@/components/shared/page-pagination";
import { SearchInput } from "@/components/shared/search-input";
import { CoverCard } from "@/components/sermons/cover-card";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return listingMetadata(
    {
      title: "Sermon Series",
      description: "Sermon and teaching series to listen to in order, free on iGospel.",
      path: "/sermons/series",
    },
    await searchParams,
  );
}

export default async function SeriesListPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const query = typeof params.q === "string" ? params.q.trim() : undefined;
  const data = await getSermonSeriesList({ page, q: query });

  return (
    <>
      <PageHeader
        title="Sermon Series"
        description="Teachings in parts, to follow from start to finish."
        crumbs={[{ name: "Sermons", href: "/sermons" }]}
      />
      <div className="px-4 py-6 sm:py-10 md:px-6">
        <FadeIn y={0} className="mb-8 max-w-md sm:mb-10 [&_input]:h-11 [&_input]:rounded-full">
          <SearchInput placeholder="Search series or ministers..." inputClassName="pl-12 border-black/10 bg-white shadow-sm" />
        </FadeIn>

        {data.results.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No sermon series yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {data.results.map((series) => (
              <CoverCard
                key={series.id}
                href={`/sermons/series/${series.slug}`}
                title={series.title}
                subtitle={`${series.minister_name} · ${series.sermon_count} ${series.sermon_count === 1 ? "sermon" : "sermons"}`}
                image={series.cover_image}
              />
            ))}
          </div>
        )}

        <div className="mt-12">
          <PagePagination
            basePath="/sermons/series"
            params={{ q: query }}
            page={page}
            totalPages={Math.ceil(data.count / 24)}
          />
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMinisters } from "@/lib/api/queries";
import { listingMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { PagePagination, parsePage } from "@/components/shared/page-pagination";
import { SearchInput } from "@/components/shared/search-input";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return listingMetadata(
    {
      title: "Ministers",
      description: "Pastors, teachers and ministers whose sermons are on iGospel.",
      path: "/sermons/ministers",
    },
    await searchParams,
  );
}

/** "3 sermons · 1 series" */
function ministerLine(sermons: number, series: number) {
  const parts = [`${sermons} ${sermons === 1 ? "sermon" : "sermons"}`];
  if (series) parts.push(`${series} series`);
  return parts.join(" · ");
}

export default async function MinistersPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const query = typeof params.q === "string" ? params.q.trim() : undefined;
  const data = await getMinisters({ page, q: query });

  return (
    <>
      <PageHeader
        title="Ministers"
        description="Listen to sermons and teachings by minister."
        crumbs={[{ name: "Sermons", href: "/sermons" }]}
      />
      <div className="px-4 py-6 sm:py-10 md:px-6">
        <FadeIn y={0} className="mb-8 max-w-md sm:mb-10 [&_input]:h-11 [&_input]:rounded-full">
          <SearchInput placeholder="Search ministers..." inputClassName="pl-12 border-black/10 bg-white shadow-sm" />
        </FadeIn>

        {data.results.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No ministers found.</p>
        ) : (
          // Same grid as the artists page: 3 across on phones, up to 6 on wide screens.
          <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-5 md:grid-cols-5 lg:grid-cols-6 lg:gap-y-8">
            {data.results.map((minister, i) => (
              <FadeIn as="li" key={minister.id} y={10} delay={Math.min(i, 12) * 0.03} className="min-w-0">
                <Link href={`/sermons/ministers/${minister.slug}`} className="group block text-center">
                  <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-shade shadow-sm ring-1 ring-black/5 transition group-hover:shadow-lg group-hover:ring-accent/40">
                    <Image
                      src={minister.image || "/placeholder.svg"}
                      alt={minister.name}
                      fill
                      sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h2 className="mt-2.5 truncate text-[13px] font-semibold leading-tight text-text group-hover:text-accent sm:text-[15px]">
                    {minister.name}
                  </h2>
                  <p className="mt-0.5 truncate text-[11px] text-meta sm:text-xs">
                    {ministerLine(minister.sermon_count, minister.series_count)}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </ul>
        )}

        <div className="mt-12">
          <PagePagination
            basePath="/sermons/ministers"
            params={{ q: query }}
            page={page}
            totalPages={Math.ceil(data.count / 24)}
          />
        </div>
      </div>
    </>
  );
}

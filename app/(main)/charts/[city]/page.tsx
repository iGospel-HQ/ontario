import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/components/shared/not-found-content";
import { getChart, getChartCities } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { ChartList, CityChips } from "@/components/music/chart-list";

type Props = { params: Promise<{ city: string }> };

export const revalidate = 600;

/** City charts are generated on first request, then refreshed every 10 minutes (ISR). */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const chart = await getChart(city);
  if (!chart?.city) return notFoundMetadata;
  const name = chart.city.name;
  return pageMetadata({
    title: `Top Gospel Songs in ${name} This Month`,
    description: `The most played gospel songs in ${name} on iGospel this month. Listen, download and share.`,
    path: `/charts/${chart.city.slug}`,
  });
}

export default async function CityChartPage({ params }: Props) {
  const { city } = await params;
  const [chart, cities] = await Promise.all([getChart(city), getChartCities()]);
  if (!chart?.city) notFound();
  const name = chart.city.name;

  return (
    <>
      <PageHeader
        title={`Top Gospel Songs in ${name}`}
        description={`What ${name} is playing on iGospel this month`}
        crumbs={[{ name: "Charts", href: "/charts" }]}
      />
      <div className="px-4 md:px-6 py-10">
        <FadeIn as="section" delay={0.1}>
          <CityChips cities={cities} active={chart.city.slug} />
          <h2 className="mb-6 mt-6 text-2xl font-bold sm:text-3xl">Top {chart.tracks.length} in {name}</h2>
          <ChartList tracks={chart.tracks} periodLabel="plays this month" />
        </FadeIn>
      </div>
    </>
  );
}

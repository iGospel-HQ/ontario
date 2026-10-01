import { pageMetadata } from "@/lib/seo";
import { ChartsPageClient } from "@/components/charts-page-client";

export const metadata = pageMetadata({
  title: "Charts",
  description:
    "The hottest tracks trending right now",
  path: "/charts",
});

export default function ChartsPage() {
  return <ChartsPageClient />;
}

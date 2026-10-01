import type { Metadata } from "next";
import { ChartsPageClient } from "@/components/charts-page-client";

export const metadata: Metadata = {
  title: "Charts - iGospel",
  description: "The hottest tracks trending right now",
};

export default function ChartsPage() {
  return <ChartsPageClient />;
}

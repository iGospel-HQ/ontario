import { notFound, redirect } from "next/navigation";
import { getChartReport } from "@/lib/api/queries";

export const revalidate = 3600;

/** /charts/report -> the latest month's report (/charts/report/2026-10). */
export default async function LatestChartReport() {
  const report = await getChartReport();
  if (!report) notFound();
  redirect(`/charts/report/${report.month}`);
}
